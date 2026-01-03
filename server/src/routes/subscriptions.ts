import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';

export const subscriptionsRouter = Router();

// Get all subscription packages
subscriptionsRouter.get('/packages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;

    const packages = await prisma.subscriptionPackage.findMany({
      where: {
        isActive: true,
        ...(category && { category: (category as string).toUpperCase() }),
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { price: 'asc' },
    });

    res.json({ success: true, data: packages });
  } catch (error) {
    next(error);
  }
});

// Get user's subscriptions
subscriptionsRouter.get('/my', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await prisma.userSubscription.findMany({
      where: { userId: req.user!.id },
      include: {
        package: {
          include: {
            services: {
              include: { service: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
});

// Subscribe to a package
subscriptionsRouter.post('/subscribe', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { packageId, autoRenew = true } = req.body;

    const pkg = await prisma.subscriptionPackage.findUnique({
      where: { id: packageId },
    });

    if (!pkg || !pkg.isActive) {
      throw ApiError.notFound('Package not found');
    }

    // Check if user already has an active subscription for this package
    const existing = await prisma.userSubscription.findFirst({
      where: {
        userId: req.user!.id,
        packageId,
        status: 'ACTIVE',
      },
    });

    if (existing) {
      throw ApiError.conflict('You already have an active subscription for this package');
    }

    // Calculate end date based on frequency
    const endDate = new Date();
    switch (pkg.frequency) {
      case 'WEEKLY':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'BIWEEKLY':
        endDate.setDate(endDate.getDate() + 14);
        break;
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
    }

    const subscription = await prisma.userSubscription.create({
      data: {
        userId: req.user!.id,
        packageId,
        endDate,
        autoRenew,
      },
      include: {
        package: true,
      },
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
});

// Cancel subscription
subscriptionsRouter.patch('/:id/cancel', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!subscription) {
      throw ApiError.notFound('Subscription not found');
    }

    if (subscription.status !== 'ACTIVE') {
      throw ApiError.badRequest('Subscription is not active');
    }

    const updated = await prisma.userSubscription.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        autoRenew: false,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Pause subscription
subscriptionsRouter.patch('/:id/pause', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        id,
        userId: req.user!.id,
        status: 'ACTIVE',
      },
    });

    if (!subscription) {
      throw ApiError.notFound('Active subscription not found');
    }

    const updated = await prisma.userSubscription.update({
      where: { id },
      data: { status: 'PAUSED' },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Resume subscription
subscriptionsRouter.patch('/:id/resume', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        id,
        userId: req.user!.id,
        status: 'PAUSED',
      },
    });

    if (!subscription) {
      throw ApiError.notFound('Paused subscription not found');
    }

    const updated = await prisma.userSubscription.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});
