import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Add a passive event listener to the window object
// window.addEventListener('scroll', () => {}, { passive: true });

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

