import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';

export const analyticsRouter = Router();

// Get provider analytics (for providers)
analyticsRouter.get('/provider', authenticate, authorize('PROVIDER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = 'month' } = req.query;

    // Get provider
    const provider = await prisma.provider.findUnique({
      where: { userId: req.user!.id },
    });

    if (!provider) {
      throw ApiError.notFound('Provider profile not found');
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Get analytics data
    const [
      analytics,
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalEarnings,
      recentReviews,
    ] = await Promise.all([
      prisma.providerAnalytics.findMany({
        where: {
          providerId: provider.id,
          date: { gte: startDate, lte: endDate },
        },
        orderBy: { date: 'asc' },
      }),
      prisma.booking.count({
        where: {
          providerId: provider.id,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.booking.count({
        where: {
          providerId: provider.id,
          status: 'COMPLETED',
          completedAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.booking.count({
        where: {
          providerId: provider.id,
          status: 'CANCELLED',
          cancelledAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.payment.aggregate({
        where: {
          booking: { providerId: provider.id },
          status: 'COMPLETED',
          paidAt: { gte: startDate, lte: endDate },
        },
        _sum: { providerAmount: true },
      }),
      prisma.review.findMany({
        where: {
          providerId: provider.id,
          createdAt: { gte: startDate, lte: endDate },
        },
        include: {
          customer: {
            select: { firstName: true, lastName: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    // Get top services
    const topServices = await prisma.booking.groupBy({
      by: ['serviceId'],
      where: {
        providerId: provider.id,
        status: 'COMPLETED',
        completedAt: { gte: startDate, lte: endDate },
      },
      _count: { serviceId: true },
      orderBy: { _count: { serviceId: 'desc' } },
      take: 5,
    });

    const serviceIds = topServices.map((s) => s.serviceId);
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalBookings,
          completedBookings,
          cancelledBookings,
          completionRate: totalBookings > 0 
            ? Math.round((completedBookings / totalBookings) * 100) 
            : 0,
          totalEarnings: totalEarnings._sum.providerAmount || 0,
          rating: provider.rating,
          reviewCount: provider.reviewCount,
        },
        dailyData: analytics,
        topServices: topServices.map((ts) => ({
          service: services.find((s) => s.id === ts.serviceId),
          count: ts._count.serviceId,
        })),
        recentReviews,
        period,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get earnings breakdown
analyticsRouter.get('/provider/earnings', authenticate, authorize('PROVIDER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = 'month' } = req.query;

    const provider = await prisma.provider.findUnique({
      where: { userId: req.user!.id },
    });

    if (!provider) {
      throw ApiError.notFound('Provider profile not found');
    }

    const endDate = new Date();
    const startDate = new Date();
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Get payments
    const payments = await prisma.payment.findMany({
      where: {
        booking: { providerId: provider.id },
        status: 'COMPLETED',
        paidAt: { gte: startDate, lte: endDate },
      },
      include: {
        booking: {
          include: { service: true },
        },
      },
      orderBy: { paidAt: 'desc' },
    });

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalCommission = payments.reduce((sum, p) => sum + (p.commissionAmount || 0), 0);
    const netEarnings = payments.reduce((sum, p) => sum + (p.providerAmount || 0), 0);

    // Group by service
    const earningsByService: Record<string, number> = {};
    payments.forEach((p) => {
      const serviceName = p.booking.service.name;
      earningsByService[serviceName] = (earningsByService[serviceName] || 0) + (p.providerAmount || 0);
    });

    res.json({
      success: true,
      data: {
        totalAmount,
        totalCommission,
        netEarnings,
        paymentCount: payments.length,
        earningsByService,
        recentPayments: payments.slice(0, 10),
        period,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get booking analytics
analyticsRouter.get('/provider/bookings', authenticate, authorize('PROVIDER', 'ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const provider = await prisma.provider.findUnique({
      where: { userId: req.user!.id },
    });

    if (!provider) {
      throw ApiError.notFound('Provider profile not found');
    }

    // Get booking stats by status
    const bookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      where: { providerId: provider.id },
      _count: { status: true },
    });

    // Get bookings by day of week
    const bookings = await prisma.booking.findMany({
      where: {
        providerId: provider.id,
        status: 'COMPLETED',
      },
      select: { scheduledDate: true },
    });

    const bookingsByDay = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    bookings.forEach((b) => {
      const day = new Date(b.scheduledDate).getDay();
      bookingsByDay[day]++;
    });

    // Get peak hours
    const bookingsByHour: Record<string, number> = {};
    const allBookings = await prisma.booking.findMany({
      where: { providerId: provider.id },
      select: { scheduledTime: true },
    });

    allBookings.forEach((b) => {
      const hour = b.scheduledTime.split(':')[0];
      bookingsByHour[hour] = (bookingsByHour[hour] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        byStatus: Object.fromEntries(
          bookingsByStatus.map((b) => [b.status, b._count.status])
        ),
        byDayOfWeek: {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          data: bookingsByDay,
        },
        peakHours: bookingsByHour,
      },
    });
  } catch (error) {
    next(error);
  }
});
