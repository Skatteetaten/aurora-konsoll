import * as React from 'react';

import Icon from 'aurora-frontend-react-komponenter/Icon';
import styled from 'styled-components';

interface ILabel {
  text: string;
  exists?: boolean;
  subText?: string;
  className?: string;
}

const getIconName = (exists: boolean) => {
  return exists ? 'Check' : 'Cancel';
};

const LabelBase = ({ text, exists = false, subText, className }: ILabel) => (
  <div className={className}>
    <h4 className="main-text">{text}</h4>
    {subText ? (
      <h4 className="sub-text">{subText}</h4>
    ) : (
      <Icon iconName={getIconName(exists)} />
    )}
  </div>
);

export const Label = styled(LabelBase)`
  display: flex;
  border: 1px solid black;
  /* border-radius: 6px; */
  background: black;
  margin: 5px;
  align-items: center;

  h4 {
    padding: 5px 10px;
    margin: 0;
    white-space: nowrap;
  }

  .main-text {
    color: black;
    background: #cde1f9;
    /* border-radius: 5px 0 0 5px; */
  }

  .sub-text {
    color: white;
    font-size: 14px;
  }

  i {
    padding: 5px;
    font-size: 18px;
    color: ${props => (props.exists ? '#70ffa8' : '#ff4949')};
  }
`;

class Home extends React.Component {
  public render() {
    return (
      <div>
        <Label text="Database" exists={true} />
        <Label text="Certificate" exists={false} />
        <Label text="Database" exists={true} />
        <Label text="Certificate" exists={false} />
        <Label text="Database" exists={true} />
        <Label text="Certificate" exists={false} />
      </div>
    );
  }
}

export default Home;
