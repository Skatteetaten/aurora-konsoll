import * as React from 'react';
import styled from 'styled-components';

export type RenderLinkFunc = (options: {
  href: string;
  name: string;
}) => React.ReactNode;

interface IBreadcrumbProps {
  path: string;
  renderLink: RenderLinkFunc;
  className?: string;
}

class Breadcrumb extends React.PureComponent<IBreadcrumbProps> {
  public defaultProps: IBreadcrumbProps = {
    path: '',
    renderLink: ({ href, name }) => {
      return <a href={href}>{name}</a>;
    },
  };

  public capitalize = (str: string) => {
    if (!str || str.length < 1) {
      return str;
    }
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  };

  public nextPath = (path: string, current: string) => {
    const paths = path.split(current);
    return paths.length > 0 ? paths[0] + current : path;
  };

  public render() {
    const { path, renderLink, className, ...rest } = this.props;

    const paths = path
      .split('/')
      .filter((p) => p && p.length > 0 && p.search('#') === -1)
      .map((p, i) => (
        <li key={i}>
          {i > 0 && <span>/</span>}
          {renderLink({
            href: this.nextPath(path, p),
            name: this.capitalize(p),
          })}
        </li>
      ));

    return (
      <nav aria-label="breadcrumb" {...rest}>
        <ol className={className}>{paths}</ol>
      </nav>
    );
  }
}

export default styled(Breadcrumb)`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  font-size: 0.875rem;
  margin: 0;
  padding: 0;

  & li {
    display: inline-flex;
    > span {
      display: inline-block;
      padding: 0 5px;
      color: #1d1d1b;
    }
    > a {
      color: #1d1d1b;
      text-decoration: underline;
      &:focus,
      &:hover,
      &:active {
        text-decoration: none;
      }
    }
  }
`;
