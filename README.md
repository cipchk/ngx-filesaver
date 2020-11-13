# ngx-filesaver

Simple file save with FileSaver.js

[![NPM version](https://img.shields.io/npm/v/ngx-filesaver.svg)](https://www.npmjs.com/package/ngx-filesaver)
[![Ci](https://github.com/cipchk/ngx-filesaver/workflows/Ci/badge.svg)](https://github.com/cipchk/ngx-filesaver/actions?query=workflow%3ACi)

[中文版](README.zh-CN.md)

## Examples

- [demo](https://cipchk.github.io/ngx-filesaver/)
- [Stackblitz](https://stackblitz.com/edit/ngx-filesaver)

## Installation

```
npm install file-saver ngx-filesaver --save
```

Add the `FileSaverModule` module to your project：

```
import { FileSaverModule } from 'ngx-filesaver';
@NgModule({
  imports: [ FileSaverModule ]
})
```

## Instructions

There are two ways to save a file: using `FileSaverService.save()` or using the `fileSaver` directive.

### 1、FileSaverService

```typescript
constructor(private _http: Http, private _FileSaverService: FileSaverService) {
}

onSave() {
  this._http.get('demo.pdf', {
    responseType: ResponseContentType.Blob // This must be a Blob type
  }).subscribe(res => {
    this._FileSaverService.save((<any>res)._body, fileName);
  });
}
```

### 2、fileSaver directive

#### Configuration example

```html
<button type="button"
        fileSaver
        [method]="'GET'"
        [fileName]="'中文pdf.pdf'"
        [url]="'assets/files/demo.pdf'"
        [header]="{ token: 'demo' }"
        [query]="{ pi: 1, name: 'demo' }"
        (success)="onSuc($event)"
        (error)="onErr($event)">Download PDF</button>
```

**fileSaver**： the directive name
**Parameters**

Parameter | Description | Type | Default
----|------|-----|------
`method` | Request method type | `string` | `GET`
`url` | Request URL | `string` | -
`fileName` | Filename when downloading | `string` | -
`query` | Additional query parameters. Equivalent to `params` value | `string` | -
`header` | Header configuration. Usually used for especifying access tokens | `any` | -
`fsOptions` | FileSaver.js config, can be set `autoBom` value | `FileSaverOptions` | -
`success` | Download success callback | `EventEmitter<HttpResponse<Blob>>` | -
`error` | Download error callback | `EventEmitter<any>` | -

#### Custom HTTP type

```html
<button type="button"
        fileSaver
        [http]="onRemote('pdf', true)">Download PDF</button>
```

```ts
onRemote(type: string, fromRemote: boolean): Observable<Response> {
  return this._http.get(`assets/files/demo.${type}`, {
    responseType: ResponseContentType.Blob
  }).map(response => {
    response.headers.set('filename', `demo.${type}`)
    return response;
  });
}
```

#### About filenames

The name for the downloaded file is obtained with the following priority:

1. fileName
2. response.headers.get('filename')
3. response.headers.get('x-filename')。

If you are requesting a CORS address, you need to pay attention to the request headers. Setting `Access-Control-Allow-Headers: filename` should be sufficient

#### Class Name

| Class Name | Description |
| --- | ---- |
| `filesaver__not-support` | Not [Supported Browsers](https://github.com/eligrey/FileSaver.js/#supported-browsers) |
| `filesaver__disabled` | During http request |

#### Configuring CommonJS dependencies

> WARNING in node_modules/ngx-filesaver/ivy_ngcc/fesm2015/ngx-filesaver.js depends on file-saver. CommonJS or AMD dependencies can cause optimization bailouts.

We cannot change this, the only way is to ignore it:

```json
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
     "allowedCommonJsDependencies": [
        "file-saver"
     ]
     ...
   }
   ...
},
```
