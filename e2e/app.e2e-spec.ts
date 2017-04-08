import { NgxFilesaverPage } from './app.po';

describe('ngx-filesaver App', () => {
  let page: NgxFilesaverPage;

  beforeEach(() => {
    page = new NgxFilesaverPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
