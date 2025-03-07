// import React, { useState } from "react";

// const ChatInput = ({ sendMessage }) => {
//     const [input, setInput] = useState("");
//     const [isListening, setIsListening] = useState(false);
//     const recognition = new window.webkitSpeechRecognition(); 

//     recognition.lang = "en-IN"; 
//     recognition.interimResults = false;

//     recognition.onresult = (event) => {
//         setInput(event.results[0][0].transcript);
//     };

//     const handleSpeechToText = () => {
//         setIsListening(true);
//         recognition.start();
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!input.trim()) return;
//         sendMessage(input);
//         setInput("");
//     };

//     return (
//         <div>
//             <input 
//                 type="text" 
//                 value={input} 
//                 onChange={(e) => setInput(e.target.value)} 
//                 placeholder="Type or use mic 🎤" 
//             />
//             <button onClick={handleSubmit}>Send</button>
//             <button onClick={handleSpeechToText}>🎤</button>
//         </div>
//     );
// };

// export default ChatInput;


//1
// import React, { useState } from "react";

// const ChatInput = ({ sendMessage }) => {
//   const [message, setMessage] = useState("");
//   const [language, setLanguage] = useState("en"); // Default to English

//   // 🔊 Convert Speech to Text (STT)
//   const startListening = () => {
//     const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
//     recognition.lang = language; // Set selected language
//     recognition.onresult = (event) => {
//       setMessage(event.results[0][0].transcript);
//     };
//     recognition.start();
//   };

//   // 📨 Handle Send Message
//   const handleSend = () => {
//     if (message.trim() !== "") {
//       sendMessage(message, language); // Pass language to API
//       setMessage("");
//     }
//   };

//   return (
//     <div className="chat-input">
//       <select value={language} onChange={(e) => setLanguage(e.target.value)}>
//         <option value="en">English</option>
//         <option value="hi">हिन्दी</option>
//         <option value="gu">ગુજરાતી</option>
//       </select>

//       <input 
//         type="text" 
//         value={message} 
//         onChange={(e) => setMessage(e.target.value)} 
//         placeholder="Type or use voice..." 
//       />

//       <button onClick={startListening}>🎙 Speak</button>
//       <button onClick={handleSend}>Send</button>
//     </div>
//   );
// };

// export default ChatInput;


//
//Final
// import React, { useState } from "react";

// const ChatInput = ({ sendMessage, language }) => {
//   const [message, setMessage] = useState("");

//   const handleSend = () => {
//     if (message.trim() !== "") {
//       sendMessage(message);
//       setMessage("");
//     }
//   };

//   const handleVoiceInput = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
//     if (!SpeechRecognition) {
//       alert("Speech recognition is not supported in this browser. Try using Chrome or Edge.");
//       return;
//     }
  
//     const recognition = new SpeechRecognition();
//     recognition.lang = language === "hi" ? "hi-IN" : language === "gu" ? "gu-IN" : "en-US";
//     recognition.start();
  
//     recognition.onresult = (event) => {
//       setMessage(event.results[0][0].transcript);
//     };
  
//     recognition.onerror = (event) => {
//       console.error("Speech Recognition Error:", event.error);
//     };
//   };
  

//   return (
//     <div>
//       <input 
//         type="text" 
//         value={message} 
//         onChange={(e) => setMessage(e.target.value)} 
//         placeholder="Type or use voice input..."
//       />
//       <button onClick={handleSend}>Send</button>
//       <button onClick={handleVoiceInput}>🎤 Speak</button>
//     </div>
//   );
// };

// export default ChatInput;

//claude
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import "../index.css";

const ChatInput = ({ sendMessage, language, loading }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
    
    // Clean up any active speech recognition on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleSend = (e) => {
    e?.preventDefault();
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try using Chrome or Edge.");
      return;
    }
    
    if (isRecording) {
      // Stop recording
      recognitionRef.current?.abort();
      setIsRecording(false);
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = language === "hi" ? "hi-IN" : language === "gu" ? "gu-IN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.start();
    setIsRecording(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      
      // If final result
      if (event.results[0].isFinal) {
        setTimeout(() => {
          setIsRecording(false);
        }, 500);
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const getLanguageLabel = () => {
    switch (language) {
      case 'hi': return 'Hindi';
      case 'gu': return 'Gujarati';
      default: return 'English';
    }
  };
  
  return (
    <div className="chat-input-container">
      <div className="current-language-indicator">
        <i className="fas fa-language"></i> {getLanguageLabel()}
      </div>
      <Form onSubmit={handleSend} className="chat-form">
        <InputGroup>
          <Form.Control
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Type in ${getLanguageLabel()} or use voice input...`}
            disabled={loading}
            className="chat-text-input"
          />
          <Button 
            variant={isRecording ? "danger" : "outline-secondary"}
            onClick={handleVoiceInput}
            disabled={loading}
            className="voice-button"
            title={isRecording ? "Stop recording" : "Start voice input"}
          >
            <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || message.trim() === ""}
            className="send-button"
          >
            <i className="fas fa-paper-plane"></i>
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default ChatInput;
