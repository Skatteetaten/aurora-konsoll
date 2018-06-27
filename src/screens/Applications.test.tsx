import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Applications from 'screens/Applications';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Applications />, div);
  ReactDOM.unmountComponentAtNode(div);
});
