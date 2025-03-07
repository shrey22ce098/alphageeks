import genai from "google-generativeai";
import { detect } from "langdetect";
import { Translator } from "googletrans";

const translator = new Translator();
genai.configure({ api_key: process.env.GEMINI_API_KEY });

class ChatBot {
    constructor() {
        this.model = new genai.GenerativeModel("gemini-pro");
    }

    async getResponse(userMessage) {
        const detectedLang = detect(userMessage);
        const translatedText = detectedLang !== "en"
            ? translator.translate(userMessage, { src: detectedLang, dest: "en" }).text
            : userMessage;

        const response = await this.model.sendMessage(translatedText);
        return detectedLang !== "en"
            ? translator.translate(response.text, { src: "en", dest: detectedLang }).text
            : response.text;
    }
}

export default new ChatBot();
