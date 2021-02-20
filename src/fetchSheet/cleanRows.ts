import { SpreadsheetRow } from 'google-spreadsheet';
import { ColumnTypes } from '../columnTypes.d';
import { camelCase } from './shared/camelCase';
import { filter } from './shared/filter';
import { guessColumnsDataTypes } from './cleanRows/columnsDataTypes';

export const cleanRows = (rows: SpreadsheetRow[]): SpreadsheetRow[] => {
  const columnTypes = guessColumnsDataTypes(rows);
  return rows.map(row =>
    Object.entries(row)
      .filter(([columnName]) => !filter.includes(columnName))
      .map(obj => {
        const key = camelCase(obj[0]);
        return {
          [key]: convertCell(columnTypes, key, obj[1]),
        };
      })
      .reduce((row, cell) => Object.assign(row, cell), {}),
  );
};

function convertCell(columnTypes: ColumnTypes, key: string, val: any): any {
  switch (columnTypes[key]) {
    case 'number':
      return isNull(val) ? null : Number(val.replace(/,/g, ''));
    case 'boolean':
      // when column contains null we return false, otherwise check boolean value
      return isNull(val) ? false : val === 'TRUE';
    default:
      // We cast all possible null types to actually be null
      return isNull(val) ? null : val;
  }
}

function isNull(val: any): boolean {
  return val === null || val === undefined || val === '';
}
