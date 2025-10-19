
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageFile, HugStyle } from '../types';
import { PROMPTS } from '../constants';

// Utility function to convert a data URL to the format Gemini API expects
const dataUrlToGenerativePart = (dataUrl: string, mimeType: string) => {
    return {
        inlineData: {
            data: dataUrl.split(',')[1],
            mimeType,
        },
    };
};

export const generateHugImage = async (
    person1: ImageFile,
    person2: ImageFile,
    style: HugStyle
): Promise<string> => {
    // API key is handled by the environment
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const model = 'gemini-2.5-flash-image';
    const prompt = PROMPTS[style];

    const imagePart1 = dataUrlToGenerativePart(person1.dataUrl, person1.mimeType);
    const imagePart2 = dataUrlToGenerativePart(person2.dataUrl, person2.mimeType);

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { text: prompt },
                    imagePart1,
                    imagePart2
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        // Find the image part in the response
        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        } else {
            throw new Error('No image was generated in the API response.');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error('The AI model failed to generate an image. This might be due to a safety policy violation or an internal error.');
    }
};
