import React, { useState } from 'react';
import ActionButton, {
  ActionButtonProps
} from '@skatteetaten/frontend-components/ActionButton';

export const EnterModeThenConfirm: React.FC<{
  confirmButtonEnabled: boolean;
  confirmText: string;
  inactiveIcon: string;
  inactiveText: string;
  onEnterMode: () => void;
  onExitMode: () => void;
  onConfirmClick: () => void;
  iconColor?: ActionButtonProps['color'];
}> = ({
  confirmButtonEnabled,
  confirmText,
  inactiveIcon,
  inactiveText,
  onEnterMode,
  onExitMode,
  onConfirmClick,
  iconColor = 'red'
}) => {
  const [modeActive, setModeActive] = useState(false);

  const onEnterModeClick = () => {
    setModeActive(true);
    onEnterMode();
  };

  const onExitModeClick = () => {
    setModeActive(false);
    onExitMode();
  };

  if (!modeActive) {
    return (
      <ActionButton
        iconSize={ActionButton.LARGE}
        color={iconColor}
        icon={inactiveIcon}
        style={{ minWidth: '120px', marginLeft: '15px', float: 'left' }}
        onClick={onEnterModeClick}
      >
        {inactiveText}
      </ActionButton>
    );
  } else {
    return (
      <span>
        <ActionButton
          iconSize={ActionButton.LARGE}
          color="green"
          icon="Completed"
          style={{
            minWidth: '120px',
            marginLeft: '15px',
            float: 'left',
          }}
          onClick={onConfirmClick}
          disabled={!confirmButtonEnabled}
        >
          {confirmText}
        </ActionButton>
        <ActionButton
          iconSize={ActionButton.LARGE}
          color="red"
          icon="Cancel"
          style={{
            minWidth: '120px',
            float: 'left',
          }}
          onClick={onExitModeClick}
        >
          Avbryt
        </ActionButton>
      </span>
    );
  }
};
