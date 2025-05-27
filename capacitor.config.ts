
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.fd718c4b013446ac84c19520e260f748',
  appName: 'TalkThru',
  webDir: 'dist',
  server: {
    url: 'https://fd718c4b-0134-46ac-84c1-9520e260f748.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#8fbc8f",
      showSpinner: false
    }
  }
};

export default config;
