import { NgModule } from '@angular/core';

import { FileSaverDirective } from './filesaver.directive';

@NgModule({
  declarations: [FileSaverDirective],
  exports: [FileSaverDirective],
})
export class FileSaverModule {}
