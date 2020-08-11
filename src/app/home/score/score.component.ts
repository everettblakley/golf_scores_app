import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Score } from '~/app/shared/score/score';
import { ScoreService } from '~/app/shared/score/score.service';

@Component({
  selector: 'ns-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  public title: string;
  public score: Score;
  public isLoading: boolean = false;

  constructor(private router: RouterExtensions, private activeRoute: ActivatedRoute, public scoreService: ScoreService) { }

  goBack() {
    this.router.backToPreviousPage();
  }

  ngOnInit(): void {
    this.isLoading = true;
    const params = this.activeRoute.snapshot.params;
    if (params.id == undefined) {
      this.title = "New Score";
      this.score = new Score();
    } else {
      this.title = "Score detail";
      this.scoreService.read(params.id)
        .subscribe((score: Score) => {
          this.score = score;
          console.dir(score);
          this.isLoading = false;
        });
    }

  }

}
