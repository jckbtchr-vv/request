import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = getHeader(event, 'x-user-id')

  if (!userId) {
    return []
  }

  const submissions = await prisma.submission.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      content: true,
      socialHandle: true,
      status: true,
      votes: true,
      isPublic: true,
      responseUrl: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return submissions
})
