import { SpreadsheetRow } from 'google-spreadsheet';
import { camelCase } from './camelCase';
import { ColumnTypes } from './columnTypes.d';
import { filter } from './filter';

export const cleanRows = (columnTypes: ColumnTypes, rows: SpreadsheetRow[]): SpreadsheetRow[] =>
  rows.map(row =>
    Object.entries(row)
      .filter(([columnName]) => !filter.includes(columnName))
      .map(obj => ({
        [camelCase(obj[0])]: convertCell(columnTypes, obj[0], obj[1]),
      }))
      .reduce((row, cell) => Object.assign(row, cell), {}),
  );

function convertCell(columnTypes: ColumnTypes, key: string, val: any): any {
  switch (columnTypes[key]) {
    case 'number':
      return Number(val.replace(/,/g, ''));
    case 'boolean':
      // when column contains null we return null, otherwise check boolean value
      return val === null ? false : val === 'TRUE';
    default:
      return val;
  }
}
