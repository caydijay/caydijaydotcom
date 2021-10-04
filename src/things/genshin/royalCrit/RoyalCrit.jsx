import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import RoyalCritWorker from './RoyalCritWorker';
import { useQueryParameters } from '../../../Helpers';
import { validate } from '../../../ReactHookFormHelpers';

import './RoyalCrit.css';

const RoyalCrit = () => {
  const [ calculating, setCalculating ] = useState(false);
  const [ critRate, setCritRate ] = useState(null);
  const queryParameters = useQueryParameters([ 'displayCritRate', 'refinementRank', 'numberOfTargets' ]);
  const { formState: { errors }, getValues, handleSubmit, register, trigger } = useForm({
    defaultValues: queryParameters.get(),
    mode: 'onChange'
  });

  useEffect(
    () => trigger(), // validate all fields
    [ trigger ] // but only once (ie query parameters on page load because trigger never changes)
  );

  const calculate = (data) => {
    queryParameters.update(getValues);
    setCalculating(true);
    RoyalCritWorker.onmessage = (event) => {
      setCritRate(event.data);
      setCalculating(false);
    }
    RoyalCritWorker.postMessage(data);
  }

  return (
    <form className='royal-crit' onSubmit={handleSubmit(calculate)}>
      <table>
        <thead>
          <tr>
            <th className='x0y0'>how much crit do royal weapons add?</th>
            {/* <th className='x1y0'>add?</th> */}
            <th className='x2y0'>
              <input type='submit' value='tell me!' disabled={
                calculating || errors?.displayCritRate || errors?.refinementRank || errors?.numberOfTargets
              }/>
            </th>
            <th className='x3y0'>{calculating ? 'beep... boop...' : critRate ? (critRate * 100).toFixed(1) : null}</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className='field'>character's crit rate</td>
            <td>
              <input placeholder='5'
                {...register('displayCritRate', validate(/^(([5-9])|([1-9][0-9])|(100))(\.[0-9])?$/, '5'))}
              />
            </td>
            <td></td>
            <td className='x3y1'>{calculating ? 'beep...' : null}</td>
          </tr>

          <tr>
            <td className='field'>refinement rank</td>
            <td>
              <input placeholder='1'
                {...register('refinementRank', validate(/^[1-5]$/, '1'))}
              />
            </td>
            <td></td>
            <td className='x3y2'>{calculating ? 'boop...' : null}</td>
          </tr>

          <tr>
            <td className='field'>number of targets hit per swing</td>
            <td>
              <input placeholder='1'
                {...register('numberOfTargets', validate(/^[1-9]$/, '1'))}
              />
            </td>
          </tr>

        </tbody>

      </table>
    </form>
  )
}

const ROYAL_CRIT = {
  component: RoyalCrit,
  display: 'ryl crit',
  resourceLocation: 'royal-crit'
}

export default ROYAL_CRIT;