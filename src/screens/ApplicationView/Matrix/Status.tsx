import { css, default as styled } from 'styled-components';

const statusColors = {
  down: '#bb4f4f',
  downHover: '#c64040',
  healthy: '#4fbb82',
  healthyHover: '#40c67f',
  observe: '#bbad4f',
  observeHover: '#c7b53b',
  off: '#91919199',
  offHover: '#b9b5b599',
  unknown: '#4f8ebb',
  unknownHover: '#4086c6'
};

const Status = styled.td<{
  name: string;
}>`
  cursor: pointer;

  ${props => css`
    background: ${statusColors[props.name]};
    &:hover {
      background: ${statusColors[props.name + 'Hover']};
    }
  `};
`;

export default Status;
