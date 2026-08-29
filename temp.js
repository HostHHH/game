function attack(x) {
  if (playerhp <= 0 || enemyhp <= 0 || isTransitioning) return;
  let mosMult = 1
  let tatMult = 1
  let polMult = 1
  if (hero === 'bodka'){
    polMult = 1.15
    tatMult = 0.85
  }
let dmg = 0
let tempShowDamage = 0
  disableHotbar(); 

  if (healBtn && healBtn.disabled) disHealBtn();
  if (strikeBtn && strikeBtn.disabled) disStrBtn();
  if (randomBtn && randomBtn.disabled) disRandBtn();

  if (x === 'random') {
     dmg = (Math.floor(Math.random() * 81) + 40) 
    disRandBtn();
  }
  if (x === 'strikes') {
     dmg = Math.max(0, Math.round(80 * (1 - Math.max(0, Math.abs((posXslider + slider.clientWidth / 2) - (posXplayersl + playerSl.clientWidth / 2)) - 5) / ((slider.clientWidth + playerSl.clientWidth) / 2 - 5))));
  }
  if (x === 'basic') {
     dmg = 50 
  }
  if (x === 'heal') {
    heal(50, player);
    buff = 1.5;
    disHealBtn();
  }
  if(x !== 'heal'){
    switch (enemy.bastard) {
  case 'moscow':
      
      tempShowDamage = Math.floor(dmg * buff * heroBuff * mosMult)
      enemyhp -= tempShowDamage
    break;

  case 'tatar':
    tempShowDamage = Math.floor(dmg * buff * heroBuff * tatMult)
    enemyhp -= tempShowDamage
    break;

  case 'poland':
    tempShowDamage = Math.floor(dmg * buff * heroBuff * polMult)
    enemyhp -=tempShowDamage
    break;

}
    
    showDamage((tempShowDamage), enemy);
    buff = 1;
  }
  update();

  if (enemyhp <= 0) {
    checkHP();
  } else {
    setTimeout(() => {
      enemyAttack();
    }, 450);
  }
}