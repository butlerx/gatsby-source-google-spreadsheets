import {
  GoogleSpreadsheet,
  GoorgleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import uuidv5 from 'uuid/v5';
import { ColumnTypes } from './shared/columnTypes.d';
import { guessColumnsDataTypes } from './fetchSheet/columnsDataTypes';
import { cleanRows } from './fetchSheet/cleanRows';

export const seedConstant = '2972963f-2fcf-4567-9237-c09a2b436541';

async function getSpreadsheet(
  spreadsheetId: string,
  credentials?: object,
  apiKey?: string,
): Promise<GoogleSpreadsheet> {
  const doc = new GoogleSpreadsheet(spreadsheetId);
  if (credentials) {
    await doc.useServiceAccountAuth(credentials);
  } else if (apiKey) {
    doc.useApiKey(apiKey);
  } else {
    throw new Error(
      'Authentication not provided. Either provided google service account credentials or an APIKey',
    );
  }
  await doc.loadInfo();
  return doc;
}

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
          [worksheet.title]: cleanRows(guessColumnsDataTypes(rows), rows).map(
            (row, id) =>
              Object.assign(row, {
                id: uuidv5(
                  `${worksheet.sheetId}-${id}`,
                  uuidv5('gsheet', seedConstant),
                ),
              }),
          ),
        };
      },
    ),
  );
  return Object.assign({}, ...sheets, {
    id: uuidv5(spreadsheetId, uuidv5('gsheet', seedConstant)),
  });
});
