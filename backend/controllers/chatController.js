// import Chat from "../models/Chat.js";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// export const chatWithBot = async (req, res) => {
//     try {
//         const { message } = req.body;
//         const userId = req.user.id;

//         if (!message) {
//             return res.status(400).json({ message: "Message is required" });
//         }

//         if (!process.env.GEMINI_API_KEY) {
//             return res.status(500).json({ message: "Missing Gemini API key" });
//         }

//         // Call Gemini API
//         const geminiResponse = await axios.post(
//             `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//             { contents: [{ parts: [{ text: message }] }] },
//             { headers: { "Content-Type": "application/json" } }
//         );

//         const responseText =
//             geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";

//         // Save chat to database
//         const chat = new Chat({ userId, message, response: responseText });
//         await chat.save();

//         res.json({ response: responseText });
//     } catch (error) {
//         console.error("Error in chatWithBot:", error.message);
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };


//1

// import Chat from "../models/Chat.js"; 
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// export const chatWithBot = async (req, res) => {
//     try {
//         const { message, language } = req.body;
//         const userId = req.user.id;

//         if (!message) {
//             return res.status(400).json({ message: "Message is required" });
//         }

//         if (!process.env.GEMINI_API_KEY) {
//             console.error("❌ GEMINI_API_KEY is missing");
//             return res.status(500).json({ message: "Server error: Missing API key" });
//         }

//         // 🌎 Translate input to English before sending to AI
//         const translatedMessage = await translateText(message, language, "en");

//         const geminiResponse = await axios.post(
//             `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//             { contents: [{ parts: [{ text: translatedMessage }] }] },
//             { headers: { "Content-Type": "application/json" } }
//         );

//         const responseText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";

//         // 🌎 Translate AI response back to user-selected language
//         const finalResponse = await translateText(responseText, "en", language);

//         const chat = new Chat({ userId, message, response: finalResponse });
//         await chat.save();

//         res.json({ response: finalResponse });

//     } catch (error) {
//         console.error("❌ Error in chatWithBot:", error.message);
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

// // 🏆 Function to Translate Text
// const translateText = async (text, fromLang, toLang) => {
//     const translationResponse = await axios.post(
//         `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
//         { q: text, source: fromLang, target: toLang, format: "text" }
//     );

//     return translationResponse.data.data.translations[0].translatedText;
// };


//
import Chat from "../models/Chat.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const chatWithBot = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Call Gemini API for AI response
        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents: [{ parts: [{ text: message }] }] },
            { headers: { "Content-Type": "application/json" } }
        );

        const responseText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";

        // Save chat to database
        const chat = new Chat({ userId, message, response: responseText });
        await chat.save();

        res.json({ response: responseText });
    } catch (error) {
        console.error("❌ Error in chatWithBot:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
