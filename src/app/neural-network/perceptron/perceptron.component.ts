import {AfterContentInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Perceptron} from '../shared/perceptron';
import * as P5 from 'p5';

@Component({
  selector: 'app-perceptron',
  templateUrl: './perceptron.component.html',
  styleUrls: ['./perceptron.component.css']
})
export class PerceptronComponent implements AfterContentInit {

  @Input() perceptron: Perceptron;
  @ViewChild('perceptronCanvas') perceptronCanvas: ElementRef;

  static roundFloat(input: number) {
    return input.toFixed(5);
  }

  constructor() {
  }

  ngAfterContentInit(): void {

    const scetch = new P5((p: any) => {
      p.setup = () => {
        p.createCanvas(300, 300);
      };
      p.draw = () => {
        p.background(255);
        this.drawPerceptronCircle(p);
        this.drawBiasInput(p);
        this.drawInputs(p);
      };
    }, this.perceptronCanvas.nativeElement);
  }

  drawPerceptronCircle(p: any) {
    p.push();
    p.translate(160, 150);
    this.perceptron.isLearning ? p.fill(255, 200, 200) : p.fill(200, 200, 255);
    p.ellipse(0, 0, 50, 50);
    p.fill(0);
    p.textSize(20);
    p.textAlign(p.CENTER);
    p.text('∑', 0, 5);

    p.line(25, 0, 100, 0);
    p.textSize(12);
    p.text('Output:' + this.perceptron.lastGuess, 60, -2);

    p.pop();
  }

  drawBiasInput(p: any) {
    p.push();
    p.translate(160, 25);
    this.perceptron.isLearning ? p.fill(255, 200, 200) : p.fill(200, 200, 255);
    p.ellipse(0, 0, 40, 40);
    p.fill(0);
    p.textSize(12);
    p.textAlign(p.CENTER);
    p.text('Bias', 0, 4);
    p.textAlign(p.LEFT);
    p.text(PerceptronComponent.roundFloat(this.perceptron.bias), 5, 30);
    p.line(0, 20, 0, 100);
    p.pop();
  }

  drawInputs(p) {
    const inputDistanceY = (p.height) / (this.perceptron.weights.length + 1);

    this.perceptron.weights.forEach((weight, index) => {
      const y = inputDistanceY * (index + 1);
      p.ellipse(25, y, 40, 40);
      p.textAlign(p.CENTER);
      p.text('Input ' + (index + 1), 25, y + 4);
      p.line(45, y, 135, 150);
      p.textAlign(p.LEFT);
      p.text(`w${index + 1}: ${PerceptronComponent.roundFloat(weight)}`, 50, y);
    });
  }


}
