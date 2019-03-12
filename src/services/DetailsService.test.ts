import { ImageTagType } from 'models/ImageTagType';
import {
  deploymentDetailsFactory,
  tagsPagedGroupFactory
} from 'testData/testDataBuilders';
import DetailsService from './DetailsService';

describe('DetailsService', () => {
  const detailsService = new DetailsService();

  describe('findTagTypeWithVersion', () => {
    it('Given version in aurora config as latest, return imageTagType as LATEST', () => {
      const result = detailsService.findTagForDeploymentSpec(
        tagsPagedGroupFactory.build(),
        deploymentDetailsFactory.build().deploymentSpec
      );
      expect(result!!.type).toEqual(ImageTagType.LATEST);
    });
  });
});
