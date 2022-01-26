import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ScorecardHoleLineComponent } from "./scorecard-hole-line/scorecard-hole-line.component";
import { ScorecardTeeInfoComponent } from "./scorecard-tee-info/scorecard-tee-info.component";
import { ScorecardScoreLineComponent } from "./scorecard-score-line/scorecard-score-line.component";
import { ScorecardTitleLineComponent } from './scorecard-title-line/scorecard-title-line.component';

@NgModule({
  declarations: [
    ScorecardHoleLineComponent,
    ScorecardTeeInfoComponent,
    ScorecardScoreLineComponent,
    ScorecardTitleLineComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ScorecardHoleLineComponent,
    ScorecardTeeInfoComponent,
    ScorecardScoreLineComponent,
    ScorecardTitleLineComponent
  ]
})
export class ScorecardModule {}
