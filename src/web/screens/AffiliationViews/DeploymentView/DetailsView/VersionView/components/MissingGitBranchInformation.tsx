import React from 'react';
import Callout from '@skatteetaten/frontend-components/Callout';
import CalloutButton from 'web/components/CalloutButton';

export const BranchInformation: React.FC<{
  gitReference: string | undefined;
  isBranchDeleted: boolean;
}> = ({ gitReference, isBranchDeleted }) => {
  return (
    <CalloutButton
      calloutProps={{
        color: isBranchDeleted ? Callout.ERROR : Callout.INFO,
        gapSpace: 8,
        beakWidth: 2,
        calloutWidth: '400px',
        directionalHint: Callout.POS_BOTTOM_CENTER,
      }}
      buttonProps={{
        icon: isBranchDeleted ? 'warning' : 'info',
        color: isBranchDeleted ? 'red' : 'blue',
      }}
      title={`Deployet med branch ${gitReference}`}
      content={
        <>
          {isBranchDeleted ? (
            <p>
              Applikasjonen har blitt deployet med en Aurora Config branch som
              er slettet. Løsning: Deploy applikasjonen med en annen branch som
              eksisterer, eller gjennopprett slettet branch.
            </p>
          ) : (
            <p>
              Applikasjonen vil deployes med Aurora Config branchen den ble
              deployet med så lenge det ikke endres manuelt i dialogen man får
              opp når man trykker på deploy.
            </p>
          )}
        </>
      }
    />
  );
};
