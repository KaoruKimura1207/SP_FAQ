import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase/admin';
import { getFaqItems } from '@/lib/sheets';
import { answerFromFaq } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    initAdmin();
    await getAuth().verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const question: string = body.question?.trim() ?? '';
  if (!question) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }

  const faqItems = await getFaqItems();
  const answer = await answerFromFaq(question, faqItems);

  return NextResponse.json({ answer });
}
