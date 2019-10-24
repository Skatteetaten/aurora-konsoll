import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import InfoDialog from 'components/InfoDialog';
import React, { useState } from 'react';
import { IDatabaseSchema } from 'models/schemas';
import { StyledPre } from 'components/StyledPre';
import { DetailsList } from 'office-ui-fabric-react';
import DatabaseSchemaService from 'services/DatabaseSchemaService';

interface IConfirmDeletionDialogProps {
  visible: boolean;
  title: string;
  isBlocking: boolean;
  schemasToDelete: IDatabaseSchema[];
  onOkClick: () => void;
  onCancelClick: () => void;
}

const ConfirmDeletionDialog: React.FC<IConfirmDeletionDialogProps> = props => {
  const {
    visible,
    title,
    isBlocking,
    schemasToDelete,
    onOkClick,
    onCancelClick
  } = props;
  const createConfirmationMessage = (schemaCount: number): string => {
    switch (schemaCount) {
      case 1:
        return `Vil du slette dette skjemaet?`;
      default:
        return `Vil du slette disse ${schemaCount} skjemaene?`;
    }
  };

  return (
    <InfoDialog
      title={title}
      renderOpenDialogButton={dialogVisibilitySetter(visible)}
      renderFooterButtons={renderFooterButtons(onOkClick, onCancelClick)}
      hideCloseButton={true}
      isBlocking={isBlocking}
    >
      <>
        <StyledPre>
          <DetailsList
            columns={DatabaseSchemaService.DELETION_COLUMNS}
            items={schemasToDelete.map(it => ({
              application: it.application,
              environment: it.environment,
              discriminator: it.discriminator
            }))}
          />
        </StyledPre>
        <h4>{createConfirmationMessage(schemasToDelete.length)}</h4>
      </>
    </InfoDialog>
  );
};

const renderFooterButtons = (
  onOkClick: () => void,
  onCancelClick: () => void
) => {
  return (close: () => void) => {
    const onOkClickInternal = () => {
      close();
      onOkClick();
    };
    const onCancelClickInternal = () => {
      close();
      onCancelClick();
    };
    return (
      <>
        <ActionButton
          onClick={onOkClickInternal}
          iconSize={ActionButton.LARGE}
          icon="Check"
          color="black"
        >
          Ja
        </ActionButton>
        <ActionButton
          onClick={onCancelClickInternal}
          iconSize={ActionButton.LARGE}
          icon="Cancel"
          color="black"
        >
          Nei
        </ActionButton>
      </>
    );
  };
};

const dialogVisibilitySetter = (visible: boolean) => {
  let isVisible: boolean = false;
  return (open: () => void) => {
    if (visible) {
      if (!isVisible) {
        setTimeout(() => {
          open();
        }, 1);
        isVisible = true;
      }
    } else {
      if (isVisible) {
        isVisible = false;
      }
    }
    return <span />;
  };
};

export default ConfirmDeletionDialog;
