import React from 'react';
import { Icon } from '@skatteetaten/frontend-components/Icon';

interface IStatusIconProps {
  success: boolean;
  reason: string;
}

const StatusIcon = ({ success, reason }: IStatusIconProps) => {
  const getIconAndColorForIcon = (): { icon: string; color: string } => {
    switch (success) {
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
    <div style={{ display: 'flex' }}>
      <Icon
        iconName={getIconAndColorForIcon().icon}
        title="status"
        style={{ fontSize: '20px', color: getIconAndColorForIcon().color }}
      />
      {!success && reason}
    </div>
  );
};

export default StatusIcon;
