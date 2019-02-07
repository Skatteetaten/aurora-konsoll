import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import { ICreateDatabaseSchemaInput } from 'models/schemas';
import New from './createDialogSteps/New';
import Type from './createDialogSteps/Type';

export enum Step {
  TYPE,
  NEW,
  EXTERNAL
}

interface IDatabaseSchemaCreateDialogProps {
  className?: string;
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) => void;
  createResponse: boolean;
}

interface IDatabaseSchemaCreateDialogState {
  isOpen: boolean;
  step: Step;
}

class DatabaseSchemaCreateDialog extends React.Component<
  IDatabaseSchemaCreateDialogProps,
  IDatabaseSchemaCreateDialogState
> {
  public state = {
    isOpen: false,
    step: Step.TYPE
  };

  public toggleDialog = (isOpen: boolean) => () => {
    this.setState({
      isOpen
    });
  };

  public handleLabelChange = (field: string) => (value: string) => {
    return;
  };

  public setStep = (newStep: string) => {
    this.setState({
      step: Number(newStep)
    });
  };

  public render() {
    const { className, onCreate } = this.props;
    const { isOpen, step } = this.state;

    const close = this.toggleDialog(false);
    const open = this.toggleDialog(true);

    const isNew = step === Step.NEW;
    const isType = step === Step.TYPE;

    return (
      <>
        <Button buttonType="primary" icon="AddOutline" onClick={open}>
          Nytt skjema
        </Button>
        <Dialog
          title={
            isType
              ? 'Velg skjematype'
              : isNew
              ? 'Nytt skjema'
              : 'Eksternt skjema'
          }
          hidden={!isOpen}
          dialogMinWidth="1000px"
          dialogMaxWidth="90%"
          dialogMinHeight="1000px"
          onDismiss={close}
        >
          <div className={className}>
            <div className="styled-dialog">
              {isType && <Type setStep={this.setStep} />}
              {isNew && <New onCreate={onCreate} />}
            </div>
          </div>
          <Dialog.Footer>{isNew && <Button>Opprett</Button>}</Dialog.Footer>
        </Dialog>
      </>
    );
  }
}

export default styled(DatabaseSchemaCreateDialog)`
  .styled-dialog {
    height: 400px;
  }
`;
