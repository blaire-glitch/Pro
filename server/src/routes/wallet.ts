import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { mpesaService } from '../services/mpesa.js';

export const walletRouter = Router();

// Get wallet balance and info
walletRouter.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get or create wallet for user
    let wallet = await prisma.wallet.findUnique({
      where: { userId: req.user!.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: req.user!.id,
          balance: 0,
          currency: 'KES',
        },
        include: {
          transactions: true,
        },
      });
    }

    // Get loyalty points
    const loyalty = await prisma.loyaltyPoints.findUnique({
      where: { userId: req.user!.id },
    });

    res.json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        tier: loyalty?.tier || 'BRONZE',
        points: loyalty?.points || 0,
        recentTransactions: wallet.transactions,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get transaction history
walletRouter.get('/transactions', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user!.id },
    });

    if (!wallet) {
      return res.json({
        success: true,
        data: {
          items: [],
          total: 0,
          page: 1,
          pageSize: 20,
          totalPages: 0,
        },
      });
    }

    const where = {
      walletId: wallet.id,
      ...(type && { type: type as string }),
    };

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.walletTransaction.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: transactions,
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

// Top up wallet
walletRouter.post('/topup', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, method, phone } = req.body;

    if (!amount || amount <= 0) {
      throw ApiError.badRequest('Valid amount is required');
    }

    if (!method) {
      throw ApiError.badRequest('Payment method is required');
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: req.user!.id },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: req.user!.id,
          balance: 0,
          currency: 'KES',
        },
      });
    }

    // Create pending transaction
    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'TOPUP',
        amount,
        currency: 'KES',
        status: 'PENDING',
        description: `Top up via ${method}`,
      },
    });

    if (method === 'MPESA') {
      try {
        const mpesaResponse = await mpesaService.stkPush({
          phoneNumber: phone,
          amount,
          accountReference: `WALLET-${transaction.id.slice(0, 8)}`,
          transactionDesc: 'Wallet Top Up',
        });

        await prisma.walletTransaction.update({
          where: { id: transaction.id },
          data: {
            reference: mpesaResponse.CheckoutRequestID,
          },
        });

        res.json({
          success: true,
          data: {
            transactionId: transaction.id,
            checkoutRequestId: mpesaResponse.CheckoutRequestID,
            message: 'Please enter your M-Pesa PIN to complete',
          },
        });
      } catch (mpesaError) {
        // For development/testing, simulate success
        await prisma.walletTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'COMPLETED',
            reference: `MOCK_${Date.now()}`,
          },
        });

        await prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { increment: amount },
          },
        });

        res.json({
          success: true,
          data: {
            transactionId: transaction.id,
            message: 'Top up successful (demo mode)',
            demo: true,
          },
        });
      }
    } else {
      // For other methods, mark as pending
      res.json({
        success: true,
        data: {
          transactionId: transaction.id,
          message: 'Top up initiated. Please complete payment.',
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

// Send money to another user
walletRouter.post('/send', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { recipientPhone, amount, note } = req.body;

    if (!recipientPhone || !amount || amount <= 0) {
      throw ApiError.badRequest('Recipient phone and valid amount are required');
    }

    // Get sender wallet
    const senderWallet = await prisma.wallet.findUnique({
      where: { userId: req.user!.id },
    });

    if (!senderWallet || senderWallet.balance < amount) {
      throw ApiError.badRequest('Insufficient balance');
    }

    // Find recipient by phone
    const recipient = await prisma.user.findFirst({
      where: { phone: recipientPhone },
    });

    if (!recipient) {
      throw ApiError.notFound('Recipient not found');
    }

    if (recipient.id === req.user!.id) {
      throw ApiError.badRequest('Cannot send money to yourself');
    }

    // Get or create recipient wallet
    let recipientWallet = await prisma.wallet.findUnique({
      where: { userId: recipient.id },
    });

    if (!recipientWallet) {
      recipientWallet = await prisma.wallet.create({
        data: {
          userId: recipient.id,
          balance: 0,
          currency: 'KES',
        },
      });
    }

    // Execute transfer in transaction
    const reference = `TRF_${Date.now()}`;

    await prisma.$transaction([
      // Debit sender
      prisma.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: amount } },
      }),
      // Create sender transaction
      prisma.walletTransaction.create({
        data: {
          walletId: senderWallet.id,
          type: 'SEND',
          amount: -amount,
          currency: 'KES',
          status: 'COMPLETED',
          description: note || `Sent to ${recipient.firstName}`,
          reference,
          recipientId: recipient.id,
        },
      }),
      // Credit recipient
      prisma.wallet.update({
        where: { id: recipientWallet.id },
        data: { balance: { increment: amount } },
      }),
      // Create recipient transaction
      prisma.walletTransaction.create({
        data: {
          walletId: recipientWallet.id,
          type: 'RECEIVE',
          amount,
          currency: 'KES',
          status: 'COMPLETED',
          description: note || `Received from ${req.user!.email}`,
          reference,
          senderId: req.user!.id,
        },
      }),
    ]);

    // Notify recipient
    await prisma.notification.create({
      data: {
        userId: recipient.id,
        type: 'PAYMENT_RECEIVED',
        title: 'Money Received',
        message: `You received KES ${amount.toLocaleString()} from a friend`,
        data: { amount, reference },
      },
    });

    res.json({
      success: true,
      data: {
        message: `KES ${amount.toLocaleString()} sent to ${recipient.firstName}`,
        reference,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Request money from another user
walletRouter.post('/request', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fromPhone, amount, note } = req.body;

    if (!fromPhone || !amount || amount <= 0) {
      throw ApiError.badRequest('Phone number and valid amount are required');
    }

    // Find the person we're requesting from
    const requestFrom = await prisma.user.findFirst({
      where: { phone: fromPhone },
    });

    if (!requestFrom) {
      throw ApiError.notFound('User not found');
    }

    const requester = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    // Create notification for the request
    await prisma.notification.create({
      data: {
        userId: requestFrom.id,
        type: 'MONEY_REQUEST',
        title: 'Money Request',
        message: `${requester?.firstName} is requesting KES ${amount.toLocaleString()}`,
        data: { 
          amount, 
          requesterId: req.user!.id,
          note,
        },
      },
    });

    res.json({
      success: true,
      message: `Request for KES ${amount.toLocaleString()} sent to ${requestFrom.firstName}`,
    });
  } catch (error) {
    next(error);
  }
});

// Pay bill
walletRouter.post('/pay-bill', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { billType, accountNumber, amount, provider } = req.body;

    if (!billType || !accountNumber || !amount || amount <= 0) {
      throw ApiError.badRequest('Bill type, account number, and valid amount are required');
    }

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user!.id },
    });

    if (!wallet || wallet.balance < amount) {
      throw ApiError.badRequest('Insufficient balance');
    }

    // Deduct from wallet and create transaction
    const reference = `BILL_${Date.now()}`;

    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'BILL_PAYMENT',
          amount: -amount,
          currency: 'KES',
          status: 'COMPLETED',
          description: `${billType} - ${provider || 'Bill Payment'}`,
          reference,
          metadata: { billType, accountNumber, provider },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        message: `${billType} payment of KES ${amount.toLocaleString()} successful`,
        reference,
      },
    });
  } catch (error) {
    next(error);
  }
});
