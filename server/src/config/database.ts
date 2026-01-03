// Neon PostgreSQL Database Configuration
// Free tier: 500MB storage, 0.5 GB RAM

import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Configure Neon for serverless environments
neonConfig.webSocketConstructor = ws;

let prisma: PrismaClient;

// For serverless environments (Vercel, Cloudflare Workers)
export const createServerlessPrisma = () => {
  const connectionString = process.env.DATABASE_URL!;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  
  return new PrismaClient({ adapter } as any);
};

// For standard Node.js environments (Railway, local)
export const createPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
    });
  }
  return prisma;
};

// Disconnect helper
export const disconnectPrisma = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

// Health check
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = createPrisma();
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

export default createPrisma;
