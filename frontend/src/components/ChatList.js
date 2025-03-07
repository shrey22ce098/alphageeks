// import React from "react";

// const ChatList = ({ messages }) => {
//     const speakText = (text, lang = "en-IN") => {
//         const speech = new SpeechSynthesisUtterance(text);
//         speech.lang = lang;
//         window.speechSynthesis.speak(speech);
//     };

//     return (
//         <div>
//             {messages.map((msg, i) => (
//                 <p key={i} onClick={() => speakText(msg.text, "en-IN")}>
//                     {msg.text}
//                 </p>
//             ))}
//         </div>
//     );
// };

// export default ChatList;


//1
// import React, { useEffect } from "react";

// const ChatList = ({ messages, language }) => {

//   // 🔊 Convert Text to Speech (TTS)
//   const speak = (text, lang) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = lang; // Set language
//     window.speechSynthesis.speak(utterance);
//   };

//   useEffect(() => {
//     // Auto speak the last received message
//     if (messages.length > 0) {
//       const lastMessage = messages[messages.length - 1];
//       if (lastMessage.type === "received") {
//         speak(lastMessage.text, language);
//       }
//     }
//   }, [messages, language]);

//   return (
//     <div className="chat-list">
//       {messages.map((msg, index) => (
//         <div key={index} className={`message ${msg.type}`}>
//           {msg.text}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ChatList;


//Final

// import React from "react";

// const ChatList = ({ messages, language }) => {
//   const speakText = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
    
//     // Set the language for speech synthesis
//     if (language === "hi") utterance.lang = "hi-IN"; // Hindi
//     else if (language === "gu") utterance.lang = "gu-IN"; // Gujarati
//     else utterance.lang = "en-US"; // English

//     synth.speak(utterance);
//   };

//   return (
//     <div>
//       {messages.map((msg, i) => (
//         <p key={i} onClick={() => speakText(msg.text)}>
//           {msg.text}
//         </p>
//       ))}
//     </div>
//   );
// };

// export default ChatList;



//claude

// import React from "react";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import "../index.css";

// const ChatList = ({ messages, language, loading }) => {
//   const speakText = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
    
//     // Set the language for speech synthesis
//     if (language === "hi") utterance.lang = "hi-IN"; // Hindi
//     else if (language === "gu") utterance.lang = "gu-IN"; // Gujarati
//     else utterance.lang = "en-US"; // English

//     synth.speak(utterance);
//   };

//   const getLangLabel = () => {
//     if (language === "hi") return "Hindi";
//     if (language === "gu") return "Gujarati";
//     return "English";
//   };

//   return (
//     <div className="chat-messages">
//       {messages.map((msg, i) => (
//         <div key={i} className={`message-wrapper ${msg.type}`}>
//           <div 
//             className={`message-bubble ${msg.type} ${msg.type === 'error' ? 'error' : ''}`}
//             onClick={() => speakText(msg.text)}
//           >
//             {msg.type === "received" && (
//               <div className="avatar">
//                 <i className="fas fa-robot"></i>
//               </div>
//             )}
//             <OverlayTrigger
//               placement="top"
//               overlay={
//                 <Tooltip id={`tooltip-${i}`}>
//                   Click to hear in {getLangLabel()}
//                 </Tooltip>
//               }
//             >
//               <div className="message-content">
//                 <p>{msg.text}</p>
//                 <div className="message-footer">
//                   <small className="message-time">
//                     {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                   </small>
//                   {msg.type === "received" && (
//                     <small className="action-hint">
//                       <i className="fas fa-volume-up"></i>
//                     </small>
//                   )}
//                 </div>
//               </div>
//             </OverlayTrigger>
//           </div>
//         </div>
//       ))}
      
//       {loading && (
//         <div className="message-wrapper received">
//           <div className="message-bubble received typing">
//             <div className="avatar">
//               <i className="fas fa-robot"></i>
//             </div>
//             <div className="typing-indicator">
//               <span></span>
//               <span></span>
//               <span></span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatList;


//

import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "../index.css";

const ChatList = ({ messages, language, loading }) => {
  const speakText = (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the language for speech synthesis
    if (language === "hi") utterance.lang = "hi-IN"; // Hindi
    else if (language === "gu") utterance.lang = "gu-IN"; // Gujarati
    else utterance.lang = "en-US"; // English
    
    // Add event handlers for debugging
    utterance.onstart = () => console.log("Speech started");
    utterance.onend = () => console.log("Speech ended");
    utterance.onerror = (event) => console.error("Speech error:", event);
    
    // Increase volume to ensure audibility
    utterance.volume = 1.0; // Maximum volume
    
    // Speak the text
    synth.speak(utterance);
  };

  const getLangLabel = () => {
    if (language === "hi") return "Hindi";
    if (language === "gu") return "Gujarati";
    return "English";
  };

  // Handle explicit speak button click
  const handleSpeakClick = (text, e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    speakText(text);
  };

  return (
    <div className="chat-messages">
      {messages.map((msg, i) => (
        <div key={i} className={`message-wrapper ${msg.type}`}>
          <div 
            className={`message-bubble ${msg.type} ${msg.type === 'error' ? 'error' : ''}`}
          >
            {msg.type === "received" && (
              <div className="avatar">
                <i className="fas fa-robot"></i>
              </div>
            )}
            <div className="message-content">
              <p>{msg.text}</p>
              <div className="message-footer">
                <small className="message-time">
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </small>
                {msg.type === "received" && (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-speak-${i}`}>
                        Click to hear in {getLangLabel()}
                      </Tooltip>
                    }
                  >
                    <button 
                      className="speak-button"
                      onClick={(e) => handleSpeakClick(msg.text, e)}
                      aria-label={`Speak message in ${getLangLabel()}`}
                    >
                      <i className="fas fa-volume-up"></i>
                    </button>
                  </OverlayTrigger>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="message-wrapper received">
          <div className="message-bubble received typing">
            <div className="avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;