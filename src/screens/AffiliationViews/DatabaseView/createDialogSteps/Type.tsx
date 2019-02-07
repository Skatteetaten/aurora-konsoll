import * as React from 'react';
import styled from 'styled-components';

import NavigationTile from 'aurora-frontend-react-komponenter/NavigationTile';

enum Step {
  TYPE,
  NEW,
  EXTERNAL
}

const contents = [
  {
    to: Step.NEW.toString(),
    title: 'Nytt skjema',
    description: 'Oppretter et internt databaseskjema',
    icon: 'add'
  },
  {
    to: Step.EXTERNAL.toString(),
    title: 'Eksternt skjema',
    description: 'Oppretter tilkoblingen for et eksternt databaseskjema',
    icon: 'openInNew'
  }
];

interface ITypeProps {
  setStep: (step: string) => void;
  className?: string;
}

const Type = ({ setStep, className }: ITypeProps) => {
  const renderContent = (to: string, content: JSX.Element) => {
    const handleStepChange = () => {
      setStep(to);
    };
    return <a onClick={handleStepChange}>{content}</a>;
  };

  return (
    <div className={className}>
      <NavigationTile
        contents={contents}
        className="centring"
        renderContent={renderContent}
      />
    </div>
  );
};

export default styled(Type)`
  .centring {
    padding-top: 100px;
    ul li {
      cursor: pointer;
    }
  }
`;
