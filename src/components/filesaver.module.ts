import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { FileSaverDirective } from './filesaver.directive';
import { FileSaverService } from './filesaver.provider';

@NgModule({
  imports: [HttpModule],
  exports: [FileSaverDirective],
  declarations: [FileSaverDirective],
  providers: [FileSaverService] 
})
export class FileSaverModule {
}
