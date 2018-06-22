import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';

interface IRowProps {
  children: React.ReactNode;
}

const Row = ({ children }: IRowProps) => (
  <Grid.Row rowSpacing="0px">{children}</Grid.Row>
);

export default Row;
