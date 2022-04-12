import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-add-qualifying-score',
  templateUrl: './add-qualifying-score.component.html',
  styleUrls: ['./add-qualifying-score.component.css']
})
export class AddQualifyingScoreComponent implements OnInit, OnDestroy {

  typeOptions: string[] = [
    "Qualifying Round",
    "Official Handicap Index"
  ];

  typeControl = new FormControl('', Validators.required);

  handicapIndexControl = new FormControl('', Validators.required);
  commentControl = new FormControl('');

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

}
