import { StatusCode, toStatusColor } from 'web/models/Status';
import styled, { css } from 'styled-components';

interface IStatusProps {
  code: StatusCode;
}

const Status = styled.td<IStatusProps>`
  cursor: pointer;
  padding: 0;

  ${({ code }) =>
    css`
      background: ${toStatusColor(code).base};
      &:hover {
        background: ${toStatusColor(code).hover};
      }
    `};

  a {
    display: block;
    color: black;
    text-decoration: none;
    padding: 15px 10px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default Status;
