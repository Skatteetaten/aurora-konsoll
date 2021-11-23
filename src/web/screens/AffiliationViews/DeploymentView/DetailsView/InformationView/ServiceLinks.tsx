import * as React from 'react';

import { ExternalLink } from 'web/components/ExternalLink';
import { ILink } from 'web/models/ApplicationDeployment';

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
        {serviceLinks.map((link) => (
          <li key={link.name} style={{ marginBottom: '5px' }}>
            <ExternalLink target="_blank" href={link.url}>
              {link.name}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </>
  );
};
