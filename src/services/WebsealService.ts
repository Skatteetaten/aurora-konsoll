import { IJunction, IWebsealView } from 'models/Webseal';

export const filterWebsealView = (filter: string) => {
  return (v: IWebsealView) => v.name.includes(filter);
};

class WebsealService {
  public addProperties = (type: IJunction): any[] => {
    const ownProps = Object.keys(type);
    let i = ownProps.length;
    const resArray = new Array(i);
    while (i--) {
      resArray[i] = {
        key: ownProps[i],
        value: type[ownProps[i]]
      };
    }
    return resArray;
  };
}

export default WebsealService;
