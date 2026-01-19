import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const submissions = await prisma.submission.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  return submissions
})
