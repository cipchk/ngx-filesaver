
import { Directive, ElementRef, NgZone, OnInit, inject, DestroyRef, input } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { filter, fromEvent, Observable, Subject } from 'rxjs';
import type { FileSaverOptions } from 'file-saver';
import { FileSaverService } from './filesaver.service';
import { outputFromObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[fileSaver]',
  exportAs: 'fileSaver',
})
export class FileSaverDirective implements OnInit {
  private readonly ngZone = inject(NgZone);
  private readonly el = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private readonly fss = inject(FileSaverService);
  private readonly httpClient = inject(HttpClient);
  readonly method = input('GET');
  readonly http = input<Observable<HttpResponse<Blob>>>();
  readonly query = input<any>();
  readonly header = input<any>();
  readonly url = input.required<string>();
  readonly fileName = input<string>();
  readonly fsOptions = input<FileSaverOptions>();
  private successEmitter = new Subject<HttpResponse<Blob>>();
  readonly success = outputFromObservable(this.successEmitter);
  private errorEmitter = new Subject<any>();
  readonly error = outputFromObservable(this.errorEmitter);

  private readonly d$ = inject(DestroyRef);

  constructor() {
    if (!this.fss.isFileSaverSupported) {
      this.el.nativeElement.classList.add(`filesaver__not-support`);
    }
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => this.setupClickListener());
  }

  private getName(res: HttpResponse<Blob>) {
    return decodeURI(this.fileName() || res.headers.get('filename') || res.headers.get('x-filename') || '');
  }

  setDisabled(status: boolean): void {
    const el = this.el.nativeElement;
    el.disabled = status;
    el.classList[status ? 'add' : 'remove'](`filesaver__disabled`);
  }

  private setupClickListener(): void {
    fromEvent(this.el.nativeElement, 'click')
      .pipe(
        filter(() => this.fss.isFileSaverSupported),
        takeUntilDestroyed(this.d$),
      )
      .subscribe(() => {
        let req = this.http();

        if (!req) {
          let params = new HttpParams();
          const query = this.query() || {};
          for (const item in query) {
            params = params.set(item, query[item]);
          }

          req = this.httpClient.request(this.method(), this.url(), {
            observe: 'response',
            responseType: 'blob',
            headers: this.header(),
            params,
          });
        }

        this.setDisabled(true);

        req.pipe(takeUntilDestroyed(this.d$)).subscribe({
          next: (response) => {
            if (response.status !== 200 || response.body!.size <= 0) {
              this.errorEmitter.next(response);
              return;
            }
            this.fss.save(response.body, this.getName(response), undefined, this.fsOptions());
            this.successEmitter.next(response);
          },
          error: (error) => this.errorEmitter.next(error),
          complete: () => this.setDisabled(false),
        });
      });
  }
}
