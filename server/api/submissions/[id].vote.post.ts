import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing submission ID'
    })
  }

  // Check if submission exists and is approved
  const existing = await prisma.submission.findUnique({
    where: { id }
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Submission not found'
    })
  }

  if (existing.status !== 'approved') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Can only vote on approved submissions'
    })
  }

  const submission = await prisma.submission.update({
    where: { id },
    data: {
      votes: { increment: 1 }
    }
  })

  return submission
})
