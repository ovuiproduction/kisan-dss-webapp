import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../css/chatbot.css";
import { sendMessage_api } from "./apis_db";
import { speak } from "./SpeakMessages.jsx";
import debounce from "lodash.debounce";
import botbackgroundimg from "../static/images/kisan-dss-logo.png";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  const [userInput, setUserInput] = useState("");
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const recognitionRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectionPosition, setSelectionPosition] = useState({
    start: 0,
    end: 0,
  });
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSuggestionSelect(suggestions[highlightedIndex]);
    }
  };

  useEffect(() => {
    setHighlightedIndex(0);
  }, [suggestions]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Transcript:", transcript);
      setUserInput(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language]);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in your browser.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const sendMessage = async () => {
    setLoading(true);
    if (!userInput.trim()) return;

    const newMessages = [...messages, { text: userInput, sender: "user" }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const botMessage = await sendMessage_api(userInput);
      setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { text: "Error retrieving response.", sender: "bot" },
      ]);
      setLoading(false);
    }
  };

  const getCurrentWord = () => {
    if (!inputRef.current) return { word: "", start: 0, end: 0 };

    const input = inputRef.current;
    const cursorPos = input.selectionStart;
    const text = input.value;

    if (cursorPos === 0 || /\s/.test(text[cursorPos - 1])) {
      return { word: "", start: cursorPos, end: cursorPos };
    }

    let start = cursorPos;
    while (start > 0 && !/\s/.test(text[start - 1])) start--;

    let end = cursorPos;
    while (end < text.length && !/\s/.test(text[end])) end++;

    return {
      word: text.substring(start, end),
      start,
      end,
    };
  };

  const fetchTransliteration = async (word, lang) => {
    console.log("fetchTransliteration called with word:", word);
    console.log("Current language:", lang);
    // 🔴 Disable for English
    if (lang === "en-IN") {
      setShowSuggestions(false);
      return;
    }

    const itcMap = {
      "mr-IN": "mr-t-i0-und",
      "hi-IN": "hi-t-i0-und",
    };

    const itc = itcMap[lang];

    if (!itc || !word.trim()) {
      setShowSuggestions(false);
      return;
    }

    try {
      console.log("Fetching transliteration for:", word, "with itc:", itc);
      const res = await axios.get("https://inputtools.google.com/request", {
        params: {
          text: word,
          itc,
          num: 5,
        },
      });

      if (res.data[0] === "SUCCESS") {
        setSuggestions(res.data[1][0][1]);
        console.log("Suggestions received:", res.data[1][0][1]);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error(err);
      setShowSuggestions(false);
    }
  };

  const debouncedFetch = useRef(
    debounce((word, lang) => fetchTransliteration(word, lang), 300)
  ).current;

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setUserInput(newText);

    // ❌ English → no transliteration
    if (language === "en-IN") {
      setShowSuggestions(false);
      return;
    }

    const { word, start, end } = getCurrentWord();
    const cursorPos = inputRef.current.selectionStart;

    if (word && cursorPos === end) {
      setSelectionPosition({ start, end });
      debouncedFetch(word, language);
      console.log("Fetching suggestions for:", word);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    const { start, end } = selectionPosition;

    const before = userInput.substring(0, start);
    const after = userInput.substring(end);

    const updated = `${before}${suggestion} ${after}`;
    setUserInput(updated);
    setShowSuggestions(false);

    setTimeout(() => {
      const pos = start + suggestion.length + 1;
      inputRef.current.setSelectionRange(pos, pos);
      inputRef.current.focus();
    }, 0);
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target) &&
      inputRef.current &&
      !inputRef.current.contains(event.target)
    ) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  return (
    <div className="chat-container">
      <h1>AgriBot</h1>
      <div className="chat-history">
      
        {messages.length === 0 && (<>
        <div className="welcome-banner">
          <img src={botbackgroundimg} alt="" />
          <h2>Kisan DSS (KD)</h2>
          <p>Your AI-powered agricultural assistant. Ask me anything about farming, crops, weather, and more!</p>
        </div>
        </>)}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user-message" : "bot-message"}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.text}
            </ReactMarkdown>

            {msg.sender === "bot" && (
              <button
                className="speak-btn"
                onClick={() => speak(msg.text, language)}
              >
                🔊
              </button>
            )}
          </div>
        ))}
          {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        )} 
      </div>

      <form className="chat-form">
        <input
          type="text"
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            language === "hi-IN"
              ? "कृषि बॉट से पूछें..."
              : language === "mr-IN"
              ? "अ‍ॅग्रीबॉटला विचारा..."
              : "Ask AgriBot..."
          }
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul ref={suggestionsRef}  className="suggestions-box">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className={i === highlightedIndex ? "active" : ""}
                onMouseEnter={() => setHighlightedIndex(i)}
                onClick={() => handleSuggestionSelect(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
        <select
          className="bot-language-selector"
          name="language"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="mr-IN">मराठी</option>
          <option value="hi-IN">हिंदी</option>
          <option value="en-IN">English</option>
        </select>
        <button type="button" onClick={() => sendMessage()}>Send</button>
        <button type="button" className="voice-btn" onClick={startListening}>
          🎤 {listening ? "Listening..." : "Voice"}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
