import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import InfoDialog from 'components/InfoDialog';
import React from 'react';
import {
  IDatabaseSchema,
  IDeleteDatabaseSchemasResponse,
  IDatabaseSchemas
} from 'models/schemas';
import DeletionSummary from './DeletionSummary';
import { renderDetailsListWithSchemaInfo } from './Schema';

interface IConfirmDeletionDialogProps {
  visible: boolean;
  title: string;
  schemasToDelete: IDatabaseSchema[];
  hasDeletionInformation: boolean;
  deleteResponse: IDeleteDatabaseSchemasResponse;
  items: IDatabaseSchemas;
  onOkClick: () => void;
  onCancelClick: () => void;
  onExitClick: () => void;
}

const ConfirmDeletionDialog: React.FC<IConfirmDeletionDialogProps> = props => {
  const {
    visible,
    title,
    schemasToDelete,
    onOkClick,
    onCancelClick,
    onExitClick,
    hasDeletionInformation,
    deleteResponse,
    items
  } = props;
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
      renderFooterButtons={renderFooterButtons(
        onOkClick,
        onCancelClick,
        onExitClick,
        hasDeletionInformation
      )}
      hideCloseButton={true}
      isBlocking={true}
    >
      <>
        {!hasDeletionInformation ? (
          <>
            {renderDetailsListWithSchemaInfo(schemasToDelete)}
            <h4>{createConfirmationMessage(schemasToDelete.length)}</h4>
          </>
        ) : (
          <DeletionSummary deleteResponse={deleteResponse} items={items} />
        )}
      </>
    </InfoDialog>
  );
};

const renderFooterButtons = (
  onOkClick: () => void,
  onCancelClick: () => void,
  onExitClick: () => void,
  hasDeletionInformation: boolean
) => {
  return (close: () => void) => {
    const onOkClickInternal = () => {
      onOkClick();
    };
    const onCancelClickInternal = () => {
      close();
      onCancelClick();
    };

    const onExitClickInternal = () => {
      onCancelClickInternal();
      onExitClick();
    };

    if (!hasDeletionInformation) {
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
    } else {
      return (
        <ActionButton
          onClick={onExitClickInternal}
          iconSize={ActionButton.LARGE}
          icon="Completed"
          color="black"
        >
          Avslutt
        </ActionButton>
      );
    }
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
    }
    return <span />;
  };
};

export default ConfirmDeletionDialog;
