/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, ResponseContentType, Response } from '@angular/http';
import { FileSaverService } from 'ngx-filesaver';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Component({
  selector: 'demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  public text: string = `{ "text": "This is text file!中文" }`;
  public fileName: string;

  constructor(private _http: Http, private _FileSaverService: FileSaverService) {
  }

  ngOnInit() {
  }

  onRemote(type: string, fromRemote: boolean): Observable<Response> {
    let options = new RequestOptions({
      responseType: ResponseContentType.Blob
    });
    return this._http.get(`assets/files/demo.${type}`, options).map(response => {
      response.headers.set('filename', `demo.${type}`)
      return response;
    });
  }

  onDown(type: string, fromRemote: boolean) {
    const fileName = `save.${type}`;
    if (fromRemote) {
      let options = new RequestOptions({
        responseType: ResponseContentType.Blob
      });
      this._http.get(`assets/files/demo.${type}`, options).subscribe(res => {
        this._FileSaverService.save((<any>res)._body, fileName);
      });
      return;
    }
    const fileType = this._FileSaverService.genType(fileName);
    const txtBlob = new Blob([this.text], { type: fileType });
    this._FileSaverService.save(txtBlob, fileName);
  }

}
