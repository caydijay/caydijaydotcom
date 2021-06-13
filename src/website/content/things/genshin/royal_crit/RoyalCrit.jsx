import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { calculateRoyalWeaponCritRate } from './RoyalCrit.js';
import { asynchronously } from '../../../../Helpers';

import './RoyalCrit.css';

const RoyalCrit = () => {
  const [ calculating, setCalculating ] = useState(false);
  const [ critRate, setCritRate ] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange' });
  const onSubmit = async (data) => {
    setCalculating(true);
    setCritRate(await asynchronously(calculateRoyalWeaponCritRate, data));
    setCalculating(false);
  }

  return (
    <form className='royal-crit' onSubmit={handleSubmit(onSubmit)}>
      <table>
        <thead>
          <tr>
            <th className='x0y0'>how much crit do royal weapons</th>
            <th className='x1y0'>add?</th>
            <th className='x2y0'>
              <input type='submit' value='tell me!' disabled={
                calculating || errors.displayCritRate || errors.refinementRank || errors.numberOfTargets
              }/>
            </th>
            <th className='x3y0'>{calculating ? 'beep... boop...' : critRate ? (critRate * 100).toFixed(1) : null}</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className='field'>character's crit rate</td>
            <td>
              <input {...register('displayCritRate', {
                valueAsNumber: true, min: 0, max: 100
              })} defaultValue='5' placeholder='5'/>
            </td>
            <td></td>
            <td className='x3y1'>{calculating ? 'beep...' : null}</td>
          </tr>

          <tr>
            <td className='field'>refinement rank</td>
            <td>
              <input {...register('refinementRank', {
                valueAsNumber: true, min: 1, max: 5, pattern: { value: /^[1-5]{1}$/ } // bugged
              })} defaultValue='1' placeholder='1' />
            </td>
            <td></td>
            <td className='x3y2'>{calculating ? 'boop...' : null}</td>
          </tr>

          <tr>
            <td className='field'>number of targets hit per swing</td>
            <td>
              <input {...register('numberOfTargets', {
                valueAsNumber: true, min: 1, max: 9, pattern: { value: /^[1-9]{1}$/ }
              })} defaultValue='1' placeholder='1' />
            </td>
          </tr>

        </tbody>

      </table>
    </form>
  )
}

export default RoyalCrit;