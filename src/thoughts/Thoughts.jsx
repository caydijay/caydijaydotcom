import React from 'react';

import FOOD from './food/Food';
import MUSIC from './music/Music';

const Thoughts = () => {
  const header = 'bleep blopasdasd';

  return (
    <div className='thoughts'>
      {header}
    </div>
  )
}

const THOUGHTS = {
  component: Thoughts,
  display: 'thoughts',
  resourceLocation: 'thoughts',
  children: [ FOOD, MUSIC ],
}
export default THOUGHTS;