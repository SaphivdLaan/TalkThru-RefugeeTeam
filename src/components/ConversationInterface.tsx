
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, RotateCcw, FileText, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConversationInterfaceProps {
  person1Lang: string;
  person2Lang: string;
  onBack: () => void;
}

interface Message {
  id: string;
  speaker: 'person1' | 'person2';
  originalText: string;
  translatedText: string;
  timestamp: Date;
}

const languageNames: Record<string, string> = {
  nl: 'Nederlands',
  en: 'English',
  ar: 'العربية',
  so: 'Soomaali',
  ti: 'ትግርኛ',
  fa: 'فارسی',
  ur: 'اردو',
  tr: 'Türkçe',
  ku: 'کوردی',
  ps: 'پښتو',
  fr: 'Français',
  es: 'Español',
};

export default function ConversationInterface({ 
  person1Lang, 
  person2Lang, 
  onBack 
}: ConversationInterfaceProps) {
  const [currentSpeaker, setCurrentSpeaker] = useState<'person1' | 'person2' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const { toast } = useToast();
  const recordingTimeoutRef = useRef<NodeJS.Timeout>();

  const startRecording = (speaker: 'person1' | 'person2') => {
    if (isRecording || isProcessing) return;

    setCurrentSpeaker(speaker);
    setIsRecording(true);
    
    // Simulate speech recognition
    recordingTimeoutRef.current = setTimeout(() => {
      stopRecording();
    }, 3000); // Auto-stop after 3 seconds for demo

    toast({
      title: `${speaker === 'person1' ? 'Coach' : 'Statushouder'} spreekt`,
      description: 'Luistert naar spraak...',
      duration: 2000,
    });
  };

  const stopRecording = async () => {
    if (!isRecording || !currentSpeaker) return;

    setIsRecording(false);
    setIsProcessing(true);

    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }

    // Simulate processing and translation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock translation
    const mockMessages = {
      person1: [
        { original: "Hallo, hoe gaat het met je?", translated: "Hello, how are you?" },
        { original: "We gaan vandaag praten over werk mogelijkheden.", translated: "Today we're going to talk about job opportunities." },
        { original: "Heb je al nagedacht over welke sector je interesseert?", translated: "Have you thought about which sector interests you?" }
      ],
      person2: [
        { original: "Hello, I am fine, thank you.", translated: "Hallo, het gaat goed, dank je." },
        { original: "Yes, I am very interested in healthcare work.", translated: "Ja, ik ben erg geïnteresseerd in zorgwerk." },
        { original: "I have experience with elderly care.", translated: "Ik heb ervaring met ouderenzorg." }
      ]
    };

    const randomMessage = mockMessages[currentSpeaker][Math.floor(Math.random() * mockMessages[currentSpeaker].length)];
    
    const newMessage: Message = {
      id: Date.now().toString(),
      speaker: currentSpeaker,
      originalText: randomMessage.original,
      translatedText: randomMessage.translated,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate text-to-speech
    toast({
      title: 'Vertaling voltooid',
      description: 'Vertaling wordt uitgesproken...',
      duration: 2000,
    });

    setIsProcessing(false);
    setCurrentSpeaker(null);
  };

  const generateSummary = () => {
    setShowSummary(true);
  };

  const Summary = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Gespreksamenvatting</h3>
          <Button
            onClick={() => setShowSummary(false)}
            variant="ghost"
            size="sm"
            className="text-gray-500"
          >
            Sluiten
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-sage-50 p-4 rounded-xl">
            <h4 className="font-semibold text-sage-700 mb-2">Nederlands</h4>
            <p className="text-sm text-gray-700">
              Tijdens dit gesprek zijn werk mogelijkheden besproken. De statushouder heeft interesse getoond in de zorgverlening, specifiek ouderenzorg. Er is afgesproken om verdere informatie te verzamelen over certificering en trainingsmogelijkheden.
            </p>
          </div>
          
          <div className="bg-ocean-50 p-4 rounded-xl">
            <h4 className="font-semibold text-ocean-700 mb-2">English</h4>
            <p className="text-sm text-gray-700">
              During this conversation, job opportunities were discussed. The refugee has shown interest in healthcare, specifically elderly care. It was agreed to gather more information about certification and training opportunities.
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-700 mb-2">Afspraken</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Informatie verzamelen over zorg certificaten</li>
              <li>• Contact opnemen met ROC voor cursussen</li>
              <li>• Volgende afspraak: volgende week</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-ocean-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">TalkThru</h1>
              <p className="text-xs text-gray-500">
                {languageNames[person1Lang]} ↔ {languageNames[person2Lang]}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={generateSummary}
              variant="ghost"
              size="sm"
              className="text-gray-600"
              disabled={messages.length === 0}
            >
              <FileText className="w-4 h-4" />
            </Button>
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-gray-600"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="max-w-md mx-auto w-full space-y-8">
          
          {/* Status Display */}
          <div className="text-center mb-8">
            {isProcessing ? (
              <div className="space-y-2">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto animate-pulse-soft">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <p className="text-lg font-medium text-gray-700">Aan het vertalen...</p>
              </div>
            ) : isRecording ? (
              <div className="space-y-2">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse-soft">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <p className="text-lg font-medium text-gray-700">
                  {currentSpeaker === 'person1' ? 'Coach spreekt...' : 'Statushouder spreekt...'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                  <MicOff className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-lg font-medium text-gray-700">Druk om te spreken</p>
              </div>
            )}
          </div>

          {/* Speech Buttons */}
          <div className="space-y-6">
            {/* Person 1 Button */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Coach / Vrijwilliger</p>
              <button
                onMouseDown={() => startRecording('person1')}
                onMouseUp={stopRecording}
                onTouchStart={() => startRecording('person1')}
                onTouchEnd={stopRecording}
                disabled={isRecording && currentSpeaker !== 'person1' || isProcessing}
                className={`w-32 h-32 speech-button ${
                  isRecording && currentSpeaker === 'person1' ? 'active' : ''
                } ${isRecording && currentSpeaker !== 'person1' || isProcessing ? 'disabled' : ''}`}
              >
                <Mic className="w-8 h-8 mx-auto" />
                <div className="text-xs mt-2 font-medium">{languageNames[person1Lang]}</div>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center">
              <div className="h-px bg-gray-300 flex-1"></div>
              <div className="px-4 text-gray-500 text-sm">of</div>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            {/* Person 2 Button */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Statushouder</p>
              <button
                onMouseDown={() => startRecording('person2')}
                onMouseUp={stopRecording}
                onTouchStart={() => startRecording('person2')}
                onTouchEnd={stopRecording}
                disabled={isRecording && currentSpeaker !== 'person2' || isProcessing}
                className={`w-32 h-32 speech-button ${
                  isRecording && currentSpeaker === 'person2' ? 'active' : ''
                } ${isRecording && currentSpeaker !== 'person2' || isProcessing ? 'disabled' : ''}`}
              >
                <Mic className="w-8 h-8 mx-auto" />
                <div className="text-xs mt-2 font-medium">{languageNames[person2Lang]}</div>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>Houd de knop ingedrukt om te spreken</p>
            <p>Laat los om te vertalen en uit te spreken</p>
          </div>
        </div>
      </div>

      {/* Message History Count */}
      {messages.length > 0 && (
        <div className="bg-white border-t p-4">
          <div className="max-w-md mx-auto text-center">
            <p className="text-sm text-gray-600">
              {messages.length} bericht{messages.length !== 1 ? 'en' : ''} uitgewisseld
            </p>
          </div>
        </div>
      )}

      {showSummary && <Summary />}
    </div>
  );
}
