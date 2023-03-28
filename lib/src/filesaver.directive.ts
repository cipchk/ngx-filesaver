import { Directive, ElementRef, Input, EventEmitter, Output, NgZone, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { filter, fromEvent, Observable, Subject, takeUntil } from 'rxjs';
import { FileSaverOptions } from 'file-saver';
import { FileSaverService } from './filesaver.service';

@Directive({
  selector: '[fileSaver]',
  exportAs: 'fileSaver',
  standalone: true,
})
export class FileSaverDirective implements OnInit, OnDestroy {
  @Input() method = 'GET';
  @Input() http?: Observable<HttpResponse<Blob>>;
  @Input() query: any;
  @Input() header: any;
  @Input() url!: string;
  @Input() fileName?: string;
  @Input() fsOptions?: FileSaverOptions;
  @Output() readonly success = new EventEmitter<HttpResponse<Blob>>();
  @Output() readonly error = new EventEmitter<any>();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private ngZone: NgZone,
    private el: ElementRef<HTMLButtonElement>,
    private fss: FileSaverService,
    private httpClient: HttpClient,
  ) {
    if (!fss.isFileSaverSupported) {
      el.nativeElement.classList.add(`filesaver__not-support`);
    }
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => this.setupClickListener());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private getName(res: HttpResponse<Blob>) {
    return decodeURI(this.fileName || res.headers.get('filename') || res.headers.get('x-filename') || '');
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
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        let req = this.http;

        if (!req) {
          let params = new HttpParams();
          const query = this.query || {};
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

        req.pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.status !== 200 || response.body!.size <= 0) {
              this.emitIfHasObservers(this.error, response);
              return;
            }
            this.fss.save(response.body, this.getName(response), undefined, this.fsOptions);
            this.emitIfHasObservers(this.success, response);
          },
          error: (error) => this.emitIfHasObservers(this.error, error),
          complete: () => this.setDisabled(false),
        });
      });
  }

  private emitIfHasObservers<T>(emitter: EventEmitter<T>, value: T): void {
    if (hasObservers(emitter)) {
      // Re-enter the Angular zone only if there're any `error` or `success` listeners
      // on the directive, for instance, `(success)="..."`.
      this.ngZone.run(() => emitter.emit(value));
    }
  }
}

function hasObservers<T>(subject: Subject<T>): boolean {
  // Note: The `observed` property is available only in RxJS@7.2.0, which means it's
  // not available for users running the lower version.
  return subject.observed ?? subject.observers.length > 0;
}
