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
    console.info(`[INFO] ${message}`);
  }

  error(message: string) {
    console.error(`[ERROR] ${message}`);
  }
}
