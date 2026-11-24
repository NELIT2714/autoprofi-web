import { Component, computed, inject } from '@angular/core';
import { I18n } from '../../i18n/i18n';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
})
export class About {
  protected readonly t = inject(I18n).t;
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly mapEmbed = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.t().business.mapEmbed),
  );
}
