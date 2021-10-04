import React from 'react';

import DAMAGE_CALC from './damageCalc/DamageCalc';
import REFINE_SIM from './refineSim/RefineSim';

const Rom = () => {
  const header = 'bleep blop rom';

  return (
    <div className='rom'>
      {header}
    </div>
  )
}

const ROM = {
  component: Rom,
  display: 'rom',
  resourceLocation: 'rom',
  children: [ DAMAGE_CALC, ] // REFINE_SIM ],
}
export default ROM;