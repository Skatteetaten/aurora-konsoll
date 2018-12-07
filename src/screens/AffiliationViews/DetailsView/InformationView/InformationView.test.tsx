import * as React from 'react';

import { render } from 'enzyme';

import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { ImageTagType } from 'models/ImageTagType';
import InformationView from './InformationView';

describe('InformationView', () => {
  const deploymentDetailsWithoutLatestDeployTag: IApplicationDeploymentDetails = {
    pods: [
      {
        latestDeployTag: true,
        name: 'martin-test-applikasjon-16-rmvrd',
        phase: 'Down',
        ready: true,
        restartCount: 1,
        startTime: '2018-12-04T13:05:50Z',
        deployTag: '',
        links: [
          {
            name: 'app',
            url: 'localhost/app'
          }
        ]
      },
      {
        latestDeployTag: false,
        name: 'martin-test-applikasjon-17-rmvrd',
        phase: 'Running',
        ready: true,
        restartCount: 1,
        startTime: '2018-12-04T13:05:50Z',
        deployTag: '',
        links: [
          {
            name: 'app',
            url: 'localhost/app'
          }
        ]
      },
      {
        latestDeployTag: false,
        name: 'martin-test-applikasjon-18-rmvrd',
        phase: 'Down',
        ready: true,
        restartCount: 1,
        startTime: '2018-12-04T13:05:50Z',
        deployTag: '',
        links: [
          {
            name: 'app',
            url: 'localhost/app'
          }
        ]
      }
    ]
  };

  const deploymentDetailsWithLatestDeployTag: IApplicationDeploymentDetails = {
    pods: [
      {
        latestDeployTag: true,
        name: 'martin-test-applikasjon-16-rmvrd',
        phase: 'Down',
        ready: true,
        restartCount: 1,
        startTime: '2018-12-04T13:05:50Z',
        deployTag: '',
        links: [
          {
            name: 'app',
            url: 'localhost/app'
          }
        ]
      },
      {
        latestDeployTag: true,
        name: 'martin-test-applikasjon-17-rmvrd',
        phase: 'Running',
        ready: true,
        restartCount: 1,
        startTime: '2018-12-04T13:05:50Z',
        deployTag: '',
        links: [
          {
            name: 'app',
            url: 'localhost/app'
          }
        ]
      }
    ]
  };

  const deployment: IApplicationDeployment = {
    id: 'c10010e594f229649437240f24f231343d62f8fa',
    affiliation: 'paas',
    environment: 'martin-dev',
    name: 'martin-test-applikasjon',
    repository: 'localhost/"martin-test-applikasjon',
    status: {
      code: 'OBSERVE',
      comment: 'POD_HEALTH_CHECK'
    },
    time: '2018-12-07T11:48:34.230Z',
    version: {
      auroraVersion: '2.0.14-b1.17.0-flange-8.181.1',
      deployTag: {
        lastModified: '',
        name: 'latest',
        type: ImageTagType.AURORA_VERSION
      },
      releaseTo: undefined
    },
    permission: {
      paas: {
        admin: false,
        view: true
      }
    }
  };

  const refreshApplicationDeployment = () => {
    return;
  };

  it('Given none of the pods has latestDeployTag=true and phase=Running, do display "er ikke siste versjon"', () => {
    const wrapper = render(
      <InformationView
        deployment={deployment}
        isFetchingDetails={false}
        isUpdating={false}
        refreshApplicationDeployment={refreshApplicationDeployment}
        deploymentDetails={deploymentDetailsWithoutLatestDeployTag}
      />
    );
    expect(wrapper.text()).toContain('er ikke siste versjon');
  });

  it('Given one of the pods has latestDeployTag=true and phase=Running, do not display "er ikke siste versjon"', () => {
    const wrapper = render(
      <InformationView
        deployment={deployment}
        isFetchingDetails={false}
        isUpdating={false}
        refreshApplicationDeployment={refreshApplicationDeployment}
        deploymentDetails={deploymentDetailsWithLatestDeployTag}
      />
    );
    expect(wrapper.text()).not.toContain('er ikke siste versjon');
  });
});
