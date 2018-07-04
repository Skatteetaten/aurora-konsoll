import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MemoryRouter, withRouter } from 'react-router-dom';

import Applications from 'screens/Applications';

const ApplicationsWithRouter = withRouter(Applications);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <ApplicationsWithRouter
        affiliation="test"
        applications={[]}
        loading={false}
      />
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
