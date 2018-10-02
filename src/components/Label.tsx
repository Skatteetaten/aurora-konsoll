import * as React from 'react';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import styled from 'styled-components';

export interface ILabelProps<T> {
  data?: T;
  text: string;
  iconName?: string;
  color?: string;
  exists?: boolean;
  subText?: string;
  className?: string;
  children?: (data: T) => JSX.Element;
}

const getIconName = (exists: boolean) => {
  return exists ? 'Check' : 'Info';
};

export default function Label<T>({
  data,
  text,
  exists = false,
  subText,
  iconName,
  children
}: ILabelProps<T>) {
  return (
    <LabelWrapper exists={exists || !!data}>
      <span className="label-bar">
        <h4 className="main-text">{text}</h4>
        {subText ? (
          <h4 className="sub-text">{subText}</h4>
        ) : (
          <Icon iconName={iconName || getIconName(exists || !!data)} />
        )}
      </span>
      {children &&
        data && <div className="label-content">{children(data)}</div>}
    </LabelWrapper>
  );
}

const LabelWrapper = styled.div<{ exists: boolean }>`
  margin: 5px;

  .label-content {
    border: 1px solid black;
    border-top: none;
    background-color: white;

    p {
      padding: 5px;
      margin: 0;
    }
  }

  .label-bar {
    border: 1px solid black;
    display: flex;
    align-items: center;
    background: black;
    line-height: 16px;

    h4 {
      padding: 5px 10px;
      margin: 0;
      white-space: nowrap;
    }

    .main-text {
      flex: 1;
      color: black;
      background: #cde1f9;
    }

    .sub-text {
      color: white;
      font-size: 14px;
    }

    i {
      padding: 5px;
      font-size: 18px;
      color: ${props => props.color || (props.exists ? '#70ffa8' : '#ffffff')};
    }
  }
`;
