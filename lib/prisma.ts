// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// In development, use a global variable to prevent multiple instances
// of Prisma Client in development when HMR is used
const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export { prisma };
