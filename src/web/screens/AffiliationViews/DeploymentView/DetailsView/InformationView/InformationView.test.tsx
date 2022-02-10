import * as React from 'react';

import Tooltip from 'web/components/IconWithTooltip';
import InfoContent from 'web/components/InfoContent';
import { DetailsList } from '@skatteetaten/frontend-components/DetailsList';

import { mount } from 'enzyme';

import { deploymentFactory } from 'web/testData/testDataBuilders';

import InformationView from './InformationView';
import { IPodsStatus } from 'web/models/Pod';
import { VersionStatus } from '../models/VersionStatus';

describe('InformationView', () => {
  const refreshApplicationDeployment = () => {
    return;
  };

  describe('AreAnyPodsRunningWithLatestDeployTag', () => {
    it('Given startTime is not defined, should display startedDate as a dash', () => {
      const deployment = deploymentFactory.build();
      deployment.details.pods = deployment.details.pods.map((pod) => ({
        ...pod,
        startTime: undefined,
      }));
      const wrapper = mount(
        <InformationView
          goToDeploymentsPage={() => {}}
          deleteApplicationDeployment={() => {}}
          versionStatus={VersionStatus.OK}
          deployment={deployment}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
        />
      );
      const items: IPodsStatus[] = wrapper
        .find(DetailsList)
        .first()
        .prop('items');
      expect(items[0]).toMatchObject({ startedDate: '-' });
    });

    it('Given none of the pods have latestDeployTag=true and phase=Running, do display warning message', () => {
      const wrapper = mount(
        <InformationView
          goToDeploymentsPage={() => {}}
          deleteApplicationDeployment={() => {}}
          versionStatus={VersionStatus.IS_NOT_LATEST}
          deployment={deploymentFactory.build()}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
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
          goToDeploymentsPage={() => {}}
          deleteApplicationDeployment={() => {}}
          versionStatus={VersionStatus.OK}
          deployment={deploymentFactory.build()}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
        />
      );
      const tooltip = wrapper.find(Tooltip);
      expect(tooltip).toHaveLength(0);
    });
  });
  describe('isActiveTagSameAsAuroraConfigTag', () => {
    it('Given different version for active deployment and AuroraConfig, show warning message', () => {
      const wrapper = mount(
        <InformationView
          goToDeploymentsPage={() => {}}
          deleteApplicationDeployment={() => {}}
          versionStatus={VersionStatus.DIFFER_FROM_AURORA_CONFIG}
          deployment={deploymentFactory.build({
            version: {
              deployTag: {
                name: 'BUGFIX',
              },
            },
          })}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
        />
      );
      const tooltip = wrapper.find(Tooltip);
      expect(tooltip).toHaveLength(1);
      expect(tooltip.props().content).toContain(
        'Aktivt deploy sin tag stemmer ikke overens med Aurora Config. Deploy på nytt.'
      );
      expect(tooltip.props().content).not.toContain(
        'Det finnes et nyere image for denne taggen tilgjengelig på Docker Registry'
      );
    });
  });
  describe('ifMessageIsSetShowIt', () => {
    it('Given an application with a message, show it in active deployment', () => {
      const message = 'May the force be with you!';
      const wrapper = mount(
        <InformationView
          goToDeploymentsPage={() => {}}
          deleteApplicationDeployment={() => {}}
          versionStatus={VersionStatus.OK}
          deployment={deploymentFactory.build({
            message,
          })}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
        />
      );
      const info = wrapper.find(InfoContent).find('div#active-deployment');
      expect(info.html()).toContain(message);
      expect(info.html()).toContain('linus');
    });
  });
});
