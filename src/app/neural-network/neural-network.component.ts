import {Component, OnInit} from '@angular/core';

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

