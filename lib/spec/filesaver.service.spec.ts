import { TestBed } from '@angular/core/testing';
import fs from 'file-saver';
import { FileSaverService } from '../src/filesaver.service';

describe('ngx-filesaver:', () => {
  let srv: FileSaverService;

  beforeEach(() => {
    srv = TestBed.inject(FileSaverService);
  });

  it('#genType', () => {
    [
      { name: null, ret: 'text/plain' },
      { name: '1.txt', ret: 'text/plain' },
      { name: '1.xml', ret: 'text/xml' },
      { name: '1.html', ret: 'text/html' },
      { name: '1.json', ret: 'octet/stream' },
      { name: '1.apk', ret: 'application/apk' },
    ].forEach(({ name, ret }) => {
      expect(srv.genType(name)).toBe(ret);
    });
  });

  describe('#save', () => {
    it('should be error when is ', () => {
      expect(() => srv.save(null)).toThrowError('Data argument should be a blob instance');
    });

    it('should be use default filename: download', () => {
      const blob = new Blob();
      const spy = spyOn(fs, 'saveAs');
      srv.save(blob);
      expect(spy.calls.first().args[1] as string).toBe('download');
    });
  });

  it('#saveText', () => {
    const spy = spyOn(fs, 'saveAs');
    srv.saveText('a');
    expect((spy.calls.first().args[0] as Blob).size).toBe(1);
  });
});
