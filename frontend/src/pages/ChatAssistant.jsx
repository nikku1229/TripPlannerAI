import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icons from "../utils/icons/index";
import { copyMessage, clearChat } from "../utils/usage";
import { sendMessage, toggleVoiceInput } from "../hooks/chatAssistantHook";
import labels from "../labels/common";
import toast from "react-hot-toast";

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: labels.messageInputContent,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const formatMessageContent = (content) => {
    const paragraphs = content.split(/\n\n/);

    return paragraphs.map((paragraph, idx) => {
      if (paragraph.includes("•") || paragraph.includes("- ")) {
        const lines = paragraph.split(/\n/);
        const bulletItems = lines.filter(
          (line) => line.includes("•") || line.includes("-"),
        );
        const beforeText = lines.find(
          (line) => !line.includes("•") && !line.includes("-"),
        );

        return (
          <div key={idx} className="message-paragraph">
            {beforeText &&
              !beforeText.includes("•") &&
              !beforeText.includes("-") && <p>{beforeText}</p>}
            <ul className="message-list">
              {bulletItems.map((item, i) => (
                <li key={i}>{item.replace(/^[•-]\s*/, "")}</li>
              ))}
            </ul>
          </div>
        );
      }

      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(paragraph)) {
        const parts = paragraph.split(boldRegex);
        return (
          <p key={idx}>
            {parts.map((part, i) => {
              if (i % 2 === 1) {
                return <strong key={i}>{part}</strong>;
              }
              return part;
            })}
          </p>
        );
      }

      return <p key={idx}>{paragraph}</p>;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input, setMessages, setInput, setLoading);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-grid">
        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <Icons.FaRobot size={20} />
              </div>
              <div>
                <h2>{labels.assistantTitleHead}</h2>
                <p>{labels.assistantTextHead}</p>
              </div>
            </div>
            <button
              onClick={() => {
                clearChat(setMessages);
              }}
              className="clear-chat-btn"
              title="Clear chat"
            >
              <Icons.FiTrash2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`message-wrapper ${message.type === "user" ? "user" : "bot"}`}
                >
                  <div
                    className={`message-bubble ${message.type === "user" ? "user" : "bot"}`}
                  >
                    <div className="message-avatar">
                      {message.type === "user" ? (
                        <Icons.FiUser size={14} />
                      ) : (
                        <Icons.FaRobot size={14} />
                      )}
                    </div>
                    <div className="message-content">
                      {message.type === "bot" ? (
                        <div className="bot-message-text">
                          {formatMessageContent(message.content)}
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}
                      <div className="message-footer">
                        <span className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                        {message.type === "bot" && (
                          <div className="message-actions">
                            <button
                              className="message-action-btn"
                              onClick={() => copyMessage(message.content)}
                              title="Copy"
                            >
                              <Icons.FiCopy size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="message-wrapper bot"
              >
                <div className="message-bubble bot">
                  <div className="message-avatar">
                    <Icons.FaRobot size={14} />
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <div className="input-wrapper">
              <button
                onClick={() => {
                  toggleVoiceInput(setIsListening, setInput);
                }}
                className={`voice-btn ${isListening ? "listening" : ""}`}
                title={isListening ? "Listening..." : "Voice input"}
              >
                {isListening ? (
                  <Icons.FiMicOff size={18} />
                ) : (
                  <Icons.FiMic size={18} />
                )}
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={labels.inputPlaceholderText}
                className="chat-input"
                rows="1"
              />
              <button
                onClick={() => {
                  sendMessage(input, setMessages, setInput, setLoading);
                }}
                disabled={!input.trim() || loading}
                className="send-btn"
                title="Send message"
              >
                <Icons.FiSend size={18} />
              </button>
            </div>
            <div className="input-hint">{labels.inputHint}</div>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="chat-sidebar">
          <div className="suggestions-card">
            <h3>
              <Icons.FiHelpCircle size={18} /> {labels.suggestedQuestionsTitle}
            </h3>
            <div className="suggestions-list">
              {labels.suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="suggestion-btn"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="tips-card">
            <h3>{labels.quickTipsTitle}</h3>
            <ul className="tips-list">
              {labels?.quickTips &&
                labels.quickTips.map((tips, i) => <li key={i}>{tips}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
