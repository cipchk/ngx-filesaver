import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, Injector, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as fs from 'file-saver';

import { FileSaverModule } from '../src/filesaver.module';
import { FileSaverDirective } from '../src/filesaver.directive';
import { FileSaverService } from '../src/filesaver.service';

function genFile(ext: string, isRealFile = true): Blob {
  const blob = new Blob([
    isRealFile ? `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==` : '',
  ]);
  return blob;
}

describe('ngx-filesaveer:', () => {
  let fixture: ComponentFixture<TestComponent>;
  let dl: DebugElement;
  let context: TestComponent;
  let injector: Injector;
  let http: HttpClient;
  let httpBed: HttpTestingController;

  beforeEach(() => {
    injector = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FileSaverModule],
      declarations: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    dl = fixture.debugElement;
    context = fixture.componentInstance;

    http = injector.get(HttpClient);
    httpBed = injector.get(HttpTestingController as Type<HttpTestingController>);
  });

  ['xlsx', 'docx', 'pptx', 'pdf'].forEach((ext) => {
    it(`should be down ${ext}`, () => {
      fixture.detectChanges();
      spyOn(fs, 'saveAs');
      if (ext === 'docx') {
        context.data = null;
      }
      fixture.detectChanges();
      (dl.query(By.css('#down-' + ext)).nativeElement as HTMLButtonElement).click();
      const ret = httpBed.expectOne((req) => req.url.startsWith('/')) as TestRequest;
      ret.flush(genFile(ext));
      expect(fs.saveAs).toHaveBeenCalled();
    });
  });

  it('should be using header filename when repseon has [filename]', () => {
    fixture.detectChanges();
    let fn = '';
    const filename = 'newfile.docx';
    spyOn(fs, 'saveAs').and.callFake((_: any, fileName?: string) => (fn = fileName!));
    context.fileName = null;
    fixture.detectChanges();
    (dl.query(By.css('#down-docx')).nativeElement as HTMLButtonElement).click();
    const ret = httpBed.expectOne((req) => req.url.startsWith('/')) as TestRequest;
    ret.flush(genFile('docx'), {
      headers: new HttpHeaders({ filename }),
    });
    expect(fn).toBe(filename);
  });

  it('should be using header filename when repseon has [x-filename]', () => {
    fixture.detectChanges();
    let fn = '';
    const filename = 'x-newfile.docx';
    spyOn(fs, 'saveAs').and.callFake((_: any, fileName?: string) => (fn = fileName!));
    context.fileName = null;
    fixture.detectChanges();
    (dl.query(By.css('#down-docx')).nativeElement as HTMLButtonElement).click();
    const ret = httpBed.expectOne((req) => req.url.startsWith('/')) as TestRequest;
    ret.flush(genFile('docx'), {
      headers: new HttpHeaders({ 'x-filename': filename }),
    });
    expect(fn).toBe(filename);
  });

  it('should be throw error when a bad request', () => {
    fixture.detectChanges();
    spyOn(context, 'error');
    expect(context.error).not.toHaveBeenCalled();
    (dl.query(By.css('#down-docx')).nativeElement as HTMLButtonElement).click();
    const ret = httpBed.expectOne((req) => req.url.startsWith('/')) as TestRequest;
    ret.error(null!, { status: 404 });
    expect(context.error).toHaveBeenCalled();
  });

  it('should be throw error when a empty file', () => {
    fixture.detectChanges();
    spyOn(context, 'error');
    expect(context.error).not.toHaveBeenCalled();
    (dl.query(By.css('#down-docx')).nativeElement as HTMLButtonElement).click();
    const ret = httpBed.expectOne((req) => req.url.startsWith('/')) as TestRequest;
    ret.flush(genFile('docx', false));
    expect(context.error).toHaveBeenCalled();
  });

  it('should be throw error when http status is not 200', () => {
    fixture.detectChanges();
    spyOn(fs, 'saveAs');
    spyOn(context, 'error');
    expect(context.error).not.toHaveBeenCalled();
    expect(fs.saveAs).not.toHaveBeenCalled();
    (dl.query(By.css('#down-docx')).nativeElement as HTMLButtonElement).click();
    const ret = httpBed.expectOne((req) => req.url.startsWith('/')) as TestRequest;
    ret.flush(null, { status: 201, statusText: '201' });
    expect(fs.saveAs).not.toHaveBeenCalled();
    expect(context.error).toHaveBeenCalled();
  });

  it('should be disabled when http request ing', () => {
    fixture.detectChanges();
    // tslint:disable-next-line: no-string-literal
    dl.query(By.css('button')).injector.get(FileSaverDirective).setDisabled(true);
    const el = dl.query(By.css('#down-xlsx')).nativeElement as HTMLButtonElement;
    expect(el.classList).toContain(`filesaver__disabled`);
  });

  it('should be filesaver__not-support when not supoort fileSaver', () => {
    const srv = injector.get(FileSaverService);
    spyOnProperty(srv, 'isFileSaverSupported', 'get').and.returnValue(false);
    context.fileTypes = ['xlsx'];
    fixture.detectChanges();
    const el = dl.query(By.css('#down-xlsx')).nativeElement as HTMLButtonElement;
    expect(el.classList).toContain(`filesaver__not-support`);
  });
});

@Component({
  template: `
    <button
      *ngFor="let i of fileTypes"
      id="down-{{ i }}"
      class="mr-sm"
      fileSaver
      query="data"
      method="get"
      url="/demo.{{ i }}"
      [fileName]="fileName"
      (success)="success()"
      (error)="error()"
    >
      {{ i }}
    </button>
  `,
})
class TestComponent {
  fileTypes = ['xlsx', 'docx', 'pptx', 'pdf'];

  data: any = {
    otherdata: 1,
    time: new Date(),
  };

  fileName: string | null = 'demo中文';

  success(): void {}

  error(): void {}
}
