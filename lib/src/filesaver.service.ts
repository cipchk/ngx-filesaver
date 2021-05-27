import { Injectable } from '@angular/core';
import { saveAs, FileSaverOptions } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class FileSaverService {
  get isFileSaverSupported(): boolean {
    try {
      return !!new Blob();
    } catch (e) {
      return false;
    }
  }

  genType(fileName?: string): string {
    if (!fileName || fileName.lastIndexOf('.') === -1) {
      return 'text/plain';
    }
    const type = fileName.substr(fileName.lastIndexOf('.') + 1);
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
