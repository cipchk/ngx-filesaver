# ngx-filesaver

Simple file save with FileSaver.js

[![NPM version](https://img.shields.io/npm/v/ngx-filesaver.svg)](https://www.npmjs.com/package/ngx-filesaver)
[![Build Status](https://travis-ci.org/cipchk/ngx-filesaver.svg?branch=master)](https://travis-ci.org/cipchk/ngx-filesaver)

## 示例

- [demo](https://cipchk.github.io/ngx-filesaver/)
- [Stackblitz](https://stackblitz.com/edit/ngx-filesaver)

## 安装

```
npm install file-saver ngx-filesaver --save
```

添加 `FileSaverModule` 模块到项目中：

```
import { FileSaverModule } from 'ngx-filesaver';
@NgModule({
  imports: [ FileSaverModule ]
})
```

## 使用方法

支持服务 `FileSaverService.save()` 或属性指令 `fileSaver` 两种保存方式。

### 1、FileSaverService

```typescript
constructor(private _http: Http, private _FileSaverService: FileSaverService) {
}

onSave() {
  this._http.get('demo.pdf', {
    responseType: ResponseContentType.Blob // 这里必须是Blob类型
  }).subscribe(res => {
    this._FileSaverService.save((<any>res)._body, fileName);
  });
}
```

### 2、fileSaver 属性指令

#### 配置型

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

**fileSaver**：属性指令名称。
**参数说明**

参数 | 说明 | 类型 | 默认值
----|------|-----|------
`method` | 请求方法类型 | `string` | `GET`
`url` | 下路路径 | `string` | -
`fileName` | 文件名 | `string` | -
`query` | 额外的查询参数，等同 `params` 值 | `string` | -
`header` | 请求的 `headers` 属性值，一般用来指定 _token_ 之类 | `any` | -
`fsOptions` | FileSaver.js 配置，可以设置 `autoBom` 等参数值 | `FileSaverOptions` | -
`success` | 下载成功回调 | `EventEmitter<HttpResponse<Blob>>` | -
`error` | 下载错误回调 | `EventEmitter<any>` | -

#### 自定义Http型

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

#### 关于文件名

文件名的获取按以下优先级：fileName =》 response.headers.get('filename') =》 response.headers.get('x-filename')。

如果你请求的是一个CORS跨域地址，需要注意设置 `Access-Control-Allow-Headers: filename`，以免无法获取。

#### 类名

| 类名 | 描述 |
| --- | ---- |
| `filesaver__not-support` | 不 [兼容](https://github.com/eligrey/FileSaver.js/#supported-browsers) `Blob` 时 |
| `filesaver__disabled` | 请求过程中 |
