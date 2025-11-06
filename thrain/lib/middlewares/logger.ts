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
    console.info(`[INFO][${dateTimeFormat.format(date)}] ${message}`);
  }

  error(message: string) {
    const date = Temporal.Now.plainDateTimeISO();
    console.error(`[ERROR][${date}] ${message}`);
  }
}
