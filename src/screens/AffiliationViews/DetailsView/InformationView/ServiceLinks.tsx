import * as React from 'react';

import { ExternalLink } from 'components/ExternalLink';
import { ILink } from 'models/ApplicationDeployment';

interface IServiceLinksProps {
  serviceLinks: ILink[];
}

export const ServiceLinks = ({ serviceLinks }: IServiceLinksProps) => {
  if (serviceLinks.length === 0) {
    return null;
  }

  return (
    <>
      <h3>Tjenestelenker</h3>
      <ul>
        {serviceLinks.map(link => (
          <li style={{ marginBottom: '5px' }}>
            <ExternalLink target="_blank" href={link.url}>
              {link.name}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </>
  );
};
