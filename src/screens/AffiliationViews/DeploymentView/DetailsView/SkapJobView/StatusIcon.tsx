import React from 'react';
import { Icon } from '@skatteetaten/frontend-components';

interface IStatusIconProps {
  status: string;
}

const StatusIcon = ({ status }: IStatusIconProps) => {
  const getIconAndColorForIcon = (): { icon: string; color: string } => {
    switch (status) {
      case 'DONE':
        return {
          icon: 'Completed',
          color: '#4fbb82',
        };
      case 'FAILED':
        return {
          icon: 'Error',
          color: '#bb4f4f',
        };
      default:
        return {
          icon: 'Info',
          color: '#bbad4f',
        };
    }
  };

  return (
    <div style={{ display: 'inline-flex', height: 0 }}>
      <div>{status}</div>
      <Icon
        iconName={getIconAndColorForIcon().icon}
        style={{ fontSize: '16px', color: getIconAndColorForIcon().color }}
      />
    </div>
  );
};

export default StatusIcon;
