import { SkeBasis } from '@skatteetaten/frontend-components/SkeBasis';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const { skeColor } = SkeBasis.PALETTE;

const TabLink = styled(NavLink)`
  display: block;
  padding: 15px 0 5px;
  text-align: center;
  font-size: 18px;
  background: ${skeColor.lightBlue};
  border-bottom: 3px solid ${skeColor.lightBlue};
  text-decoration: none;
  border-collapse: collapse;
  color: black;
  &:hover {
    border-bottom: 3px solid ${skeColor.blue50};
  }
`;

TabLink.defaultProps = {
  activeStyle: {
    borderBottom: `3px solid ${skeColor.blue}`,
  },
};

export const TabLinkWrapper = styled.div`
  display: flex;

  a {
    flex: 1;
  }
`;

export default TabLink;
