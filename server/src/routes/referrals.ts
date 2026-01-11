import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import crypto from 'crypto';

export const referralsRouter = Router();

// Generate unique referral code
function generateReferralCode(userId: string): string {
  const hash = crypto.createHash('sha256').update(userId + Date.now()).digest('hex');
  return `AFR${hash.substring(0, 8).toUpperCase()}`;
}

// Get user's referral info
referralsRouter.get('/my-referral', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    // Get or create user's referral code
    let referral = await prisma.referral.findFirst({
      where: { referrerId: userId, referredId: null },
    });

    if (!referral) {
      referral = await prisma.referral.create({
        data: {
          referrerId: userId,
          referralCode: generateReferralCode(userId),
        },
      });
    }

    // Get referral stats
    const [totalReferrals, successfulReferrals, totalEarnings] = await Promise.all([
      prisma.referral.count({
        where: { referrerId: userId, referredId: { not: null } },
      }),
      prisma.referral.count({
        where: { referrerId: userId, status: { in: ['QUALIFIED', 'REWARDED'] } },
      }),
      prisma.referralReward.aggregate({
        where: { userId, status: 'CLAIMED' },
        _sum: { amount: true },
      }),
    ]);

    // Get recent referrals
    const recentReferrals = await prisma.referral.findMany({
      where: { referrerId: userId, referredId: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get referred user names
    const referralsWithNames = await Promise.all(
      recentReferrals.map(async (ref) => {
        if (!ref.referredId) return { ...ref, referredUser: null };
        const user = await prisma.user.findUnique({
          where: { id: ref.referredId },
          select: { firstName: true, lastName: true, avatar: true },
        });
        return { ...ref, referredUser: user };
      })
    );

    res.json({
      success: true,
      data: {
        referralCode: referral.referralCode,
        shareLink: `${process.env.FRONTEND_URL}/register?ref=${referral.referralCode}`,
        stats: {
          totalReferrals,
          successfulReferrals,
          totalEarnings: totalEarnings._sum.amount || 0,
          pendingRewards: await prisma.referralReward.aggregate({
            where: { userId, status: 'AVAILABLE' },
            _sum: { amount: true },
          }).then(r => r._sum.amount || 0),
        },
        recentReferrals: referralsWithNames,
        rewards: {
          referrerReward: 100, // KES
          referredReward: 50,  // KES
          qualifyingAction: 'Complete first booking',
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Validate referral code
referralsRouter.get('/validate/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;

    const referral = await prisma.referral.findUnique({
      where: { referralCode: code },
    });

    if (!referral) {
      return res.json({
        success: true,
        data: { valid: false, message: 'Invalid referral code' },
      });
    }

    // Get referrer info
    const referrer = await prisma.user.findUnique({
      where: { id: referral.referrerId },
      select: { firstName: true, avatar: true },
    });

    res.json({
      success: true,
      data: {
        valid: true,
        referrer: referrer?.firstName,
        reward: 50, // KES reward for new user
      },
    });
  } catch (error) {
    next(error);
  }
});

// Apply referral code (called during registration)
referralsRouter.post('/apply', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { referralCode } = req.body;

    if (!referralCode) {
      throw new ApiError(400, 'Referral code is required');
    }

    // Check if user already used a referral
    const existingReferral = await prisma.referral.findFirst({
      where: { referredId: userId },
    });

    if (existingReferral) {
      throw new ApiError(400, 'You have already used a referral code');
    }

    // Find the referral
    const referral = await prisma.referral.findUnique({
      where: { referralCode },
    });

    if (!referral) {
      throw new ApiError(404, 'Invalid referral code');
    }

    // Can't refer yourself
    if (referral.referrerId === userId) {
      throw new ApiError(400, 'You cannot use your own referral code');
    }

    // Create new referral record for this user
    const newReferral = await prisma.referral.create({
      data: {
        referrerId: referral.referrerId,
        referredId: userId,
        referralCode: generateReferralCode(userId + 'ref'),
        status: 'SIGNED_UP',
        signupAt: new Date(),
        referredReward: 50, // KES
        referrerReward: 100, // KES
      },
    });

    res.json({
      success: true,
      data: {
        message: 'Referral code applied! You\'ll receive KES 50 after your first booking.',
        referralId: newReferral.id,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Process referral qualification (called after first booking)
referralsRouter.post('/qualify/:referralId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { referralId } = req.params;
    const userId = req.user!.id;

    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
    });

    if (!referral || referral.referredId !== userId) {
      throw new ApiError(404, 'Referral not found');
    }

    if (referral.status !== 'SIGNED_UP') {
      throw new ApiError(400, 'Referral already processed');
    }

    // Update referral status
    await prisma.referral.update({
      where: { id: referralId },
      data: {
        status: 'QUALIFIED',
        qualifiedAt: new Date(),
      },
    });

    // Create rewards for both users
    await prisma.$transaction([
      // Reward for referred user
      prisma.referralReward.create({
        data: {
          userId: referral.referredId!,
          referralId,
          amount: referral.referredReward,
          type: 'CASH',
          status: 'AVAILABLE',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      }),
      // Reward for referrer
      prisma.referralReward.create({
        data: {
          userId: referral.referrerId,
          referralId,
          amount: referral.referrerReward,
          type: 'CASH',
          status: 'AVAILABLE',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    res.json({
      success: true,
      data: { message: 'Referral rewards unlocked!' },
    });
  } catch (error) {
    next(error);
  }
});

// Get available rewards
referralsRouter.get('/rewards', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const rewards = await prisma.referralReward.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const summary = {
      available: rewards.filter(r => r.status === 'AVAILABLE').reduce((sum, r) => sum + r.amount, 0),
      claimed: rewards.filter(r => r.status === 'CLAIMED').reduce((sum, r) => sum + r.amount, 0),
      expired: rewards.filter(r => r.status === 'EXPIRED').reduce((sum, r) => sum + r.amount, 0),
    };

    res.json({
      success: true,
      data: { rewards, summary },
    });
  } catch (error) {
    next(error);
  }
});

// Claim reward (transfer to wallet)
referralsRouter.post('/rewards/:rewardId/claim', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rewardId } = req.params;
    const userId = req.user!.id;

    const reward = await prisma.referralReward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || reward.userId !== userId) {
      throw new ApiError(404, 'Reward not found');
    }

    if (reward.status !== 'AVAILABLE') {
      throw new ApiError(400, 'Reward is not available for claiming');
    }

    // Check expiration
    if (reward.expiresAt && new Date() > reward.expiresAt) {
      await prisma.referralReward.update({
        where: { id: rewardId },
        data: { status: 'EXPIRED' },
      });
      throw new ApiError(400, 'Reward has expired');
    }

    // Transfer to wallet
    await prisma.$transaction([
      prisma.referralReward.update({
        where: { id: rewardId },
        data: { status: 'CLAIMED', claimedAt: new Date() },
      }),
      prisma.wallet.update({
        where: { userId },
        data: { balance: { increment: reward.amount } },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: (await prisma.wallet.findUnique({ where: { userId } }))!.id,
          type: 'CREDIT',
          amount: reward.amount,
          currency: 'KES',
          description: 'Referral reward claimed',
          status: 'COMPLETED',
        },
      }),
    ]);

    res.json({
      success: true,
      data: { message: `KES ${reward.amount} added to your wallet!` },
    });
  } catch (error) {
    next(error);
  }
});

// Get leaderboard
referralsRouter.get('/leaderboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leaderboard = await prisma.$queryRaw`
      SELECT 
        u."firstName",
        u."avatar",
        COUNT(r.id) as "referralCount",
        SUM(CASE WHEN r.status IN ('QUALIFIED', 'REWARDED') THEN 1 ELSE 0 END) as "successfulReferrals"
      FROM "User" u
      LEFT JOIN "Referral" r ON r."referrerId" = u.id AND r."referredId" IS NOT NULL
      GROUP BY u.id, u."firstName", u."avatar"
      HAVING COUNT(r.id) > 0
      ORDER BY "successfulReferrals" DESC, "referralCount" DESC
      LIMIT 10
    `;

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
});
