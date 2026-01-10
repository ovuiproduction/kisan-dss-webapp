const speak = (text, language) => {

  if(language === "mr-IN") {
    language = "hi-IN";
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    return;
  }
  startSpeaking(cleanText(text), language);
};

const cleanText = (text) => {
  let cleaned = text;
  // Remove markdown formatting
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2'); // Italic
  cleaned = cleaned.replace(/~~(.*?)~~/g, '$1'); // Strikethrough
  cleaned = cleaned.replace(/`{1,3}[^`\n]+`{1,3}/g, ''); // Code blocks
  cleaned = cleaned.replace(/#{1,6}\s?/g, ''); // Headers
  cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, ''); // Images
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Links
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, ''); // Unordered lists
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, ''); // Ordered lists
  cleaned = cleaned.replace(/^\s*>\s+/gm, ''); // Blockquotes
  cleaned = cleaned.replace(/^\s*[-=]{3,}\s*$/gm, ''); // Horizontal rules
  cleaned = cleaned.replace(/\|/g, ' '); // Tables

  // Remove extra punctuation (keep basic ones for natural pauses)
  cleaned = cleaned.replace(/[*_~`#\[\](){}]/g, ''); // Markdown symbols
  cleaned = cleaned.replace(/[₹$€£¥]/g, 'rupees '); // Currency symbols
  cleaned = cleaned.replace(/[@&%]/g, ''); // Special chars
  
  // Clean up whitespace
  cleaned = cleaned.replace(/\s+/g, ' '); // Multiple spaces to single
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Multiple newlines
  cleaned = cleaned.trim();

  return cleaned;
};

const startSpeaking = (text, language) => {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = language;

  // Optional: Set speech rate and pitch
  speech.rate = 0.9; // Slightly slower for better clarity
  speech.pitch = 1.0;
  speech.volume = 1.0;

  // Get available voices and try to find the best match
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find((voice) =>
    voice.lang.startsWith(language.split("-")[0])
  );

  if (matchingVoice) {
    speech.voice = matchingVoice;
    console.log(`Using voice: ${matchingVoice.name} for language: ${language}`);
  }

  speech.onerror = function (event) {
    // Only log non-interrupted errors
    if (event.error !== "interrupted") {
      console.error("Speech synthesis error:", event.error);
    }
  };

  speech.onend = function (event) {
    console.log("Speech finished");
  };

  window.speechSynthesis.speak(speech);
};


// Export the function you want to use
export { speak };
