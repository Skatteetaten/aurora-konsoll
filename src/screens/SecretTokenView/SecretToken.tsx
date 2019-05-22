import * as React from 'react';
import * as qs from 'qs';

class SecretTokenNavigation extends React.Component {

  public async fetchData() {
    interface IAuthQueryString {
      expires_in: string;
      access_token: string;
    }
  
    const authQueryString = qs.parse(
      window.location.hash.substring(1)
    ) as IAuthQueryString;
      
    fetch('/api/accept-token?access_token=' + authQueryString.access_token + '&expires_in=' + authQueryString.expires_in).then(function(response) {
      return response.text().then(function(text) {
        window.location.href = text;
      });
    });
  }

  public componentDidMount() {
    this.fetchData();
  }

  public render() {
    return <div/>;
  }

}

export { SecretTokenNavigation };

