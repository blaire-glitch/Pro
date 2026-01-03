import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';

export const usersRouter = Router();

// Get user profile
usersRouter.get('/profile', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isVerified: true,
        latitude: true,
        longitude: true,
        address: true,
        city: true,
        country: true,
        createdAt: true,
        provider: true,
        loyaltyPoints: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// Update user profile
usersRouter.patch('/profile', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, avatar, address, city, country, latitude, longitude } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(avatar && { avatar }),
        ...(address && { address }),
        ...(city && { city }),
        ...(country && { country }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        address: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// Update user location
usersRouter.patch('/location', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { latitude, longitude, address, city } = req.body;

    if (latitude === undefined || longitude === undefined) {
      throw ApiError.badRequest('Latitude and longitude are required');
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        latitude,
        longitude,
        ...(address && { address }),
        ...(city && { city }),
      },
      select: {
        latitude: true,
        longitude: true,
        address: true,
        city: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// Get user bookings history
usersRouter.get('/bookings', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      customerId: req.user!.id,
      ...(status && { status: status as string }),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          service: true,
          provider: {
            include: {
              user: {
                select: { firstName: true, lastName: true, avatar: true },
              },
            },
          },
          payment: true,
          review: true,
        },
        orderBy: { scheduledDate: 'desc' },
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

// Get loyalty points
usersRouter.get('/loyalty', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loyalty = await prisma.loyaltyPoints.findUnique({
      where: { userId: req.user!.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { pointsCost: 'asc' },
    });

    res.json({
      success: true,
      data: {
        loyalty,
        availableRewards: rewards,
      },
    });
  } catch (error) {
    next(error);
  }
});
