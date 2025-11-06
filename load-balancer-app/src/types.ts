export type Config = {
  servers: ConfigEntry[];
};

export type ConfigEntry = {
  host: string;
  port: number;
  timeout: number;
};
