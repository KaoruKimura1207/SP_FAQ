import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FaqItem } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_INSTRUCTION = `あなたはFAQ回答システムです。以下のルールを必ず守ってください。

【絶対ルール】
- FAQリストに記載されている回答文のみを使用してください
- 自分で推論・補完・創作した内容を一切追加しないでください
- 質問に複数のFAQ項目が該当する場合は、各項目の回答をそのまま組み合わせて返してください
- FAQに存在しない内容の質問には「申し訳ありません、その内容はFAQに登録されていません。」とだけ回答してください
- 回答の要約・言い換え・補足は禁止です`;

function buildFaqContext(items: FaqItem[]): string {
  return items
    .map(
      (item, i) =>
        `[${i + 1}] カテゴリ: ${item.category}\nQ: ${item.question}\nA: ${item.answer}`
    )
    .join('\n\n');
}

export async function answerFromFaq(question: string, faqItems: FaqItem[]): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const faqContext = buildFaqContext(faqItems);
  const prompt = `【FAQリスト】\n${faqContext}\n\n【質問】\n${question}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
