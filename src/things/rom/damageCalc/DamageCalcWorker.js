import { createWorkerFromFunction } from '../../../Helpers';

const calculateStatAtk = (a, b = 0, c = 0) => {
  return 2 * a + Math.floor(a * a / 100) + Math.floor(b / 5) + Math.floor(c / 5);
}

const calculateDamage = (current, additional, skillName) => {

  ////
  // private functions
  ////
  function calculatePhysical(
    multipliers, physicalDI, skillDI, skillDmgReduc, skillDmg, skillMultiplier, refDmgReduc, refAtk,
    mvpDmg, def, defPercent, ignoreDef, pen, raceDI, statAtk,
    dmg, secretPen, eleDmg, eleDmgReduc, eleTargetDI, sizeDI, sizePenalty, eleWeakness, baseAtk
  ) {
    var defTotal = def * Math.max(1 + defPercent - ignoreDef, 0);
    var defMit = (defTotal + 4000) / (10 * defTotal + 4000);
    return multipliers * physicalDI * (skillDI - skillDmgReduc) * skillDmg * skillMultiplier * refDmgReduc * (refAtk +
      mvpDmg * defMit * (pen + secretPen) * raceDI * (statAtk +
        dmg * (eleDmg - eleDmgReduc) * eleTargetDI * sizeDI * sizePenalty * eleWeakness * baseAtk
      )
    );
  }
  
  function calculateMagical(
    multipliers, magicDI, skillDI, skillDmgReduc, skillDmg, skillMultiplier, refMdmgReduc, eleDmg, eleDmgReduc, eleWeakness, refMatk,
    mvpDmg, mdef, mdefPercent, ignoreMdef, mpen, raceDI, statMatk,
    mdmg, secretPen, baseMatk
  ) {
    var mdefTotal = mdef * Math.max(1 + mdefPercent - ignoreMdef, 0);
    var mdefMit = (mdefTotal + 1000) / (10 * mdefTotal + 1000);
    return multipliers * magicDI * (skillDI - skillDmgReduc) * skillDmg * skillMultiplier * refMdmgReduc * (eleDmg - eleDmgReduc) * eleWeakness * (refMatk +
      mvpDmg * mdefMit * (mpen + secretPen) * raceDI * (statMatk +
        mdmg * baseMatk
      )
    );
  }
  
  function calculateSecretPen(refineLevel) {
    return refineLevel < 5? 0 : .009 * 2**(Math.floor(refineLevel/5) - 1);
  }
  ////
  // end private functions
  ////

  var stats = new Array(current.length);
  for (var i = 4; i < current.length; i++) {
    stats[i] = (parseFloat(current[i]) || 0) + (parseFloat(additional[i]) || 0);
  }

  var str = stats[4];
  var luk = stats[5];
  var dex = stats[6];
  var agi = stats[7];
  var vit = stats[8];
  var int = stats[9];

  var pen = stats[10] / 100 + 1;
  var mpen = stats[11] / 100 + 1;
  var critDmg = stats[12] / 100 + 1;
  var aaDI = stats[13] / 100 + 1;
  var skillDI = stats[14] / 100 + 1;

  var dmg = stats[15] / 100 + 1;
  var physicalDI = stats[16] / 100 + 1;
  var ignoreDef = stats[17] / 100 + 1;
  var refAtk = stats[18];

  var mdmg = stats[19] / 100 + 1;
  var magicDI = stats[20] / 100 + 1;
  var ignoreMdef = stats[21] / 100 + 1;
  var refMatk = stats[22];

  var eleDmg = stats[23] / 100 + 1;
  var eleTargetDI = stats[24] / 100 + 1;
  var raceDI = stats[25] / 100 + 1;
  var sizeDI = stats[26] / 100 + 1;


  var multipliers = stats[28] || 1;
  var mvpDmg = stats[29] / 100 + 1;
  var wpnRefLvl = stats[30];
  var acc1RefLvl = stats[31];
  var acc2RefLvl = stats[32];
  var secretPen = calculateSecretPen(wpnRefLvl) + calculateSecretPen(acc1RefLvl) + calculateSecretPen(acc2RefLvl);
  
  var aaBonus = stats[34];
  var strRatio = stats[35] / 100 + 1;
  var matkAARatio = stats[36] / 100;


  var skillMultiplier = stats[38] / 100;
  var skillDmg = stats[39] / 100 + 1;


  var critDmgReduc = stats[41] / 100;
  var aaReduc = stats[42] / 100;
  var skillDmgReduc = stats[43] / 100;
  var rangedDmgReduc = stats[44] / 100;

  var def = stats[45];
  var defPercent = stats[46] / 100 + 1;
  var dmgReduc = stats[47] / 100 + 1;
  var refDmgReduc = stats[48] / 100 + 1;
  var targetVit = stats[49];

  var mdef = stats[50];
  var mdefPercent = stats[51] / 100 + 1;
  var mdmgReduc = stats[52] / 100 + 1;
  var refMdmgReduc = stats[53] / 100 + 1;
  var targetInt = stats[54];

  var eleDmgReduc = stats[55] / 100;
  var raceDmgReduc = stats[56] / 100 + 1;
  var sizeDmgReduc = stats[57] / 100 + 1;
  var sizePenalty = stats[58] || 1;
  var eleWeakness = stats[59] || 1;

  var melee = skillName.includes("melee");
  var statAtk = melee? calculateStatAtk(str, dex, luk) : calculateStatAtk(dex, str, luk);
  var statMatk = calculateStatAtk(int) - int;
  
  var currentSheetAtk = parseFloat(current[0]) || 0;
  var additionalBaseAtk = parseFloat(additional[1]) || 0;
  var currentSheetMatk = parseFloat(current[2]) || 0;
  var additionalBaseMatk = parseFloat(additional[3]) || 0;
  var currentStr = parseFloat(current[4]) || 0;
  var currentLuk = parseFloat(current[5]) || 0;
  var currentDex = parseFloat(current[6]) || 0;
  var currentInt = parseFloat(current[9]) || 0;
  var currentDmg = (parseFloat(current[15]) || 0) / 100 + 1;
  var currentMdmg = (parseFloat(current[19]) || 0) / 100 + 1;
  var currentStatAtk = melee?
    calculateStatAtk(currentStr, currentDex, currentLuk):
    calculateStatAtk(currentDex, currentStr, currentLuk);
  var currentStatMatk = calculateStatAtk(currentInt) - currentInt;
  var currentBaseAtk = currentSheetAtk / currentDmg - currentStatAtk;
  var currentBaseMatk = currentSheetMatk / currentMdmg - currentStatMatk;
  var baseAtk = currentBaseAtk + additionalBaseAtk;
  var baseMatk = currentBaseMatk + additionalBaseMatk;

  if (skillName.includes("auto")) {
    var critMod = 1;
    var aaStr = str * strRatio;
    var aaStatAtk = melee? calculateStatAtk(aaStr, dex, luk): statAtk; 
    var mainStatAABonus = melee? 5*aaStr : 3*dex;
    var matkAABonus = matkAARatio * mdmg * (baseMatk + statMatk);
    var baseAA = baseAtk + aaBonus + mainStatAABonus + matkAABonus;
    if (skillName.includes("crit")) {
      critMod = critDmg - critDmgReduc + .5;
      def = 0;
    }
    return calculatePhysical(
      multipliers, physicalDI, aaDI, aaReduc, critMod, /*skillMultiplier*/ 1, refDmgReduc, refAtk,
      mvpDmg, def, defPercent, ignoreDef, pen, raceDI, aaStatAtk,
      dmg, secretPen, eleDmg, eleDmgReduc, eleTargetDI, sizeDI, sizePenalty, eleWeakness, baseAA
    );
  }

  var skillName = skillName + "";
  switch (skillName) {
    case "staff":
    skillMultiplier = 1;
    baseMatk += 3*int;
    case "magic":
    return calculateMagical(
      multipliers, magicDI, skillDI, skillDmgReduc, skillDmg, skillMultiplier, refMdmgReduc, eleDmg, eleDmgReduc, eleWeakness, refMatk,
      mvpDmg, mdef, mdefPercent, ignoreMdef, mpen, raceDI, statMatk,
      mdmg, secretPen, baseMatk
    );
    break;

    case "melee_physical":
    case "ranged_physical":
    return calculatePhysical(
      multipliers, physicalDI, skillDI, skillDmgReduc, skillDmg, skillMultiplier, refDmgReduc, refAtk,
      mvpDmg, def, defPercent, ignoreDef, pen, raceDI, statAtk,
      dmg, secretPen, eleDmg, eleDmgReduc, eleTargetDI, sizeDI, sizePenalty, eleWeakness, baseAtk
    );
    break;
      
    default: return "error";
  }
}