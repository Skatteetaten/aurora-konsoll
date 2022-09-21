export interface IConfiguration {
  DBH_ENABLED: boolean;
  SKAP_ENABLED: boolean;
  DNS_ENABLED: boolean;
  STORAGEGRID_ENABLED: boolean;
  STORAGEGRID_INFORMATION_URL?: string;
  OPENSHIFT_CLUSTER?: string;
  STORYTELLER_ENABLED: boolean;
  APPLICATION_NAME: string;
}

export async function fetchConfiguration(): Promise<IConfiguration | Error> {
  try {
    const data = await fetch('/api/konsoll/config');
    return await data.json();
  } catch (error: any) {
    (window as any).e = error;
    return error;
  }
}

export function isConfiguration(config: any): config is IConfiguration {
  return config.APPLICATION_NAME !== undefined;
}
