import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
import { TuiAppearance, TuiButton, TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiCardMedium, TuiHeader } from '@taiga-ui/layout';

@Component({
  standalone: true,
  exportAs: 'TaigaExamples',
  templateUrl: './taiga-examples.component.html',
  styleUrls: ['./taiga-examples.component.css'],
  imports: [
    TuiAppearance,
    TuiButton,
    TuiCardLarge,
    TuiCardMedium,
    TuiHeader,
    TuiIcon,
    TuiRepeatTimes,
    TuiTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaigaExamplesComponent {}
