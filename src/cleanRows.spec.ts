import { cleanRows } from './cleanRows';
import { guessColumnsDataTypes } from './columnsDataTypes';

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
    const columnTypes = guessColumnsDataTypes([row]);
    const cleaned = cleanRows(columnTypes, [row])[0];
    expect(Object.keys(cleaned)).toHaveLength(1);

    expect(Object.keys(cleaned)[0]).toBe('validKey');
    expect(cleaned.validKey).toBe('true');
  });

  it('converts "TRUE" and "FALSE" into actual booleans', () => {
    const row = { truthy: 'TRUE', falsy: 'FALSE' };
    const columnTypes = guessColumnsDataTypes([row]);
    const cleaned = cleanRows(columnTypes, [row])[0];
    expect(Object.keys(cleaned)).toEqual(['truthy', 'falsy']);
    expect(cleaned.truthy).toBe(true);
    expect(cleaned.falsy).toBe(false);
  });

  it('respects emoji', () => {
    const TEST_EMOJI_STRING = '🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑🔑';
    const row = { emoji: TEST_EMOJI_STRING };
    const columnTypes = guessColumnsDataTypes([row]);
    const cleaned = cleanRows(columnTypes, [row])[0];
    expect(cleaned.emoji).toEqual(TEST_EMOJI_STRING);
  });

  it('returns comma-delineated number strings as numbers', () => {
    const row = {
      short: '1',
      long: '123,456,789',
      decimal: '0.5912',
      mixed: '123,456.789',
    };
    const columnTypes = guessColumnsDataTypes([row]);
    const cleaned = cleanRows(columnTypes, [row])[0];
    expect(Object.values(cleaned)).toEqual([1, 123456789, 0.5912, 123456.789]);
  });

  it('parses cells as numbers when all column cells contains numbers only', () => {
    const rows = [{ column: '5' }, { column: '2' }];
    const columnTypes = guessColumnsDataTypes(rows);
    const cleaned = cleanRows(columnTypes, rows);
    expect(cleaned[0].column).toBe(5);
    expect(cleaned[1].column).toBe(2);
  });

  it('parses all cells in column as strings when data types are mixed in given column', () => {
    const rows = [{ column: '5' }, { column: 'hello' }];
    const columnTypes = guessColumnsDataTypes(rows);
    const cleaned = cleanRows(columnTypes, rows);
    expect(cleaned[0].column).toBe('5');
    expect(cleaned[1].column).toBe('hello');
  });

  it('guesses column types', () => {
    const rows = [
      {
        number: '0',
        string: 'something',
        null: null,
        boolean: 'TRUE',
      },
      {
        number: '1',
        string: 'anything',
        null: null,
        boolean: 'FALSE',
      },
      {
        number: '2',
        string: 'nothing',
        null: null,
        boolean: null,
      },
    ];
    const columnTypes = guessColumnsDataTypes(rows);
    const cleaned = cleanRows(columnTypes, rows);
    expect(cleaned.map(row => row.number)).toEqual([0, 1, 2]);
    expect(cleaned.map(row => row.string)).toEqual(['something', 'anything', 'nothing']);
    expect(cleaned.map(row => row.null)).toEqual([null, null, null]);
    expect(cleaned.map(row => row.boolean)).toEqual([true, false, false]);
  });
});
