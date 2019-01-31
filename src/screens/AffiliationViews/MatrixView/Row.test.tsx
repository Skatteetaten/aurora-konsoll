import { shallow } from 'enzyme';
import * as React from 'react';

import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { deploymentFactory } from 'testData/testDataBuilders';
import Row, { IApplicationMap } from './Row';
import Status from './Status';

describe('Row', () => {
  const createApplicationMap = (releaseToParam?: string): IApplicationMap => {
    return {
      app: deploymentFactory.buildList(1, {
        name: 'app',
        environment: 'dev',
        version: {
          deployTag: {
            name: 'version'
          },
          releaseTo: releaseToParam
        }
      })
    };
  };

  const linkBuilder = (_: IApplicationDeployment) => () => <div />;

  it('Given undefined releaseTo do not add text to tooltip', () => {
    const wrapper = shallow(
      <Row
        name="app"
        environments={['test', 'dev']}
        apps={createApplicationMap()}
        linkBuilder={linkBuilder}
        showExactVersion={false}
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
        showExactVersion={false}
      />
    );

    const status = wrapper.find(Status);

    expect(status.props().title).toContain('prod');
  });
});
