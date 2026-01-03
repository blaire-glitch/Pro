import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const servicesRouter = Router();

// Get all services
servicesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      page = '1',
      limit = '20',
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      isActive: true,
      ...(category && { category: category as string }),
      ...(subcategory && { subcategory: subcategory as string }),
      ...(minPrice && { price: { gte: parseFloat(minPrice as string) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice as string) } }),
    };

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          provider: {
            include: {
              user: {
                select: { firstName: true, lastName: true, avatar: true },
              },
            },
          },
        },
        orderBy: { price: 'asc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.service.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: services,
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

// Get service by ID
servicesRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: {
        provider: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true },
            },
            workingHours: true,
          },
        },
      },
    });

    if (!service) {
      throw ApiError.notFound('Service not found');
    }

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

// Get services by category
servicesRouter.get('/category/:category', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    const { subcategory, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      isActive: true,
      category: category.toUpperCase(),
      ...(subcategory && { subcategory: subcategory as string }),
    };

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          provider: {
            include: {
              user: {
                select: { firstName: true, lastName: true, avatar: true },
              },
            },
          },
        },
        orderBy: { price: 'asc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.service.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: services,
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

// Create service (provider only)
servicesRouter.post('/', authenticate, authorize('PROVIDER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, category, subcategory, price, currency = 'KES', duration, images } = req.body;

    // Get provider ID
    const provider = await prisma.provider.findUnique({
      where: { userId: req.user!.id },
    });

    if (!provider) {
      throw ApiError.forbidden('You must create a provider profile first');
    }

    const service = await prisma.service.create({
      data: {
        providerId: provider.id,
        name,
        description,
        category,
        subcategory,
        price,
        currency,
        duration,
        images: images || [],
      },
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

// Update service
servicesRouter.patch('/:id', authenticate, authorize('PROVIDER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration, images, isActive } = req.body;

    // Verify ownership
    const service = await prisma.service.findUnique({
      where: { id },
      include: { provider: true },
    });

    if (!service) {
      throw ApiError.notFound('Service not found');
    }

    if (service.provider.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw ApiError.forbidden('Not authorized to update this service');
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(duration && { duration }),
        ...(images && { images }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({ success: true, data: updatedService });
  } catch (error) {
    next(error);
  }
});

// Delete service
servicesRouter.delete('/:id', authenticate, authorize('PROVIDER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const service = await prisma.service.findUnique({
      where: { id },
      include: { provider: true },
    });

    if (!service) {
      throw ApiError.notFound('Service not found');
    }

    if (service.provider.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw ApiError.forbidden('Not authorized to delete this service');
    }

    // Soft delete - just mark as inactive
    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
});
