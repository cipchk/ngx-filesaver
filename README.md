# ngx-filesaver

Simple file save with FileSaver.js

[![Build Status](https://travis-ci.org/cipchk/ngx-filesaver.svg?branch=master)](https://travis-ci.org/cipchk/ngx-filesaver)

## 示例

[demo](https://cipchk.github.io/ngx-filesaver/)

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
  let options = new RequestOptions({
    responseType: ResponseContentType.Blob // 这里必须是Blob类型
  });

  this._http.get('demo.pdf', options).subscribe(res => {
    this._FileSaverService.save((<any>res)._body, fileName);
  });
}
```

### 2、fileSaver 属性指令

#### 配置型

```html
<button type="button" 
        fileSaver 
        [fileName]="'中文pdf.pdf'"
        [url]="'assets/files/demo.pdf'"
        [header]="{ token: 'demo' }"
        [query]="{ pi: 1, name: 'demo' }">Download PDF</button>
```

**fileSaver**：属性指令名称。

**url**：下路路径。

**fileName**：文件名。【选填】

**header**：请求的 `headers` 属性值，一般用来指定 _token_ 之类。【选填】

**query**：额外的查询参数。【选填】



#### 自定义Http型

```html
<button type="button" 
        fileSaver 
        [http]="onRemote('pdf', true)">Download PDF</button>
```

```typescript
onRemote(type: string, fromRemote: boolean): Observable<Response> {
  let options = new RequestOptions({
    responseType: ResponseContentType.Blob
  });
  return this._http.get(`assets/files/demo.${type}`, options).map(response => {
    response.headers.set('filename', `demo.${type}`)
    return response;
  });
}
```
