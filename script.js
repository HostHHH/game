const player = document.getElementById('player');
const enemy = document.getElementById('enemy');
const playerHpEl = document.getElementById('playerHp');
const enemyHpEl = document.getElementById('enemyHp');
const gameMenu = document.getElementById('gameMenu');
const menuTitle = document.getElementById('menuTitle');
const menuSubtitle = document.getElementById('menuSubtitle');
const startBtn = document.getElementById('startBtn');
const shopBtn = document.getElementById('shopBtn');
const healBtn = document.getElementById('healBtn');
const randomBtn = document.getElementById('randomBtn');
const strikeBtn = document.getElementById('strikeBtn');
const playerPortrait = document.getElementById('playerPortrait');
const enemyName = document.getElementById('enemyName');
const charBlock = document.querySelector('.characters');
const hotbar = document.querySelector('.hotbar');
const slider = document.getElementById('slider');
const bar = slider ? slider.parentElement : null;
const playerSl = document.getElementById('playerSl');

let playerhp = 200;
let enemyhp = Math.floor(Math.random() * 21) + 140;
let buff = 1;
let enemyNum = 0;
let isTransitioning = false;
let y = 0;
let hero = 'bodka';
let heroBuff = 1.5;

const muscoviteEnemies = [
  "Стрілець-Заблуда", "Застінковий Шляхтич", "Боярський Посіпака",
  "Опричник", "Воєвода Василь Шереметьєв", "Цар Олексій Михайлович",
  "Князь Семен Пожарський", "Дячок-Доносчик", "Драгун-Забіяка",
  "Челядник", "Лапотник", "Под’ячий Викритовець", "Посадський Отаман"
];

const tatarEnemies = [
  "Степовий Нукер", "Ханський Мурза", "Мурза Тугай-Бей",
  "Хан Іслям III Ґерай", "Чауш-Вісник", "Башибузук-Нападник",
  "Ясавул Тремтячий", "Аскер-Стрілець", "Алпаут-Ватажок",
  "Степовий Арканник", "Загонич Людолов", "Сайдак-Охоронець"
];

const polishEnemies = [
  "Гусар-Пійбук", "Яничар-Сорвиголова", "Найманець-Рейтар",
  "Князь Ярема Вишневецький", "Гетьман Миколай Потоцький", "Гетьман Марцин Калиновський",
  "Пан Жолнєж", "Коронний Хорунжий", "Шляхтич-Забіяка",
  "Лисовчик-Грабіжник", "Ротмістр Стражний", "Надвірний Надглядач"
];

const muscoviteBosses = [
  "Цар Іван Грозний", "Цар Петро I", "Імператриця Катерина II", "Цар Федір Іванович"
];

const polishBosses = [
  "Король Ян II Казимир", "Король Сигізмунд III Ваза", "Король Ян III Собеський", "Польний гетьман Марцин Калиновський"
];

const tatarBosses = [
  "Хан Іслям III Ґерай", "Хан Сахіб I Ґерай", "Мурза Тугай-Бей", "Хан Мехмед IV Ґерай"
];

function showMenu(title, subtitle) {
  if (menuTitle && title) menuTitle.textContent = title;
  if (menuSubtitle && subtitle) menuSubtitle.textContent = subtitle;
  if (gameMenu) gameMenu.classList.remove('hidden');
}

function hideMenu() {
  if (gameMenu) gameMenu.classList.add('hidden');
}

function pickChar() {
  if (charBlock) charBlock.classList.toggle('hidden');
}

startBtn.addEventListener('click', () => {
  hideMenu();
  enableHotbar();
  
  if (enemyNum === 0 || (enemyNum === 4 && enemyhp <= 0)) {
    enemyNum = 0;
    nextEnemy();
  }
});

shopBtn.addEventListener('click', () => {
  alert('Магазин у розробці');
});

function showDamage(amount, targetElement) {
  const pop = document.createElement('div');
  pop.classList.add('damage-popup');

  if (amount <= 0) {
    pop.textContent = 'Промах!';
    pop.classList.add('miss');
  } else {
    pop.textContent = `-${amount}`;
    targetElement.classList.remove('hit-anim');
    void targetElement.offsetWidth;
    targetElement.classList.add('hit-anim');
    setTimeout(() => {
      targetElement.classList.remove('hit-anim');
    }, 300);
  }

  targetElement.appendChild(pop);

  setTimeout(() => {
    pop.remove();
  }, 850);
}

function showHeal(amount, targetElement) {
  const pop = document.createElement('div');
  pop.classList.add('damage-popup');
  pop.style.color = '#00ff77';
  pop.textContent = `+${amount}`;

  targetElement.appendChild(pop);

  setTimeout(() => {
    pop.remove();
  }, 850);
}

function heal(amount, targetElement) {
  if (targetElement === player) {
    playerhp = Math.min(200, playerhp + amount);
  } else if (targetElement === enemy) {
    enemyhp += amount;
  }

  showHeal(amount, targetElement);
  update();
}

function loss() {
  alert('You lost');
  console.log('loss work');
}

function update() {
  if (playerHpEl) {
    playerHpEl.textContent = Math.max(0, playerhp);
  } else if (player) {
    player.textContent = Math.max(0, playerhp);
  }

  if (enemyHpEl) {
    enemyHpEl.textContent = Math.max(0, enemyhp);
  } else if (enemy) {
    enemy.textContent = Math.max(0, enemyhp);
  }
}

function enemyAttack() {
  if (enemyhp <= 0 || playerhp <= 0) {
    disableHotbar();
    return;
  }
  
  let pickAttack = Math.floor(Math.random() * 3) + 1;
  let tempEnemyDamage = 0;

  setTimeout(() => {
    if (enemyhp <= 0) return;

    if (pickAttack === 1) {
      switch (enemyNum) {
        case 1: tempEnemyDamage = 20; break;
        case 2: tempEnemyDamage = 35; break;
        case 3: tempEnemyDamage = 45; break;
        case 4: tempEnemyDamage = 60; break;
      } 
      playerhp -= tempEnemyDamage;
      showDamage(tempEnemyDamage, player);
    } else if (pickAttack === 2) {
      switch (enemyNum) {
        case 1: tempEnemyDamage = Math.floor(Math.random() * 31) + 10; break;
        case 2: tempEnemyDamage = Math.floor(Math.random() * 46) + 15; break;
        case 3: tempEnemyDamage = Math.floor(Math.random() * 51) + 20; break;
        case 4: tempEnemyDamage = Math.floor(Math.random() * 81) + 10; break;
      } 
      playerhp -= tempEnemyDamage;
      showDamage(tempEnemyDamage, player);
    } else if (pickAttack === 3) {
      if (enemyNum === 4) {
        playerhp -= 30;
        showDamage(30, player);
      } else {
        showDamage(0, player);
      }
    }

    update();
    checkHP();

    if (playerhp > 0 && enemyhp > 0) {
      enableHotbar();
    }
  }, 1200);
}

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

const keys = { left: false, right: false };
let strike = false;
let posXslider = 0;
let speed = 3;
let posXplayersl = 0;
let speedplayer = 2;

window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;

  if (e.code === 'Space' && !e.repeat && strike) {
    e.preventDefault();
    strike = false;
    attack('strikes');
    if (bar) bar.classList.add('hidden');
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
});

function animate() {
  if (strike && bar) {
    const maxSliderLeft = bar.clientWidth - slider.clientWidth;
    const maxPlayerLeft = bar.clientWidth - playerSl.clientWidth;

    if (keys.left) posXplayersl -= speedplayer;
    if (keys.right) posXplayersl += speedplayer;

    posXplayersl = Math.max(0, Math.min(posXplayersl, maxPlayerLeft));

    posXslider += speed;
    if (posXslider >= maxSliderLeft) {
      posXslider = maxSliderLeft;
      speed = -Math.abs(speed);
    } else if (posXslider <= 0) {
      posXslider = 0;
      speed = Math.abs(speed);
    }

    slider.style.transform = `translateX(${posXslider}px)`;
    playerSl.style.transform = `translateX(${posXplayersl}px)`;
  }

  requestAnimationFrame(animate);
}

function summonStrike() {
  if (!bar) return;
  bar.classList.remove('hidden');
  posXslider = 0;
  speed = Math.abs(speed) || 3;
  posXplayersl = Math.floor(bar.clientWidth / 2 - playerSl.clientWidth / 2);
  slider.style.transform = `translateX(${posXslider}px)`;
  playerSl.style.transform = `translateX(${posXplayersl}px)`;
  strike = true;
  disStrBtn();
}

let roundsRand = 0;
function disRandBtn() {
  if (!randomBtn) return;
  if (!randomBtn.disabled) {
    randomBtn.disabled = true;
    roundsRand = 0;
  } else {
    roundsRand += 1;
    if (roundsRand >= 3) {
      randomBtn.disabled = false;
      roundsRand = 0;
    }
  }
}

let roundsHeal = 0;
function disHealBtn() {
  if (!healBtn) return;
  if (!healBtn.disabled) {
    healBtn.disabled = true;
    roundsHeal = 0;
  } else {
    roundsHeal += 1;
    if (roundsHeal >= 3) {
      healBtn.disabled = false;
      roundsHeal = 0;
    }
  }
}

let roundsStr = 0;
function disStrBtn() {
  if (!strikeBtn) return;
  if (!strikeBtn.disabled) {
    strikeBtn.disabled = true;
    roundsStr = 0;
  } else {
    roundsStr += 1;
    if (roundsStr >= 3) {
      strikeBtn.disabled = false;
      roundsStr = 0;
    }
  }
}

function disableHotbar() {
  if (!hotbar) return;
  hotbar.inert = true;
  hotbar.classList.add('disabled-state');
}

function enableHotbar() {
  if (!hotbar) return;
  hotbar.inert = false;
  hotbar.classList.remove('disabled-state');
}

function nextEnemy() {
  if (isTransitioning) return;
  isTransitioning = true;
  disableHotbar();

  let tempEnemyHp = 1;
  enemy.style.left = '110%';
  
  let tempHeal = Math.floor(Math.random() * 41) + 25;
  heal(tempHeal, player);
  enemyNum += 1;

  setTimeout(() => {
    switch (enemyNum) {
      case 1: tempEnemyHp = Math.floor(Math.random() * 21) + 140; break;
      case 2: tempEnemyHp = Math.floor(Math.random() * 31) + 205; break;
      case 3: tempEnemyHp = Math.floor(Math.random() * 31) + 250; break;
      case 4: tempEnemyHp = Math.floor(Math.random() * 41) + 300; break;
      default: tempEnemyHp = Math.floor(Math.random() * 21) + 140; break;
    }
    enemyhp = tempEnemyHp;

    const portraitEl = document.getElementById('enemyPortrait');
    y = Math.floor(Math.random() * 3) + 1;

    if (enemyNum === 4) {
      const bossIdx = Math.floor(Math.random() * 4);
      const posNum = bossIdx + 1;

      switch (y) {
        case 1:
          enemyName.textContent = muscoviteBosses[bossIdx];
          enemy.bastard = 'moscow';
          break;
        case 2:
          enemyName.textContent = tatarBosses[bossIdx];
          enemy.bastard = 'tatar';
          break;
        case 3:
          enemyName.textContent = polishBosses[bossIdx];
          enemy.bastard = 'poland';
          break;
      }

      if (portraitEl) portraitEl.className = `boss-${enemy.bastard} p-${posNum}`;

    } else {
      const randomIdx = Math.floor(Math.random() * 4) + 1;

      switch (y) {
        case 1:
          enemyName.textContent = muscoviteEnemies[Math.floor(Math.random() * muscoviteEnemies.length)];
          enemy.bastard = 'moscow';
          break;
        case 2:
          enemyName.textContent = tatarEnemies[Math.floor(Math.random() * tatarEnemies.length)];
          enemy.bastard = 'tatar';
          break;
        case 3:
          enemyName.textContent = polishEnemies[Math.floor(Math.random() * polishEnemies.length)];
          enemy.bastard = 'poland';
          break;
      }

      if (portraitEl) portraitEl.className = `faction-${enemy.bastard} p-${randomIdx}`;
    }

    update();
    enemy.style.left = '75%';
    enableHotbar();
    isTransitioning = false;
  }, 2000);
}

function checkHP() {
  if (enemyhp <= 0 && !isTransitioning) {
    if (enemyNum === 4) {
      disableHotbar();
      showMenu('Перемога над Босом!', 'Ви здолали боса.');
      playerhp = 200;
      resetAllCooldowns()
    } else {
      nextEnemy();
    }
  }
  
  if (playerhp <= 0) {
    disableHotbar();
    loss();
  }
}

function selectHero(heros) {
  hero = heros;
  switch (hero) {
    case 'bodka':
      if (playerPortrait) {
        playerPortrait.style.backgroundImage = "url('https://lh3.googleusercontent.com/d/1GZtuUiAZ7RML6HIC12HXH35ZfjUOafzG')";
      }
      heroBuff = 1.25;
      document.body.style.backgroundImage = "url('https://lh3.googleusercontent.com/d/1SVuVSK0z2QougDlakw4Xn3y5xTh34yWR')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      break;
  }
}
function resetAllCooldowns() {
  roundsHeal = 0;
  roundsRand = 0;
  roundsStr = 0;

  if (healBtn) healBtn.disabled = false;
  if (randomBtn) randomBtn.disabled = false;
  if (strikeBtn) strikeBtn.disabled = false;
}
selectHero('bodka');
animate();
update();
disableHotbar();
showMenu('Головне Меню', 'Натисніть кнопку для початку');