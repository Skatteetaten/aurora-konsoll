import styled from 'styled-components';

import { SkeBasis } from '@skatteetaten/frontend-components/SkeBasis';

const { skeColor } = SkeBasis.PALETTE;

const Card = styled.div`
  flex: 1;
  padding: 16px;
  overflow-x: hidden;
  height: 100%;
  background-color: ${skeColor.lightGreen};
`;

export default Card;
