import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>ngx-filesaver</h1>
    <p>Simple file save with FileSaver.js, pls refer <a href="https://github.com/cipchk/ngx-filesaver/blob/master/README.md" target="_blank">README.md</a></p>
    <app-demo></app-demo>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
