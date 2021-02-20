import fetchSheet from './fetchSheet';

const {
  CLIENT_EMAIL,
  CLIENT_ID,
  GOOGLE_API_KEY,
  PRIVATE_KEY,
  PRIVATE_KEY_ID,
  PROJECT_ID,
  SPREADSHEET_ID,
} = process.env;

const withAPIKey = GOOGLE_API_KEY ? it : it.skip;
if (withAPIKey == it.skip) {
  console.warn('GOOGLE_API_KEY is undefined, skipping authed tests');
}

const privateKey = CLIENT_EMAIL && PRIVATE_KEY_ID && PRIVATE_KEY && PROJECT_ID;
const withPrivateKey = privateKey ? it : it.skip;

if (withPrivateKey == it.skip) {
  console.warn(
    'CLIENT_EMAIL, PRIVATE_KEY, PRIVATE_KEY_ID or PROJECT_ID is undefined, skipping authed tests',
  );
}

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

describe('fetching remote sheet from google', () => {
  withAPIKey('public sheets require API credential', async () => {
    const sheet = await fetchSheet(SPREADSHEET_ID, undefined, GOOGLE_API_KEY);
    expect(sheet).toBeDefined();
    expect(sheet.id).toBeDefined();
    expect(sheet.inventory).toBeDefined();
  });

  it('No Auth throws exception', async () => {
    await expect(fetchSheet(SPREADSHEET_ID)).rejects.toThrow();
  });

  withPrivateKey('private sheets require credential', async () => {
    const credentials = {
      type: 'service_account',
      project_id: PROJECT_ID,
      private_key_id: PRIVATE_KEY_ID,
      private_key: PRIVATE_KEY.replace(/(\\r)|(\\n)/g, '\n'),
      client_email: CLIENT_EMAIL,
      client_id: CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
        CLIENT_EMAIL,
      )}`,
    };
    const sheet = await fetchSheet(SPREADSHEET_ID, credentials);
    expect(sheet).toBeDefined();
    expect(sheet.id).toBeDefined();
    expect(sheet.inventory).toBeDefined();
  });

  withAPIKey('undefineds on sheets to be correct', async () => {
    const sheet = await fetchSheet(
      '1QfQ-DvRe1O-w2t87AIA_XcQFgMEwylrVVeBetZW9plI',
      undefined,
      GOOGLE_API_KEY,
    );
    expect(sheet).toBeDefined();
    expect(sheet.id).toBeDefined();
  });
});
