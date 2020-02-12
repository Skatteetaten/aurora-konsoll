import styled from 'styled-components';

import palette from '@skatteetaten/frontend-components/utils/palette';

const { skeColor } = palette;

const Card = styled.div`
  flex: 1;
  padding: 16px;
  overflow-x: hidden;
  height: 100%;
  background-color: ${skeColor.lightGreen};
`;

export default Card;
