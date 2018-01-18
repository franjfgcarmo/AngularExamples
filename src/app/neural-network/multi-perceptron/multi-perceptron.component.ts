import {Component, OnInit} from '@angular/core';
import {BrainService} from '../perceptron-tab/brain.service';

@Component({
  selector: 'app-multi-perceptron',
  templateUrl: './multi-perceptron.component.html',
  styleUrls: ['./multi-perceptron.component.less']
})
export class MultiPerceptronComponent implements OnInit {

  constructor(private brainService: BrainService) {
  }

  ngOnInit() {
    this.brainService.createMultiPerceptron(2, [3, 1]);
  }

  get perceptrons() {
    return this.brainService.perceptrons;
  }
}
