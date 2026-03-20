import { google } from 'googleapis';
import type { FaqItem } from '@/types';

let cache: { data: FaqItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000;

function getAuth() {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

export async function getFaqItems(): Promise<FaqItem[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
    range: 'A2:D',
  });

  const rows = response.data.values ?? [];
  const data: FaqItem[] = rows
    .filter((row) => row[1] && row[2])
    .map((row) => ({
      category: row[0] ?? '',
      question: row[1] ?? '',
      answer: row[2] ?? '',
      tags: row[3] ?? '',
    }));

  cache = { data, timestamp: Date.now() };
  return data;
}

export function clearFaqCache(): void {
  cache = null;
}
