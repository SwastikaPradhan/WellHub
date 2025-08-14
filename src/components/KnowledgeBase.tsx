// components/KnowledgeBase.tsx
'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { FiFileText } from 'react-icons/fi';

interface KnowledgeBaseProps {
  uploadedFiles: string[];
  onFileUpload: (file: File) => void;
}

export default function KnowledgeBase({ uploadedFiles, onFileUpload }: KnowledgeBaseProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileUpload(selectedFile);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[48%]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-base text-gray-800">Knowledge Base</h3>
        <label className="cursor-pointer text-blue-600 flex items-center gap-1 hover:text-blue-700">
          <FaPlus className="text-base" />
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      <div className="overflow-y-auto pr-1 custom-scrollbar">
        <ul className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <li
              key={index}
              className="p-2 bg-white rounded-md shadow-sm flex items-center gap-2 text-gray-800 text-sm hover:bg-gray-50 transition cursor-pointer"
            >
              <FiFileText className="text-gray-600 flex-shrink-0" />
              <span className="truncate">{file}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
