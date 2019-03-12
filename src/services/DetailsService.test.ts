import { ImageTagType } from 'models/ImageTagType';
import {
  deploymentDetailsFactory,
  deploymentFactory,
  tagsPagedGroupFactory
} from 'testData/testDataBuilders';
import DetailsService from './DetailsService';

describe('DetailsService', () => {
  const detailsService = new DetailsService();

  describe('findTagTypeWithVersion', () => {
    it('Given version in aurora config as latest, return imageTagType as LATEST', () => {
      const result = detailsService.findTagTypeWithVersion(
        tagsPagedGroupFactory.build(),
        deploymentDetailsFactory.build()
      );
      expect(result).toEqual(ImageTagType.LATEST);
    });
  });

  describe('deployTag', () => {
    it('Given releaseTo is defined get version from aurora config', () => {
      const result = detailsService.deployTag(
        deploymentDetailsFactory.build({ deploymentSpec: { version: '0' } }),
        deploymentFactory.build({ version: { releaseTo: 'latest' } }),
        ImageTagType.MAJOR
      );
      expect(result.name).toEqual('0');
    });

    it('Given releaseTo is not defined get version from deployTag', () => {
      const result = detailsService.deployTag(
        deploymentDetailsFactory.build({ deploymentSpec: { version: '0' } }),
        deploymentFactory.build({ version: { releaseTo: undefined } }),
        ImageTagType.MAJOR
      );
      expect(result.name).toEqual('latest');
    });
  });
});
