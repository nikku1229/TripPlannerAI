import { aiAPI } from "../services/servicesApi";
import toast from "react-hot-toast";

export const sendMessage = async (input, setMessages, setInput, setLoading) => {
  if (!input.trim()) return;

  const userMessage = {
    id: Date.now(),
    type: "user",
    content: input,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
    const response = await aiAPI.chat(input, "Travel planning");
    const botMessage = {
      id: Date.now() + 1,
      type: "bot",
      content: response.data.reply,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    toast.error("Failed to get response");
    const errorMessage = {
      id: Date.now() + 1,
      type: "bot",
      content: "Sorry, I'm having trouble connecting. Please try again later.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setLoading(false);
  }
};

export const toggleVoiceInput = (setIsListening, setInput) => {
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition failed");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  } else {
    toast.error("Voice recognition not supported in your browser");
  }
};
