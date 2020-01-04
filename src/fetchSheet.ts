import GoogleSpreadsheet, {
  SpreadsheetRow,
  SpreadsheetWorksheet,
} from 'google-spreadsheet';
import uuidv5 from 'uuid/v5';
import { promisify } from 'util';
import { ColumnTypes } from './columnTypes.d';
import { guessColumnsDataTypes } from './columnsDataTypes';
import { cleanRows } from './cleanRows';

export const seedConstant = '2972963f-2fcf-4567-9237-c09a2b436541';

async function getSpreadsheet(
  spreadsheetId: string,
  credentials?: object,
): Promise<GoogleSpreadsheet> {
  const doc = new GoogleSpreadsheet(spreadsheetId);
  if (credentials) {
    await new Promise((resolve, reject) => {
      doc.useServiceAccountAuth(credentials, (err: Error) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
  doc.getInfo = promisify(doc.getInfo);
  return doc;
}

export default (async function fetchData(
  spreadsheetId: string,
  credentials?: object,
) {
  const spreadsheet = await getSpreadsheet(spreadsheetId, credentials);
  const {
    worksheets,
  }: { worksheets: SpreadsheetWorksheet[] } = await spreadsheet.getInfo();
  const sheets: { [title: string]: object }[] = await Promise.all(
    worksheets.map(async worksheet => {
      const rows = await promisify(worksheet.getRows)({});
      return {
        [worksheet.title]: cleanRows(
          guessColumnsDataTypes(rows),
          rows,
        ).map(row =>
          Object.assign(row, {
            id: uuidv5(row.id, uuidv5('gsheet', seedConstant)),
          }),
        ),
      };
    }),
  );
  return Object.assign({}, ...sheets, {
    id: uuidv5(spreadsheetId, uuidv5('gsheet', seedConstant)),
  });
});
