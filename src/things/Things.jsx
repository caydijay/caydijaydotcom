import React from 'react';

import GENSHIN from './genshin/Genshin';
import ROM from './rom/Rom';

const Things = () => {
  const header = 'bleep blop';

  return (
    <div className='things'>
      {header}
    </div>
  )
}

const THINGS = {
  component: Things,
  display: 'things',
  resourceLocation: 'things',
  children: [ GENSHIN, ROM ],
}

export default THINGS;