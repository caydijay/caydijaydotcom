import React from 'react';

const Food = () => {
  const header = 'food';

  return (
    <div className='food'>
      {header}
    </div>
  )
}

const FOOD = {
  component: Food,
  display: 'food',
  resourceLocation: 'food',
}

export default FOOD;