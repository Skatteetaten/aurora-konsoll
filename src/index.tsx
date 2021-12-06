/**
 * This file is just for local development with react-scripts. For Single-SPA
 * development, see: README.md
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { tokenStore } from 'web/services/TokenStore';
import Root from './root.component';

ReactDOM.render(
  <Root tokenStore={tokenStore} />,
  document.getElementById('root') as HTMLElement
);
