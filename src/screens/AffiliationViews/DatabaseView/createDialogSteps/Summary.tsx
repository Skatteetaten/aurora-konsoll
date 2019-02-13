import * as React from 'react';

import Card from 'aurora-frontend-react-komponenter/Card';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import TextField from 'aurora-frontend-react-komponenter/TextField';

interface ISummaryProps {
  id: string;
  jdbcUrl: string;
  password: string;
}

const Summary = (props: ISummaryProps) => {
  return (
    <div>
      <Card color={Card.WHITE} title="Du må betale omregistreringsavgift">
        <Grid>
          <Grid.Row>
            <Grid.Col xl={2} md={8}>
              <TextField
                id={'my-readonlyfield-1'}
                readonly={true}
                label="Beløp"
                value={'3600'}
                inputSize={'large'}
                boldText={true}
              />
            </Grid.Col>
            <Grid.Col xl={3} md={8}>
              <TextField
                id={'my-readonlyfield-2'}
                readonly={true}
                label="KID"
                value={'4432 1233 4324 5425'}
                inputSize={'large'}
                boldText={true}
              />
            </Grid.Col>
            <Grid.Col xl={3} md={8}>
              <TextField
                id={'my-readonlyfield-3'}
                readonly={true}
                label="Kontonummer"
                value={'9484 12 31435'}
                inputSize={'large'}
                boldText={true}
              />
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Card>
    </div>
  );
};

export default Summary;
