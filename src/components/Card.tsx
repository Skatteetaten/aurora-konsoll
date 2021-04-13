import styled from 'styled-components';

import { Palette } from '@skatteetaten/frontend-components';

const { skeColor } = Palette;

const Card = styled.div`
  flex: 1;
  padding: 16px;
  overflow-x: hidden;
  height: 100%;
  background-color: ${skeColor.lightGreen};
`;

export default Card;
