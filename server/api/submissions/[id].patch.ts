import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing submission ID'
    })
  }

  const submission = await prisma.submission.update({
    where: { id },
    data: {
      status: body.status,
      response: body.response,
      responseUrl: body.responseUrl
    }
  })

  return submission
})
