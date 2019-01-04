import * as React from 'react';
import styled from 'styled-components';

import palette from 'aurora-frontend-react-komponenter/utils/palette';

const { skeColor } = palette;

interface IFooterTextProps {
  filter?: string;
  className?: string;
}

export const FooterText = ({ filter, className }: IFooterTextProps) => (
  <div className={className}>
    {!!filter ? `Standardvalg: ${filter}` : 'Standardvalg ikke definert'}
  </div>
);

const StyledFooterText = styled(FooterText)`
  float: left;
  color: ${skeColor.lightGrey};
  font-size: 16px;
  height: 40px;
  align-items: 'center';
  display: 'flex';
`;

export default StyledFooterText;
