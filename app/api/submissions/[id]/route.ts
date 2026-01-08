import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, response, responseUrl } = body

    const submission = await prisma.submission.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(response !== undefined && { response }),
        ...(responseUrl !== undefined && { responseUrl })
      }
    })

    return NextResponse.json(submission)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}

