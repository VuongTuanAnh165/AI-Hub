import { initializeApp } from 'firebase/app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Only initialize if we have the config
  if (!config.public.firebaseProjectId) {
    console.warn('Firebase config is missing. Please check your .env file.');
    return;
  }

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string,
  };

  const app = initializeApp(firebaseConfig);

  return {
    provide: {
      firebaseApp: app
    }
  }
});
