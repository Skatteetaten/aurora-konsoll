import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import InfoDialog from 'components/InfoDialog';
import React from 'react';
import {
  IChangeCooldownDatabaseSchemasResponse,
  IRestorableDatabaseSchemas,
  IRestorableDatabaseSchemaData,
} from 'models/schemas';
import { renderDetailsListWithSchemaInfo } from './RestorableSchema';
import RestorationSummary from './RestorationSummary';

interface IConfirmRestorationDialogProps {
  visible: boolean;
  title: string;
  schemasToRestore: IRestorableDatabaseSchemaData[];
  hasRestorationInformation: boolean;
  restoreResponse: IChangeCooldownDatabaseSchemasResponse;
  items: IRestorableDatabaseSchemas;
  onOkClick: () => void;
  onCancelClick: () => void;
  onExitClick: () => void;
}

const ConfirmRestorationDialog: React.FC<IConfirmRestorationDialogProps> = (
  props
) => {
  const {
    visible,
    title,
    schemasToRestore,
    onOkClick,
    onCancelClick,
    onExitClick,
    hasRestorationInformation,
    restoreResponse,
    items,
  } = props;
  const createConfirmationMessage = (schemaCount: number): string => {
    if (schemaCount === 1) {
      return `Vil du gjenopprette dette skjemaet?`;
    } else {
      return `Vil du gjenopprette disse ${schemaCount} skjemaene?`;
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
        hasRestorationInformation
      )}
      hideCloseButton={true}
      isBlocking={true}
    >
      <>
        {!hasRestorationInformation ? (
          <>
            {renderDetailsListWithSchemaInfo(schemasToRestore)}
            <h4>{createConfirmationMessage(schemasToRestore.length)}</h4>
          </>
        ) : (
          <RestorationSummary restoreResponse={restoreResponse} items={items} />
        )}
      </>
    </InfoDialog>
  );
};

const renderFooterButtons = (
  onOkClick: () => void,
  onCancelClick: () => void,
  onExitClick: () => void,
  hasRestorationInformation: boolean
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

    if (!hasRestorationInformation) {
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

export default ConfirmRestorationDialog;
