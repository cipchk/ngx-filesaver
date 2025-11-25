import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(App, {
  providers: [provideHttpClient(), provideZonelessChangeDetection()],
}).catch((err) => console.error(err));
