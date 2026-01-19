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

  const user = await prisma.user.findUnique({
    where: { username: body.username }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  const valid = await bcrypt.compare(body.password, user.password)

  if (!valid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt
  }
})
