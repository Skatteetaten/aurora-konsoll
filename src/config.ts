interface IConfiguration {
  AUTHORIZATION_URI: string;
  CLIENT_ID: string;
  GRAPHQL_URL: string;
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

export {IConfiguration, fetchConfiguration};