import * as React from 'react';

import { shallow } from 'enzyme';

import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { ImageTagType } from 'models/ImageTagType';
import InformationView from './InformationView';

import { IDeploymentSpec, IMount } from 'models/DeploymentSpec';

describe('InformationView', () => {
  const mounts: IMount = {
    exist: true,
    mountName: 'name',
    path: '/',
    type: 'mount',
    volumeName: 'volume'
  };

  let deploymentSpec: IDeploymentSpec = {
    version: 'latest',
    affiliation: 'paas',
    alarm: true,
    applicationDeploymentRef: 'martin-dev/martin-test-applikasjon',
    applicationId: 'martin-dev/martin-test-applikasjon',
    applicationPlatform: 'java',
    artifactId: 'openshift-reference-springboot-server',
    certificate: true,
    cluster: 'utv',
    configVersion: 'master',
    config: { config: 'config' },
    serviceAccount: '',
    mounts: { mounts },
    database: true,
    secretVault: 'secret',
    debug: false,
    deployStrategy: { type: 'rolling', timeout: 180 },
    envName: 'martin-dev',
    groupId: 'openshift',
    liveness: { port: 8080, delay: 10, timeout: 1 },
    management: { path: '', port: '8081' },
    name: 'martin-test-applikasjon',
    pause: false,
    permissions: { admin: 'test' },
    prometheus: { path: '/test', port: 8081 },
    readiness: { port: 8080, delay: 10, timeout: 1 },
    replicas: 1,
    resources: {
      cpu: {
        max: '2000m',
        min: '10m'
      },
      memory: {
        max: '512Mi',
        min: '128Mi'
      }
    },
    route: { route: 'route' },
    routeDefaults: { host: 'test' },
    schemaVersion: 'v1',
    splunkIndex: 'openshift-test',
    toxiproxy: { version: '2.1.3' },
    type: 'deploy',
    webseal: false
  };

  const deploymentDetailsWithoutLatestDeployTag: IApplicationDeploymentDetails = {
    deploymentSpec,
    pods: [
      {
        latestDeployTag: true,
        name: 'martin-test-applikasjon-16-rmvrd',
        phase: 'Down',
        ready: true,
        restartCount: 1,
        startTime: '2018-12-04T13:05:50Z',
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
    deploymentSpec,
    pods: [
      {
        latestDeployTag: true,
        name: 'martin-test-applikasjon-16-rmvrd',
        phase: 'Down',
        ready: true,
        restartCount: 1,
        startTime: '2018-12-04T13:05:50Z',
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
        links: [
          {
            name: 'app',
            url: 'localhost/app'
          }
        ]
      }
    ]
  };

  deploymentSpec = {
    version: 'BUGFIX',
    affiliation: 'paas',
    alarm: true,
    applicationDeploymentRef: 'martin-dev/martin-test-applikasjon',
    applicationId: 'martin-dev/martin-test-applikasjon',
    applicationPlatform: 'java',
    artifactId: 'openshift-reference-springboot-server',
    certificate: true,
    cluster: 'utv',
    configVersion: 'master',
    config: { config: 'config' },
    serviceAccount: '',
    mounts: { mounts },
    database: true,
    secretVault: 'secret',
    debug: false,
    deployStrategy: { type: 'rolling', timeout: 180 },
    envName: 'martin-dev',
    groupId: 'openshift',
    liveness: { port: 8080, delay: 10, timeout: 1 },
    management: { path: '', port: '8081' },
    name: 'martin-test-applikasjon',
    pause: false,
    permissions: { admin: 'test' },
    prometheus: { path: '/test', port: 8081 },
    readiness: { port: 8080, delay: 10, timeout: 1 },
    replicas: 1,
    resources: {
      cpu: {
        max: '2000m',
        min: '10m'
      },
      memory: {
        max: '512Mi',
        min: '128Mi'
      }
    },
    route: { route: 'route' },
    routeDefaults: { host: 'test' },
    schemaVersion: 'v1',
    splunkIndex: 'openshift-test',
    toxiproxy: { version: '2.1.3' },
    type: 'deploy',
    webseal: false
  };

  const deploymentDetailsWithWrongVersionInDeploymentSpec: IApplicationDeploymentDetails = {
    deploymentSpec,
    pods: [
      {
        latestDeployTag: true,
        name: 'martin-test-applikasjon-16-rmvrd',
        phase: 'Down',
        ready: true,
        restartCount: 1,
        startTime: '2018-12-04T13:05:50Z',
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

  describe('AreAnyPodsRunningWithLatestDeployTag', () => {
    it('Given none of the pods have latestDeployTag=true and phase=Running, do display warning message', () => {
      const wrapper = shallow(
        <InformationView
          deployment={deployment}
          isFetchingDetails={false}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
          deploymentDetails={deploymentDetailsWithoutLatestDeployTag}
        />
      );
      expect(wrapper.html()).toContain(
        '• Det finnes et nyere image for denne taggen tilgjengelig på Docker Registry'
      );
      expect(wrapper.html()).not.toContain(
        '• Aktivt deploy sin tag stemmer ikke overens med Aurora Config. Deploy på nytt.'
      );
    });

    it('Given one of the pods have latestDeployTag=true and phase=Running, do not display warning message', () => {
      const wrapper = shallow(
        <InformationView
          deployment={deployment}
          isFetchingDetails={false}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
          deploymentDetails={deploymentDetailsWithLatestDeployTag}
        />
      );
      expect(wrapper.html()).not.toContain(
        '• Det finnes et nyere image for denne taggen tilgjengelig på Docker Registry'
      );
      expect(wrapper.html()).not.toContain(
        '• Aktivt deploy sin tag stemmer ikke overens med Aurora Config. Deploy på nytt.'
      );
    });
  });
  describe('isActiveTagSameAsAuroraConfigTag', () => {
    it('Given is latestDeploytag and Aurora Configs version is differnt from active Deployment version, do display warning message', () => {
      const wrapper = shallow(
        <InformationView
          deployment={deployment}
          isFetchingDetails={false}
          isUpdating={false}
          refreshApplicationDeployment={refreshApplicationDeployment}
          deploymentDetails={deploymentDetailsWithWrongVersionInDeploymentSpec}
        />
      );
      expect(wrapper.html()).toContain(
        '• Aktivt deploy sin tag stemmer ikke overens med Aurora Config. Deploy på nytt.'
      );
      expect(wrapper.html()).not.toContain(
        '• Det finnes et nyere image for denne taggen tilgjengelig på Docker Registry'
      );
    });
  });
});
