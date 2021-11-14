import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ScorecardScoreLineComponent } from "./scorecard-score-line/scorecard-score-line.component";
import { ScorecardTeeInfoComponent } from "./scorecard-tee-info/scorecard-tee-info.component";

@NgModule({
  declarations: [
    ScorecardTeeInfoComponent,
    ScorecardScoreLineComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ScorecardTeeInfoComponent,
    ScorecardScoreLineComponent
  ]
})
export class ScorecardModule {}
