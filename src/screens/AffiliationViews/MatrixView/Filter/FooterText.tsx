import * as React from 'react';

import palette from 'aurora-frontend-react-komponenter/utils/palette';

const { skeColor } = palette;

interface IFooterTextProps {
  filter?: string;
}

const FooterText = ({ filter }: IFooterTextProps) => (
  <div
    style={{
      float: 'left',
      color: skeColor.lightGrey,
      fontSize: '16px',
      height: '40px',
      alignItems: 'center',
      display: 'flex'
    }}
  >
    {!!filter ? `Default filter: ${filter}` : 'Default filter ikke definert'}
  </div>
);

export default FooterText;
