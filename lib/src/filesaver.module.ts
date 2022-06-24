import { NgModule } from '@angular/core';
import { FileSaverDirective } from './filesaver.directive';

@NgModule({
  imports: [FileSaverDirective],
  exports: [FileSaverDirective],
})
export class FileSaverModule {}
