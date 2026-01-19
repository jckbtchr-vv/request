import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const submissions = await prisma.submission.findMany({
    where: {
      status: 'approved',
      isPublic: true
    },
    orderBy: {
      votes: 'desc'
    },
    select: {
      id: true,
      content: true,
      socialHandle: true,
      votes: true,
      createdAt: true
    }
  })
  return submissions
})
