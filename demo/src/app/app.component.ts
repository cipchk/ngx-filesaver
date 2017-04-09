import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>ngx-filesaver</h1>
    <p>Simple file save with FileSaver.js</p>
    <demo></demo>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
