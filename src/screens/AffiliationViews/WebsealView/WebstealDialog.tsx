import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import Tabs from 'aurora-frontend-react-komponenter/Tabs';
import TabItem from 'aurora-frontend-react-komponenter/Tabs/TabItem';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import { IWebsealState } from 'models/Webseal';
import WebsealService from 'services/WebsealService';
import styled from 'styled-components';
import { StyledPre } from 'components/StyledPre';

interface IWebsealDialogProps {
  className?: string;
  selectedWebsealState?: IWebsealState;
  deselectWebsealState: () => void;
}

interface IWebsealDialogState {
  junctions: string[];
}

class WebsealDialog extends React.Component<
  IWebsealDialogProps,
  IWebsealDialogState
> {
  public state = {
    junctions: []
  };

  private websealService = new WebsealService();

  public onRenderFirstColumn = () => (item: { key: string }) => {
    return <b>{item.key}</b>;
  };

  public renderDetailsListWebsealStates = (items: string) => {
    if (!items) {
      return <div />;
    }
    return (
      <StyledPre>
        <DetailsList
          isHeaderVisible={false}
          columns={WebsealService.JUNCTION_COLUMNS(this.onRenderFirstColumn())}
          items={this.websealService.addProperties(items)}
        />
      </StyledPre>
    );
  };

  public render() {
    const {
      selectedWebsealState,
      deselectWebsealState,
      className
    } = this.props;

    if (!selectedWebsealState) {
      return <div />;
    }
    const tabs = () => {
      if (selectedWebsealState.junctions.length > 1) {
        return (
          <Tabs defaultSelectedKey="itemKey-1">
            <TabItem itemIcon="Info" linkText="Instance 1" itemKey="itemKey-1">
              {this.renderDetailsListWebsealStates(
                selectedWebsealState.junctions[0]
              )}
            </TabItem>
            <TabItem itemIcon="Info" linkText="Instance 2" itemKey="itemKey-2">
              {this.renderDetailsListWebsealStates(
                selectedWebsealState.junctions[1]
              )}
            </TabItem>
          </Tabs>
        );
      }
      return (
        <Tabs defaultSelectedKey="itemKey-1">
          <TabItem itemIcon="Info" linkText="Instance 1" itemKey="itemKey-1">
            {this.renderDetailsListWebsealStates(
              selectedWebsealState.junctions[0]
            )}
          </TabItem>
        </Tabs>
      );
    };

    return (
      <Dialog
        dialogMinWidth="1000px"
        dialogMaxWidth="90%"
        title={selectedWebsealState && selectedWebsealState.name}
        hidden={!!!selectedWebsealState}
        onDismiss={deselectWebsealState}
      >
        <div className={className}>
          <Grid>
            <Grid.Row>
              <Grid.Col lg={4} className="bold">
                <p>Miljø: </p>
                <p>Rutenavn: </p>
              </Grid.Col>
              <Grid.Col lg={8}>
                <p>{selectedWebsealState.namespace}</p>
                <p>{selectedWebsealState.routeName}</p>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>{tabs()}</Grid.Row>
          </Grid>
        </div>
        <Dialog.Footer>
          <ActionButton onClick={deselectWebsealState}>Lukk</ActionButton>
        </Dialog.Footer>
      </Dialog>
    );
  }
}

export default styled(WebsealDialog)`
  .bold {
    font-weight: bold;
  }
`;
