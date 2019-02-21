interface IConfiguration {
  AUTHORIZATION_URI: string;
  CLIENT_ID: string;
}

interface IDbhConfiguration {
  INTEGRATIONS_DBH_URL: string;
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

async function isDbhUrlDefined(): Promise<boolean | Error> {
  try {
    const data = await fetch('/api/dbh');
    const response = await data.json();
    if (Object.keys(response as IDbhConfiguration).length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    (window as any).e = error;
    return error;
  }
}

export {
  IConfiguration,
  fetchConfiguration,
  isDbhUrlDefined,
  IDbhConfiguration
};
