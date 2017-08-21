import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'POISON';

  play = true;

  ngOnInit() {
  }

  setPlay(play: boolean) {
    this.play = play;
  }
}

