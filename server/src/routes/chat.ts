import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';

export const chatRouter = Router();

// Get all conversations for current user
chatRouter.get('/conversations', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Find conversations where user is either customer or provider
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { customerId: userId },
          { providerId: userId },
        ],
        isActive: true,
      },
      orderBy: { lastMessageAt: 'desc' },
      skip,
      take: parseInt(limit as string),
    });

    // Get participant details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.customerId === userId ? conv.providerId : conv.customerId;
        
        // Get provider details
        const provider = await prisma.provider.findUnique({
          where: { userId: otherUserId },
          select: {
            id: true,
            businessName: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        });

        // Get customer details if not provider
        let otherUser = provider?.user;
        if (!otherUser) {
          otherUser = await prisma.user.findUnique({
            where: { id: otherUserId },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          });
        }

        // Get unread count
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            isRead: false,
          },
        });

        return {
          ...conv,
          participant: {
            ...otherUser,
            businessName: provider?.businessName,
          },
          unreadCount,
        };
      })
    );

    res.json({
      success: true,
      data: conversationsWithDetails,
    });
  } catch (error) {
    next(error);
  }
});

// Get or create conversation with a provider
chatRouter.post('/conversations', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { providerId, bookingId } = req.body;

    if (!providerId) {
      throw new ApiError(400, 'Provider ID is required');
    }

    // Get provider's user ID
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
      select: { userId: true },
    });

    if (!provider) {
      throw new ApiError(404, 'Provider not found');
    }

    // Check if conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        customerId: userId,
        providerId: provider.userId,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          customerId: userId,
          providerId: provider.userId,
          bookingId,
        },
      });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
});

// Get messages for a conversation
chatRouter.get('/conversations/:conversationId/messages', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { conversationId } = req.params;
    const { page = '1', limit = '50' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { customerId: userId },
          { providerId: userId },
        ],
      },
    });

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.message.count({ where: { conversationId } }),
    ]);

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
        status: 'READ',
      },
    });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
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

// Send a message
chatRouter.post('/conversations/:conversationId/messages', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { conversationId } = req.params;
    const { content, type = 'TEXT', attachments = [] } = req.body;

    if (!content && attachments.length === 0) {
      throw new ApiError(400, 'Message content or attachments required');
    }

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { customerId: userId },
          { providerId: userId },
        ],
      },
    });

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: content || '',
        type,
        attachments,
        status: 'SENT',
      },
    });

    // Update conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: content || 'Attachment',
        lastMessageAt: new Date(),
      },
    });

    // Get sender details for the response
    const sender = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    });

    // Emit via Socket.IO
    const io = req.app.get('io');
    const recipientId = conversation.customerId === userId 
      ? conversation.providerId 
      : conversation.customerId;

    io.to(`user_${recipientId}`).emit('new_message', {
      ...message,
      sender,
    });

    res.status(201).json({
      success: true,
      data: {
        ...message,
        sender,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Mark messages as read
chatRouter.patch('/conversations/:conversationId/read', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { conversationId } = req.params;

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { customerId: userId },
          { providerId: userId },
        ],
      },
    });

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    // Mark all messages from other user as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
        status: 'READ',
      },
    });

    // Notify sender that messages were read
    const io = req.app.get('io');
    const otherUserId = conversation.customerId === userId 
      ? conversation.providerId 
      : conversation.customerId;

    io.to(`user_${otherUserId}`).emit('messages_read', {
      conversationId,
      readBy: userId,
    });

    res.json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    next(error);
  }
});

// Get unread message count
chatRouter.get('/unread-count', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    // Get all conversations for user
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { customerId: userId },
          { providerId: userId },
        ],
        isActive: true,
      },
      select: { id: true },
    });

    const conversationIds = conversations.map(c => c.id);

    // Count unread messages
    const unreadCount = await prisma.message.count({
      where: {
        conversationId: { in: conversationIds },
        senderId: { not: userId },
        isRead: false,
      },
    });

    res.json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    next(error);
  }
});

// Delete conversation (soft delete)
chatRouter.delete('/conversations/:conversationId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { conversationId } = req.params;

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { customerId: userId },
          { providerId: userId },
        ],
      },
    });

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    // Soft delete
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: 'Conversation deleted',
    });
  } catch (error) {
    next(error);
  }
});
