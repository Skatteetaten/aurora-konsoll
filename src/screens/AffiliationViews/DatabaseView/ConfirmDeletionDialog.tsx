import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import InfoDialog from 'components/InfoDialog';
import React from 'react';
import { IDatabaseSchema } from 'models/schemas';
import { StyledPre } from 'components/StyledPre';
import { DetailsList } from 'office-ui-fabric-react';

interface IConfirmDeletionDialogProps {
  visible: boolean;
  title: string;
  schemasToDelete: IDatabaseSchema[];
  onOkClick: () => void;
  onCancelClick: () => void;
}

const ConfirmDeletionDialog: React.FC<IConfirmDeletionDialogProps> = props => {
  const { visible, title, schemasToDelete, onOkClick, onCancelClick } = props;
  const createConfirmationMessage = (schemaCount: number): string => {
    if (schemaCount === 1) {
      return `Vil du slette dette skjemaet?`;
    } else {
      return `Vil du slette disse ${schemaCount} skjemaene?`;
    }
  };

  return (
    <InfoDialog
      title={title}
      renderOpenDialogButton={dialogVisibilitySetter(visible)}
      renderFooterButtons={renderFooterButtons(onOkClick, onCancelClick)}
      hideCloseButton={true}
      isBlocking={true}
    >
      <>
        <StyledPre>
          <DetailsList
            columns={[
              {
                key: 'column1',
                name: 'Applikasjon',
                fieldName: 'application',
                minWidth: 200,
                maxWidth: 200,
                isResizable: true
              },
              {
                key: 'column2',
                name: 'Miljø',
                fieldName: 'environment',
                minWidth: 200,
                maxWidth: 200,
                isResizable: true
              },
              {
                key: 'column3',
                name: 'Diskriminator',
                fieldName: 'discriminator',
                minWidth: 200,
                maxWidth: 200,
                isResizable: true
              }
            ]}
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

const dialogVisibilitySetter = (shouldBeVisible: boolean) => {
  let isVisible: boolean = false;
  return (open: () => void) => {
    if (shouldBeVisible && !isVisible) {
      setTimeout(() => {
        open();
      }, 1);
      isVisible = true;
    } else if (!shouldBeVisible && isVisible) {
      isVisible = false;
    }
    return <span />;
  };
};

export default ConfirmDeletionDialog;
