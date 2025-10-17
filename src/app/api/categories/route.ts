import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/firebase-data'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
