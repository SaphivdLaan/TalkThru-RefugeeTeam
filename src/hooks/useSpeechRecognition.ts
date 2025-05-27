
import { useState, useCallback } from 'react';

interface SpeechRecognitionResult {
  text: string;
  confidence: number;
}

interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  startListening: (language: string) => Promise<void>;
  stopListening: () => void;
  result: SpeechRecognitionResult | null;
  error: string | null;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SpeechRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if speech recognition is supported
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const startListening = useCallback(async (language: string) => {
    if (!isSupported) {
      setError('Spraakherkenning wordt niet ondersteund in deze browser');
      return;
    }

    try {
      setIsListening(true);
      setError(null);
      setResult(null);

      // For this demo, we'll simulate speech recognition
      // In a real implementation, you would use the Web Speech API or a service like Google Speech-to-Text
      setTimeout(() => {
        const mockResults = [
          { text: "Hallo, hoe gaat het?", confidence: 0.95 },
          { text: "Ik ben geïnteresseerd in werk", confidence: 0.88 },
          { text: "Wanneer is de volgende afspraak?", confidence: 0.92 },
          { text: "Dank je wel voor je hulp", confidence: 0.96 }
        ];
        
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        setResult(randomResult);
        setIsListening(false);
      }, 2000);

    } catch (err) {
      setError('Er is een fout opgetreden bij spraakherkenning');
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isSupported,
    isListening,
    startListening,
    stopListening,
    result,
    error
  };
};
