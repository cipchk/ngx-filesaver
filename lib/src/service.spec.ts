import { TestBed } from '@angular/core/testing';

import fs from 'file-saver';

import { FileSaverService } from './service';

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
      { name: '1.apk', ret: 'application/apk' }
    ].forEach(({ name, ret }) => {
      expect(srv.genType(name)).toBe(ret);
    });
  });

  describe('#save', () => {
    it('should be error when is ', () => {
      expect(() => srv.save(null)).toThrow('Data argument should be a blob instance');
    });

    it('should be use default filename: download', () => {
      const blob = new Blob();
      const spy = vi.spyOn(fs, 'saveAs').mockClear();
      srv.save(blob);
      expect(spy.mock.calls[0][1] as string).toBe('download');
    });

    it('should be use given filtType', () => {
      const blob = new Blob();
      const spy = vi.spyOn(fs, 'saveAs').mockClear();
      srv.save(blob, 'demo.bin', 'application/octet-stream');
      expect((spy.mock.calls[0][0] as Blob).type).toBe('application/octet-stream');
    });

    it('should be use blob type when filtType is missing', () => {
      const blob = new Blob([], { type: 'image/png' });
      const spy = vi.spyOn(fs, 'saveAs').mockClear();
      srv.save(blob, 'demo.png');
      expect((spy.mock.calls[0][0] as Blob).type).toBe('image/png');
    });
  });

  it('#saveText', () => {
    const spy = vi.spyOn(fs, 'saveAs').mockClear();
    srv.saveText('a');
    expect((spy.mock.calls[0][0] as Blob).size).toBe(1);
  });
});

describe('isFileSaverSupported', () => {
  it('should be false when Blob is not supported', async () => {
    vi.stubGlobal(
      'Blob',
      class {
        constructor() {
          throw new Error('Blob is not supported');
        }
      } as unknown as typeof Blob
    );
    // 清空模块缓存后重新导入，重新执行模块级 try/catch
    vi.resetModules();
    const { FileSaverService: FreshService } = await import('./service');
    expect(new FreshService().isFileSaverSupported).toBe(false);
    vi.unstubAllGlobals();
    vi.resetModules();
  });
});
