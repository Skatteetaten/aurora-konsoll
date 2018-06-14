import Image from 'aurora-frontend-react-komponenter/Image';
import * as Logo from 'aurora-frontend-react-komponenter/TopBanner/assets/ske-logo.svg';
import * as React from 'react';
import './header.css';

interface IHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const Header = ({ title, children, ...rest }: IHeaderProps) => (
  <div {...rest} className={'main-header'}>
    <div className={'main-header-content'}>
      <div className={'main-header-wrapper'}>
        <div>
          <Image src={Logo} className={'main-header-logo'} />
        </div>
        <h2 className="title">{title}</h2>
        {children}
      </div>
    </div>
  </div>
);
