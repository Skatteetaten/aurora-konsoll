import { ActionButton } from '@skatteetaten/frontend-components';
import InfoDialog from 'components/InfoDialog';
import React from 'react';
import {
  IChangeCooldownDatabaseSchemasResponse,
  IDatabaseSchema,
  IDatabaseSchemas,
} from 'models/schemas';
import { renderDetailsListWithSchemaInfo } from './Schema';
import ChangeCooldownSummary from './ChangeCooldownSummary';

interface IConfirmRestorationDialogProps {
  visible: boolean;
  title: string;
  changeCooldownType: string;
  schemasToChange: IDatabaseSchema[];
  hasChangeInformation: boolean;
  changeCooldownResponse: IChangeCooldownDatabaseSchemasResponse;
  items: IDatabaseSchemas;
  onOkClick: () => void;
  onCancelClick: () => void;
  onExitClick: () => void;
}

const ConfirmChangeCooldownDialog: React.FC<IConfirmRestorationDialogProps> = ({
  visible,
  title,
  changeCooldownType,
  schemasToChange,
  onOkClick,
  onCancelClick,
  onExitClick,
  hasChangeInformation,
  changeCooldownResponse,
  items,
}) => (
  <InfoDialog
    title={title}
    renderOpenDialogButton={dialogVisibilitySetter(visible)}
    renderFooterButtons={renderFooterButtons(
      onOkClick,
      onCancelClick,
      onExitClick,
      hasChangeInformation
    )}
    hideCloseButton={true}
    isBlocking={true}
    onDismiss={onCancelClick}
  >
    {!hasChangeInformation ? (
      <>
        {renderDetailsListWithSchemaInfo(schemasToChange)}
        <h4>
          {schemasToChange.length === 1
            ? `Vil du ${changeCooldownType} dette skjemaet?`
            : `Vil du ${changeCooldownType} disse ${schemasToChange.length} skjemaene?`}
        </h4>
      </>
    ) : (
      <ChangeCooldownSummary
        changeCooldownType={changeCooldownType}
        changeCooldownResponse={changeCooldownResponse}
        items={items}
      />
    )}
  </InfoDialog>
);

const renderFooterButtons = (
  onOkClick: () => void,
  onCancelClick: () => void,
  onExitClick: () => void,
  hasChangeCooldownInformation: boolean
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

    if (!hasChangeCooldownInformation) {
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

export default ConfirmChangeCooldownDialog;
