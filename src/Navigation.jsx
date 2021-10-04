import React from 'react';
import { NavLink, Route } from 'react-router-dom';

import './Navigation.css';

const buildNavLink = (parents_path, route, i) => {
  const exact = { exact: route.exact || false };
  const path = `${parents_path}/${route.resourceLocation}`;
  const navLink = (
    <li className={`navigation-bar-row-${i}`} key={path}>
      <NavLink {...exact} to={path}>{route.display}</NavLink>
    </li>
  )
  const navLinkContent = (
    <Route key={path} exact path={path} component={route.component} />
  )
  return [ navLink, navLinkContent ];
}

const buildSpace = (invisibleLabel, key) => {
  return (
    <li key={key} className='navigation-bar-space' visibility='hidden'>
      {invisibleLabel}
    </li>
  )
}

const getPathFromRoutes = (routes) => {
  return routes.length > 0
    ? `/${routes.map((route) => route.resourceLocation).join('/')}`
    : '';
}

const buildNavBar = (parents, children, spaces) => {
  const navigationBarContent = [];
  const parents_path = getPathFromRoutes(parents);
  const navLinks = spaces.map((space, i) => buildSpace(space.display, parents_path + i)).concat(
    children.map((child, i) => {
      const [ navLink, navLinkContent ] = buildNavLink(parents_path, child, parents.length + spaces.length + i);
      navigationBarContent.push(navLinkContent);
      return navLink;
    })
  )
  const buildNavLinks = () => (
    <ul className={`navigation-bar-col-${parents.length}`}>
      {navLinks}
    </ul>
  )
  const navigationBar = ( <Route key={parents_path} path={parents_path} component={buildNavLinks} /> );
  return [ navigationBar, navigationBarContent ];
}

export default function Navigation({ routes }) {
  const queue = [ { parents: [], children: routes, spaces: [], } ];
  const [ navigationBars, content ] = [ [], [] ];
  while (queue.length) {
    const { parents, children, spaces } = queue.shift();
    children.forEach((child, i) => {
      const grandChildren = child.children || [];
      if (grandChildren.length) {
        queue.push({
          parents: parents.concat(child),
          children: grandChildren,
          spaces: spaces.concat(children.slice(0, i)),
        })
      }
    })

    const [ navigationBar, navigationBarContent ] = buildNavBar(parents, children, spaces);
    navigationBars.push(navigationBar);
    content.push(...navigationBarContent);
  }

  return (
    <div>
      <div className='navigation-bars'>{navigationBars}</div>
      <div className='navigation-content'>{content}</div>
    </div>
  );
}