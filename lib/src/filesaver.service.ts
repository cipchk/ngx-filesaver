import { Injectable } from '@angular/core';
import { saveAs, FileSaverOptions } from 'file-saver';

/** Check the `Blob` existance only once. */
let isFileSaverSupported: boolean;
try {
  isFileSaverSupported = !!new Blob();
} catch {
  isFileSaverSupported = false;
}

@Injectable({ providedIn: 'root' })
export class FileSaverService {
  get isFileSaverSupported(): boolean {
    return isFileSaverSupported;
  }

  genType(fileName?: string | null): string {
    if (!fileName || fileName.lastIndexOf('.') === -1) {
      return 'text/plain';
    }
    const type = fileName.substring(fileName.lastIndexOf('.') + 1);
    switch (type) {
      case 'txt':
        return 'text/plain';
      case 'xml':
      case 'html':
        return `text/${type}`;
      case 'json':
        return 'octet/stream';
      default:
        return `application/${type}`;
    }
  }

  save(blob: Blob | null, fileName?: string, filtType?: string, option?: FileSaverOptions): void {
    if (!blob) {
      throw new Error('Data argument should be a blob instance');
    }

    const file = new Blob([blob], { type: filtType || blob.type || this.genType(fileName) });
    saveAs(file, decodeURI(fileName || 'download'), option);
  }

  saveText(txt: string, fileName?: string, option?: FileSaverOptions): void {
    const blob = new Blob([txt]);
    this.save(blob, fileName, undefined, option);
  }
}
