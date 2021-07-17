import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import { getNestedValue, getPathFromRoutes } from './Helpers'

import './Navigation.css';

const buildNavLink = (parents, route) => {
  const exact = { exact: route.exact || false };
  const path = `${getPathFromRoutes(parents)}/${route.resourceLocation}`;
  const navLink = (
    <li key={path}>
      <NavLink {...exact} to={path}>
        {route.label}
      </NavLink>
    </li>
  )
  const navLinkContent = (
    <Route key={path} exact path={path} component={route.component} />
  )
  return [ navLink, navLinkContent ];
}

const buildSpace = (invisibleLabel, key) => {
  // hidden doesn't work
  return (
    <li key={key} className='space' visibility='hidden' hidden>
      {invisibleLabel}
    </li>
  )
}

const buildNavBar = (parents, children, spaces) => {
  const navBarContent = [];
  const path = getPathFromRoutes(parents);
  const navLinks = spaces.map((space, i ) => buildSpace(space.label, path + i)).concat(
    children.map((child) => {
      const [ navLink, navLinkContent ] = buildNavLink(parents, child);
      navBarContent.push(navLinkContent);
      return navLink;
    })
  )
  const buildNavLinks = () => (
    <ul className={`navbar${parents.length + 1}`}>
      <li className='leftpadding'></li>
      {navLinks}
    </ul>
  )
  const navBar = ( <Route key={path} path={path} component={buildNavLinks} /> );
  return [ navBar, navBarContent ];
}

export default function Navigation({ routes }) {
  const queue = [
    { parents: [],
      children: routes.labels.map((label) => getNestedValue(routes, [ label ])),
      spaces: [],
    }
   ]

  const [ navBars, content ] = [ [], [] ];
  while (queue.length) {
    const { parents, children, spaces } = queue.shift();
    children.forEach((child, i) => {
      const grandChildren = child.labels || [];
      if (grandChildren.length) {
        const newParents = parents.concat(child);
        queue.push({
          parents: newParents,
          children: grandChildren.map((label) => newParents[newParents.length - 1][label]),
          spaces: spaces.concat(children.slice(0, i)),
        })
      }
    })

    const [ navBar, navBarContent ] = buildNavBar(parents, children, spaces);
    navBars.push(navBar);
    content.push(...navBarContent);
  }

  return (
    <div className='navigation'>
      {navBars}
      <div className='space'></div>
      <div className='content'>{content}</div>
    </div>
  );
}