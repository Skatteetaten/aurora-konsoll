import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';

interface IColProps {
  children: React.ReactNode;
  [key: string]: any;
}

const Col = ({ children, ...props }: IColProps) => (
  <Grid.Col noSpacing={true} {...props}>
    {children}
  </Grid.Col>
);

export default Col;
