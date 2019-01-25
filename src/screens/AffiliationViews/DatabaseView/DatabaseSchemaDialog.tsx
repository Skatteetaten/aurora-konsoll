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

  public state = {
    affiliation: ''
  }

  public hideDialog = () => {
    const { clearSelectedSchema } = this.props;
    clearSelectedSchema();
    this.setState({
      affiliation: ''
    });
  };

  public updateAffiliation = (affiliation: string) => {
    this.setState({
      affiliation
    });
  };

  public persistChanges = () => {
    const { schema } = this.props;
    const { affiliation } = this.state;
    if(affiliation.length > 0) {
      // tslint:disable-next-line:no-console
      console.log(affiliation);
    } else {
      // tslint:disable-next-line:no-console
      console.log(schema ? schema.affiliation.name : '');
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
                <h3>Tilkoblingsinformasjon</h3>
              </Grid.Col>
              <Grid.Col lg={6}>
                <h3>Labels</h3>
                <TextField
                  id={'affiliation'}
                  label={'Tilhørighet'}
                  value={schema ? schema.affiliation.name : ''}
                  onChanged={this.updateAffiliation}
                />
                <TextField
                  id={'environment'}
                  label={'Miljø'}
                  value={'miljø'}
                />
                <TextField
                  id={'application'}
                  label={'Applikasjon'}
                  value={'applikasjon'}
                />
                <TextField
                  id={'discriminator'}
                  label={'Diskriminator'}
                  value={'diskriminator'}
                />
                <TextField
                  id={'userId'}
                  label={'Bruker'}
                  value={'bruker'}
                />
                <TextField
                  id={'description'}
                  label={'Beskrivelse'}
                  value={'beskrivelse'}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
        <Dialog.Footer>
          <ActionButton onClick={this.persistChanges}>Lagre</ActionButton>
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
