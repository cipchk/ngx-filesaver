import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app';

bootstrapApplication(App, {
  providers: [provideHttpClient(), provideZonelessChangeDetection()]
}).catch(err => console.error(err));
