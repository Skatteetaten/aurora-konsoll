export const STATUS_COLORS: IStatusColors = {
  down: '#bb4f4f',
  downHover: '#c64040',
  healthy: '#4fbb82',
  healthyHover: '#40c67f',
  observe: '#bbad4f',
  observeHover: '#c7b53b',
  off: '#91919199',
  offHover: '#b9b5b599',
  unknown: '#4f8ebb',
  unknownHover: '#4086c6',
};

interface IStatusColors {
  [key: string]: string;
}

export enum StatusCode {
  HEALTHY = 'HEALTHY',
  OBSERVE = 'OBSERVE',
  DOWN = 'DOWN',
  OFF = 'OFF',
}

export interface IStatusColor {
  base: string;
  hover: string;
}

export function toStatusColor(code: StatusCode): IStatusColor {
  const codeId = code.toLowerCase();
  return {
    base: STATUS_COLORS[codeId],
    hover: STATUS_COLORS[codeId + 'Hover'],
  };
}
