import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BrainService} from './perceptron-tab/brain.service';
import {Point} from './shared/point';
import {Observable} from 'rxjs/Observable';
import {navLinks} from './neural-network-routing.module';
import {Route} from '@angular/router';

@Component({
  selector: 'app-neural-network',
  templateUrl: './neural-network.component.html',
  styleUrls: ['./neural-network.component.less']
})
export class NeuralNetworkComponent implements OnInit {
  navLinks: { path: any, label: string }[];

  ngOnInit(): void {
    this.navLinks = [
      {path: 'perceptron', label: 'Perceptron'},
      {path: 'multiPerceptron', label: 'Multi layer net'}
    ];
  }
}

