import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const isDev = import.meta.dev

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  })

if (isDev) globalForPrisma.prisma = prisma
