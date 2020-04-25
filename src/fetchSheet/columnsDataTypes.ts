import { GoogleSpreadsheetRow } from 'google-spreadsheet';
import { ColumnTypes } from '../shared/columnTypes.d';
import { camelCase } from './shared/camelCase';
import { filter } from './shared/filter';

const checkType = (val: any): string => {
  // try to determine type based on the cell value
  if (!val || val === '') return 'null';
  // sheets apparently leaves commas in some #s depending on formatting
  if (val.replace(/[,\.\d]/g, '').length === 0 && val !== '') return 'number';
  if (val === 'TRUE' || val === 'FALSE') return 'boolean';
  return 'string';
};

const rowTypes = (row: GoogleSpreadsheetRow): ColumnTypes =>
  Object.entries(row)
    .filter(([columnName]) => !filter.includes(columnName))
    .map(obj => ({ [camelCase(obj[0])]: checkType(obj[1]) }))
    .reduce((row, cell) => Object.assign(row, cell), {});

function flattenRowTypes(
  columnTypes: ColumnTypes,
  row: ColumnTypes,
): ColumnTypes {
  Object.entries(row).forEach(([columnName, columnType]: string[]) => {
    // skip nulls, they should have no effect
    if (columnType === 'null') return;
    const currentTypeCandidate = columnTypes[columnName];
    if (!currentTypeCandidate) {
      // no discovered type yet -> use the one from current item
      columnTypes[columnName] = columnType;
    } else if (currentTypeCandidate !== columnType) {
      // previously discovered type is different therefore we fallback to string
      columnTypes[columnName] = 'string';
    }
  });
  return columnTypes;
}

export const guessColumnsDataTypes = (
  rows: GoogleSpreadsheetRow[],
): ColumnTypes => rows.map(rowTypes).reduce(flattenRowTypes, {});
