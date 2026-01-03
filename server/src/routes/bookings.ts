import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { Server as SocketIOServer } from 'socket.io';

export const bookingsRouter = Router();

// Get user's bookings (customer or provider)
bookingsRouter.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, upcoming, page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Get provider ID if user is a provider
    const provider = await prisma.provider.findUnique({
      where: { userId: req.user!.id },
    });

    const where = {
      OR: [
        { customerId: req.user!.id },
        ...(provider ? [{ providerId: provider.id }] : []),
      ],
      ...(status && { status: status as string }),
      ...(upcoming === 'true' && {
        scheduledDate: { gte: new Date() },
        status: { in: ['PENDING', 'CONFIRMED'] },
      }),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, avatar: true, phone: true },
          },
          provider: {
            include: {
              user: {
                select: { firstName: true, lastName: true, avatar: true },
              },
            },
          },
          service: true,
          payment: true,
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

// Get booking by ID
bookingsRouter.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        customer: {
          select: { id: true, firstName: true, lastName: true, avatar: true, phone: true },
        },
        provider: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatar: true, phone: true },
            },
          },
        },
        service: true,
        payment: true,
        review: true,
      },
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    // Verify access
    const provider = await prisma.provider.findUnique({
      where: { userId: req.user!.id },
    });

    if (
      booking.customerId !== req.user!.id &&
      booking.providerId !== provider?.id &&
      req.user!.role !== 'ADMIN'
    ) {
      throw ApiError.forbidden('Not authorized to view this booking');
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

// Create booking
bookingsRouter.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      serviceId,
      scheduledDate,
      scheduledTime,
      latitude,
      longitude,
      address,
      notes,
      isInstantBooking = false,
    } = req.body;

    // Get service and provider
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { provider: true },
    });

    if (!service) {
      throw ApiError.notFound('Service not found');
    }

    if (!service.isActive) {
      throw ApiError.badRequest('This service is not available');
    }

    // Check for conflicting bookings
    const existingBooking = await prisma.booking.findFirst({
      where: {
        providerId: service.providerId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
      },
    });

    if (existingBooking) {
      throw ApiError.conflict('This time slot is not available');
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerId: req.user!.id,
        providerId: service.providerId,
        serviceId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        duration: service.duration,
        latitude,
        longitude,
        address,
        notes,
        isInstantBooking,
        totalAmount: service.price,
        currency: service.currency,
        status: service.provider.instantBooking && isInstantBooking ? 'CONFIRMED' : 'PENDING',
        ...(service.provider.instantBooking && isInstantBooking && { confirmedAt: new Date() }),
      },
      include: {
        customer: {
          select: { firstName: true, lastName: true },
        },
        provider: {
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
        service: true,
      },
    });

    // Send notification to provider
    await prisma.notification.create({
      data: {
        userId: service.provider.userId,
        type: 'BOOKING_CONFIRMED',
        title: 'New Booking Request',
        message: `${booking.customer.firstName} has booked ${service.name}`,
        data: { bookingId: booking.id },
      },
    });

    // Emit socket event
    const io = req.app.get('io') as SocketIOServer;
    io.to(`user_${service.provider.userId}`).emit('new_booking', booking);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

// Confirm booking (provider only)
bookingsRouter.patch('/:id/confirm', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { provider: true },
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    if (booking.provider.userId !== req.user!.id) {
      throw ApiError.forbidden('Not authorized');
    }

    if (booking.status !== 'PENDING') {
      throw ApiError.badRequest('Booking cannot be confirmed');
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
      include: {
        service: true,
        provider: { include: { user: true } },
      },
    });

    // Notify customer
    await prisma.notification.create({
      data: {
        userId: booking.customerId,
        type: 'BOOKING_CONFIRMED',
        title: 'Booking Confirmed',
        message: `Your booking for ${updated.service.name} has been confirmed`,
        data: { bookingId: id },
      },
    });

    const io = req.app.get('io') as SocketIOServer;
    io.to(`user_${booking.customerId}`).emit('booking_confirmed', updated);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Cancel booking
bookingsRouter.patch('/:id/cancel', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { provider: true, service: true },
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    // Check authorization
    const provider = await prisma.provider.findUnique({
      where: { userId: req.user!.id },
    });

    const isCustomer = booking.customerId === req.user!.id;
    const isProvider = booking.providerId === provider?.id;

    if (!isCustomer && !isProvider && req.user!.role !== 'ADMIN') {
      throw ApiError.forbidden('Not authorized');
    }

    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw ApiError.badRequest('Booking cannot be cancelled');
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy: isCustomer ? 'CUSTOMER' : 'PROVIDER',
        cancellationReason: reason,
      },
    });

    // Notify the other party
    const notifyUserId = isCustomer ? booking.provider.userId : booking.customerId;
    await prisma.notification.create({
      data: {
        userId: notifyUserId,
        type: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled',
        message: `Booking for ${booking.service.name} has been cancelled`,
        data: { bookingId: id, reason },
      },
    });

    const io = req.app.get('io') as SocketIOServer;
    io.to(`user_${notifyUserId}`).emit('booking_cancelled', updated);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Complete booking (provider only)
bookingsRouter.patch('/:id/complete', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { provider: true, service: true },
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    if (booking.provider.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw ApiError.forbidden('Not authorized');
    }

    if (booking.status !== 'IN_PROGRESS' && booking.status !== 'CONFIRMED') {
      throw ApiError.badRequest('Booking cannot be completed');
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Update provider analytics
    await prisma.providerAnalytics.upsert({
      where: {
        providerId_date: {
          providerId: booking.providerId,
          date: new Date(new Date().toISOString().split('T')[0]),
        },
      },
      update: {
        completedBookings: { increment: 1 },
        totalEarnings: { increment: booking.totalAmount * 0.85 }, // After 15% commission
      },
      create: {
        providerId: booking.providerId,
        date: new Date(new Date().toISOString().split('T')[0]),
        completedBookings: 1,
        totalEarnings: booking.totalAmount * 0.85,
      },
    });

    // Award loyalty points
    await prisma.loyaltyPoints.update({
      where: { userId: booking.customerId },
      data: {
        points: { increment: 10 },
        lifetimePoints: { increment: 10 },
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Reschedule booking
bookingsRouter.patch('/:id/reschedule', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { scheduledDate, scheduledTime } = req.body;

    if (!scheduledDate || !scheduledTime) {
      throw ApiError.badRequest('New date and time are required');
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { provider: true, service: true },
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    // Check authorization
    if (booking.customerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw ApiError.forbidden('Not authorized');
    }

    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw ApiError.badRequest('Booking cannot be rescheduled');
    }

    // Check for conflicts
    const conflict = await prisma.booking.findFirst({
      where: {
        id: { not: id },
        providerId: booking.providerId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
      },
    });

    if (conflict) {
      throw ApiError.conflict('This time slot is not available');
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        status: 'PENDING', // Needs re-confirmation
      },
    });

    // Notify provider
    await prisma.notification.create({
      data: {
        userId: booking.provider.userId,
        type: 'BOOKING_REMINDER',
        title: 'Booking Rescheduled',
        message: `Booking for ${booking.service.name} has been rescheduled`,
        data: { bookingId: id },
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});
