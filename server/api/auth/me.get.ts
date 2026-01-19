import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = getHeader(event, 'x-user-id')

  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      createdAt: true
    }
  })

  return user
})
