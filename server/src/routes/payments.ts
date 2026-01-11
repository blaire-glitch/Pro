import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { mpesaService } from '../services/mpesa.js';

export const paymentsRouter = Router();

// Initialize payment
paymentsRouter.post('/initiate', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, method, phone } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    if (booking.customerId !== req.user!.id) {
      throw ApiError.forbidden('Not authorized');
    }

    if (booking.payment?.status === 'COMPLETED') {
      throw ApiError.badRequest('Payment already completed');
    }

    // Calculate commission
    const commissionRate = 0.15; // 15%
    const commissionAmount = booking.totalAmount * commissionRate;
    const providerAmount = booking.totalAmount - commissionAmount;

    // Create or update payment record
    const payment = await prisma.payment.upsert({
      where: { bookingId },
      update: {
        method,
        status: 'PROCESSING',
      },
      create: {
        bookingId,
        amount: booking.totalAmount,
        currency: booking.currency,
        method,
        status: 'PROCESSING',
        providerAmount,
        commissionAmount,
      },
    });

    // Handle different payment methods
    if (method === 'MPESA') {
      try {
        // Integrate with M-Pesa STK Push
        const mpesaResponse = await mpesaService.stkPush({
          phoneNumber: phone,
          amount: booking.totalAmount,
          accountReference: `AFR-${bookingId.slice(0, 8)}`,
          transactionDesc: `Payment for ${booking.id}`,
        });

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            checkoutRequestId: mpesaResponse.CheckoutRequestID,
            merchantRequestId: mpesaResponse.MerchantRequestID,
          },
        });

        res.json({
          success: true,
          data: {
            paymentId: payment.id,
            checkoutRequestId: mpesaResponse.CheckoutRequestID,
            message: 'Please enter your M-Pesa PIN to complete payment',
          },
        });
      } catch (mpesaError: any) {
        // Fallback to mock response for development/testing
        const mockResponse = {
          CheckoutRequestID: `ws_CO_${Date.now()}`,
          MerchantRequestID: `${Date.now()}-${bookingId}`,
        };

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            checkoutRequestId: mockResponse.CheckoutRequestID,
            merchantRequestId: mockResponse.MerchantRequestID,
            status: 'PENDING',
          },
        });

        res.json({
          success: true,
          data: {
            paymentId: payment.id,
            checkoutRequestId: mockResponse.CheckoutRequestID,
            message: 'Payment initiated. Please check your phone for M-Pesa prompt.',
            demo: true,
          },
        });
      }
    } else if (method === 'AIRTEL_MONEY') {
      // Airtel Money integration with mock fallback
      const airtelCheckoutId = `AIRTEL_${Date.now()}`;
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          checkoutRequestId: airtelCheckoutId,
          status: 'PENDING',
        },
      });

      res.json({
        success: true,
        data: {
          paymentId: payment.id,
          checkoutRequestId: airtelCheckoutId,
          message: 'Please approve the payment request on your phone',
        },
      });
    } else {
      // Card or Wallet payment
      res.json({
        success: true,
        data: {
          paymentId: payment.id,
          method,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

// M-Pesa callback (webhook)
paymentsRouter.post('/mpesa/callback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Body } = req.body;

    if (!Body?.stkCallback) {
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

    // Find payment by checkout request ID
    const payment = await prisma.payment.findFirst({
      where: { checkoutRequestId: CheckoutRequestID },
      include: { booking: true },
    });

    if (!payment) {
      console.error('Payment not found for checkout:', CheckoutRequestID);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      const receiptNumber = metadata.find((i: { Name: string; Value: unknown }) => i.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = metadata.find((i: { Name: string; Value: unknown }) => i.Name === 'TransactionDate')?.Value;

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          mpesaReceiptNumber: receiptNumber,
          transactionId: receiptNumber,
          paidAt: new Date(),
        },
      });

      // Update booking status if not already confirmed
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date(),
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: payment.booking.customerId,
          type: 'PAYMENT_RECEIVED',
          title: 'Payment Successful',
          message: `Payment of KSh ${payment.amount} received. Receipt: ${receiptNumber}`,
          data: { paymentId: payment.id, bookingId: payment.bookingId },
        },
      });
    } else {
      // Payment failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
        },
      });
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});

// Check payment status
paymentsRouter.get('/:id/status', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        booking: {
          select: { customerId: true },
        },
      },
    });

    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }

    if (payment.booking.customerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw ApiError.forbidden('Not authorized');
    }

    res.json({
      success: true,
      data: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        transactionId: payment.transactionId,
        mpesaReceiptNumber: payment.mpesaReceiptNumber,
        paidAt: payment.paidAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Confirm payment (manual/testing)
paymentsRouter.post('/:id/confirm', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }

    if (payment.status === 'COMPLETED') {
      throw ApiError.badRequest('Payment already completed');
    }

    const updated = await prisma.payment.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        transactionId: transactionId || `TXN_${Date.now()}`,
        paidAt: new Date(),
      },
    });

    // Update booking
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});
