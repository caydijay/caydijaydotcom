var upgrades = [2, 1, 1, 1];

var factorial = function(n) {
  var value = 1;
  for (var i = 2; i <= n; i++) {
    value = value * i;
  }
  return value;
}

var choose = function(x, y) {
  return factorial(x) / (factorial(y) * factorial(x - y));
}

var paths = 1;
var upgradesRemaining = 5;
var uniqueNumbers = {};
for (var i = 0; i < upgrades.length; i++) {
  var upgradeCount = upgrades[i];
  uniqueNumbers[upgradeCount] = uniqueNumbers[upgradeCount] ? uniqueNumbers[upgradeCount] + 1 : 1;
  paths = paths * choose(upgradesRemaining, upgradeCount);
  upgradesRemaining = upgradesRemaining - upgradeCount;
}
var duplicates = 1;
for (var uniqueNumber in uniqueNumbers) {
  duplicates = duplicates * factorial(uniqueNumbers[uniqueNumber]);
}
var uniquePaths = paths * factorial(upgrades.length) / duplicates;
console.log(uniquePaths);