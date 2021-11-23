import PodsStatusService from './PodsStatusService';
import { iconLinkDataFactory, podFactory } from 'testData/testDataBuilders';
import { STATUS_COLORS } from 'web/models/Status';

describe('PodsStatusService', () => {
  const podsStatusService = new PodsStatusService();

  it('isHandleActive should equal true given href starts with http', () => {
    const isHandleActive = podsStatusService.handleIsActive(
      iconLinkDataFactory.build()
    );
    expect(isHandleActive).toEqual(true);
  });
  it('isHandleActive should equal false given href does not start withinclude http', () => {
    const isHandleActive = podsStatusService.handleIsActive(
      iconLinkDataFactory.build({ href: 'test.no' })
    );
    expect(isHandleActive).toEqual(false);
  });

  it('should return link given existing link with name app', () => {
    const link = podsStatusService.findLink(podFactory.build(), 'app');
    expect(link).toEqual('localhost/app');
  });

  it('should return hashicon given not existing link with name test', () => {
    const link = podsStatusService.findLink(podFactory.build(), 'test');
    expect(link).toEqual('#');
  });

  it('given empty health textResponse return info icon and unkown color', () => {
    const getIconAndColor = podsStatusService.getStatusColorAndIconForPod(
      podFactory.build()
    );
    expect(getIconAndColor).toEqual({
      icon: 'Info',
      color: STATUS_COLORS.unknown,
    } as { icon: string; color: string });
  });
  it('given empty health textResponse return Info icon and unkown color', () => {
    const getIconAndColor = podsStatusService.getStatusColorAndIconForPod(
      podFactory.build()
    );
    expect(getIconAndColor).toEqual({
      icon: 'Info',
      color: STATUS_COLORS.unknown,
    } as { icon: string; color: string });
  });

  it('given UP health textResponse return Completed icon and healthy color', () => {
    const getIconAndColor = podsStatusService.getStatusColorAndIconForPod(
      podFactory.build({
        managementResponses: {
          health: {
            hasResponse: true,
            textResponse: '{"status":"UP"}',
          },
        },
      })
    );

    expect(getIconAndColor).toEqual({
      icon: 'Completed',
      color: STATUS_COLORS.healthy,
    } as { icon: string; color: string });
  });

  it('given invalid JSON health textResponse return Info icon and unknown color', () => {
    const getIconAndColor = podsStatusService.getStatusColorAndIconForPod(
      podFactory.build({
        managementResponses: {
          health: {
            hasResponse: true,
            textResponse: 'Invalid JSON',
          },
        },
      })
    );

    expect(getIconAndColor).toEqual({
      icon: 'Info',
      color: STATUS_COLORS.unknown,
    } as { icon: string; color: string });
  });
});
