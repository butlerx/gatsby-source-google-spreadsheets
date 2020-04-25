import fetchSheet from './fetchSheet';

describe('fetching remote sheet from google', () => {
  it('public sheets require API credential', async () => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const sheet = await fetchSheet(
      '1UPOEWfYO_BpK_upTzsUyzsjO-buodyIYSuVvFhb_xc4',
      undefined,
      apiKey,
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
