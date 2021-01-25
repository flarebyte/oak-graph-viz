import {
  parseAsGraph,
} from '../src';


describe('Visualisation of graphs and networks', () => {
  it('validate the graph format', () => {
    const actual = parseAsGraph("");
    expect(actual).toBeDefined();
  });
}
);
  