import { mount } from 'enzyme';
import * as React from 'react';

import { deploymentFactory } from 'testData/testDataBuilders';
import Row, { IApplicationMap } from './Row';
import Status from './Status';
import { MemoryRouter } from 'react-router';

describe('Row', () => {
  const createApplicationMap = (releaseToParam?: string): IApplicationMap => {
    return {
      app: deploymentFactory.buildList(1, {
        name: 'app',
        environment: 'dev',
        version: {
          auroraVersion: '1.2.3',
          deployTag: {
            name: 'version'
          },
          releaseTo: releaseToParam
        }
      })
    };
  };

  it('Given undefined releaseTo do not add text to tooltip', () => {
    const wrapper = mount(
      <MemoryRouter>
        <table>
          <tbody>
            <Row
              name="app"
              environments={['test', 'dev']}
              apps={createApplicationMap()}
              showSemanticVersion={false}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );
    const status = wrapper.find(Status);
    expect(status.props().title).toEqual('version');
  });

  it('Given releaseTo do add text to tooltip', () => {
    const wrapper = mount(
      <MemoryRouter>
        <table>
          <tbody>
            <Row
              name="app"
              environments={['test', 'dev']}
              apps={createApplicationMap('prod')}
              showSemanticVersion={false}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );

    const status = wrapper.find(Status);

    expect(status.props().title).toContain('prod');
  });

  it('Given showSemanticVersion is true, add a new line with semantic version', () => {
    const wrapper = mount(
      <MemoryRouter>
        <table>
          <tbody>
            <Row
              name="app"
              environments={['test', 'dev']}
              apps={createApplicationMap('prod')}
              showSemanticVersion={true}
            />
          </tbody>
        </table>
      </MemoryRouter>
    );

    const span = wrapper.find('span');
    const br = wrapper.find('br');
    expect(br.getElements().length).toBe(1);
    expect(span.text()).toContain('1.2.3');
  });
});
