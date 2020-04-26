import fetchSheet from './fetchSheet';

const { GOOGLE_API_KEY } = process.env;
const withAuth = GOOGLE_API_KEY ? it : it.skip;
if (withAuth == it.skip) {
  console.warn('GOOGLE_API_KEY is undefined, skipping authed tests');
}

describe('fetching remote sheet from google', () => {
  withAuth('public sheets require API credential', async () => {
    const sheet = await fetchSheet(
      '1UPOEWfYO_BpK_upTzsUyzsjO-buodyIYSuVvFhb_xc4',
      undefined,
      GOOGLE_API_KEY,
    );
    expect(sheet).toBeDefined();
    expect(sheet.id).toBeDefined();
    expect(sheet.inventory).toBeDefined();
  });

  it('No Auth throws exception', async () => {
    await expect(
      fetchSheet('1UPOEWfYO_BpK_upTzsUyzsjO-buodyIYSuVvFhb_xc4'),
    ).rejects.toThrow();
  });
});
