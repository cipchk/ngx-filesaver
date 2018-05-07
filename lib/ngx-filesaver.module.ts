import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FileSaverDirective } from './components/filesaver.directive';
import { FileSaverService } from './components/filesaver.provider';

@NgModule({
  imports: [HttpClientModule],
  exports: [FileSaverDirective],
  declarations: [FileSaverDirective],
  providers: [FileSaverService]
})
export class FileSaverModule {
}
