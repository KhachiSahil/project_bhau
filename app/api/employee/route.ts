import prisma from '@/db';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, password } = body;

    if (!name || !password) {
      return NextResponse.json({
        error: 'missing values'
      },
        {
          status: 400
        })
    }
    const user = await prisma.admin.create({
      data: {
        name,
        password
      }
    })
    return NextResponse.json({
      msg: user
    },
      {
        status: 200
      })

  } catch (err) {
    return NextResponse.json({
      msg: err
    },
      { status: 400 })
  }
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const user = await prisma.admin.findUnique({
    where: {
      name,
    },
  });

  return NextResponse.json({ msg: user }, { status: 200 });
}