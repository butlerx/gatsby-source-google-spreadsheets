import { cleanRows } from './cleanRows';
import { guessColumnsDataTypes } from './cleanRows/columnsDataTypes';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeBoolean(): R;
    }
  }
}

expect.extend({
  toBeBoolean(received) {
    return {
      message: () => `expected ${received} to be boolean or null`,
      pass: typeof received === 'boolean',
    };
  },
});

describe('cleaning rows from GSheets response', () => {
  it("removes keys that don't correspond to column names", () => {
    const badKeys = ['_xml', 'app:edited', 'save', 'del', '_links'];
    const row = badKeys.reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: 'true',
      }),
      { validKey: 'true' },
    );
    const cleaned = cleanRows([row])[0];
    expect(Object.keys(cleaned)).toHaveLength(1);

    expect(Object.keys(cleaned)[0]).toBe('validKey');
    expect(cleaned.validKey).toBe('true');
  });

  it('converts "TRUE" and "FALSE" into actual booleans', () => {
    const row = { truthy: 'TRUE', falsy: 'FALSE' };
    const cleaned = cleanRows([row])[0];
    expect(Object.keys(cleaned)).toEqual(['truthy', 'falsy']);
    expect(cleaned.truthy).toBeBoolean();
    expect(cleaned.falsy).toBeBoolean();
    expect(cleaned.truthy).toBe(true);
    expect(cleaned.falsy).toBe(false);
  });

  it('converts empty cells into actual null', () => {
    const row = { empty: '', nulled: null };
    const cleaned = cleanRows([row])[0];
    expect(cleaned.empty).toBe(null);
    expect(cleaned.nulled).toBe(null);
  });

  it('respects emoji', () => {
    const TEST_EMOJI_STRING = '🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑';
    const row = { emoji: TEST_EMOJI_STRING };
    const cleaned = cleanRows([row])[0];
    expect(cleaned.emoji).toEqual(TEST_EMOJI_STRING);
  });

  it('returns comma-delineated number strings as numbers', () => {
    const row = {
      short: '1',
      long: '123,456,789',
      decimal: '0.5912',
      mixed: '123,456.789',
    };
    const cleaned = cleanRows([row])[0];
    expect(Object.values(cleaned)).toEqual([1, 123456789, 0.5912, 123456.789]);
  });

  it('parses cells as numbers when all column cells contains numbers only', () => {
    const rows = [{ column: '5' }, { column: '2' }];
    const cleaned = cleanRows(rows);
    expect(cleaned[0].column).toBe(5);
    expect(cleaned[1].column).toBe(2);
  });

  it('parses all cells in column as strings when data types are mixed in given column', () => {
    const rows = [{ column: '5' }, { column: 'hello' }];
    const cleaned = cleanRows(rows);
    expect(cleaned[0].column).toBe('5');
    expect(cleaned[1].column).toBe('hello');
  });

  it('guesses column types', () => {
    const rows = [
      {
        number: '0',
        string: 'something',
        null: null,
        'boolean-value': 'TRUE',
      },
      {
        number: '1',
        string: 'anything',
        null: null,
        'boolean-value': 'FALSE',
      },
      {
        number: '2',
        string: '',
        null: null,
        'boolean-value': null,
      },
      {
        number: null,
        string: null,
        null: null,
        'boolean-value': null,
      },
      {
        number: undefined,
        string: undefined,
        null: undefined,
        'boolean-value': undefined,
      },
    ];
    const cleaned = cleanRows(rows);
    expect(cleaned.map(row => row.number)).toEqual([0, 1, 2, null, null]);
    expect(cleaned.map(row => row.string)).toEqual([
      'something',
      'anything',
      null,
      null,
      null,
    ]);
    expect(cleaned.map(row => row.null)).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(cleaned.map(row => row.booleanValue)).toEqual([
      true,
      false,
      false,
      false,
      false,
    ]);
  });
});
