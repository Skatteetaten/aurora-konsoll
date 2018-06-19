import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import { DocumentNode } from 'graphql';
import * as React from 'react';
import { Query, QueryResult } from 'react-apollo';

function GoboQuery<T>({ query, children }: IGoboQueryProps<T>) {
  return (
    <Query query={query}>
      {({ loading, error, data }: QueryResult) => {
        if (loading) {
          return (
            <div>
              <Spinner size={Spinner.Size.large} />
              <p>Loading...</p>
            </div>
          );
        }
        if (error || !data) {
          return <p>Error</p>;
        }

        return children(data);
      }}
    </Query>
  );
}

interface IGoboQueryProps<TData> {
  query: DocumentNode;
  children: (data: TData) => React.ReactNode;
}

export default GoboQuery;
