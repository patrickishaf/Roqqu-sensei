import { removeNumberFromJoke } from "../../src/jokes";

describe('removeNumberFromJoke', () => {
  it('returns the joke with no spaces', () => {
    const joke = '1. this is a sample joke';
    const result = removeNumberFromJoke(joke);
    expect(result).toEqual('this is a sample joke');
  });
  it('removes the number successfully', () => {
    const joke = '1.this is a sample joke';
    const result = removeNumberFromJoke(joke);
    expect(result).toEqual('this is a sample joke');
  });
  it('returns a joke if there is no period', () => {
    const joke = 'this is a sample joke';
    const result = removeNumberFromJoke(joke);
    expect(result).toEqual('this is a sample joke');
  })
});