type LogLevel = 'error' | 'warning' | 'info' | 'debug';

export class Logger {
  static error(message: string, logData?: any) {
    this.log('error', message, logData);
  }
  static warning(message: string, logData?: any) {
    this.log('warning', message, logData);
  }
  static info(message: string, logData?: any) {
    this.log('info', message, logData);
  }
  static debug(message: string, logData?: any) {
    this.log('debug', message, logData);
  }

  static log(level: LogLevel, message: string, logData?: any): void {
    fetch('/api/log', {
      body: JSON.stringify({
        level,
        message,
        logData
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      method: 'POST'
    });
  }
}
