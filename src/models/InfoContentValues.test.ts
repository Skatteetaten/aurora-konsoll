import { podFactory } from 'testData/testDataBuilders';

import { InfoContentValues } from './InfoContentValues';

describe('InfoContentValues', () => {
  describe('addFrom', () => {
    it('should add Phase, but not Health since its undefined', () => {
      const pod = podFactory.build();
      const infoContent = new InfoContentValues();
      infoContent.addFrom(pod, add => {
        add('phase', 'Phase');
        add('managementResponses', 'Health', m => m.health);
      });
      const values = infoContent.get();
      expect(values.Phase).toEqual('Down');
      expect(values.Health).toBeUndefined();
    });
  });
});
