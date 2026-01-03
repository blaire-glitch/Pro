import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';

export const reviewsRouter = Router();

// Create review
reviewsRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, rating, comment, images } = req.body;

    if (!bookingId || !rating || !comment) {
      throw ApiError.badRequest('Booking ID, rating, and comment are required');
    }

    if (rating < 1 || rating > 5) {
      throw ApiError.badRequest('Rating must be between 1 and 5');
    }

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    if (booking.customerId !== req.user!.id) {
      throw ApiError.forbidden('Not authorized');
    }

    if (booking.status !== 'COMPLETED') {
      throw ApiError.badRequest('Can only review completed bookings');
    }

    if (booking.review) {
      throw ApiError.conflict('Review already exists for this booking');
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId,
        customerId: req.user!.id,
        providerId: booking.providerId,
        rating,
        comment,
        images: images || [],
      },
      include: {
        customer: {
          select: { firstName: true, lastName: true, avatar: true },
        },
      },
    });

    // Update provider rating
    const reviews = await prisma.review.findMany({
      where: { providerId: booking.providerId },
      select: { rating: true },
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.provider.update({
      where: { id: booking.providerId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });

    // Notify provider
    const provider = await prisma.provider.findUnique({
      where: { id: booking.providerId },
    });

    if (provider) {
      await prisma.notification.create({
        data: {
          userId: provider.userId,
          type: 'NEW_REVIEW',
          title: 'New Review',
          message: `${review.customer.firstName} left a ${rating}-star review`,
          data: { reviewId: review.id, bookingId },
        },
      });
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

// Provider respond to review
reviewsRouter.post('/:id/respond', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    if (!response) {
      throw ApiError.badRequest('Response is required');
    }

    const review = await prisma.review.findUnique({
      where: { id },
      include: { provider: true },
    });

    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    if (review.provider.userId !== req.user!.id) {
      throw ApiError.forbidden('Not authorized');
    }

    if (review.response) {
      throw ApiError.conflict('Already responded to this review');
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        response,
        respondedAt: new Date(),
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Get reviews for a provider
reviewsRouter.get('/provider/:providerId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { providerId } = req.params;
    const { rating, page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = {
      providerId,
      ...(rating && { rating: parseInt(rating as string) }),
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
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
      prisma.review.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: reviews,
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
