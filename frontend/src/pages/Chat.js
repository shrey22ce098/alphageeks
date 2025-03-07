// import React, { useState } from "react";
// import axios from "../api";
// import ChatList from "../components/ChatList";
// import ChatInput from "../components/ChatInput";
// import { Container, Card } from "react-bootstrap";

// function Chat() {
//   const [messages, setMessages] = useState([]);

//   const sendMessage = async (message) => {
//     const { data } = await axios.post("/chat/send", { message }, {
//       headers: { Authorization: localStorage.getItem("token") }
//     });
//     setMessages([...messages, { text: message, type: "sent" }, { text: data.response, type: "received" }]);
//   };

//   return (
//     <Container className="d-flex flex-column vh-100">
//       <Card className="flex-grow-1">
//         <ChatList messages={messages} />
//       </Card>
//       <ChatInput sendMessage={sendMessage} />
//     </Container>
//   );
// }

// export default Chat;


//2

// import React, { useState } from "react";
// import axios from "../api";
// import ChatList from "../components/ChatList";
// import ChatInput from "../components/ChatInput";
// import { Container, Card } from "react-bootstrap";

// function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [language, setLanguage] = useState("en"); // Default language: English

//   const sendMessage = async (message) => {
//     const { data } = await axios.post("/chat/send", { message, language }, {
//       headers: { Authorization: localStorage.getItem("token") }
//     });
    
//     setMessages([...messages, { text: message, type: "sent" }, { text: data.response, type: "received" }]);
//   };

//   return (
//     <Container className="d-flex flex-column vh-100">
//       <select value={language} onChange={(e) => setLanguage(e.target.value)}>
//         <option value="en">English</option>
//         <option value="hi">Hindi</option>
//         <option value="gu">Gujarati</option>
//       </select>
//       <Card className="flex-grow-1">
//         <ChatList messages={messages} language={language} />
//       </Card>
//       <ChatInput sendMessage={sendMessage} language={language} />
//     </Container>
//   );
// }

// export default Chat;


//3 Final


// import React, { useState } from "react";
// import axios from "../api";
// import ChatList from "../components/ChatList";
// import ChatInput from "../components/ChatInput";
// import { Container, Card } from "react-bootstrap";

// function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [language, setLanguage] = useState("en"); // Default language: English

//   // Function to handle text-to-speech
//   const speakText = (text) => {
//     const speechSynthesis = window.speechSynthesis;
//     if (!speechSynthesis) {
//       console.error("Speech Synthesis is not supported in this browser.");
//       return;
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = language === "hi" ? "hi-IN" : language === "gu" ? "gu-IN" : "en-US";
//     speechSynthesis.speak(utterance);
//   };

//   // Function to send a message to the backend
//   const sendMessage = async (message) => {
//     try {
//       const { data } = await axios.post("/chat/send", { message, language }, {
//         headers: { Authorization: localStorage.getItem("token") }
//       });

//       const botResponse = data.response;

//       // Update chat messages
//       setMessages([...messages, { text: message, type: "sent" }, { text: botResponse, type: "received" }]);

//       // Speak out the bot's response
//       speakText(botResponse);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <Container className="d-flex flex-column vh-100">
//       <select value={language} onChange={(e) => setLanguage(e.target.value)}>
//         <option value="en">English</option>
//         <option value="hi">Hindi</option>
//         <option value="gu">Gujarati</option>
//       </select>
//       <Card className="flex-grow-1">
//         <ChatList messages={messages} language={language} />
//       </Card>
//       <ChatInput sendMessage={sendMessage} language={language} />
//     </Container>
//   );
// }

// export default Chat;



//claude

// import React, { useState, useRef, useEffect } from "react";
// import axios from "../api";
// import ChatList from "../components/ChatList";
// import ChatInput from "../components/ChatInput";
// import { Container, Card, Navbar, Form } from "react-bootstrap";
// import "../index.css";

// function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [language, setLanguage] = useState("en"); // Default language: English
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom of chat when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Function to handle text-to-speech
//   const speakText = (text) => {
//     const speechSynthesis = window.speechSynthesis;
//     if (!speechSynthesis) {
//       console.error("Speech Synthesis is not supported in this browser.");
//       return;
//     }
    
//     const cleanText = text.replace(/\*/g, "");
//     const utterance = new SpeechSynthesisUtterance(cleanText);
//     utterance.lang = language === "hi" ? "hi-IN" : language === "gu" ? "gu-IN" : "en-US";
//     speechSynthesis.speak(utterance);
//   };

//   // Function to send a message to the backend
//   const sendMessage = async (message) => {
//     try {
//       setLoading(true);
      
//       // Immediately update with user message
//       setMessages([...messages, { text: message, type: "sent" }]);
      
//       const { data } = await axios.post("/chat/send", { message, language }, {
//         headers: { Authorization: localStorage.getItem("token") }
//       });

//       const botResponse = data.response;

//       // Update with bot response
//       setMessages(prevMessages => [...prevMessages, { text: botResponse, type: "received" }]);

//       // Speak out the bot's response
//       speakText(botResponse);
//     } catch (error) {
//       console.error("Error sending message:", error);
//       // Add error message
//       setMessages(prevMessages => [...prevMessages, { 
//         text: "Sorry, I couldn't process your request. Please try again.", 
//         type: "error" 
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container fluid className="chat-container p-0 d-flex flex-column vh-100">
//       <Navbar bg="primary" variant="dark" className="chat-header">
//         <Navbar.Brand className="mx-auto">
//           <i className="fas fa-robot me-2"></i>
//           Multilingual Assistant
//         </Navbar.Brand>
//         <Form.Select 
//           className="language-selector"
//           value={language} 
//           onChange={(e) => setLanguage(e.target.value)}
//           aria-label="Language selector"
//         >
//           <option value="en">English</option>
//           <option value="hi">Hindi</option>
//           <option value="gu">Gujarati</option>
//         </Form.Select>
//       </Navbar>
      
//       <Card className="chat-body flex-grow-1 border-0 rounded-0">
//         <Card.Body className="p-0 d-flex flex-column">
//           {messages.length === 0 ? (
//             <div className="empty-chat">
//               <div className="welcome-graphic">
//                 <i className="fas fa-comments fa-4x text-primary"></i>
//               </div>
//               <h3>Start a Conversation</h3>
//               <p>Send a message to begin chatting with your multilingual assistant</p>
//             </div>
//           ) : (
//             <ChatList messages={messages} language={language} loading={loading} />
//           )}
//           <div ref={messagesEndRef} />
//         </Card.Body>
//       </Card>
      
//       <ChatInput sendMessage={sendMessage} language={language} loading={loading} />
//     </Container>
//   );
// }

// export default Chat;



//refresh
import React, { useState, useRef, useEffect } from "react";
import axios from "../api";
import ChatList from "../components/ChatList";
import ChatInput from "../components/ChatInput";
import { Container, Card, Navbar, Form } from "react-bootstrap";
import "../index.css";

function Chat() {
  // Retrieve messages from localStorage or initialize as an empty array
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [language, setLanguage] = useState("en"); // Default language: English
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to handle text-to-speech
  const speakText = (text) => {
    const speechSynthesis = window.speechSynthesis;
    if (!speechSynthesis) {
      console.error("Speech Synthesis is not supported in this browser.");
      return;
    }

    const cleanText = text.replace(/\*/g, ""); // Remove markdown formatting
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === "hi" ? "hi-IN" : language === "gu" ? "gu-IN" : "en-US";
    speechSynthesis.speak(utterance);
  };

  // Function to send a message to the backend
  const sendMessage = async (message) => {
    try {
      setLoading(true);

      // Immediately update with user message
      setMessages([...messages, { text: message, type: "sent" }]);

      const { data } = await axios.post(
        "/chat/send",
        { message, language },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      const botResponse = data.response;

      // Update with bot response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, type: "received" },
      ]);

      // Speak out the bot's response
      speakText(botResponse);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Sorry, I couldn't process your request. Please try again.",
          type: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear chat messages on logout
  const clearChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
  };

  return (
    <Container fluid className="chat-container p-0 d-flex flex-column vh-100">
      <Navbar bg="primary" variant="dark" className="chat-header">
        <Navbar.Brand className="mx-auto">
          <i className="fas fa-robot me-2"></i>
          Multilingual Assistant
        </Navbar.Brand>
        <Form.Select
          className="language-selector"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Language selector"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="gu">Gujarati</option>
        </Form.Select>
        <button onClick={clearChat} className="btn btn-danger ms-2">
          Logout
        </button>
      </Navbar>

      <Card className="chat-body flex-grow-1 border-0 rounded-0">
        <Card.Body className="p-0 d-flex flex-column">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="welcome-graphic">
                <i className="fas fa-comments fa-4x text-primary"></i>
              </div>
              <h3>Start a Conversation</h3>
              <p>Send a message to begin chatting with your multilingual assistant</p>
            </div>
          ) : (
            <ChatList messages={messages} language={language} loading={loading} />
          )}
          <div ref={messagesEndRef} />
        </Card.Body>
      </Card>

      <ChatInput sendMessage={sendMessage} language={language} loading={loading} />
    </Container>
  );
}

export default Chat;