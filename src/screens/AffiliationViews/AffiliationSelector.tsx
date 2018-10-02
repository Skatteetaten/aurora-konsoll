import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface IAffiliationSelectorProps {
  affiliations: string[];
  user: string;
  className?: string;
}

const AffiliationSelector = ({
  affiliations,
  className,
  user
}: IAffiliationSelectorProps) => (
  <div className={className}>
    <div>
      <h1>Velkommen {user}</h1>
      <div className="affiliation-list">
        {affiliations.sort((a1, a2) => a1.localeCompare(a2)).map(a => (
          <Link to={`/a/${a}/deployments`} key={a}>
            <li>{a}</li>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default styled(AffiliationSelector)`
  display: flex;
  justify-content: center;

  h1 {
    padding-bottom: 10px;
    border-bottom: 1px solid #1d1d1d;
  }

  .affiliation-list {
    li {
      padding: 5px 0;
    }

    a {
      color: #000;
      text-decoration: none;

      &:hover {
        color: $primary-color;
        text-decoration: underline;
      }
    }
  }
`;
