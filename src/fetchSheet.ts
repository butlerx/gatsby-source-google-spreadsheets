import {
  GoogleSpreadsheet,
  GoorgleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import uuidv5 from 'uuid/v5';
import { ColumnTypes } from './shared/columnTypes.d';
import { cleanRows } from './fetchSheet/cleanRows';
import { getSpreadsheet } from './fetchSheet/get';

const seedConstant = uuidv5('gsheet', '2972963f-2fcf-4567-9237-c09a2b436541');

export default (async function fetchData(
  spreadsheetId: string,
  credentials?: object,
  apiKey?: string,
) {
  const spreadsheet = await getSpreadsheet(spreadsheetId, credentials, apiKey);
  const sheets: { [title: string]: object }[] = await Promise.all(
    spreadsheet.sheetsByIndex.map(
      async (worksheet: GoogleSpreadsheetWorksheet) => {
        const rows = await worksheet.getRows({});
        return {
          [worksheet.title]: cleanRows(rows).map((row, id) =>
            Object.assign(row, {
              id: uuidv5(`${worksheet.sheetId}-${id}`, seedConstant),
            }),
          ),
        };
      },
    ),
  );
  return Object.assign({}, ...sheets, {
    id: uuidv5(spreadsheetId, seedConstant),
  });
});
