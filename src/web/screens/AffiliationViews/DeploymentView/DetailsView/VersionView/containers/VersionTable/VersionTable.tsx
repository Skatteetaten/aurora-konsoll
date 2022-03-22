import * as React from 'react';
import styled from 'styled-components';
import { ImageTagType } from 'web/models/ImageTagType';
import { DeployButton } from '../../components/DeployButton';
import { VersionInfo } from '../../components/VersionInfo';
import DateWithTooltip from 'web/components/DateWithTooltip';
import { Table } from '@skatteetaten/frontend-components/Table';
import { IImageTag } from '../../../../../../../services/auroraApiClients/imageRepositoryClient/query';
import { skeColor } from '@skatteetaten/frontend-components/utils';

const columns = [
  {
    fieldName: 'type',
    key: 'type',
    name: 'Versjonstype',
  },
  {
    fieldName: 'name',
    key: 'name',
    name: 'Navn',
  },
  {
    fieldName: 'lastModified',
    key: 'lastModified',
    name: 'Sist endret',
  },
  {
    fieldName: 'deploy',
    key: 'deploy',
    name: '',
  },
];

function getOptionName(type: ImageTagType): string {
  switch (type) {
    case ImageTagType.AURORA_VERSION:
      return 'Aurora-versjon';
    case ImageTagType.AURORA_SNAPSHOT_VERSION:
      return 'Unik snapshot-versjon';
    case ImageTagType.BUGFIX:
      return 'Bugfix';
    case ImageTagType.LATEST:
      return 'Latest';
    case ImageTagType.MAJOR:
      return 'Major';
    case ImageTagType.MINOR:
      return 'Minor';
    case ImageTagType.SNAPSHOT:
      return 'Snapshot';
    case ImageTagType.COMMIT_HASH:
      return 'Commit hash';
    default:
      return '';
  }
}

export interface IVersionTableProps {
  onConfirmDeploy: (version: string) => void;
  hasAccessToDeploy: boolean;
  versionType: ImageTagType;
  currentVersion: IImageTag;
  versionBeingDeployed?: string;
  configuredVersionTag?: IImageTag;
  releaseTo?: string;
  imageTags: IImageTag[];
  searchText: string;
}

export const VersionTable = ({
  currentVersion,
  hasAccessToDeploy,
  versionBeingDeployed,
  onConfirmDeploy,
  configuredVersionTag,
  releaseTo,
  imageTags,
  versionType,
  searchText,
}: IVersionTableProps) => {
  const versionToFilter: string =
    releaseTo && configuredVersionTag
      ? configuredVersionTag.name
      : currentVersion.name;

  const data = imageTags
    .filter((it) => it.name !== versionToFilter)
    .map((it) => ({
      type: getOptionName(it.type),
      name:
        versionType === ImageTagType.SEARCH ? (
          <HighlightedValues searchText={searchText} text={it.name} />
        ) : (
          it.name
        ),
      lastModified: it.image ? (
        <DateWithTooltip date={it.image.buildTime} position="left" />
      ) : (
        ''
      ),
      deploy: (
        <DeployButton
          isLoading={versionBeingDeployed === it.name}
          disabled={versionBeingDeployed !== undefined}
          buttonText="Deploy"
          dialogTitle="Vil du endre versjonen?"
          hasAccessToDeploy={hasAccessToDeploy}
          isOldVersion={!it.image}
          onConfirmDeploy={() => onConfirmDeploy(it.name)}
          releaseTo={releaseTo}
          currentVersion={currentVersion}
        >
          <VersionInfo>
            <p>Fra:</p>{' '}
            {!releaseTo ? currentVersion.name : configuredVersionTag?.name}
          </VersionInfo>
          <VersionInfo>
            <p>Til:</p> {it.name}
          </VersionInfo>
        </DeployButton>
      ),
    }));

  const Description = () => {
    const { length } = imageTags;
    const prefix = length > 0 ? `Viser ${length}` : 'Fant ingen';
    const [er, e] = length === 1 ? ['', ''] : ['er', 'e'];

    // prettier-ignore
    // Prettier vil legge inn unødvendig mange linjeskift her. Denne trenger ikke å ta så mye plass.
    switch (versionType) {
      case ImageTagType.AURORA_VERSION: return <>{prefix} Aurora-versjon{er}.</>;
      case ImageTagType.AURORA_SNAPSHOT_VERSION: return <>{prefix} unik{e} <i>snapshot</i>-versjon{er}.</>;
      case ImageTagType.BUGFIX: return <>{prefix} <i>bugfix</i>-versjon{er}.</>;
      case ImageTagType.LATEST: return <>{prefix} <i>latest</i>-versjon{er}.</>;
      case ImageTagType.MAJOR: return <>{prefix} <i>major</i>-versjon{er}.</>;
      case ImageTagType.MINOR: return <>{prefix} <i>minor</i>-versjon{er}.</>;
      case ImageTagType.SNAPSHOT: return <>{prefix} <i>snapshot</i>-versjon{er}.</>;
      case ImageTagType.COMMIT_HASH: return <>{prefix} <i>commit hash</i>-versjon{er}.</>;
      default: return <>{prefix} resultat{er} av søk etter "{searchText}".</>;
    }
  };

  return (
    <TableWrapper>
      <SearchInfo>
        <Description />
      </SearchInfo>
      {imageTags.length > 0 && (
        <Table
          data={data as any}
          columns={columns}
          caption={''}
          hideCaption={true}
        />
      )}
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
  table {
    background-color: white;
    width: 100%;
    th:nth-child(1) {
      width: 15%;
    }
    th:nth-child(2) {
      width: 65%;
    }
    th:nth-child(3) {
      width: 20%;
    }
  }

  tbody {
    tr {
      &:hover,
      &:active,
      &:focus {
        background: #cde1f9 !important;
        button {
          opacity: 1;
        }
      }
    }
  }

  div.cellContentLarge {
    padding: 6px 12px;
  }

  td button {
    opacity: 0;
    transition: none !important;
  }

  button.ms-Button.ms-Button--action.ms-Button--command {
    height: 100%;
  }

  .ms-List-cell {
    cursor: pointer;
  }

  > div:last-child {
    overflow-x: visible;
  }
`;

const SearchInfo = styled.div`
  background-color: ${skeColor.lightBlue};
  color: ${skeColor.blue100};
  padding: 12px;
`;

const HighlightedValues = (props: { searchText: string; text: string }) => {
  const { searchText, text } = props;
  const lcText = text.toLowerCase();

  interface IIndices {
    start: number;
    end: number;
  }

  // Finner indekser for treff i søk:
  const indicesList: IIndices[] = searchText
    .split(' ')
    .map((value) => value.trim().toLowerCase())
    .filter((v) => v.length > 0)
    .flatMap((v) => {
      let startIndex = 0,
        index = 0,
        indices: IIndices[] = [];
      while ((index = lcText.indexOf(v, startIndex)) > -1) {
        indices.push({ start: index, end: index + v.length });
        startIndex = index + 1;
      }
      return indices;
    })
    .sort((a, b) => a!.start - b!.start);

  if (indicesList.length === 0) return null;

  // Fletter sammen overlappende treff:
  let mergedList: IIndices[] = [],
    current: IIndices = indicesList[0];
  for (let i = 0; i < indicesList.length; i++) {
    if (i === indicesList.length - 1) {
      mergedList.push(current);
    } else {
      const next = indicesList[i + 1];
      if (next.start < current.end) {
        if (next.end > current.end) current.end = next.end;
      } else {
        mergedList.push(current);
        current = next;
      }
    }
  }

  // Formaterer resultat:
  const startOfString =
    mergedList[0].start > 0 ? [<>{text.slice(0, mergedList[0].start)}</>] : [];
  return (
    <>
      {startOfString.concat(
        mergedList.flatMap((indices, i) => {
          const matchingString = (
            <Highlight key={`h${i}`}>
              {text.slice(indices.start, indices.end)}
            </Highlight>
          );
          const afterMatchingString = text.slice(
            indices.end,
            mergedList[i + 1]?.start
          );
          return afterMatchingString.length === 0
            ? [matchingString]
            : [matchingString, <>{afterMatchingString}</>];
        })
      )}
    </>
  );
};

const Highlight = styled.span`
  background-color: ${skeColor.lightBrown};
`;
