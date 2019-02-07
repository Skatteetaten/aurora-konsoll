import * as React from 'react';

import {
  ICreateDatabaseSchemaInput
  // IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';
import Labels from '../Labels';

export interface INewProps {
  onCreate: (databaseSchema: ICreateDatabaseSchemaInput) => void;
}

export interface INewState {
  id: string;
  discriminator: string;
  createdBy: string;
  description?: string | null;
  environment: string;
  application: string;
  affiliation: string;
}

class New extends React.Component<INewProps, INewState> {
  public state = {
    id: '',
    discriminator: '',
    createdBy: '',
    description: '',
    environment: '',
    application: '',
    affiliation: ''
  };

  public handleLabelChange = (field: string) => (value: string) => {
    this.setState(state => ({
      ...state,
      [field]: value
    }));
  };

  public create = () => {
    // const { onCreate } = this.props;
    // const newSchema:IUpdateDatabaseSchemaInputWithCreatedBy  = {
    //   ...this.state
    // };
    // onCreate(newSchema);
  };

  public render() {
    return <Labels handleLabelChange={this.handleLabelChange} />;
  }
}

export default New;
