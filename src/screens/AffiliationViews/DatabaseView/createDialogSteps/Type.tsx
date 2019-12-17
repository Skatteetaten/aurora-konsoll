import * as React from 'react';
import styled from 'styled-components';

import palette from '@skatteetaten/frontend-components/utils/palette';

import NavigationTile from '@skatteetaten/frontend-components/NavigationTile';
import NavigationContent from '@skatteetaten/frontend-components/NavigationTile/NavigationContent';
import { Step } from 'models/schemas';
import { ButtonLink } from 'components/ButtonLink';

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
      <NavigationTile className="styled-tile">
        <NavigationContent
          to={Step.NEW.toString()}
          heading="Nytt skjema"
          description="Oppretter et internt databaseskjema"
          icon="add"
          renderContent={renderContent}
        />
        <NavigationContent
          to={Step.EXTERNAL.toString()}
          heading="Eksternt skjema"
          description="Oppretter tilkoblingen for et eksternt databaseskjema"
          icon="openInNew"
          renderContent={renderContent}
        />
      </NavigationTile>
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
