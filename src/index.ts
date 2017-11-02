import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";

import { FileSaverDirective } from './components/filesaver.directive';
import { FileSaverService } from './components/filesaver.provider';

export * from './components/filesaver.provider';
export * from './components/filesaver.directive';

@NgModule({
  imports: [HttpModule],
  exports: [FileSaverDirective],
  declarations: [FileSaverDirective],
  providers: [FileSaverService]
})
export class FileSaverModule {
}
