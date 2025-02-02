import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
import { TuiAxes, TuiLineChart } from '@taiga-ui/addon-charts';
import { TuiAppearance, TuiButton, TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiCardMedium, TuiHeader } from '@taiga-ui/layout';
import type { TuiContext, TuiStringHandler } from '@taiga-ui/cdk';
import type { TuiPoint } from '@taiga-ui/core';
import { TuiHint } from '@taiga-ui/core';

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
    TuiAxes,
    TuiLineChart,
    TuiHint,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaigaExamplesComponent {
  protected readonly value: readonly TuiPoint[] = [
    [50, 50],
    [100, 75],
    [150, 50],
    [200, 150],
    [250, 155],
    [300, 190],
    [350, 90],
  ];

  protected readonly hint: TuiStringHandler<TuiContext<TuiPoint>> = ({ $implicit }) =>
    `Vertical: ${$implicit[1]}\nHorizontal: ${$implicit[0]}`;
}
