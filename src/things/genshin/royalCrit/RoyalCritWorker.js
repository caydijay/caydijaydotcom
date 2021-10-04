import { createWorkerFromFunction } from '../../../Helpers';

const worker = createWorkerFromFunction((event) => {
  const swingOnce = (numberOfTargets, initialCritRate, critRatePerStack, stacks) => {
    const critRate = initialCritRate + critRatePerStack * stacks;
    let critCount = 0;
    for (let i = 0; i < numberOfTargets; i++) {
      if (Math.random() < critRate) {
        critCount++;
      }
    }
    return critCount;
  }

  const calculateRoyalWeaponCritRate = ({ displayCritRate, refinementRank, numberOfTargets }) => {
    const MAX_STACKS = 5;
    const initialCritRate = displayCritRate / 100;
    const critRatePerStack = [ .08, .10, .12, .14, .16 ][refinementRank - 1];
  
    let [ unchanged, swings, critCount, stacks ] = [ 0, 0, 0, 0 ];
    let averageCritRate = initialCritRate;

    while (unchanged < 2000000 && ++swings) {
      const critsFromOneSwing = swingOnce(numberOfTargets, initialCritRate, critRatePerStack, stacks);
      critCount += critsFromOneSwing;
      if (critsFromOneSwing > 0) stacks = 0;
      else if (stacks < MAX_STACKS) stacks++;
  
      const newAverageCritRate = (critCount / (swings * numberOfTargets) - initialCritRate).toFixed(3);
      if (newAverageCritRate === averageCritRate) unchanged++;
      else unchanged = 0;
      averageCritRate = newAverageCritRate;
    }
    return averageCritRate;
  }
  postMessage(calculateRoyalWeaponCritRate(event.data));
})

export default worker;