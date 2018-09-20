import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FileSaverDirective } from './filesaver.directive';
import { FileSaverService } from './filesaver.provider';

@NgModule({
  imports: [HttpClientModule],
  exports: [FileSaverDirective],
  declarations: [FileSaverDirective],
  providers: [FileSaverService]
})
export class FileSaverModule {
}
