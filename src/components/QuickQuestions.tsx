// components/QuickQuestions.tsx
'use client';

interface QuickQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

export default function QuickQuestions({ onSelectQuestion }: QuickQuestionsProps) {
  const questions = [
    'What should I eat for better mood?',
    'Help me with stress management',
    'Suggest yoga poses for beginners',
    'How can I improve my sleep?',
    'What was my mood pattern last week?',
  ];

  return (
    <div className="flex flex-col h-[48%]">
      <h3 className="font-bold text-base text-gray-800 mb-2">Quick Questions</h3>
      <div className="overflow-y-auto pr-1 custom-scrollbar">
        <ul className="space-y-2">
          {questions.map((question, idx) => (
            <li
              key={idx}
              onClick={() => onSelectQuestion(question)}
              className="p-2 bg-white rounded-md shadow-sm text-gray-800 hover:bg-gray-50 cursor-pointer transition text-sm"
            >
              {question}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
