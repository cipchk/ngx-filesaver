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
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';

import { FileSaverService } from './filesaver.provider';

@Directive({ selector: '[fileSaver]' })
export class FileSaverDirective {
  @Input() method = 'GET';
  @Input() http: Observable<HttpResponse<Blob>>;
  @Input() query: any;
  @Input() header: any;
  @Input() url: string;
  @Input() fileName: string;
  /** 成功回调 */
  @Output() success: EventEmitter<any> = new EventEmitter<any>();
  /** 错误回调 */
  @Output() error: EventEmitter<any> = new EventEmitter<any>();

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
  onclick() {
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
