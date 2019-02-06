import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import TabLink, { TabLinkWrapper } from 'components/TabLink';
import { ICreateDatabaseSchemaInput } from 'models/schemas';

interface IDatabaseSchemaCreateDialogProps {
  className?: string;
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) => void;
  createResponse: boolean;
}

interface IDatabaseSchemaCreateDialogState {
  isOpen: boolean;
}

class DatabaseSchemaCreateDialog extends React.Component<
  IDatabaseSchemaCreateDialogProps,
  IDatabaseSchemaCreateDialogState
> {
  public state = {
    isOpen: false
  };

  public create = () => {
    const { onCreate } = this.props;
    const newSchema: ICreateDatabaseSchemaInput = {
      affiliation: 'paas',
      application: 'martin-dev2',
      description: 'dette fungerer!!',
      discriminator: 'ny-db',
      environment: 'martin-env2',
      userId: 'm79861',
      jdbcUser: {
        jdbcUrl: 'localhost',
        password: 'password',
        username: 'username'
      }
    };
    onCreate(newSchema);
  };

  public toggleDialog = (isOpen: boolean) => () => {
    this.setState({
      isOpen
    });
  };

  public render() {
    const { className } = this.props;
    const { isOpen } = this.state;

    const close = this.toggleDialog(false);
    const open = this.toggleDialog(true);
    return (
      <div className={className}>
        <Button buttonType="primary" icon="AddOutline" onClick={open}>
          Nytt skjema
        </Button>
        <Dialog
          hidden={!isOpen}
          dialogMinWidth="1000px"
          dialogMaxWidth="90%"
          onDismiss={close}
        >
          <TabLinkWrapper>
            <TabLink to={`/databaseSchemas/create/type`}>
              Velg skjematype
            </TabLink>
            <TabLink to={`/databaseSchemas/create/labels`}>Sett labels</TabLink>
          </TabLinkWrapper>
          <Dialog.Footer>
            <Button buttonType="primary" icon="AddOutline" onClick={open}>
              Nytt skjema
            </Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}

export default styled(DatabaseSchemaCreateDialog)``;
