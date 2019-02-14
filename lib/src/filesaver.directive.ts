import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  EventEmitter,
  Output,
} from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FileSaverService } from './filesaver.service';

@Directive({
  selector: '[fileSaver]',
  exportAs: 'fileSaver'
})
export class FileSaverDirective {
  @Input() method = 'GET';
  @Input() http: Observable<HttpResponse<Blob>>;
  @Input() query: any;
  @Input() header: any;
  @Input() url: string;
  @Input() fileName: string;
  @Output() readonly success = new EventEmitter<any>();
  @Output() readonly error = new EventEmitter<any>();

  constructor(
    private el: ElementRef,
    private _FileSaverService: FileSaverService,
    private _httpClient: HttpClient,
  ) {}

  private getName(res: HttpResponse<Blob>) {
    return decodeURI(
      this.fileName ||
      res.headers.get('filename') ||
      res.headers.get('x-filename')
    );
  }

  @HostListener('click')
  _click() {
    let _http = this.http;
    if (!_http) {
      const params = new HttpParams(),
        _data = this.query || {};
      // tslint:disable-next-line:forin
      for (const item in _data) {
        params.set(item, _data[item]);
      }

      _http = this._httpClient.request(this.method, this.url, {
        observe: 'response',
        responseType: 'blob',
        headers: this.header,
        params
      });
    }

    this.el.nativeElement.disabled = true;
    _http.subscribe(
      res => {
        if (res.status !== 200 || res.body.size <= 0) {
          this.error.emit(res);
          return;
        }
        this._FileSaverService.save(res.body, this.getName(res));
        this.success.emit(res);
      },
      err => {
        this.error.emit(err);
      },
      () => {
        this.el.nativeElement.disabled = false;
      },
    );
  }
}
