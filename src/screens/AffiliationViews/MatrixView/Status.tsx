import { IStatusColor, StatusCode, toStatusColor } from 'models/Status';
import styled, { css } from 'styled-components';

interface IStatusProps {
  code: StatusCode;
}

interface IStatusAttrs {
  statusColor?: IStatusColor;
}

const mapping = {
  statusColor: (props: IStatusProps) => toStatusColor(props.code)
};

const Status = styled<IStatusProps, 'td'>('td').attrs<IStatusAttrs>(mapping)`
  cursor: pointer;
  padding: 0;

  ${({ statusColor }) =>
    statusColor &&
    css`
      background: ${statusColor.base};
      &:hover {
        background: ${statusColor.hover};
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
