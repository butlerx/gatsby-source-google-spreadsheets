import { guessColumnsDataTypes } from './columnsDataTypes';

describe('guessing column data type based on all cells in column', () => {
  it('recognizes type for all same cells', () => {
    const rows = [
      {
        numbers: '1,',
        strings: 'something',
        nulls: null,
        booleans: 'TRUE',
      },
      {
        numbers: '2',
        strings: 'anything',
        nulls: null,
        booleans: 'FALSE',
      },
      {
        numbers: '3,',
        strings: 'nothing',
        nulls: null,
        booleans: 'TRUE',
      },
    ];
    const guessedTypes = guessColumnsDataTypes(rows);
    expect(guessedTypes.numbers).toBe('number');
    expect(guessedTypes.strings).toBe('string');
    expect(guessedTypes.nulls).toBeUndefined();
    expect(guessedTypes.booleans).toBe('boolean');
  });

  it('ignores null', () => {
    const rows = [
      {
        numbers: '1,',
        strings: 'something',
        nulls: null,
        booleans: null,
      },
      {
        numbers: null,
        strings: 'anything',
        nulls: null,
        booleans: 'FALSE',
      },
      {
        numbers: '3,',
        strings: null,
        nulls: null,
        booleans: 'TRUE',
      },
    ];
    const guessedTypes = guessColumnsDataTypes(rows);
    expect(guessedTypes.numbers).toBe('number');
    expect(guessedTypes.strings).toBe('string');
    expect(guessedTypes.nulls).toBeUndefined();
    expect(guessedTypes.booleans).toBe('boolean');
  });

  it('fallbacks to string when types are different', () => {
    const rows = [
      {
        numbers: '1,',
        strings: 'something',
        nulls: null,
        booleans: 'TRUE',
      },
      {
        numbers: '2',
        strings: 'anything',
        nulls: null,
        booleans: 'FALSE',
      },
      {
        numbers: '3/5,',
        strings: 'nothing',
        nulls: null,
        booleans: 'TRUE',
      },
    ];
    const guessedTypes = guessColumnsDataTypes(rows);
    expect(guessedTypes.numbers).toBe('string');
    expect(guessedTypes.strings).toBe('string');
    expect(guessedTypes.nulls).toBeUndefined();
    expect(guessedTypes.booleans).toBe('boolean');
  });
});
