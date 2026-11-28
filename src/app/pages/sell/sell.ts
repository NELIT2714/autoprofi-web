import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Catalog } from '../../sections/sell/catalog/catalog';
import { Info } from '../../sections/sell/info/info';
import { Cta } from '../../sections/sell/cta/cta';

@Component({
  selector: 'app-sell',
  imports: [Catalog, Info, Cta],
  templateUrl: './sell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sell {}
