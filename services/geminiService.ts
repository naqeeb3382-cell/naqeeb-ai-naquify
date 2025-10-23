import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function editImage(base64ImageData: string, mimeType: string, prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    throw new Error("No image was generated in the response.");

  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    throw new Error("The AI model failed to process the image. Please try again with a different image or effect.");
  }
}

// NOTE: A new GoogleGenAI instance must be created for each call to Veo.
// Do not reuse a single instance across multiple calls.
const getVeoClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });


export async function startVideoGenerationFromImage(prompt: string, base64ImageData: string, mimeType: string) {
  try {
    const veo = getVeoClient();
    let operation = await veo.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      image: {
        imageBytes: base64ImageData,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });
    return operation;
  } catch (error) {
    console.error("Error starting video generation:", error);
    if (error instanceof Error && error.message.includes('Requested entity was not found')) {
        throw new Error("Authentication error. Please ensure the API key is valid and configured correctly.");
    }
    throw new Error("Failed to start video generation.");
  }
}

export async function checkVideoGenerationStatus(operation: any) {
    const veo = getVeoClient();
    return await veo.operations.getVideosOperation({ operation });
}