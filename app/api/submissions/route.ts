import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(submissions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, socialHandle } = body

    if (!content || !socialHandle) {
      return NextResponse.json(
        { error: 'Content and social handle are required' },
        { status: 400 }
      )
    }

    const submission = await prisma.submission.create({
      data: {
        content,
        socialHandle,
        status: 'pending'
      }
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}

