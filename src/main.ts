import './app.css';

import App from './App.svelte';

if ('serviceWorker' in navigator) {
  // declaring scope manually
  navigator.serviceWorker.register('/service-worker.js', { scope: './' }).then(
    (registration) => {
      console.log('Service worker registration succeeded:', registration);
    },
    /*catch*/ (error) => {
      console.error(`Service worker registration failed: ${error}`);
    }
  );
} else {
  console.error('Service workers are not supported.');
}

const app = new App({
  target: document.getElementById('app')!,
});

export default app;
