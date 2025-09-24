import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/chatbot.css";

import { sendMessage_api } from "./apis_db";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [listening, setListening] = useState(false);

  // Speech recognition setup
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
  }

  // Handle voice input
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

      recognition.onend = () => {
        setListening(false);
      };
    }
  }, []);

  // Text-to-Speech function

  const speak = (text) => {
    if (window.speechSynthesis.speaking) {
      // Stop speech if already speaking
      window.speechSynthesis.cancel();
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // Handle text message submission

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
            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
            {msg.sender === "bot" && (
              <button className="speak-btn" onClick={() => speak(msg.text)}>
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
        <button type="submit">Send</button>
        <button type="button" className="voice-btn" onClick={startListening}>
          🎤 {listening ? "Listening..." : "Voice"}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
