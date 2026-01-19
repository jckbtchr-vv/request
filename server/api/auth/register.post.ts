import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password required'
    })
  }

  const existing = await prisma.user.findUnique({
    where: { username: body.username }
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username already taken'
    })
  }

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const user = await prisma.user.create({
    data: {
      username: body.username,
      password: hashedPassword
    },
    select: {
      id: true,
      username: true,
      createdAt: true
    }
  })

  return user
})
