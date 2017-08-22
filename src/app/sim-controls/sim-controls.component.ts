import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-sim-controls',
  templateUrl: './sim-controls.component.html',
  styleUrls: ['./sim-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimControlsComponent implements OnInit {

  play = false;

  @Output() playChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() onReset: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  private emitPlay() {
    this.playChanged.emit(this.play);
  }

  togglePlay() {
    this.play = !this.play;
    this.emitPlay();
  }

  reset(): void {
    this.play = false;
    this.emitPlay();
    this.onReset.emit(true);
  }

}
