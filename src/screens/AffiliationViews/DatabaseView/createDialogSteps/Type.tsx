import * as React from 'react';
import styled from 'styled-components';

import palette from 'aurora-frontend-react-komponenter/utils/palette';

import NavigationTile from 'aurora-frontend-react-komponenter/NavigationTile';
import { Step } from 'models/schemas';
import { ButtonLink } from 'components/ButtonLink';

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
  setStep: (step: Step) => void;
  className?: string;
}

const Type = ({ setStep, className }: ITypeProps) => {
  const renderContent = (to: string, content: JSX.Element) => {
    const handleStepChange = () => {
      setStep(Number(to));
    };
    return <ButtonLink onClick={handleStepChange}>{content}</ButtonLink>;
  };

  return (
    <div className={className}>
      <NavigationTile
        contents={contents}
        className="styled-tile"
        renderContent={renderContent}
      />
    </div>
  );
};

export default styled(Type)`
  button {
    padding: 0 16px 16px 16px;
    width: 100%;
  }

  button:hover {
    background-color: ${palette.skeColor.lightBlue};
  }

  .styled-tile {
    padding-top: 100px;
    ul li {
      cursor: pointer;
    }
  }
`;
