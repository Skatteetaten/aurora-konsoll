import * as React from 'react';

import Tooltip from 'components/IconWithTooltip';
import { mount } from 'enzyme';

import {
  deploymentDetailsFactory,
  deploymentFactory,
  deploymentSpecFactory,
  podFactory
} from 'testData/testDataBuilders';

import InformationView from './InformationView';

describe('InformationView', () => {
  const downPod = podFactory.build({ phase: 'Down', latestDeployTag: true });
  const runningLatestPod = podFactory.build({
    phase: 'Running',
    latestDeployTag: true
  });
  const runningNotLatestPod = podFactory.build({
    phase: 'Running',
    latestDeployTag: false
  });

  const refreshApplicationDeployment = () => {
    return;
  };

  describe('AreAnyPodsRunningWithLatestDeployTag', () => {
    it('Given none of the pods have latestDeployTag=true and phase=Running, do display warning message', () => {
      const wrapper = mount(
        <InformationView
          deployment={deploymentFactory.build()}
          isFetchingDetails={false}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
          deploymentDetails={deploymentDetailsFactory.build({
            pods: [downPod, runningNotLatestPod],
            deploymentSpec: deploymentSpecFactory.build()
          })}
        />
      );
      const tooltip = wrapper.find(Tooltip);

      expect(tooltip).toHaveLength(1);
      expect(tooltip.props().content).toContain(
        'Det finnes et nyere image for denne taggen tilgjengelig på Docker Registry'
      );
      expect(tooltip.props().content).not.toContain(
        'Aktivt deploy sin tag stemmer ikke overens med Aurora Config. Deploy på nytt.'
      );
    });
    it('Given one of the pods have latestDeployTag=true and phase=Running, do not display tooltip', () => {
      const wrapper = mount(
        <InformationView
          deployment={deploymentFactory.build()}
          isFetchingDetails={false}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
          deploymentDetails={deploymentDetailsFactory.build({
            pods: [downPod, runningLatestPod],
            deploymentSpec: deploymentSpecFactory.build()
          })}
        />
      );
      const tooltip = wrapper.find(Tooltip);
      expect(tooltip).toHaveLength(0);
    });
  });
  describe('isActiveTagSameAsAuroraConfigTag', () => {
    it('Given one of the pods have latestDeployTag=true and phase=Running, do not display warning message', () => {
      const wrapper = mount(
        <InformationView
          deployment={deploymentFactory.build({
            version: {
              deployTag: {
                name: 'BUGFIX'
              }
            }
          })}
          isFetchingDetails={false}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
          deploymentDetails={deploymentDetailsFactory.build({
            pods: [downPod, runningLatestPod],
            deploymentSpec: deploymentSpecFactory.build()
          })}
        />
      );
      const tooltip = wrapper.find(Tooltip);
      expect(tooltip.props().content).toContain(
        'Aktivt deploy sin tag stemmer ikke overens med Aurora Config. Deploy på nytt.'
      );
      expect(tooltip.props().content).not.toContain(
        'Det finnes et nyere image for denne taggen tilgjengelig på Docker Registry'
      );
    });
  });
});
