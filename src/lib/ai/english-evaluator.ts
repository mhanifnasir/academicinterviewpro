import { z } from "zod";
import {
  ENGLISH_PRACTICE_SCENARIOS,
  EnglishScenarioKey,
} from "@/data/english-scenarios";

export const VoiceEvaluationResultSchema = z.object({
  grammarScore: z.number().min(0).max(100),
  fluencyScore: z.number().min(0).max(100),
  vocabularyScore: z.number().min(0).max(100),
  pronunciationScore: z.number().min(0).max(100),
  clarityScore: z.number().min(0).max(100),
  relevanceScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  wordsPerMinute: z.number(),
  fillerWordCount: z.number(),
  fillerWords: z.array(z.object({ word: z.string(), count: z.number() })),
  correctedSentence: z.string(),
  grammarExplanation: z.string(),
  urduExplanation: z.string().optional(),
  vocabularyUpgrades: z.array(
    z.object({
      original: z.string(),
      suggested: z.string(),
      reason: z.string(),
    })
  ),
  suggestedPractice: z.string(),
  aiConversationalReply: z.string(),
});

export type VoiceEvaluationResult = z.infer<typeof VoiceEvaluationResultSchema>;

// Common filler words tracked in spoken English
const FILLER_WORDS_LIST = [
  "um",
  "uh",
  "er",
  "like",
  "you know",
  "basically",
  "actually",
  "literally",
  "i mean",
  "so yeah",
  "kind of",
  "sort of",
];

// High-frequency Pakistani English common grammatical errors and corrections
const COMMON_GRAMMAR_PATTERNS: Array<{
  regex: RegExp;
  correction: string;
  explanation: string;
  urdu: string;
}> = [
  {
    regex: /\bi am having\b/i,
    correction: "I have",
    explanation:
      "Stative verbs of possession like 'have' should not be used in the continuous (-ing) tense when indicating possession.",
    urdu: "ملکیت یا حیثیت ظاہر کرنے کے لیے 'I have' کا استعمال درست ہے، نہ کہ 'I am having'۔",
  },
  {
    regex: /\bpassed out from\b/i,
    correction: "graduated from",
    explanation:
      "In standard academic English, 'passed out' means lost consciousness. Use 'graduated from' or 'completed my degree at'.",
    urdu: "یونیورسٹی کی ڈگری مکمل کرنے کے لیے 'graduated from' کا لفظ درست ہے، نہ کہ 'passed out'۔",
  },
  {
    regex: /\bdiscuss about\b/i,
    correction: "discuss",
    explanation:
      "The verb 'discuss' is transitive and takes a direct object. 'About' is redundant.",
    urdu: "لفظ 'discuss' کے ساتھ 'about' لگانا غلط ہے، صرف 'discuss the topic' کہیں۔",
  },
  {
    regex: /\bcope up with\b/i,
    correction: "cope with",
    explanation:
      "The correct idiom is 'cope with', meaning to deal effectively with something difficult.",
    urdu: "صحیح محاورہ 'cope with' ہے، اس میں 'up' نہیں آتا۔",
  },
  {
    regex: /\brevert back\b/i,
    correction: "revert / reply",
    explanation:
      "'Revert' already means to return to a previous state. 'Back' is redundant.",
    urdu: "لفظ 'revert' کے ساتھ 'back' کی ضرورت نہیں ہوتی۔",
  },
  {
    regex: /\bme and my colleague\b/i,
    correction: "my colleague and I",
    explanation:
      "When acting as the subject of a sentence, use subjective case 'I' and place the other person first out of politeness.",
    urdu: "جب آپ فاعل (Subject) کے طور پر بات کر رہے ہوں تو 'my colleague and I' استعمال کریں۔",
  },
];

// Vocabulary upgrade dictionary
const VOCABULARY_UPGRADE_MAP: Record<string, { suggested: string; reason: string }> = {
  good: { suggested: "exemplary / robust", reason: "Demonstrates higher academic precision." },
  bad: { suggested: "suboptimal / detrimental", reason: "More formal and objective." },
  big: { suggested: "substantial / profound", reason: "Elevates conversational register." },
  hard: { suggested: "computationally intensive / rigorous", reason: "Specific to technical academia." },
  explain: { suggested: "elucidate / articulate", reason: "Standard scholarly nomenclature." },
  fast: { suggested: "high-throughput / efficient", reason: "Technical precision." },
  make: { suggested: "synthesize / construct", reason: "More academic phrasing." },
  show: { suggested: "demonstrate / exhibit", reason: "Preferred in university discourse." },
  try: { suggested: "endeavor / strive", reason: "More formal and persuasive." },
  use: { suggested: "leverage / deploy", reason: "Professional modern vocabulary." },
};

export class EnglishVoiceEvaluator {
  /**
   * Evaluates candidate spoken transcript against grammar, fluency, vocabulary, and relevance
   */
  static async evaluateTranscript(params: {
    scenarioKey: EnglishScenarioKey;
    candidateTranscript: string;
    audioDurationSeconds?: number;
    turnIndex: number;
    includeUrdu?: boolean;
  }): Promise<VoiceEvaluationResult> {
    const scenario = ENGLISH_PRACTICE_SCENARIOS[params.scenarioKey] || ENGLISH_PRACTICE_SCENARIOS.GENERAL_CONVERSATION;

    // Check external AI provider if configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const aiResult = await this.callGeminiForEvaluation({
          scenario,
          ...params,
        });
        if (aiResult) return aiResult;
      } catch (err) {
        console.warn("External AI call failed, falling back to linguistic evaluator:", err);
      }
    }

    // High-Fidelity Deterministic Linguistic Engine
    return this.evaluateWithLinguisticEngine({
      scenario,
      ...params,
    });
  }

  /**
   * Internal deterministic linguistic analysis for zero-downtime offline execution
   */
  private static evaluateWithLinguisticEngine(params: {
    scenario: typeof ENGLISH_PRACTICE_SCENARIOS.GENERAL_CONVERSATION;
    candidateTranscript: string;
    audioDurationSeconds?: number;
    turnIndex: number;
    includeUrdu?: boolean;
  }): VoiceEvaluationResult {
    const text = params.candidateTranscript.trim();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // 1. Calculate WPM (Words Per Minute)
    const durationMins = (params.audioDurationSeconds && params.audioDurationSeconds > 0)
      ? params.audioDurationSeconds / 60
      : Math.max(0.1, wordCount / 130);
    const calculatedWPM = Math.round(wordCount / durationMins);
    const wpm = Math.min(220, Math.max(60, calculatedWPM));

    // 2. Detect Filler Words
    const fillerWords: Array<{ word: string; count: number }> = [];
    let totalFillerCount = 0;

    for (const fw of FILLER_WORDS_LIST) {
      const regex = new RegExp(`\\b${fw}\\b`, "gi");
      const matches = text.match(regex);
      if (matches && matches.length > 0) {
        fillerWords.push({ word: fw, count: matches.length });
        totalFillerCount += matches.length;
      }
    }

    // 3. Grammar Checking & Pattern Matching
    let correctedSentence = text;
    let grammarExplanation = "Your sentence structure was sound and grammatically intact.";
    let urduExplanation = params.includeUrdu
      ? "آپ کے جملے کی ساخت درست تھی اور کوئی بڑی گرامر کی غلطی نہیں پائی گئی۔"
      : undefined;
    let grammarDeductions = 0;

    for (const pattern of COMMON_GRAMMAR_PATTERNS) {
      if (pattern.regex.test(text)) {
        correctedSentence = correctedSentence.replace(pattern.regex, pattern.correction);
        grammarExplanation = pattern.explanation;
        if (params.includeUrdu) {
          urduExplanation = pattern.urdu;
        }
        grammarDeductions += 15;
      }
    }

    // Check capitalization & sentence ending
    if (correctedSentence.length > 0 && !/[.?!]$/.test(correctedSentence)) {
      correctedSentence += ".";
    }

    // 4. Vocabulary Upgrades
    const vocabularyUpgrades: Array<{ original: string; suggested: string; reason: string }> = [];
    for (const [simpleWord, upgrade] of Object.entries(VOCABULARY_UPGRADE_MAP)) {
      const reg = new RegExp(`\\b${simpleWord}\\b`, "i");
      if (reg.test(text)) {
        vocabularyUpgrades.push({
          original: simpleWord,
          suggested: upgrade.suggested,
          reason: upgrade.reason,
        });
      }
    }

    // 5. Score Calculations
    // Grammar Score
    let grammarScore = Math.max(50, 100 - grammarDeductions);
    if (wordCount < 10) grammarScore -= 10;

    // Fluency Score (Target 120-145 WPM, penalize excessive fillers)
    let fluencyScore = 88;
    if (wpm < params.scenario.targetWPM.min) {
      fluencyScore -= Math.min(25, (params.scenario.targetWPM.min - wpm) * 0.8);
    } else if (wpm > params.scenario.targetWPM.max) {
      fluencyScore -= Math.min(20, (wpm - params.scenario.targetWPM.max) * 0.6);
    }
    fluencyScore -= Math.min(20, totalFillerCount * 4);
    fluencyScore = Math.round(Math.max(45, Math.min(98, fluencyScore)));

    // Vocabulary Score
    let vocabularyScore = 75;
    if (vocabularyUpgrades.length > 0) vocabularyScore += 8;
    if (wordCount > 35) vocabularyScore += 7;
    for (const recVocab of params.scenario.recommendedVocabulary) {
      if (text.toLowerCase().includes(recVocab.toLowerCase())) {
        vocabularyScore += 4;
      }
    }
    vocabularyScore = Math.min(95, vocabularyScore);

    // Pronunciation & Clarity Score
    const pronunciationScore = Math.min(96, Math.max(70, Math.round((fluencyScore + grammarScore) / 2)));
    const clarityScore = Math.min(95, Math.max(65, Math.round(grammarScore * 0.6 + fluencyScore * 0.4)));

    // Answer Relevance Score
    let relevanceScore = 85;
    if (wordCount < 12) relevanceScore = 60;

    // Overall Aggregate Score
    const overallScore = Math.round(
      grammarScore * 0.25 +
      fluencyScore * 0.25 +
      vocabularyScore * 0.2 +
      pronunciationScore * 0.1 +
      clarityScore * 0.1 +
      relevanceScore * 0.1
    );

    // Conversational Follow-Up Reply
    const conversationalReplies: Record<EnglishScenarioKey, string[]> = {
      GENERAL_CONVERSATION: [
        "That is very interesting! How do you usually balance your academic schedule with continuous technical self-study?",
        "Indeed. When speaking with international peers or researchers, what communication strategies do you find most helpful?",
      ],
      LECTURER_INTERVIEW: [
        "A compelling perspective. Candidate, how would you address an undergraduate student who claims that theoretical computer science is irrelevant to modern software industry jobs?",
        "Very well articulated. And what specific role does academic research play in maintaining your lecturing excellence?",
      ],
      SELF_INTRODUCTION: [
        "Thank you for that introduction. Could you elaborate on how your graduate thesis findings directly translate into effective classroom instruction?",
        "Good. And what is your 5-year academic career plan if inducted into the faculty?",
      ],
      TECHNICAL_ENGLISH: [
        "Precisely. Now, how would you explain the subtle difference between a deadlock and a livelock to third-semester students?",
        "Excellent technical terminology. What is the precise mechanical relationship between CPU cache lines and false sharing in multi-threaded programs?",
      ],
      HR_INTERVIEW: [
        "A measured and diplomatic response. How would you handle a situation where an influential department member requests an arbitrary grade boost for a student?",
        "Thank you. How do you maintain professional boundaries while serving as an approachable student mentor?",
      ],
      CLASSROOM_COMMUNICATION: [
        "An engaging demonstration! How would you verify that the students at the back of the lecture hall actually understood the pointer mechanics you just described?",
        "Well explained. What active learning techniques would you pair with this lecture topic?",
      ],
      ACADEMIC_DISCUSSION: [
        "An astute counter-argument. However, how do you account for potential confounding variables in your experimental validation dataset?",
        "Point well taken. How scalable is this proposed methodology when deployed across heterogeneous distributed nodes?",
      ],
    };

    const replyList = conversationalReplies[params.scenario.key] || conversationalReplies.GENERAL_CONVERSATION;
    const aiConversationalReply =
      replyList[params.turnIndex % replyList.length] ||
      "Thank you for your response. Let us explore the next dimension of this topic.";

    return {
      grammarScore,
      fluencyScore,
      vocabularyScore,
      pronunciationScore,
      clarityScore,
      relevanceScore,
      overallScore,
      wordsPerMinute: wpm,
      fillerWordCount: totalFillerCount,
      fillerWords,
      correctedSentence,
      grammarExplanation,
      urduExplanation,
      vocabularyUpgrades: vocabularyUpgrades.slice(0, 3),
      suggestedPractice: `Practice delivering this answer aloud aiming for a smooth cadence of ${params.scenario.targetWPM.min}-${params.scenario.targetWPM.max} words per minute with fewer filler words.`,
      aiConversationalReply,
    };
  }

  /**
   * Calls Google Gemini API if configured
   */
  private static async callGeminiForEvaluation(params: {
    scenario: typeof ENGLISH_PRACTICE_SCENARIOS.GENERAL_CONVERSATION;
    candidateTranscript: string;
    audioDurationSeconds?: number;
    turnIndex: number;
    includeUrdu?: boolean;
  }): Promise<VoiceEvaluationResult | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const prompt = `You are a professional IELTS / Academic English Voice Examiner for Pakistani University Lecturer candidates.
Scenario: ${params.scenario.title} (${params.scenario.subtitle}).
Target Cadence: ${params.scenario.targetWPM.min}-${params.scenario.targetWPM.max} WPM. CEFR Level: ${params.scenario.cefrTarget}.
Candidate Spoken Transcript: "${params.candidateTranscript}"
Estimated Audio Duration: ${params.audioDurationSeconds || 15} seconds.
Include Urdu Explanation: ${params.includeUrdu ? "Yes" : "No"}.

Analyze the candidate's speech:
1. Grammar Score (0-100)
2. Fluency Score (0-100)
3. Vocabulary Score (0-100)
4. Pronunciation Score (0-100)
5. Clarity Score (0-100)
6. Relevance Score (0-100)
7. Exact corrected sentence (formal academic English)
8. Grammar explanation
${params.includeUrdu ? "9. Urdu explanation of the grammatical mistake (in Urdu script)" : ""}
10. Vocabulary upgrades (original -> academic replacement with reason)
11. An engaging conversational follow-up response in English for the next turn.

Return ONLY strict valid JSON in this schema:
{
  "grammarScore": number,
  "fluencyScore": number,
  "vocabularyScore": number,
  "pronunciationScore": number,
  "clarityScore": number,
  "relevanceScore": number,
  "overallScore": number,
  "wordsPerMinute": number,
  "fillerWordCount": number,
  "fillerWords": [{"word": string, "count": number}],
  "correctedSentence": string,
  "grammarExplanation": string,
  "urduExplanation": string,
  "vocabularyUpgrades": [{"original": string, "suggested": string, "reason": string}],
  "suggestedPractice": string,
  "aiConversationalReply": string
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!res.ok) return null;
    const json = await res.json();
    const textOut = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOut) return null;

    const parsed = JSON.parse(textOut);
    return VoiceEvaluationResultSchema.parse(parsed);
  }
}
