import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const adminRouter = Router();

// All admin routes require authentication and ADMIN role
adminRouter.use(authenticate);
adminRouter.use(authorize('ADMIN'));

// Get dashboard stats
adminRouter.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalUsers,
      totalProviders,
      pendingVerifications,
      totalBookings,
      revenueResult,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.provider.count({ where: { verificationStatus: 'VERIFIED' } }),
      prisma.provider.count({ where: { verificationStatus: { in: ['PENDING', 'IN_REVIEW'] } } }),
      prisma.booking.count(),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    // Calculate monthly growth (compare this month vs last month users)
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [thisMonthUsers, lastMonthUsers] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: thisMonthStart } } }),
      prisma.user.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    ]);

    const monthlyGrowth = lastMonthUsers > 0 
      ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        pendingVerifications,
        totalBookings,
        totalRevenue: revenueResult._sum.amount || 0,
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get pending provider verifications
adminRouter.get('/providers/pending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status = 'ALL', page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = status === 'ALL' 
      ? { verificationStatus: { in: ['PENDING' as const, 'IN_REVIEW' as const] } }
      : { verificationStatus: status as 'PENDING' | 'IN_REVIEW' };

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.provider.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: providers,
        total,
        page: parseInt(page as string),
        pageSize: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all providers with filters
adminRouter.get('/providers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, category, search, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.verificationStatus = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { businessName: { contains: search as string, mode: 'insensitive' } },
        { user: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { user: { lastName: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.provider.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: providers,
        total,
        page: parseInt(page as string),
        pageSize: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single provider details
adminRouter.get('/providers/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const provider = await prisma.provider.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true,
          },
        },
        services: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!provider) {
      throw new ApiError(404, 'Provider not found');
    }

    res.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
});

// Verify/reject provider
adminRouter.patch('/providers/:id/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, reason } = req.body;

    if (!['VERIFIED', 'REJECTED', 'IN_REVIEW'].includes(status)) {
      throw new ApiError(400, 'Invalid verification status');
    }

    const provider = await prisma.provider.findUnique({
      where: { id: req.params.id },
      include: { user: true },
    });

    if (!provider) {
      throw new ApiError(404, 'Provider not found');
    }

    // Update provider verification status
    const updatedProvider = await prisma.provider.update({
      where: { id: req.params.id },
      data: {
        verificationStatus: status,
        isVerified: status === 'VERIFIED',
      },
    });

    // If verified, update user role to PROVIDER
    if (status === 'VERIFIED') {
      await prisma.user.update({
        where: { id: provider.userId },
        data: { role: 'PROVIDER' },
      });

      // Create notification for provider
      await prisma.notification.create({
        data: {
          userId: provider.userId,
          type: 'SYSTEM',
          title: 'Account Verified! 🎉',
          message: 'Congratulations! Your provider account has been verified. You can now start accepting bookings.',
        },
      });
    } else if (status === 'REJECTED') {
      // Create notification for rejection
      await prisma.notification.create({
        data: {
          userId: provider.userId,
          type: 'SYSTEM',
          title: 'Verification Update',
          message: reason || 'Your provider application has been reviewed. Please contact support for more details.',
        },
      });
    }

    res.json({
      success: true,
      data: updatedProvider,
      message: `Provider ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// Get all users
adminRouter.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, search, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: {
              bookingsAsCustomer: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: users,
        total,
        page: parseInt(page as string),
        pageSize: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all bookings
adminRouter.get('/bookings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          provider: {
            select: {
              id: true,
              businessName: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: bookings,
        total,
        page: parseInt(page as string),
        pageSize: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default adminRouter;
