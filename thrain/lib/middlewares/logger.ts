export declare namespace Temporal {
  namespace Now {
    function plainDateTimeISO(): Date;
  }
}

const dateTimeFormat = Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short',
  timeStyle: 'full',
});

export class Logger {
  private static _instance: Logger;

  private constructor() {}

  static get instance(): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }

    return Logger._instance;
  }

  info(message: string) {
    const date = Temporal.Now.plainDateTimeISO();
    console.info('\x1b[32m[INFO]', `\x1b[0m[${dateTimeFormat.format(date)}] ${message}`);
  }

  error(message: string) {
    const date = Temporal.Now.plainDateTimeISO();
    console.error('\x1b[31m[ERROR]', `\x1b[0m[${date}] ${message}`);
  }
}
