// // import React from 'react';

// // const DamageCalc = () => {
// //   const header = 'yes';

// //   return (
// //     <div className='damage-calc'>
// //       {header}
// //     </div>
// //   )
// // }

// // export default DamageCalc;

// let counter = 0;
// ////
// // CONFIGURATION
// ////
// const SAFE = 'safe';
// const NORMAL = 'normal';
// const CONFIGS = {
//   materialCost: 25000,
//   zenyDiscount: .95,
//   [SAFE]: {
//     equipments: [
//       0, 0, 0, 0, 1,
//       2, 3, 4, 6, 10
//     ],
//     materials: [
//       1, 1, 1, 1, 5,
//       10, 15, 25, 50, 85
//     ],
//     zenyCost: [
//       10000, 20000, 30000, 40000, 100000,
//       220000, 470000, 910000, 1630000, 2740000
//     ]
//   },
//   [NORMAL]: {
//     rates: [
//       null, null, null, null, .5,
//       .5, .4, .4, .4, .4,
//       .4, .4, .4, .4, .4
//     ],
//     equipments: [
//       null, null, null, null, 0,
//       0, 0, 0, 0, 0,
//       0, 0, 0, 0, 0
//     ],
//     materials: [
//       null, null, null, null, 1,
//       1, 1, 1, 1, 1,
//       5, 5, 5, 5, 5
//     ],
//     zenyCost: [
//       null, null, null, null, 50000,
//       60000, 70000, 80000, 90000, 100000,
//       100000, 100000, 100000, 100000, 100000
//     ]
//   }
// }
// ////
// // REFINE UNTIL BROKEN OR TARGET REACHED
// ////
// const refineUntilBrokenOrTargetReached = (initialLevel, target, cheapestEquipmentCost, refineStrategy) => {
//   const result = {
//     broken: false,
//     level: initialLevel,
//     zenyCost: 0,
//   }
//   while (!result.broken && result.level < target) {
//     const level = result.level++;
//     const safety = level < 4 ? SAFE : level >= 10 ? NORMAL : refineStrategy[level];
//     const config = CONFIGS[safety];
//     if (safety == NORMAL) {
//       const randomValue = Math.random();
//       const successRate = config.rates[level];
//       if (randomValue >= successRate) {
//         result.level -= 2;
//         result.broken = randomValue >= .5 + successRate / 2;
//       }
//     }
//     result.zenyCost += config.equipments[level] * cheapestEquipmentCost
//       + config.materials[level] * CONFIGS.materialCost
//       + config.zenyCost[level] * CONFIGS.zenyDiscount;
//   }
//   return result;
// }
// ////
// // REFINE UNBROKEN
// ////
// const refineUnbroken = (initial, target, cheapestEquipmentCost, refineStrategy) => {
//   const total = {
//     unbroken: [...initial],
//     broken: new Array(15).fill(0),
//     zenyCost: 0,
//     refineStrategy: refineStrategy
//   }
//   for (let level = 0; level < target; level++) {
//     while (total.unbroken[level]) {
//       total.unbroken[level]--;
//       const result = refineUntilBrokenOrTargetReached(level, target, cheapestEquipmentCost, refineStrategy);
//       total[result.broken ? 'broken' : 'unbroken'][result.level]++;
//       total.zenyCost += result.zenyCost;
//     }
//   }
//   return total;
// }
// ////
// // ORGANIZE BY REPAIR STRATEGY
// ////
// const organizeByRepairStrategy = (broken, repairStrategy) => {
//   const shouldRepair = (level) => repairStrategy.includes(level);
//   let [highest, lowest] = [0, 0];
//   for (let i = 0, j = broken.length - 1; i < broken.length; i++, j--) {
//     highest = (shouldRepair(i) && broken[i]) ? i : highest;
//     lowest = (shouldRepair(j) && broken[j]) ? j : lowest;
//   }
//   return {
//     fixerUpper: highest,
//     fodder: lowest,
//     count: highest <= lowest ? 0 : Math.min(broken[highest], broken[lowest])
//   }
// }
// ////
// // REFINE WITH FODDER
// ////
// const refineWithFodder = (
//   initial,
//   target,
//   cheapestEquipmentCost,
//   refineStrategy,
//   repairStrategy,
//   initialCost,
//   prices
// ) => {
//   let unbroken = [...initial];
//   let broken = new Array(15).fill(0);
//   let zenyCost = 0;
//   let { fixerUpper, fodder, count } = organizeByRepairStrategy(broken, repairStrategy);
//   while (count || !zenyCost) {
//     broken[fixerUpper] -= count;
//     unbroken[fixerUpper] += count;
//     broken[fodder] -= count;
//     let results = refineUnbroken(unbroken, target, cheapestEquipmentCost, refineStrategy);
//     unbroken = [...results.unbroken];
//     broken = broken.map((count, level) => count + results.broken[level]);
//     zenyCost += results.zenyCost;
//     ({ fixerUpper, fodder, count } = organizeByRepairStrategy(broken, repairStrategy));
//   }
//   const profit = ((broken, prices, target) => {
//     return broken.reduce((total, count, level) => {
//       return level == target ? total : total + count * (prices[level] || 0);
//     }, 0)
//   })(broken, prices, target);
//   return {
//     unbroken: unbroken,
//     broken: broken,
//     zenyCost: initialCost + zenyCost - profit,
//     refineStrategy: refineStrategy,
//     repairStrategy: repairStrategy
//   };
// }
// ////
// // begin sim
// ////
// ////
// // RUN REFINE WITH FODDER
// ////
// const runRefineWithFodder = (
//   initial,
//   target,
//   cheapestEquipmentCost,
//   refineStrategy,
//   repairStrategy,
//   initialCost,
//   prices,
//   sampleSize
// ) => {
//   const unbroken = new Array(16).fill(0);
//   const broken = new Array(15).fill(0);
//   let zenyCost = 0;
//   for (let i = 0; i < sampleSize; i++) {
//     const results = refineWithFodder(
//       initial, target, cheapestEquipmentCost, refineStrategy, repairStrategy, initialCost, prices
//     );
//     unbroken.forEach((value, i, array) => array[i] += results.unbroken[i]);
//     broken.forEach((value, i, array) => array[i] += results.broken[i]);
//     zenyCost += results.zenyCost;
//   }
//   return {
//     unbroken: unbroken,
//     broken: broken,
//     zenyCost: zenyCost,
//     zenyCostPer: zenyCost / unbroken[target],
//     refineStrategy: refineStrategy,
//     repairStrategy: repairStrategy
//   }
// }
// ////
// // GENERATE STRATEGIES
// ////
// const generateStrategies = (options, totalDecisions, reusable = false, modify = null, i = 0, decisions = []) => {
//   if (i == totalDecisions) {
//     return [modify ? modify(decisions) : decisions];
//   }
//   return options.reduce((strategies, decision, index) => {
//     return strategies.concat(generateStrategies(
//       reusable ? options : options.slice(index + 1),
//       totalDecisions,
//       reusable,
//       modify,
//       i + 1,
//       decisions.concat(decision)
//     ))
//   }, [])
// }
// ////
// // GENERATE ALL STRATEGIES
// ////
// const generateAllStrategies = (target) => {
//   const first = [SAFE, SAFE, SAFE, SAFE].filter((value, i) => i < target);
//   const last = [NORMAL, NORMAL, NORMAL, NORMAL, NORMAL].filter((value, i) => i + 10 < target);
//   const refineStrategies = generateStrategies(
//     [SAFE, NORMAL],
//     [4, 5, 6, 7, 8, 9].filter((value) => value < target).length,
//     /* reusable */ true,
//     (decisions) => first.concat(decisions, last)
//   )
//   console.log(refineStrategies);
//   const repairStrategies = [5, 6, 7, 8, 9, 10, 11, 12, 13].filter((value) => value < target - 1).reduce(
//     (strategies, value, index, options) => strategies.concat(generateStrategies(options, index + 1)), []
//   ).concat([[]])
//   console.log(repairStrategies);
//   const stringifiedStrategies = new Set();
//   refineStrategies.forEach((refineStrategy) => {
//     repairStrategies.forEach((repairStrategy) => {
//       const reducedStrategy = repairStrategy.reduce((reduction, value) => {
//         return refineStrategy[value + 1] == SAFE ? reduction : reduction.concat(value);
//       }, []).join();
//       stringifiedStrategies.add(JSON.stringify({ refine: refineStrategy, repair: reducedStrategy }));
//     })
//   })
//   console.log(`${stringifiedStrategies.size} unique variations`);
//   return stringifiedStrategies;
// }
// ////
// // TEST STRATEGIES
// ////
// const testStrategies = (initial, target, equipmentCosts, sampleSize) => {
//   const cheapestEquipmentCost = Math.min(equipmentCosts.unbroken[0], equipmentCosts.broken[3]);
//   const initialCost = initial.reduce((total, count, level) => {
//     return total + count * (equipmentCosts.unbroken[level] || 0);
//   }, 0)
//   const results = [];
//   const stringifiedStrategies = generateAllStrategies(target);
//   stringifiedStrategies.forEach((stringifiedStrategy) => {
//     const strategy = JSON.parse(stringifiedStrategy);
//     results.push(runRefineWithFodder(
//       initial,
//       target,
//       cheapestEquipmentCost,
//       strategy.refine,
//       strategy.repair,
//       initialCost,
//       equipmentCosts.broken,
//       sampleSize
//     ))
//     if (counter++ % (stringifiedStrategies.size / 100).toFixed() == 0) {
//       console.log(`${counter} out of ${stringifiedStrategies.size}`);
//     }
//   })
//   return results;
// }
// ////
// // IS NEW BUCKET REQUIRED
// ////
// const isNewBucketRequired = (number, bucket, shouldBucketizeNegatives = false) => {
//   return !bucket
//     || (Number.isFinite(number) && !Number.isFinite(bucket))
//     || (shouldBucketizeNegatives && Number.isFinite(number) && number <= 0 && number >= bucket / 2)
//     || (Number.isFinite(number) && number >= 0 && number >= bucket * 2)
//     || (!Number.isFinite(number) && Number.isFinite(bucket));
// }
// ////
// // FIND BEST REFINE STRATEGY
// ////
// const findBestStrategies = (level, initial, target, equipmentCosts, sampleSize) => {
//   const start = new Date().getTime();
//   const results = testStrategies(initial, target, equipmentCosts, sampleSize);
//   results.sort((first, second) => {
//     return Number.isFinite(first.zenyCostPer) || Number.isFinite(second.zenyCostPer)
//       ? first.zenyCostPer - second.zenyCostPer
//       : first.zenyCost - second.zenyCost;
//   });
//   const organizedResults = [];
//   let bucket = null;
//   results.forEach((result) => {
//     if (isNewBucketRequired(result.zenyCostPer, bucket)) {
//       bucket = result.zenyCostPer;
//       organizedResults.push([]);
//     }
//     organizedResults[organizedResults.length - 1].push(result);
//   })
//   console.log(organizedResults.length);
//   organizedResults.forEach((bucket) => {
//     const result = bucket[0];
//     const successRate = result.unbroken[target] / initial[level] / sampleSize;
//     console.log(result);
//     console.log(`${successRate} @ ${result.zenyCost / result.unbroken[target]} ${bucket.length} similar results`);
//   })
//   const end = new Date().getTime();
//   console.log(`${results.length} for ${(end - start) / 1000}`);
// }
// ////
// // RUN
// ////
// const amount = 100; // anything over total multiple of 1000 @15 will go over 1 min
// const level = 0;
// const initial = new Array(16).fill(0).fill(amount, level, level + 1);
// const target = 15;
// const sampleSize = 1000; // don't go over 1000

// const slash = {
//   unbroken: {
//     0: 358036,
//     10: 15441961,
//   },
//   broken: {
//     3: 315658,
//     10: 15101240
//   }
// }
// // findBestStrategies(level, initial, target, slash, sampleSize, level);

// const og = {
//   unbroken: {
//     0: 4090499,
//     10: 92414306,
//     15: 1501958528
//   },
//   broken: {
//     3: 2180250,
//     4: 2245250,
//     8: 27836595,
//     10: 90278606,
//     12: 369125394
//   }
// }
// findBestStrategies(level, initial, target, og, sampleSize, level);

// // validate cost calculation is correct

// const REFINE_SIM = {
//   component: RefineSim,
//   display: 'ref sim',
//   resourceLocation: 'refine-sim'
// }

// export default REFINE_SIM;