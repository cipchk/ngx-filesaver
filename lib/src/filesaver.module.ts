import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FileSaverDirective } from './filesaver.directive';

@NgModule({
  imports: [HttpClientModule],
  declarations: [FileSaverDirective],
  exports: [FileSaverDirective],
})
export class FileSaverModule {}
