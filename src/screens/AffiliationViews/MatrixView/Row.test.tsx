import { shallow } from 'enzyme';
import * as React from 'react';

import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { ImageTagType } from 'models/ImageTagType';
import Row, { IApplicationMap } from './Row';
import Status from './Status';

describe('Row', () => {
  const createApplicationMap = (releaseToParam?: string) => {
    const deployments: IApplicationDeployment[] = [
      {
        id: '',
        affiliation: '',
        name: '',
        environment: 'dev',
        status: {
          code: ''
        },
        version: {
          auroraVersion: '',
          deployTag: {
            name: 'version',
            type: ImageTagType.AURORA_SNAPSHOT_VERSION,
            lastModified: ''
          },
          releaseTo: releaseToParam
        },
        permission: {
          paas: {
            admin: true,
            view: true
          }
        },
        repository: '',
        time: ''
      }
    ];

    const app: IApplicationMap = {
      app: deployments
    };
    return app;
  };

  const linkBuilder = (_: IApplicationDeployment) => () => <div />;

  it('Given undefined releaseTo do not add text to tooltip', () => {
    const wrapper = shallow(
      <Row
        name="app"
        environments={['test', 'dev']}
        apps={createApplicationMap()}
        linkBuilder={linkBuilder}
      />
    );
    const status = wrapper.find(Status);
    expect(status.props().title).toEqual('version');
  });

  it('Given releaseTo do add text to tooltip', () => {
    const wrapper = shallow(
      <Row
        name="app"
        environments={['test', 'dev']}
        apps={createApplicationMap('prod')}
        linkBuilder={linkBuilder}
      />
    );

    const status = wrapper.find(Status);

    expect(status.props().title).toContain('prod');
  });
});
