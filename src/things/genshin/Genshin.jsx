import React from 'react';

import ROYAL_CRIT from './royalCrit/RoyalCrit';

const Genshin = () => {
  const header = 'asdasdasd';

  return (
    <div className='games'>
      {header}
    </div>
  )
}

const GENSHIN = {
  component: Genshin,
  display: 'genshin',
  resourceLocation: 'genshin',
  children: [ ROYAL_CRIT ],
}

export default GENSHIN;