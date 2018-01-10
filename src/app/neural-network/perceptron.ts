export class Perceptron {

  public weights: number[];

  constructor(private inputConnections: number,
              private outputMapping: (number) => number = (num) => Math.sign(num),
              private learnRate: number = 0.05) {
    this.weights = Perceptron.getRandomWeights(inputConnections);
  }

  private static getRandomWeights(inputConnections: number) {
    const result = [];
    for (let i = 0; i < inputConnections; i++) {
      result.push(Math.random() * 2 - 1.0);
    }
    return result;
  }

  guess(inputs: number[]): number {
    return inputs.reduce((prev, input, index) => prev + input * this.weights[index], 0.0);
  }

  train(trainData: { inputs: number[], expected: number }): number {
    const {inputs, expected} = trainData;
    const guess = this.guess(inputs);

    const error = expected - guess;

    const adjustedWeights = this.weights.map((weight, index) =>
      weight + error * inputs[index] * this.learnRate
    );
    this.weights = adjustedWeights;
    return error;
  }

}
