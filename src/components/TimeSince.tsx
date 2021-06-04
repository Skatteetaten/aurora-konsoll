import { skeColor } from '@skatteetaten/frontend-components';
import * as React from 'react';
import styled from 'styled-components';

interface ITimeSinceProps {
  timeSince: Date | string;
  className?: string;
}

interface ITimeSinceState {
  time?: Date;
  minutesAgo: number;
  secondsAgo: number;
  isSecond: boolean;
}

class TimeSince extends React.PureComponent<ITimeSinceProps, ITimeSinceState> {
  public timer: any;
  public state: ITimeSinceState = {
    isSecond: false,
    minutesAgo: 0,
    secondsAgo: 0,
  };

  public calculateTimeSinceDeployment(prevTime: Date) {
    const currentTime = new Date();
    const timeDifference: number = Math.abs(
      currentTime.getTime() - prevTime.getTime()
    );
    const minutesDifference = Math.floor(timeDifference / 1000 / 60);
    const secondsDifference = Math.floor(timeDifference / 1000);

    this.setState({
      isSecond: secondsDifference < 60,
      minutesAgo: minutesDifference,
      secondsAgo: secondsDifference,
      time: prevTime,
    });
  }
  public componentDidUpdate(prevProps: ITimeSinceProps) {
    const { timeSince } = this.props;
    if (prevProps.timeSince !== timeSince) {
      clearInterval(this.timer);
      this.handleSetTime(timeSince);
    }
  }

  public handleSetTime(timeSince: Date | string) {
    let time: Date;
    if (timeSince instanceof Date) {
      time = timeSince;
    } else {
      time = new Date(timeSince);
    }
    this.calculateTimeSinceDeployment(time);
    this.timer = setInterval(
      () => this.calculateTimeSinceDeployment(time),
      1000
    );
  }

  public componentDidMount() {
    const { timeSince } = this.props;
    this.handleSetTime(timeSince);
  }

  public componentWillUnmount() {
    clearInterval(this.timer);
  }

  public render() {
    const { className } = this.props;
    const { minutesAgo, secondsAgo, isSecond, time } = this.state;
    return (
      <div className={className}>
        <div className="tooltip">
          {isSecond
            ? `Sist oppdatert for:  ${secondsAgo} sek siden`
            : `Sist oppdatert for:  ${minutesAgo} min siden`}
          <span className="tooltip-text">
            {time && time.toLocaleTimeString('nb-NO')}
          </span>
        </div>
      </div>
    );
  }
}

export default styled(TimeSince)`
  .tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted ${skeColor.black};
    margin-right: 10px;
    cursor: default;
    z-index: 100;
  }

  .tooltip .tooltip-text {
    visibility: hidden;
    opacity: 0;
    width: 120px;
    background-color: ${skeColor.blackAlt};
    color: ${skeColor.white};
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    top: 150%;
    left: 50%;
    margin-left: -60px;
  }

  .tooltip .tooltip-text::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent ${skeColor.blackAlt} transparent;
  }

  .tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
    transition: all 0.3s;
  }
`;
