import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
})
export class DemoComponent implements OnInit {
  public text = `{ "text": "This is text file!中文" }`;
  public fileName: string;

  constructor(
    private _httpClient: HttpClient,
    private _FileSaverService: FileSaverService,
  ) {}

  ngOnInit() {}

  onDown(type: string, fromRemote: boolean) {
    const fileName = `save.${type}`;
    if (fromRemote) {
      this._httpClient.get(`assets/files/demo.${type}`, {
        observe: 'response',
        responseType: 'blob'
      }).subscribe(res => {
        this._FileSaverService.save(res.body, fileName);
      });
      return;
    }
    const fileType = this._FileSaverService.genType(fileName);
    const txtBlob = new Blob([this.text], { type: fileType });
    this._FileSaverService.save(txtBlob, fileName);
  }
}
