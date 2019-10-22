import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import { FileSaverOptions } from 'file-saver';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
})
export class DemoComponent {
  text = `{ "text": "This is text file!中文" }`;
  fileName: string;
  options: FileSaverOptions = {
    autoBom: false,
  };

  constructor(
    private httpClient: HttpClient,
    private fileSaverService: FileSaverService,
  ) {}

  onDown(type: string, fromRemote: boolean) {
    const fileName = `save.${type}`;
    if (fromRemote) {
      this.httpClient.get(`assets/files/demo.${type}`, {
        observe: 'response',
        responseType: 'blob'
      }).subscribe(res => {
        this.fileSaverService.save(res.body, fileName);
      });
      return;
    }
    const fileType = this.fileSaverService.genType(fileName);
    const txtBlob = new Blob([this.text], { type: fileType });
    this.fileSaverService.save(txtBlob, fileName, null, this.options);
  }
}
