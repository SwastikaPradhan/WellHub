"use client";
import { useState, useRef } from "react";
import { IoMicOutline, IoMicOffOutline } from "react-icons/io5";
import clsx from "clsx";

interface MicButtonProps {
  onTranscript: (text: string) => void;
}

export default function MicButton({ onTranscript }: MicButtonProps) {
  const [isListening, setIsListening] = useState(false);
  //@ts-ignore
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      //@ts-ignore
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false; 
    recognition.maxAlternatives = 1;
    //@ts-ignore
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      // Auto-stop on silence
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  return (
    <button
      onClick={toggleMic}
      className={clsx(
        "absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300",
        isListening ? "bg-red-600 animate-pulse text-white" : "bg-black text-white"
      )}
      title={isListening ? "Stop Listening" : "Start Listening"}
    >
      {isListening ? <IoMicOffOutline size={24} /> : <IoMicOutline size={24} />}
    </button>
  );
}


