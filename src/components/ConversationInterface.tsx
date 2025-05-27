
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, RotateCcw, FileText, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OpenAI from 'openai';

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

const languageCodes: Record<string, string> = {
  nl: 'Dutch',
  en: 'English',
  ar: 'Arabic',
  so: 'Somali',
  ti: 'Tigrinya',
  fa: 'Persian',
  ur: 'Urdu',
  tr: 'Turkish',
  ku: 'Kurdish',
  ps: 'Pashto',
  fr: 'French',
  es: 'Spanish',
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
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [currentTranslation, setCurrentTranslation] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { toast } = useToast();
  const recordingTimeoutRef = useRef<NodeJS.Timeout>();

  const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
    if (!openaiApiKey) {
      setShowApiKeyInput(true);
      return "OpenAI API key is required for translation";
    }

    try {
      const openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text from ${languageCodes[fromLang]} to ${languageCodes[toLang]}. Only provide the translation, no additional text.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      return response.choices[0]?.message?.content || "Translation failed";
    } catch (error) {
      console.error('Translation error:', error);
      return "Translation error occurred";
    }
  };

  const startRecording = (speaker: 'person1' | 'person2') => {
    if (isRecording || isProcessing) return;

    setCurrentSpeaker(speaker);
    setIsRecording(true);
    setCurrentTranscription('');
    setCurrentTranslation('');
    
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

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock transcription
    const mockTranscriptions = {
      person1: [
        "Hallo, hoe gaat het met je?",
        "We gaan vandaag praten over werk mogelijkheden.",
        "Heb je al nagedacht over welke sector je interesseert?"
      ],
      person2: [
        "Hello, I am fine, thank you.",
        "Yes, I am very interested in healthcare work.",
        "I have experience with elderly care."
      ]
    };

    const randomTranscription = mockTranscriptions[currentSpeaker][Math.floor(Math.random() * mockTranscriptions[currentSpeaker].length)];
    setCurrentTranscription(randomTranscription);

    // Translate using AI
    const fromLang = currentSpeaker === 'person1' ? person1Lang : person2Lang;
    const toLang = currentSpeaker === 'person1' ? person2Lang : person1Lang;
    
    const translation = await translateText(randomTranscription, fromLang, toLang);
    setCurrentTranslation(translation);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      speaker: currentSpeaker,
      originalText: randomTranscription,
      translatedText: translation,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    toast({
      title: 'Vertaling voltooid',
      description: 'Tekst is vertaald en weergegeven',
      duration: 2000,
    });

    setIsProcessing(false);
    setCurrentSpeaker(null);
  };

  const generateSummary = async () => {
    if (messages.length === 0) {
      toast({
        title: 'Geen berichten',
        description: 'Er zijn nog geen gesprekken om samen te vatten.',
        duration: 3000,
      });
      return;
    }

    if (!openaiApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    try {
      const openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true
      });

      const conversationText = messages.map(msg => 
        `${msg.speaker === 'person1' ? 'Coach' : 'Statushouder'}: ${msg.originalText} (${msg.translatedText})`
      ).join('\n');

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional meeting summarizer. Create a concise summary of this conversation between a coach and a refugee (statushouder) in both Dutch and English. Focus on key points, agreements, and action items. Keep it brief and professional.`
          },
          {
            role: "user",
            content: conversationText
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      });

      // For demo purposes, we'll use a mock summary
      setShowSummary(true);
    } catch (error) {
      console.error('Summary generation error:', error);
      toast({
        title: 'Fout bij samenvatting',
        description: 'Er is een fout opgetreden bij het genereren van de samenvatting.',
        duration: 3000,
      });
    }
  };

  const ApiKeyInput = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">OpenAI API Key</h3>
        <p className="text-sm text-gray-600 mb-4">
          Voor AI-vertaling is een OpenAI API key nodig. Deze wordt alleen lokaal opgeslagen.
        </p>
        <input
          type="password"
          placeholder="sk-..."
          value={openaiApiKey}
          onChange={(e) => setOpenaiApiKey(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl mb-4"
        />
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              localStorage.setItem('openai-api-key', openaiApiKey);
              setShowApiKeyInput(false);
            }}
            disabled={!openaiApiKey}
            className="flex-1"
          >
            Opslaan
          </Button>
          <Button
            onClick={() => setShowApiKeyInput(false)}
            variant="ghost"
            className="flex-1"
          >
            Annuleren
          </Button>
        </div>
      </div>
    </div>
  );

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

  // Load saved API key on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai-api-key');
    if (savedKey) {
      setOpenaiApiKey(savedKey);
    }
  }, []);

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
            <p>Laat los om te vertalen</p>
          </div>
        </div>
      </div>

      {/* Current Transcription and Translation */}
      {(currentTranscription || currentTranslation) && (
        <div className="bg-white border-t p-4">
          <div className="max-w-md mx-auto space-y-3">
            {currentTranscription && (
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Opgenomen:</p>
                <p className="text-sm text-gray-800">{currentTranscription}</p>
              </div>
            )}
            {currentTranslation && (
              <div className="bg-ocean-50 p-3 rounded-xl">
                <p className="text-xs text-ocean-600 mb-1">Vertaling:</p>
                <p className="text-sm text-gray-800">{currentTranslation}</p>
              </div>
            )}
          </div>
        </div>
      )}

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
      {showApiKeyInput && <ApiKeyInput />}
    </div>
  );
}
