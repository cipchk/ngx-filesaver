import { Directive, ElementRef, Input, HostListener, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileSaverOptions } from 'file-saver';
import { FileSaverService } from './filesaver.service';

@Directive({
  selector: '[fileSaver]',
  exportAs: 'fileSaver',
  standalone: true,
})
export class FileSaverDirective {
  @Input() method = 'GET';
  @Input() http?: Observable<HttpResponse<Blob>>;
  @Input() query: any;
  @Input() header: any;
  @Input() url!: string;
  @Input() fileName?: string;
  @Input() fsOptions?: FileSaverOptions;
  @Output() readonly success = new EventEmitter<HttpResponse<Blob>>();
  @Output() readonly error = new EventEmitter<any>();

  constructor(private el: ElementRef<HTMLButtonElement>, private fss: FileSaverService, private httpClient: HttpClient) {
    if (!fss.isFileSaverSupported) {
      el.nativeElement.classList.add(`filesaver__not-support`);
    }
  }

  private getName(res: HttpResponse<Blob>) {
    return decodeURI(this.fileName || res.headers.get('filename') || res.headers.get('x-filename') || '');
  }

  @HostListener('click')
  _click(): void {
    if (!this.fss.isFileSaverSupported) {
      return;
    }
    let req = this.http;
    if (!req) {
      let params = new HttpParams();
      const query = this.query || {};
      // tslint:disable-next-line:forin
      for (const item in query) {
        params = params.set(item, query[item]);
      }

      req = this.httpClient.request(this.method, this.url, {
        observe: 'response',
        responseType: 'blob',
        headers: this.header,
        params,
      });
    }

    this.setDisabled(true);
    req.subscribe(
      (res) => {
        if (res.status !== 200 || res.body!.size <= 0) {
          this.error.emit(res);
          return;
        }
        this.fss.save(res.body, this.getName(res), undefined, this.fsOptions);
        this.success.emit(res);
      },
      (err) => this.error.emit(err),
      () => this.setDisabled(false),
    );
  }

  setDisabled(status: boolean): void {
    const el = this.el.nativeElement;
    el.disabled = status;
    el.classList[status ? 'add' : 'remove'](`filesaver__disabled`);
  }
}
