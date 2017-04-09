import { Http, RequestOptions, Headers, URLSearchParams, ResponseContentType, Response } from '@angular/http';
import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FileSaverService } from 'ngx-filesaver';
import { saveAs } from 'file-saver';

@Directive({ selector: '[fileSaver]' })
export class FileSaverDirective {

  @Input() http: Observable<Response>;
  @Input() query: any;
  @Input() header: any;
  @Input() url: string;
  @Input() fileName: string;

  constructor(private el: ElementRef, private _FileSaverService: FileSaverService, private _http: Http) {
  }

  @HostListener('click') onclick() {
    if (this.http) {
      this.http.subscribe((response) => {
        this._FileSaverService.save((<any>response)._body, this.fileName || response.headers.get('filename') || response.headers.get('x-filename'));
      });
      return;
    }

    let params = new URLSearchParams(),
      _data = (this.query || {});
    for (let item in _data) {
      params.set(item, _data[item]);
    }

    let options = new RequestOptions({
      search: params,
      headers: new Headers(this.header || {}),
      responseType: ResponseContentType.Blob
    });
    this.el.nativeElement.disabled = true;
    this._http.get(this.url, options)
      .subscribe(response => {
        this._FileSaverService.save((<any>response)._body, this.fileName || response.headers.get('filename') || response.headers.get('x-filename'));
      }, (err) => {

      }, () => {
        this.el.nativeElement.disabled = false;
      });
  }
}
