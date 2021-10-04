import React from 'react';

const News = () => {
  const header = 'no hay nada';

  return (
    <div className='news'>
      {header}
    </div>
  )
}

const NEWS = {
  component: News,
  display: 'news',
  resourceLocation: '',
  exact: true,
}

export default NEWS;