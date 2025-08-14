// components/ChatInterface.tsx
'use client';

import { useEffect, useRef } from 'react';
import { IoSend } from 'react-icons/io5';
import { Button } from './ui/button';

interface ChatInterfaceProps {
  message: string;
  chatHistory: { role: 'user' | 'ai'; content: string }[];
  loading: boolean;
  onMessageChange: (val: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function ChatInterface({
  message,
  chatHistory,
  loading,
  onMessageChange,
  onSend,
  onKeyPress,
}: ChatInterfaceProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="flex-1 flex flex-col rounded-xl h-full bg-yellow-50 max-w-4xl mx-auto">
      <h2 className="text-gray-600 text-3xl font-mono mb-4">Chat With AI</h2>

      <div className="flex-1 p-4 rounded-xl overflow-y-auto border border-gray-200 min-h-[400px] bg-white">
        {chatHistory.length === 0 ? (
          <div className="text-gray-500 text-center mt-8">
            Start chatting with your AI assistant...
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    chat.role === 'user'
                      ? 'bg-teal-100 text-gray-800 ml-auto'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{chat.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse">AI is typing...</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="flex items-end gap-3 mt-4">
        <input
          type="text"
          placeholder="Ask about wellness, nutrition, mental health..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={loading}
          className="flex-1 border rounded-md px-4 py-2 bg-white shadow focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:opacity-50"
        />
        <Button
          onClick={onSend}
          disabled={loading || !message.trim()}
          className="bg-teal-200 hover:bg-teal-300 text-black flex gap-2 disabled:opacity-50"
        >
          <IoSend /> Send
        </Button>
      </div>
    </div>
  );
}
