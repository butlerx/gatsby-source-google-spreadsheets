import { camelCase } from './camelCase';

describe('Convert Text to Camel Case', () => {
  it('removes spaces from string', () => {
    expect(camelCase('test string')).toBe('testString');
  });

  it('removes starting capital from string', () => {
    expect(camelCase('Test string')).toBe('testString');
  });

  it('removes dashes from string', () => {
    expect(camelCase('test-string')).toBe('testString');
  });

  it('convert snake case from string', () => {
    expect(camelCase('test_string')).toBe('testString');
  });

  it('leave camelCase text unchanged', () => {
    expect(camelCase('testString')).toBe('testString');
  });
});
