import React from 'react';

const DamageCalc = () => {
  const header = 'dmg calc';

  return (
    <div className='foo'>
      {header}
    </div>
  )
}

const DAMAGE_CALC = {
  component: DamageCalc,
  display: 'dmg calc',
  resourceLocation: 'damage-calc'
}

export default DAMAGE_CALC;