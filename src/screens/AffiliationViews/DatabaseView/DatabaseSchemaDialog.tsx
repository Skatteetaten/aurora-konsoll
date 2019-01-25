import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import { IDatabaseSchema } from 'models/schemas';
import * as React from 'react';

export interface IDatabaseSchemaDialogProps {
  schema: IDatabaseSchema;
}

export interface IDatabaseSchemaDialogState {
  isOpen: boolean;
}

export default class DatabaseSchemaDialog extends React.Component<IDatabaseSchemaDialogProps, IDatabaseSchemaDialogState> {

  public state: IDatabaseSchemaDialogState = {
    isOpen: true
  }

  public hideDialog = () => {
    this.setState({
      isOpen: false
    });
  };

  public componentDidUpdate(prevProps: IDatabaseSchemaDialogProps) {
    const { schema } = this.props;
    if(schema.id !== prevProps.schema.id) {
      this.setState({
        isOpen: true
      });
    }
  }

  public render() {
    const { isOpen } = this.state;
    const { schema } = this.props; 
    return (
        <Dialog
          hidden={!isOpen}
          onDismiss={this.hideDialog}
          dialogMinWidth="500px"
          dialogMaxWidth="90%"
        >
           <>
          <p>{schema.id}</p>
          <p>{schema.affiliation.name}</p>
          <p>{schema.createdBy}</p>
          <p>{schema.createdDate}</p>
          <p>{schema.databaseEngine}</p>
          <p>{schema.discriminator}</p>
          <p>{schema.jdbcUrl}</p>
          <p>{schema.lastUsedDate}</p>
          <p>{schema.name}</p>
          <p>{schema.sizeInMb}</p>
          <p>{schema.type}</p>
          { schema.users.map((u) => {
            return (
              <ul key={u.username}>
                <li>{u.type}</li>
                <li>{u.username}</li>
              </ul>
            )
          })}
        </>
          <Dialog.Footer>
            <ActionButton onClick={this.hideDialog}>Lukk</ActionButton>
          </Dialog.Footer>
        </Dialog>
    );
  }
}
