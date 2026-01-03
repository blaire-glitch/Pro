import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { optionalAuth } from '../middleware/auth.js';

export const searchRouter = Router();

// Search providers and services
searchRouter.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      query,
      category,
      subcategory,
      latitude,
      longitude,
      radius = '10',
      minPrice,
      maxPrice,
      minRating,
      isVerified,
      instantBooking,
      sortBy = 'relevance',
      page = '1',
      limit = '20',
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build provider filters
    const providerWhere = {
      isVerified: isVerified === 'true' ? true : undefined,
      ...(category && { category: (category as string).toUpperCase() }),
      ...(subcategory && { subcategories: { has: subcategory as string } }),
      ...(minRating && { rating: { gte: parseFloat(minRating as string) } }),
      ...(instantBooking === 'true' && { instantBooking: true }),
      ...(query && {
        OR: [
          { businessName: { contains: query as string, mode: 'insensitive' as const } },
          { description: { contains: query as string, mode: 'insensitive' as const } },
        ],
      }),
    };

    // Build service filters
    const serviceWhere = {
      isActive: true,
      ...(category && { category: (category as string).toUpperCase() }),
      ...(subcategory && { subcategory: subcategory as string }),
      ...(minPrice && { price: { gte: parseFloat(minPrice as string) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice as string) } }),
      ...(query && {
        OR: [
          { name: { contains: query as string, mode: 'insensitive' as const } },
          { description: { contains: query as string, mode: 'insensitive' as const } },
        ],
      }),
    };

    // Execute searches in parallel
    const [providers, services, providerCount, serviceCount] = await Promise.all([
      prisma.provider.findMany({
        where: providerWhere,
        include: {
          user: {
            select: { firstName: true, lastName: true, avatar: true },
          },
          services: {
            where: { isActive: true },
            take: 3,
          },
          badges: true,
        },
        orderBy: sortBy === 'rating' 
          ? { rating: 'desc' }
          : sortBy === 'price_low'
          ? { services: { _count: 'asc' } }
          : { reviewCount: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.service.findMany({
        where: serviceWhere,
        include: {
          provider: {
            include: {
              user: {
                select: { firstName: true, lastName: true, avatar: true },
              },
            },
          },
        },
        orderBy: sortBy === 'price_low' 
          ? { price: 'asc' }
          : sortBy === 'price_high'
          ? { price: 'desc' }
          : { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.provider.count({ where: providerWhere }),
      prisma.service.count({ where: serviceWhere }),
    ]);

    // Get category counts
    const categoryCounts = await prisma.provider.groupBy({
      by: ['category'],
      _count: true,
    });

    res.json({
      success: true,
      data: {
        providers: {
          items: providers,
          total: providerCount,
        },
        services: {
          items: services,
          total: serviceCount,
        },
        categories: Object.fromEntries(
          categoryCounts.map((c) => [c.category, c._count])
        ),
        page: parseInt(page as string),
        pageSize: parseInt(limit as string),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get popular/trending services
searchRouter.get('/trending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, city } = req.query;

    // Get most booked services in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendingServices = await prisma.booking.groupBy({
      by: ['serviceId'],
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ['COMPLETED', 'CONFIRMED', 'IN_PROGRESS'] },
        ...(category && {
          service: { category: (category as string).toUpperCase() },
        }),
      },
      _count: { serviceId: true },
      orderBy: { _count: { serviceId: 'desc' } },
      take: 10,
    });

    const serviceIds = trendingServices.map((t) => t.serviceId);

    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      include: {
        provider: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
        },
      },
    });

    // Sort by booking count
    const sortedServices = serviceIds.map((id) =>
      services.find((s) => s.id === id)
    ).filter(Boolean);

    res.json({
      success: true,
      data: sortedServices,
    });
  } catch (error) {
    next(error);
  }
});

// Get recommended providers (based on user history)
searchRouter.get('/recommended', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      // Return top-rated providers for unauthenticated users
      const providers = await prisma.provider.findMany({
        where: { isVerified: true },
        include: {
          user: {
            select: { firstName: true, lastName: true, avatar: true },
          },
          services: { take: 3 },
        },
        orderBy: { rating: 'desc' },
        take: 10,
      });

      return res.json({ success: true, data: providers });
    }

    // Get user's booking history
    const userBookings = await prisma.booking.findMany({
      where: { customerId: req.user.id },
      include: { service: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get categories the user has used
    const usedCategories = [...new Set(userBookings.map((b) => b.service.category))];

    // Find similar providers
    const providers = await prisma.provider.findMany({
      where: {
        isVerified: true,
        category: { in: usedCategories },
        id: { notIn: userBookings.map((b) => b.providerId) }, // Exclude already used
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, avatar: true },
        },
        services: { take: 3 },
      },
      orderBy: { rating: 'desc' },
      take: 10,
    });

    res.json({ success: true, data: providers });
  } catch (error) {
    next(error);
  }
});
