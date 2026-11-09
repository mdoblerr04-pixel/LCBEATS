import { GoogleGenAI } from "@google/genai";
import { Beat } from '../types';

let aiClient: GoogleGenAI | null = null;

// Initialize the client lazily
const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API_KEY not found in environment variables");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateLyrics = async (beat: Beat, topic: string, style: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Error: API Key faltante. Configura tu clave de API para usar esta función.";

  const prompt = `
    Actúa como un compositor de canciones profesional de habla hispana.
    Escribe un coro y un verso para una canción basada en la siguiente instrumental:
    
    Título: ${beat.title}
    BPM: ${beat.bpm}
    Género/Tags: ${beat.tags.join(', ')}
    Tonalidad: ${beat.key}
    
    El usuario quiere que la letra trate sobre: "${topic}".
    Estilo de letra deseado: "${style}".
    
    Estructura la respuesta claramente con [Coro] y [Verso]. 
    Mantén el ritmo y la rima adecuados para el género especificado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "No se pudo generar la letra.";
  } catch (error) {
    console.error("Error generating lyrics:", error);
    return "Ocurrió un error al contactar con la IA. Por favor intenta de nuevo.";
  }
};