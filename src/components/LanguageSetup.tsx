
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'ku', name: 'Kurdish', nativeName: 'کوردی' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

interface LanguageSetupProps {
  onLanguagesSelected: (person1Lang: string, person2Lang: string) => void;
}

export default function LanguageSetup({ onLanguagesSelected }: LanguageSetupProps) {
  const [person1Lang, setPerson1Lang] = useState<string>('');
  const [person2Lang, setPerson2Lang] = useState<string>('');
  const [showPerson1Dropdown, setShowPerson1Dropdown] = useState(false);
  const [showPerson2Dropdown, setShowPerson2Dropdown] = useState(false);

  const handleStart = () => {
    if (person1Lang && person2Lang) {
      onLanguagesSelected(person1Lang, person2Lang);
    }
  };

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? `${lang.nativeName} (${lang.name})` : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-ocean-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sage-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">TalkThru</h1>
          <p className="text-gray-600 text-sm">Kies de talen voor jullie gesprek</p>
        </div>

        <div className="space-y-6">
          {/* Person 1 Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Persoon 1 (Coach/Vrijwilliger)
            </label>
            <div className="relative">
              <button
                onClick={() => setShowPerson1Dropdown(!showPerson1Dropdown)}
                className="w-full p-4 bg-sage-50 border-2 border-sage-200 rounded-xl text-left flex items-center justify-between hover:border-sage-300 transition-colors"
              >
                <span className={person1Lang ? 'text-gray-800' : 'text-gray-500'}>
                  {person1Lang ? getLanguageName(person1Lang) : 'Selecteer taal...'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              {showPerson1Dropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setPerson1Lang(lang.code);
                        setShowPerson1Dropdown(false);
                      }}
                      className="w-full p-3 text-left hover:bg-sage-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-sm text-gray-500">{lang.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Person 2 Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Persoon 2 (Statushouder)
            </label>
            <div className="relative">
              <button
                onClick={() => setShowPerson2Dropdown(!showPerson2Dropdown)}
                className="w-full p-4 bg-ocean-50 border-2 border-ocean-200 rounded-xl text-left flex items-center justify-between hover:border-ocean-300 transition-colors"
              >
                <span className={person2Lang ? 'text-gray-800' : 'text-gray-500'}>
                  {person2Lang ? getLanguageName(person2Lang) : 'Selecteer taal...'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              {showPerson2Dropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setPerson2Lang(lang.code);
                        setShowPerson2Dropdown(false);
                      }}
                      className="w-full p-3 text-left hover:bg-ocean-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-sm text-gray-500">{lang.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleStart}
          disabled={!person1Lang || !person2Lang}
          className="w-full mt-8 py-4 text-lg font-semibold bg-gradient-to-r from-sage-500 to-ocean-500 hover:from-sage-600 hover:to-ocean-600 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Begin Gesprek
        </Button>
      </div>
    </div>
  );
}
