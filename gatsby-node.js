const uuidv5 = require('uuid/v5');
const { camelCase } = require('lodash');
const crypto = require('crypto');
const fetchSheet = require('./lib/fetchSheet.js').default;

const seedConstant = '2972963f-2fcf-4567-9237-c09a2b436541';

exports.sourceNodes = async ({ actions }, { spreadsheetId, credentials }) => {
  const { createNode } = actions;
  console.log('Fetching Google Sheet', fetchSheet, spreadsheetId);
  const sheets = await fetchSheet(spreadsheetId, credentials);
  createNode(
    Object.assign(sheets, {
      id: uuidv5(spreadsheetId, uuidv5('gsheet', seedConstant)),
      parent: '__SOURCE__',
      children: [],
      internal: {
        type: camelCase('googleSheet'),
        contentDigest: crypto
          .createHash('md5')
          .update(JSON.stringify(sheets))
          .digest('hex'),
      },
    }),
  );
};
