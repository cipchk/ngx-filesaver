import { Injectable, EventEmitter } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable()
export class FileSaverService {

  constructor() { }

  public genType(fileName?: string): string {
    if (!fileName || fileName.lastIndexOf('.') === -1) return 'text/plain';
    let type = fileName.substr(fileName.lastIndexOf('.') + 1);
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

  public save(blob: Blob, fileName?: string, filtType?: string): void {
    if (!blob) {
      throw new Error('必须指定Blod');
    }

    saveAs(new Blob([blob], { type: filtType || blob.type || this.genType(fileName) }), decodeURI(fileName || 'download'));
  }

  public saveText(txt: string, fileName?: string): void {
    const blob = new Blob([txt], fileName);
    this.save(blob, fileName);
  }
}
