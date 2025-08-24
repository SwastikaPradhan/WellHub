'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import ChatInterface from '@/components/ChatInterface';
import KnowledgeBase from '@/components/KnowledgeBase';
import QuickQuestions from '@/components/QuickQuestions';

export default function ChatWithAI() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;
    setChatHistory((prev) => [...prev, { role: 'user', content: userMessage }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Handle different response formats from backend
      const aiResponse = data.response || data.reply || data.message || 'No response received';

      setChatHistory((prev) => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (err: any) {
      console.error('Chat error:', err);
      let errorMessage = 'Failed to get AI response.';
      
      // Handle specific error cases
      if (err.message?.includes('404')) {
        errorMessage = 'No relevant documents found. Please upload some documents first or ask a general question.';
      } else if (err.message?.includes('500')) {
        errorMessage = 'Server error occurred. Please try again.';
      }
      
      setChatHistory((prev) => [
        ...prev,
        { role: 'ai', content: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    // Add file to uploaded files list immediately for UI feedback
    const fileName = selectedFile.name;
    setUploadedFiles((prev) => [...prev, fileName]);
    
    // Show uploading message
    setChatHistory((prev) => [
      ...prev,
      { role: 'ai', content: `Uploading "${fileName}"...` },
    ]);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/upload`, {
        method: 'POST',
        
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const data = await res.json();
      
      // Update chat with success message
      setChatHistory((prev) => [
        ...prev.slice(0, -1), // Remove the "uploading..." message
        { 
          role: 'ai', 
          content: `Successfully uploaded "${fileName}" to your knowledge base! Processed ${data.documentsProcessed || 0} document chunks.` 
        },
      ]);
    } catch (err: any) {
      console.error('Upload error:', err);
      
      // Remove file from uploaded files list on error
      setUploadedFiles((prev) => prev.filter(f => f !== fileName));
      
      // Update chat with error message
      setChatHistory((prev) => [
        ...prev.slice(0, -1), // Remove the "uploading..." message
        { role: 'ai', content: `Upload failed for "${fileName}": ${err.message}` },
      ]);
    }
  };

  return (
    <AuthGuard>
      <div className="h-screen flex flex-row bg-yellow-50 text-[#1A1A1A] overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 flex gap-6">
          <ChatInterface
            message={message}
            chatHistory={chatHistory}
            loading={loading}
            onMessageChange={setMessage}
            onSend={handleSend}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="w-[300px] h-full flex flex-col gap-4 text-sm border-l bg-[#f8fafc] shadow-inner px-3 py-4 rounded-l-xl">
            <KnowledgeBase uploadedFiles={uploadedFiles} onFileUpload={handleFileUpload} />
            <div className="border-t border-gray-300 my-1" />
            <QuickQuestions onSelectQuestion={(q) => setMessage(q)} />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
