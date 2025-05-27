
import { useState } from 'react';
import LanguageSetup from '@/components/LanguageSetup';
import ConversationInterface from '@/components/ConversationInterface';

export default function Index() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<{
    person1: string;
    person2: string;
  }>({ person1: '', person2: '' });

  const handleLanguagesSelected = (person1Lang: string, person2Lang: string) => {
    setSelectedLanguages({ person1: person1Lang, person2: person2Lang });
    setIsSetupComplete(true);
  };

  const handleBack = () => {
    setIsSetupComplete(false);
    setSelectedLanguages({ person1: '', person2: '' });
  };

  if (!isSetupComplete) {
    return <LanguageSetup onLanguagesSelected={handleLanguagesSelected} />;
  }

  return (
    <ConversationInterface
      person1Lang={selectedLanguages.person1}
      person2Lang={selectedLanguages.person2}
      onBack={handleBack}
    />
  );
}
