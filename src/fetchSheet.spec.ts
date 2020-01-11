import fetchSheet from './fetchSheet';

describe('fetching remote sheet from google', () => {
  it('public sheets dont require credential', async () => {
    const sheet = await fetchSheet(
      '1UPOEWfYO_BpK_upTzsUyzsjO-buodyIYSuVvFhb_xc4',
    );
    expect(sheet).toBeDefined();
    expect(sheet.id).toBeDefined();
    expect(sheet.inventory).toBeDefined();
  });
});
