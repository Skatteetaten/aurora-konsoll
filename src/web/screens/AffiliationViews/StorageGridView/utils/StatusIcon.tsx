import React from 'react';
import { Icon } from '@skatteetaten/frontend-components/Icon';

interface IStatusIconProps {
  status: boolean;
}

const StatusIcon = ({ status }: IStatusIconProps) => {
  const getIconAndColorForIcon = (): { icon: string; color: string } => {
    switch (status) {
      case true:
        return {
          icon: 'Completed',
          color: '#4fbb82',
        };
      case false:
        return {
          icon: 'Error',
          color: '#bb4f4f',
        };
    }
  };

  return (
    <Icon
      iconName={getIconAndColorForIcon().icon}
      title={String(status)}
      style={{ fontSize: '20px', color: getIconAndColorForIcon().color }}
    />
  );
};

export default StatusIcon;
