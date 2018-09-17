import styled from 'styled-components';

export enum IndicatorColor {
  RED = 'linear-gradient(120deg, #ff0000, #ff0000)',
  GREEN = 'linear-gradient(120deg, #33cc33, #84e184)'
}

interface IIndicatorProps {
  color: IndicatorColor;
}

const Indicator = styled.div<IIndicatorProps>`
  margin: 0 0 -28px 30px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${props => props.color};
`;

export default Indicator;