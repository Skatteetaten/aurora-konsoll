import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import { IDatabaseSchema } from 'models/schemas';

export interface IDatabaseSchemaDialogProps {
  schema?: IDatabaseSchema;
  className?: string;
  clearSelectedSchema: () => void;
}

export interface IDatabaseSchemaDialogState {
  affiliation: string;
}

class DatabaseSchemaDialog extends React.Component<
  IDatabaseSchemaDialogProps,
  IDatabaseSchemaDialogState
> {
  constructor(props: IDatabaseSchemaDialogProps) {
    super(props);
    this.state = {
      affiliation: props.schema ? props.schema.affiliation.name : ''
    };
  }

  public hideDialog = () => {
    const { clearSelectedSchema } = this.props;
    clearSelectedSchema();
  };

  public updateAffiliation = (affiliation: string) => {
    this.setState({
      affiliation
    });
  };

  public componentDidUpdate(prevProps: IDatabaseSchemaDialogProps) {
    const { schema } = this.props;
    if (schema && prevProps.schema && prevProps.schema.id !== schema.id) {
      this.setState({
        affiliation: schema.affiliation.name
      });
    }
  }

  public render() {
    const { schema, className } = this.props;
    if (!schema) {
      return <div />;
    }
    return (
      <Dialog
        hidden={!!!schema}
        onDismiss={this.hideDialog}
        dialogMinWidth="1000px"
        dialogMaxWidth="90%"
      >
        <div className={className}>
          <Grid>
            <Grid.Row>
              <Grid.Col lg={2} className="styled-labels">
                <p>Id: </p>
                <p>Opprettet av: </p>
                <p>Sist brukt: </p>
                <p>Opprettet: </p>
                <p>Type: </p>
              </Grid.Col>
              <Grid.Col lg={10}>
                <p>{schema.id}</p>
                <p>{schema.createdBy}</p>
                <p>{schema.lastUsedDate}</p>
                <p>{schema.createdDate}</p>
                <p>{schema.type}</p>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col lg={6}>
                <TextField
                  id={'affiliation'}
                  label={'Tilhørighet'}
                  value={
                    this.props.schema && this.props.schema.affiliation.name
                  }
                  onChanged={this.updateAffiliation}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
        <Dialog.Footer>
          <ActionButton onClick={this.hideDialog}>Lukk</ActionButton>
        </Dialog.Footer>
      </Dialog>
    );
  }
}

export default styled(DatabaseSchemaDialog)`
  .styled-labels {
    font-weight: bold;
  }
`;
