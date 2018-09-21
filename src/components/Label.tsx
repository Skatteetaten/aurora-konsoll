import * as React from 'react';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import styled from 'styled-components';

interface ILabel {
  text: string;
  iconName?: string;
  color?: string;
  exists?: boolean;
  subText?: string;
  className?: string;
}

const getIconName = (exists: boolean) => {
  return exists ? 'Check' : 'Cancel';
};

const LabelBase = ({
  text,
  exists = false,
  subText,
  iconName,
  className
}: ILabel) => (
  <div className={className}>
    <h4 className="main-text">{text}</h4>
    {subText ? (
      <h4 className="sub-text">{subText}</h4>
    ) : (
      <Icon iconName={iconName || getIconName(exists)} />
    )}
  </div>
);

export default styled(LabelBase)`
  display: flex;
  border: 1px solid black;
  background: black;
  margin: 5px;
  align-items: center;
  height: 28px;

  h4 {
    padding: 5px 10px;
    margin: 0;
    white-space: nowrap;
  }

  .main-text {
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
    color: ${props => props.color || (props.exists ? '#70ffa8' : '#ff4949')};
  }
`;
