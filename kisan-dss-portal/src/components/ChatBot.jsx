import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../css/chatbot.css";
import { sendMessage_api } from "./apis_db";
import {speak} from "./SpeakMessages.jsx";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-IN");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = language;
    recognition.interimResults = false;
  }

  const startListening = () => {
    if (!recognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }
    setListening(true);
    recognition.start();
  };

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
      };
      recognition.onend = () => setListening(false);
    }
  }, []);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [...messages, { text: userInput, sender: "user" }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const botMessage = await sendMessage_api(userInput);
      setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { text: "Error retrieving response.", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <h1>AgriBot</h1>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user-message" : "bot-message"}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} >
              {msg.text}
            </ReactMarkdown>

            {msg.sender === "bot" && (
              <button className="speak-btn" onClick={() => speak(msg.text,language)}>
                🔊
              </button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask AgriBot..."
        />
        <select className="bot-language-selector" name="language" value={language} onChange={handleLanguageChange}>
          <option value="hi-IN">मराठी</option>
          <option value="hi-IN">हिंदी</option>
          <option value="en-IN">English</option>
        </select>
        <button type="submit">Send</button>
        <button type="button" className="voice-btn" onClick={startListening}>
          🎤 {listening ? "Listening..." : "Voice"}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
