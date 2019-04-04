import WebsealService from './WebsealService';

describe('WebsealService', () => {
  const websealService = new WebsealService();

  describe('addProperties', () => {
    it('should convert object to have two properties', () => {
      const object = [
        { key: 'activeWorkerThreads', value: '1' },
        { key: 'hostname', value: 'test.com' }
      ];

      const newObject = websealService.addProperties({
        activeWorkerThreads: '1',
        hostname: 'test.com'
      });
      expect(newObject).toEqual(object);
    });
  });
});
