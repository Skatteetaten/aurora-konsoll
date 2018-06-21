import Dropdown from 'aurora-frontend-react-komponenter/Dropdown';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import Icon from 'aurora-frontend-react-komponenter/Icon';
import Image from 'aurora-frontend-react-komponenter/Image';
import * as Logo from 'aurora-frontend-react-komponenter/TopBanner/assets/ske-logo.svg';
import * as React from 'react';
import './header.css';

export const Header = ({
  title,
  user,
  handleChangeAffiliation,
  affiliations = []
}: IHeaderProps) => {
  const onChangedAffiliation = (item: { text: string }) =>
    handleChangeAffiliation(item.text);
  return (
    <div className="main-header">
      <Grid>
        <Grid.Row className="main-header-grid">
          <div className="main-header-row">
            <Grid.Col lg={3} xl={2} noSpacing={true}>
              <div className="main-header-logo-wrapper">
                <div>
                  <Image src={Logo} className="main-header-logo" />
                </div>
                <h2 className="main-header-title">{title}</h2>
              </div>
            </Grid.Col>
            <Grid.Col lg={3} xl={2} noSpacing={true}>
              <Dropdown
                options={affiliations}
                onChanged={onChangedAffiliation}
              />
            </Grid.Col>
            <Grid.Col lg={6} xl={4} xlPush={4} noSpacing={true}>
              <div className="main-header-user-wrapper">
                <p style={{ margin: 0, fontSize: '20px' }}>{user}</p>
                <Icon iconName="Person" className="main-header-user-icon" />
              </div>
            </Grid.Col>
          </div>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export interface IDropdownOption {
  key: string;
  text: string;
}

interface IHeaderProps {
  title: string;
  user: string;
  affiliations?: IDropdownOption[];
  handleChangeAffiliation: (affiliation: string) => void;
}
