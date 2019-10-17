import React from 'react';
import styled from 'styled-components';

import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { DeployButtonContainer } from '../containers/DeployButton/DeployButtonContainer';
import { ITag } from 'models/Tag';
import { WrongVersionCallout } from './WrongVersionCallout';

interface IRedeployRowProps {
  affiliation: string;
  applicationId: string;
  hasAccessToDeploy: boolean;
  activeVersion?: ITag;
  version?: IImageTag;
}

export const RedeployRow = ({
  version,
  affiliation,
  hasAccessToDeploy,
  applicationId,
  activeVersion
}: IRedeployRowProps) => {
  if (!version) {
    return null;
  }

  const isDeployed = activeVersion && activeVersion.name === version.name;

  return (
    <Wrapper>
      <h3>Konfigurert versjon</h3>
      <TableWrapper>
        <table>
          <thead>
            <tr>
              <th>Navn</th>
              <th>Sist endret</th>
              <th>Kjørede versjon</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{version.name}</td>
              <td>{version.image && version.image.buildTime}</td>
              <td>{isDeployed ? 'Ja' : <WrongVersionCallout />}</td>
              <td>
                <DeployButtonContainer
                  affiliation={affiliation}
                  applicationId={applicationId}
                  hasAccessToDeploy={hasAccessToDeploy}
                  currentVersion={version}
                  nextVersion={version}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </TableWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  h3 {
    margin: 0;
    margin-bottom: 4px;
  }
  margin-bottom: 12px;
`;

const TableWrapper = styled.div`
  background: rgb(249, 237, 226);
  padding: 8px 7px;

  thead {
    text-align: left;
  }

  th,
  td {
    padding: 0 5px;
  }
`;
