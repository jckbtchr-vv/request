import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.content || !body.socialHandle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: content and socialHandle'
    })
  }

  const submission = await prisma.submission.create({
    data: {
      content: body.content,
      socialHandle: body.socialHandle
    }
  })

  setResponseStatus(event, 201)
  return submission
})
