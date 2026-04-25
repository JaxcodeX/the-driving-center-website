import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ ok: true, msg: 'minimal test' })
}

export async function POST(request: Request) {
  return NextResponse.json({ ok: true, msg: 'POST works' })
}
