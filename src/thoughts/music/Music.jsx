import React from 'react';

const Music = () => {
  const header = 'music';

  return (
    <div className='music'>
      {header}
    </div>
  );
}

const MUSIC = {
  component: Music,
  display: 'music',
  resourceLocation: 'music',
}

export default MUSIC;