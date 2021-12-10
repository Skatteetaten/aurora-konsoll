import * as React from 'react';
import styled from 'styled-components';

import { Palette } from '@skatteetaten/frontend-components';

const { skeColor } = Palette;

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
  position: relative;
  top: 8px;
`;

export default StyledFooterText;
