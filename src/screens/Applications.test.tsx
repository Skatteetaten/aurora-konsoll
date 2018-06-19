import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import * as ReactDOM from 'react-dom';
import Applications from 'screens/Applications';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MockedProvider mocks={[]}>
      <Applications />
    </MockedProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
