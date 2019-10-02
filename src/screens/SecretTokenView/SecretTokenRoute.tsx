import * as React from 'react';
import { Route } from 'react-router-dom';
import { SecretTokenNavigation } from './SecretToken';

const SecretTokenRoute = () => (
  <Route path="/secret" component={SecretTokenNavigation} />
);

export { SecretTokenRoute };
