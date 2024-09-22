import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { AppModule } from './app/app.module';
import fetch from 'node-fetch';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1RNKFIJDoZPa-pqIrifrvuNCTAm22lSA",
  authDomain: "sdk-akademie1.firebaseapp.com",
  projectId: "sdk-akademie1",
  storageBucket: "sdk-akademie1.appspot.com",
  messagingSenderId: "669541836589",
  appId: "1:669541836589:web:61c73a553124a9d90e55a4",
  measurementId: "G-R3BQ9VTS5X"
};



platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));

// Register the plugin
gsap.registerPlugin(ScrollToPlugin);
