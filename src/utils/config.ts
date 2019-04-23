interface IConfiguration {
  AUTHORIZATION_URI: string;
  CLIENT_ID: string;
  DBH_ENABLED: boolean;
  SKAP_ENABLED: boolean;
  APPLICATION_NAME: string;
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

export { IConfiguration, fetchConfiguration };
