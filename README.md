# Welcome to gatsby-source-google-spreadsheets 👋

[![Version](https://img.shields.io/npm/v/gatsby-source-google-spreadsheets.svg)](https://www.npmjs.com/package/gatsby-source-google-spreadsheets)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/butlerx/gatsby-source-google-spreadsheets/blob/master/LICENSE)
[![file structure: destiny](https://img.shields.io/badge/file%20structure-destiny-7a49ff?style=flat)](https://github.com/benawad/destiny)
[![Twitter: cianbutlerx](https://img.shields.io/twitter/follow/cianbutlerx.svg?style=social)](https://twitter.com/cianbutlerx)

> A source plugin for Gatsby that allows reading data from Google Sheets.

Forked from
[brandonmp/gatsby-source-google-sheets](https://github.com/brandonmp/gatsby-source-google-sheets)
to allow pulling the entire sheet as an objects and using public sheets

Why go through the hassle of setting up a complicated headless CMS when Google
Sheets already has user permissions, revision history, and a powerful UI?

This source plugin for [Gatsby JS](https://github.com/gatsbyjs/gatsby) will turn
any Google Sheets worksheet into a GraphQL type for build-time consumption.

### ✨ [Demo](https://beer.notthe.cloud)

## Install

```sh
yarn add gatsby-source-google-spreadsheets
```

## Usage

### Step 1: Set up your google project & enable the sheets API

1. Go to the [Google Developers Console](https://console.developers.google.com/)
1. Select your project or create a new one (and then select it)
1. Enable the Sheets API for your project
   - In the sidebar on the left, select **APIs & Services > Library**
   - Search for "sheets"
   - Click on "Google Sheets API"
   - click the blue "Enable" button

### Step 2: set up sheets/permissions

Next you need to decide if you wish to authenticate with a service account or an
API key.

1. Create a service account for your project
   - In the sidebar on the left, select **APIs & Services > Credentials**
   - Click blue "+ CREATE CREDENITALS" and select "Service account" option
   - Enter name, description, click "CREATE"
   - You can skip permissions, click "CONTINUE"
   - Click "+ CREATE KEY" button
   - Select the "JSON" key type option
   - Click "Create" button
   - your JSON key file is generated and downloaded to your machine (**it is the
     only copy!**)
   - click "DONE"
   - note your service account's email address (also available in the JSON key
     file)
1. Open your google sheet, click "File > Share..." and enter your service
   account's e-mail address (you can find it in the credentials file).

Or if you wish to use an API Key not only must the Spreadsheet in question be
visible to the web, but it must also have been explicitly published.

1. Create an API key for your project
   - In the sidebar on the left, select **Credentials**
   - Click blue "+ CREATE CREDENITALS" and select "API key" option
   - Copy the API key
1. OPTIONAL - click "Restrict key" on popup to set up restrictions
   - Click "API restrictions" > Restrict Key"
   - Check the "Google Sheets API" checkbox
   - Click "Save"
1. Open your google sheet, Click "File > Publish to the web" and Share entire
   sheet or specific worksheets.
1. Click "File > Share" and click "Get Shareable Link", the link should look
   like
   `https://docs.google.com/spreadsheets/d/$SPREADSHEET_ID/edit?usp=sharing`

### Step 2: configure your gatsby project

Standard source plugin installation.

```js
// gatsby-config.js
// ...
{
  resolve: 'gatsby-source-google-spreadsheets',
  options: {
    spreadsheetId: 'get this from the sheet url',
    apiKey: 'GOOGLE-API-KEY'
    // Or
    credentials: require('./path-to-credentials-file.json')
  }
},
// OR using environment variables
{
  resolve: 'gatsby-source-google-spreadsheets',
  options: {
    spreadsheetId: process.env.SPREADSHEET_ID,
    apiKey: process.env.GOOGLE_API_KEY,
    // OR
    credentials: {
      type: 'service_account',
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY.replace(/(\\r)|(\\n)/g, '\n'),
      client_email: process.env.CLIENT_EMAIL,
      client_id: '',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.PROJECT_ID}%40appspot.gserviceaccount.com`,
    },
  }
},
// ...
```

The plugin makes the following conversions before feeding Gatsby nodes:

1. Numbers are converted to numbers. Sheets formats numbers as comma-delineated
   strings, so to determine if something is a number, the plugin tests to see if
   the string (a) is non-empty and (b) is composed only of commas, decimals, and
   digits:

```
if (
    "value".replace(/[,\.\d]/g, "").length === 0
      && "value" !== ""
   ) {
    ...assume value is a number and handle accordingly
}
```

2. "TRUE"/"FALSE" converted to boolean true/false
3. empty cells ("" in sheets payload) converted to null
4. Column names are converted to camelcase

A few notes:

1. Not tested with cells of data type dates.
2. Google sheets mangles column names and converts them all to lower case. This
   plugin will convert them to camelcase, so the best convention here is to name
   your columns all lowercase with dashes. e.g. instead of "Column Name 1" or
   "columnName1", prefer "column-name-1"--this last one will be turned into
   "columnName1" in your GatsbyQL graph.

## Troubleshooting

1. If you get the error "No key or keyFile set", make sure you are using a
   Service Account API key and not a simple API key.
2. If you get the error "Cannot read property 'worksheets' of undefined", make
   sure you have shared your spreadsheet with your service account user.
3. If you encounter issues while fetching Spreadsheet data despite your data looks correct, ensure you don't have hidden Sheets in your document which can cause erros.

## Release Process

To Release a new version of the plugin

1. Bump the version in the `package.json` to the new version
2. Create a commit message with the pattern `Release 1.2.3` where `1.2.3` is the
   new version.
3. push to master

## Author

👤 **Cian Butler <butlerx@notthe.cloud>**

- Website: https://cianbutler.ie
- Twitter: [@cianbutlerx](https://twitter.com/cianbutlerx)
- Github: [@butlerx](https://github.com/butlerx)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check
[issues page](https://github.com/butlerx/gatsby-source-google-spreadsheets/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020
[Cian Butler <butlerx@notthe.cloud>](https://github.com/butlerc).

This project is
[MIT](https://github.com/butlerx/gatsby-source-google-spreadsheets/blob/master/LICENSE)
licensed.
