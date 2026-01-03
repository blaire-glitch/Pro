import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

export const providersRouter = Router();

// Get all providers with filters
providersRouter.get('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      subcategory,
      city,
      minRating,
      isVerified,
      instantBooking,
      page = '1',
      limit = '20',
      sortBy = 'rating',
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      ...(category && { category: category as string }),
      ...(subcategory && { subcategories: { has: subcategory as string } }),
      ...(city && { city: { contains: city as string, mode: 'insensitive' as const } }),
      ...(minRating && { rating: { gte: parseFloat(minRating as string) } }),
      ...(isVerified === 'true' && { isVerified: true }),
      ...(instantBooking === 'true' && { instantBooking: true }),
    };

    const orderBy = sortBy === 'rating' 
      ? { rating: 'desc' as const }
      : sortBy === 'reviews'
      ? { reviewCount: 'desc' as const }
      : { createdAt: 'desc' as const };

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        include: {
          user: {
            select: { firstName: true, lastName: true, avatar: true },
          },
          services: {
            where: { isActive: true },
            take: 4,
          },
          badges: true,
        },
        orderBy,
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

// Get nearby providers
providersRouter.get('/nearby', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { latitude, longitude, radius = '10', category } = req.query;

    if (!latitude || !longitude) {
      throw ApiError.badRequest('Latitude and longitude are required');
    }

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const maxDistance = parseFloat(radius as string);

    // Using raw query for distance calculation
    const providers = await prisma.$queryRaw`
      SELECT 
        p.*,
        u."firstName", u."lastName", u.avatar,
        (
          6371 * acos(
            cos(radians(${lat})) * cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(p.latitude))
          )
        ) AS distance
      FROM "Provider" p
      JOIN "User" u ON p."userId" = u.id
      WHERE p."isVerified" = true
        ${category ? prisma.$queryRaw`AND p.category = ${category}` : prisma.$queryRaw``}
      HAVING distance <= ${maxDistance}
      ORDER BY distance
      LIMIT 50
    `;

    res.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
});

// Get provider by ID or shareLink
providersRouter.get('/:idOrLink', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idOrLink } = req.params;

    const provider = await prisma.provider.findFirst({
      where: {
        OR: [
          { id: idOrLink },
          { shareLink: idOrLink },
        ],
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, avatar: true, phone: true },
        },
        services: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        workingHours: {
          orderBy: { day: 'asc' },
        },
        badges: true,
        reviews: {
          include: {
            customer: {
              select: { firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!provider) {
      throw ApiError.notFound('Provider not found');
    }

    // Track profile view
    await prisma.providerAnalytics.upsert({
      where: {
        providerId_date: {
          providerId: provider.id,
          date: new Date(new Date().toISOString().split('T')[0]),
        },
      },
      update: { profileViews: { increment: 1 } },
      create: {
        providerId: provider.id,
        date: new Date(new Date().toISOString().split('T')[0]),
        profileViews: 1,
      },
    });

    res.json({ success: true, data: provider });
  } catch (error) {
    next(error);
  }
});

// Create provider profile
providersRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      businessName,
      description,
      category,
      subcategories,
      latitude,
      longitude,
      address,
      city,
      country = 'Kenya',
      instantBooking = false,
      serviceRadius = 10,
      workingHours,
    } = req.body;

    // Check if user already has a provider profile
    const existing = await prisma.provider.findUnique({
      where: { userId: req.user!.id },
    });

    if (existing) {
      throw ApiError.conflict('You already have a provider profile');
    }

    // Generate unique shareLink
    const shareLink = businessName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') + 
      '-' + Date.now().toString(36);

    const provider = await prisma.provider.create({
      data: {
        userId: req.user!.id,
        businessName,
        description,
        category,
        subcategories,
        latitude,
        longitude,
        address,
        city,
        country,
        shareLink,
        instantBooking,
        serviceRadius,
        workingHours: workingHours
          ? { create: workingHours }
          : undefined,
      },
      include: {
        workingHours: true,
      },
    });

    // Update user role
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { role: 'PROVIDER' },
    });

    res.status(201).json({ success: true, data: provider });
  } catch (error) {
    next(error);
  }
});

// Update provider profile
providersRouter.patch('/:id', authenticate, authorize('PROVIDER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      businessName,
      description,
      subcategories,
      latitude,
      longitude,
      address,
      city,
      instantBooking,
      serviceRadius,
      minimumNotice,
      cancellationPolicy,
      gallery,
    } = req.body;

    // Verify ownership
    const existing = await prisma.provider.findUnique({
      where: { id },
    });

    if (!existing) {
      throw ApiError.notFound('Provider not found');
    }

    if (existing.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw ApiError.forbidden('Not authorized to update this provider');
    }

    const provider = await prisma.provider.update({
      where: { id },
      data: {
        ...(businessName && { businessName }),
        ...(description && { description }),
        ...(subcategories && { subcategories }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(address && { address }),
        ...(city && { city }),
        ...(instantBooking !== undefined && { instantBooking }),
        ...(serviceRadius && { serviceRadius }),
        ...(minimumNotice && { minimumNotice }),
        ...(cancellationPolicy && { cancellationPolicy }),
        ...(gallery && { gallery }),
      },
      include: {
        workingHours: true,
        badges: true,
      },
    });

    res.json({ success: true, data: provider });
  } catch (error) {
    next(error);
  }
});

// Get provider's services
providersRouter.get('/:id/services', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const services = await prisma.service.findMany({
      where: { providerId: id, isActive: true },
      orderBy: { price: 'asc' },
    });

    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
});

// Get provider's reviews
providersRouter.get('/:id/reviews', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { providerId: id },
        include: {
          customer: {
            select: { firstName: true, lastName: true, avatar: true },
          },
          booking: {
            include: { service: { select: { name: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.review.count({ where: { providerId: id } }),
    ]);

    // Calculate rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { providerId: id },
      _count: true,
    });

    res.json({
      success: true,
      data: {
        items: reviews,
        total,
        page: parseInt(page as string),
        pageSize: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
        ratingDistribution: Object.fromEntries(
          ratingDistribution.map((r) => [r.rating, r._count])
        ),
      },
    });
  } catch (error) {
    next(error);
  }
});
