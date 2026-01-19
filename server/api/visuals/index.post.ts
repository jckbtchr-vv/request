import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.title || !body.imageUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and image URL required'
    })
  }

  const visual = await prisma.completedVisual.create({
    data: {
      title: body.title,
      description: body.description || null,
      imageUrl: body.imageUrl
    }
  })

  return visual
})
