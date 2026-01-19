import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = getHeader(event, 'x-user-id')

  if (!body.content || !body.socialHandle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: content and socialHandle'
    })
  }

  const submission = await prisma.submission.create({
    data: {
      content: body.content,
      socialHandle: body.socialHandle,
      email: body.email || null,
      isPublic: body.isPublic !== false,
      userId: userId || null
    }
  })

  setResponseStatus(event, 201)
  return submission
})
