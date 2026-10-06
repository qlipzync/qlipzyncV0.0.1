import { GoogleGenAI, Type, Schema } from '@google/genai';

// Lazy-Initialisierung des Gemini-Clients zur Vermeidung von Boot-Crashes bei fehlendem Key
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY ist in den Server-Umgebungsvariablen nicht konfiguriert.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// -----------------------------------------------------------------------------
// 1. Social-Media Metadaten (TikTok, Shorts, Reels)
// -----------------------------------------------------------------------------
export interface ClipMetadataInput {
  streamer: string;
  game?: string;
  clipTitle: string;
  transcriptSnippet?: string;
}

export interface GeneratedSocialMetadata {
  viralTitle: string;
  hook: string;
  caption: string;
  hashtags: string[];
  suggestedPlatforms: ('tiktok' | 'youtube_shorts' | 'instagram_reels')[];
}

const socialMetadataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    viralTitle: {
      type: Type.STRING,
      description: 'Ein klickstarker Kurztitel unter 60 Zeichen.',
    },
    hook: {
      type: Type.STRING,
      description: 'Der visuelle oder gesprochene Hook der ersten 3 Sekunden.',
    },
    caption: {
      type: Type.STRING,
      description: 'Kurze Social-Media-Beschreibung inklusive Call-to-Action.',
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '5 bis 8 virale Gaming-Hashtags ohne Duplikate.',
    },
    suggestedPlatforms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Empfohlene Plattformen (tiktok, youtube_shorts, instagram_reels).',
    },
  },
  required: ['viralTitle', 'hook', 'caption', 'hashtags', 'suggestedPlatforms'],
};

export async function generateSocialMetadata(
  input: ClipMetadataInput
): Promise<GeneratedSocialMetadata> {
  const ai = getGeminiClient();
  const prompt = `
Analysiere diesen Gaming-Stream-Clip und erstelle zielgruppenoptimierte Metadaten für Kurzvideo-Plattformen:
- Streamer: ${input.streamer}
- Spiel/Kategorie: ${input.game || 'Gaming'}
- Originaler Clip-Titel: "${input.clipTitle}"
${input.transcriptSnippet ? `- Audio-Transkript / Highlight: "${input.transcriptSnippet}"` : ''}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction:
        'Du bist ein professioneller Social-Media-Stratege für Twitch-Clips und Kurzvideos. Antworte präzise und halte dich strikt an das vorgegebene JSON-Schema.',
      temperature: 0.7,
      responseMimeType: 'application/json',
      responseSchema: socialMetadataSchema,
    },
  });

  const text = response.text;
  if (!text) throw new Error('Gemini API hat eine leere Antwort geliefert.');
  return JSON.parse(text) as GeneratedSocialMetadata;
}

// -----------------------------------------------------------------------------
// 2. Virales Kurzvideo-Skript
// -----------------------------------------------------------------------------
export interface ViralScriptOptions {
  streamTitle?: string;
  channelName?: string;
  durationSec?: number;
  topic?: string;
  tone?: string;
}

export async function generateViralClipScript(options: ViralScriptOptions): Promise<string> {
  const ai = getGeminiClient();
  const prompt = `
Du bist ein weltklasse Viral Video Producer und Kurzvideo-Algorithmus-Experte (TikTok, YouTube Shorts, Instagram Reels).
Erstelle ein fesselndes Skript für einen 9:16 Gaming-Highlight-Clip basierend auf folgenden Stream-Daten:

- Stream-Titel: "${options.streamTitle || 'Epic Twitch Gameplay & Reaction'}"
- Twitch-Kanal: "${options.channelName || 'Streamer'}"
- Ziel-Länge: ${options.durationSec || 45} Sekunden
- Thema / Spiel: ${options.topic || 'Highlight-Momente & Community Interaction'}
- Tonalität: ${options.tone || 'Energisch, fesselnd, authentisch'}

Struktur:
1. Hook (Sekunde 0-3): Visueller & auditiver Aufhänger (Stop the Scroll)
2. Story/Gameplay Climax (Sekunde 4-45): Schneller Aufbau, prägnante Schnitt- und Sound-Hinweise [Cue: Sound Effect]
3. Call to Action (Sekunde 46-60): Twitch-Follow & YouTube-Abo Aufforderung
4. Optimierte Video-Beschreibung & 5 virale Hashtags
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.75,
    },
  });

  return response.text || 'Skript konnte nicht generiert werden.';
}

// -----------------------------------------------------------------------------
// 3. Sponsoren-Pitch
// -----------------------------------------------------------------------------
export interface SponsorPitchOptions {
  sponsorName?: string;
  channelName?: string;
  avgViewers?: string;
  focusGame?: string;
  pricingEur?: number;
}

export async function generateSponsorPitch(options: SponsorPitchOptions): Promise<string> {
  const ai = getGeminiClient();
  const prompt = `
Formuliere eine hochprofessionelle Sponsoren-Pitch-E-Mail auf Deutsch für den Twitch-Kanal "${options.channelName || 'Streamer'}".
- Sponsor/Marke: ${options.sponsorName || 'Gaming Gear Brand'}
- Durchschnittliche Zuschauer (CCV): ${options.avgViewers || '150-300+ Live'}
- Hauptfokus / Spiel: ${options.focusGame || 'Gaming, Reaction & Community Events'}
- Angebotenes Paket: ${
    options.pricingEur
      ? `${options.pricingEur} € für dediziertes Twitch-Banner, 3x Live-Shoutouts & Clip-Integration`
      : 'Individuelles Kampagnenpaket'
  }

Anforderungen:
- Höflich, verbindlich und auf Augenhöhe
- Klare Nennung des Mehrwerts (hohe Conversion in der Gaming-Zielgruppe, Zero-Botting-Qualität)
- Strukturierter Aufbau mit Betreffzeile und Signatur
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || 'Pitch konnte nicht generiert werden.';
}

// -----------------------------------------------------------------------------
// 4. Clip-Virality-Analyse
// -----------------------------------------------------------------------------
export async function analyzeClipVirality(
  clipTitle: string,
  gameName?: string
): Promise<{
  viralityScore: number;
  suggestions: string[];
  recommendedHashtags: string[];
}> {
  try {
    const ai = getGeminiClient();
    const prompt = `Analysiere den folgenden Clip-Titel für einen TikTok/Reels Gaming-Clip:
Titel: "${clipTitle}"
Spiel: "${gameName || 'Twitch Stream'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            viralityScore: { type: Type.NUMBER },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['viralityScore', 'suggestions', 'recommendedHashtags'],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (e) {
    console.warn('[Gemini Service] Fallback Virality-Scoring aktiv:', e);
  }

  return {
    viralityScore: 88,
    suggestions: ['Hook in den ersten 2 Sekunden optimieren', 'Auto-Captions aktivieren'],
    recommendedHashtags: ['#twitchclips', '#foryou', '#gamingmoment', '#viralstream'],
  };
}

// -----------------------------------------------------------------------------
// 5. Architektur-Advisor (für AiArchitectureAdvisor.tsx)
// -----------------------------------------------------------------------------
export async function generateArchitectureAdvice(prompt: string): Promise<string> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.4,
    },
  });

  return response.text || 'Keine Empfehlung generiert.';
}