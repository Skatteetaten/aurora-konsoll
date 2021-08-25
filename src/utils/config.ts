export interface IConfiguration {
  AUTHORIZATION_URI: string;
  CLIENT_ID: string;
  DBH_ENABLED: boolean;
  SKAP_ENABLED: boolean;
  GAVEL_ENABLED: boolean;
  APPLICATION_NAME: string;
  STORYTELLER_URL: string;
}

async function fetchConfiguration(): Promise<IConfiguration | Error> {
  try {
    const data = await fetch('/api/config');
    return await data.json();
  } catch (error) {
    (window as any).e = error;
    return error;
  }
}

export { fetchConfiguration };
