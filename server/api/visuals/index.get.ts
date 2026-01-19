import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const visuals = await prisma.completedVisual.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  return visuals
})
