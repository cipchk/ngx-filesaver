import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class FileSaverService {
  genType(fileName?: string): string {
    if (!fileName || fileName.lastIndexOf('.') === -1) return 'text/plain';
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

  save(blob: Blob, fileName?: string, filtType?: string): void {
    if (!blob) {
      throw new Error('Muse spcify blod argument');
    }

    saveAs(new Blob([blob], { type: filtType || blob.type || this.genType(fileName) }), decodeURI(fileName || 'download'));
  }

  saveText(txt: string, fileName?: string): void {
    const blob = new Blob([txt]);
    this.save(blob, fileName);
  }
}
