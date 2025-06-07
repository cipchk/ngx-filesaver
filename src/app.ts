import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileSaverOptions } from 'file-saver';
import { FileSaverDirective, FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-root',
  template: `
    <h1>ngx-filesaver</h1>
    <p>
      Simple file save with FileSaver.js, pls refer
      <a href="https://github.com/cipchk/ngx-filesaver/blob/master/README.md" target="_blank">README.md</a>
    </p>
    <h1>Filesaver option</h1>
    <label> <input type="checkbox" [(ngModel)]="options.autoBom" /> AutoBOM </label>

    <h1>Text Document</h1>
    <textarea [(ngModel)]="text"></textarea>
    <button type="button" (click)="onDown('txt', false)">Save Text</button>
    <button type="button" (click)="onDown('json', false)">Save JSON</button>

    <h1>Remote file download</h1>
    <button type="button" (click)="onDown('docx', true)">Save Word</button>
    <button type="button" (click)="onDown('xlsx', true)">Save Excel</button>
    <button type="button" (click)="onDown('csv', true)">Save CSV</button>
    <button type="button" (click)="onDown('pptx', true)">Save PPT</button>
    <button type="button" (click)="onDown('pdf', true)">Save PDF</button>
    <button type="button" (click)="onDown('zip', true)">Save Zip</button>
    <button type="button" (click)="onDown('7z', true)">Save 7z</button>
    <button type="button" (click)="onDown('jpg', true)">Save JPG</button>
    <button type="button" (click)="onDown('gif', true)">Save Gif</button>
    <button type="button" (click)="onDown('png', true)">Save Png</button>

    <h1>fileSaver Directive</h1>
    <button type="button" fileSaver url="files/demo.docx">Save Word</button>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, FileSaverDirective],
})
export class AppComponent {
  private readonly httpClient = inject(HttpClient);
  private readonly fileSaverService = inject(FileSaverService);
  text = `{ "text": "This is text file!中文" }`;
  fileName?: string;
  options: FileSaverOptions = {
    autoBom: false,
  };

  onDown(type: string, fromRemote: boolean) {
    const fileName = `save.${type}`;
    if (fromRemote) {
      this.httpClient
        .get(`files/demo.${type}`, {
          observe: 'response',
          responseType: 'blob',
        })
        .subscribe((res) => {
          this.fileSaverService.save(res.body, fileName);
        });
      return;
    }
    const fileType = this.fileSaverService.genType(fileName);
    const txtBlob = new Blob([this.text], { type: fileType });
    this.fileSaverService.save(txtBlob, fileName, undefined, this.options);
  }
}
