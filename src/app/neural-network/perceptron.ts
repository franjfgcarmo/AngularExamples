import {TrainData} from './train-data';

export class Perceptron {

  weights: number[];
  bias = 1.0;
  isLearning = false;
  lastGuess: number;
  lastLearnRate: number;

  private static outputMapping(activationLevel: number): number {
    return Math.sign(activationLevel);
  }

  private static getRandomWeights(inputConnections: number) {
    const result = [];
    for (let i = 0; i < inputConnections; i++) {
      result.push(Math.random() * 2 - 1.0);
    }
    return result;
  }


  constructor(private inputConnections: number) {
    this.weights = Perceptron.getRandomWeights(inputConnections);
  }


  guess(inputs: number[]): number {
    this.lastGuess = this.guessSilent(inputs);
    return this.lastGuess;
  }

  guessSilent(inputs: number[]): number {
    return Perceptron.outputMapping(inputs.reduce((prev, input, index) => prev + input * this.weights[index], this.bias));
  }

  train({inputs, expected}: TrainData, learnRate: number): number {
    this.lastLearnRate = learnRate;
    const guess = this.guess(inputs);
    const error = expected - guess;

    if (error !== 0.0) {
      this.isLearning = true;
      setTimeout(() => this.isLearning = false, 500);
      const adjustedWeights = this.weights.map((weight, index) =>
        weight + error * inputs[index] * learnRate
      );

      this.bias = this.bias + error * this.bias * learnRate;
      this.weights = adjustedWeights;
    }
    return error;
  }


}
