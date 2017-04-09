import { NgModule } from '@angular/core';
import { FileSaverDirective } from './filesaver.directive';
import { FileSaverService } from './filesaver.provider';
import { HttpModule } from "@angular/http";

@NgModule({
  imports: [HttpModule],
  exports: [FileSaverDirective],
  declarations: [FileSaverDirective],
  providers: [FileSaverService] 
})
export class FileSaverModule {
}
