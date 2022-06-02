import ActionButton from '@skatteetaten/frontend-components/ActionButton';
import Dialog from '@skatteetaten/frontend-components/Dialog';
import Grid from '@skatteetaten/frontend-components/Grid';
import { useEffect, useState } from 'react';
import { Selection, IObjectWithKey } from '@fluentui/react';
import MessageBar from '@skatteetaten/frontend-components/MessageBar';
import {
  BoldParagraph,
  MessageBarContent,
} from 'web/components/DetailsListUtils/styles';

interface Props {
  selected: object[] | undefined;
  selection: Selection<IObjectWithKey>;
  className?: string;
}

export interface StorageGridObjectAreasTableData {
  name: string;
  bucketName: string;
  namespace: string;
  creationTimestamp: string;
  statusSuccess: string;
  statusMessage: string;
  statusReason: string;
}

const StorageGridDialog = ({ selected, selection, className }: Props) => {
  const [hidden, setHidden] = useState(true);
  const [data, setData] = useState<StorageGridObjectAreasTableData>();

  useEffect(() => {
    if (selected && selected.length) {
      setData(selected[0] as StorageGridObjectAreasTableData);
      setHidden(!selected);
    }
  }, [selected]);

  const close = () => {
    setHidden(true);
    selection.setAllSelected(false);
  };

  const success = data?.statusSuccess === 'true';

  return (
    <Dialog
      title="Område"
      hidden={hidden}
      minWidth="1000px"
      maxWidth="90%"
      onDismiss={close}
    >
      <div className={className}>
        <Grid>
          <Grid.Row>
            <Grid.Col lg={2}>
              <BoldParagraph>Namespace: </BoldParagraph>
              <BoldParagraph>Navn: </BoldParagraph>
              <BoldParagraph>Bucket Navn: </BoldParagraph>
              <BoldParagraph>Opprettet: </BoldParagraph>
            </Grid.Col>
            <Grid.Col lg={10}>
              <p>{data?.namespace}</p>
              <p>{data?.name}</p>
              <p>{data?.bucketName}</p>
              <p>{data?.creationTimestamp}</p>
            </Grid.Col>
          </Grid.Row>
        </Grid>
        <hr />
        <h3>Statusinformasjon</h3>
        <MessageBar
          type={success ? MessageBar.Type.success : MessageBar.Type.error}
          style={{ maxWidth: 'fit-content' }}
        >
          <MessageBarContent>
            <b>Hendelse: </b>
            {data?.statusReason}
            <br />
            <b>Melding: </b>
            {data?.statusMessage}
          </MessageBarContent>
        </MessageBar>
      </div>
      <Dialog.Footer>
        <ActionButton onClick={close}>Lukk</ActionButton>
      </Dialog.Footer>
    </Dialog>
  );
};

export default StorageGridDialog;
