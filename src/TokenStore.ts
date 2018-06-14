class TokenStore {

  private TOKEN_KEY = 'token';

  private EXPIRES_AT_KEY = 'expiresAt';

  public isTokenValid(): boolean {
    const token = window.localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      return false;
    }

    const expiresAt = window.localStorage.getItem(this.EXPIRES_AT_KEY);
    if (!expiresAt) {
      return false;
    }

    const tokenExpired = new Date().getTime() > Number(expiresAt);
    return !tokenExpired;
  }

  public updateToken(token: string, expiresInSeconds: number) {
    const expiresInMillis = expiresInSeconds * 1000;
    const time = new Date().getTime();
    const expiresAt = new Date(time + expiresInMillis).getTime();

    window.localStorage.setItem(this.TOKEN_KEY, token);
    window.localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
  }
}

export default TokenStore;