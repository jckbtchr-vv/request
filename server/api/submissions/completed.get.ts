import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const submissions = await prisma.submission.findMany({
    where: {
      status: 'completed',
      isPublic: true
    },
    orderBy: {
      updatedAt: 'desc'
    },
    select: {
      id: true,
      content: true,
      socialHandle: true,
      responseUrl: true,
      createdAt: true
    }
  })
  return submissions
})
