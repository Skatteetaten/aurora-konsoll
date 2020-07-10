import * as React from 'react';

class SecretTokenNavigation extends React.Component {
  public async fetchData() {
    const urlParams = new URLSearchParams(
      window.location.hash.replace('#', '?')
    );
    fetch(
      '/api/accept-token?access_token=' +
        urlParams.get('access_token') +
        '&expires_in=' +
        urlParams.get('expires_in')
    ).then(function (response) {
      return response.text().then(function (text) {
        window.location.href = text;
      });
    });
  }

  public componentDidMount() {
    this.fetchData();
  }

  public render() {
    return <div />;
  }
}

export { SecretTokenNavigation };
