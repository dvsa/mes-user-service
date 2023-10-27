describe('Integration test', () => {
  const baseUrl = 'http://localhost:3000/dev/users';

  beforeAll(() => {
    process.env.IS_OFFLINE = 'true';
  });

  it('should respond 200 for a user that exists', async () => {
    try {
      const response = await fetch(`${baseUrl}/1234567`);
      expect(response.status).toEqual(200);
      expect(await response.json()).toEqual({});
    } catch (err) {
      throw err;
    }
  });

  it('should respond 404 for a user that does not exist', async () => {
    try {
      const response = await fetch(`${baseUrl}/0000000`);
      expect(response.status).toEqual(404);
    } catch (err) {
      throw err;
    }
  });
});
