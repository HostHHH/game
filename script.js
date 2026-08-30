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

// 1. Проста перевірка наявності предмета в мішку
function hasInBag(itemName) {
  return bag.some(item => item && item.name === itemName);
}

// 2. Атака ворога
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
    } else if (pickAttack === 2) {
      switch (enemyNum) {
        case 1: tempEnemyDamage = Math.floor(Math.random() * 31) + 10; break;
        case 2: tempEnemyDamage = Math.floor(Math.random() * 46) + 15; break;
        case 3: tempEnemyDamage = Math.floor(Math.random() * 51) + 20; break;
        case 4: tempEnemyDamage = Math.floor(Math.random() * 81) + 10; break;
      }
    } else if (pickAttack === 3) {
      if (enemyNum === 4) {
        tempEnemyDamage = 30;
      } else {
        tempEnemyDamage = 0;
      }
    }

    // Предмети в мішку зменшують урон ворога
    if (tempEnemyDamage > 0) {
      let damageReduce = 0;
      if (hasInBag('Тризуб УНР')) damageReduce += 10;
      if (hasInBag('Залізний кунтуш')) damageReduce += 3;

      tempEnemyDamage = Math.max(0, tempEnemyDamage - damageReduce);
    }

    playerhp -= tempEnemyDamage;
    showDamage(tempEnemyDamage, player);

    update();
    checkHP();

    if (playerhp > 0 && enemyhp > 0) {
      enableHotbar();
    }
  }, 1200);
}

// 3. Атака гравця
function attack(x) {
  if (playerhp <= 0 || enemyhp <= 0 || isTransitioning) return;
  let mosMult = 1;
  let tatMult = 1;
  let polMult = 1;
  if (hero === 'bodka') {

  }
  switch (hero) {
  case 'bodka':    
    polMult = 1.15;
    tatMult = 0.85;
    break;
  case 'baida':
    tatMult = 1.15;
    polMult = 0.85
    break;
  case 'olezhko':
    mosMult = 1.15
    tatMult = 0.85
    break;
}
  let dmg = 0;
  let tempShowDamage = 0;
  disableHotbar();

  if (healBtn && healBtn.disabled) disHealBtn();
  if (strikeBtn && strikeBtn.disabled) disStrBtn();
  if (randomBtn && randomBtn.disabled) disRandBtn();

  if (x === 'random') {
    dmg = (Math.floor(Math.random() * 81) + 40);
    disRandBtn();
  }
  if (x === 'strikes') {
    dmg = Math.max(0, Math.round(80 * (1 - Math.max(0, Math.abs((posXslider + slider.clientWidth / 2) - (posXplayersl + playerSl.clientWidth / 2)) - 5) / ((slider.clientWidth + playerSl.clientWidth) / 2 - 5))));
  }
  if (x === 'basic') {
    dmg = 50;
  }
  if (x === 'heal') {
    heal(50, player);
    buff = 1.5;
    disHealBtn();
  }

  if (x !== 'heal') {
    
    let extraDamage = 0;
    if (hasInBag('Меч Володьки Великого')) extraDamage += 10;
    if (hasInBag('Загартована козацька шабля')) extraDamage += 5;

    dmg += extraDamage;

    switch (enemy.bastard) {
      case 'moscow':
        tempShowDamage = Math.floor(dmg * buff * heroBuff * mosMult);
        enemyhp -= tempShowDamage;
        break;

      case 'tatar':
        tempShowDamage = Math.floor(dmg * buff * heroBuff * tatMult);
        enemyhp -= tempShowDamage;
        break;

      case 'poland':
        tempShowDamage = Math.floor(dmg * buff * heroBuff * polMult);
        enemyhp -= tempShowDamage;
        break;
    }

    showDamage(tempShowDamage, enemy);
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

  // Використання предметів у мішку по клавішах 1-5
  if (['1', '2', '3', '4', '5'].includes(e.key)) {
    const index = parseInt(e.key) - 1;
    useBagItem(index);
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
let olezhkoBuff = 1
function nextEnemy() {
  if (isTransitioning) return;
  isTransitioning = true;

  if (enemyNum > 0) {
    if(hero === 'olezhko'){olezhkoBuff = 1.5}
    updateScore(Math.floor(Math.random() * 4 * olezhkoBuff) );
    let tempHeal = Math.floor(Math.random() * 41) + 25;
    heal(tempHeal, player);
  }

  disableHotbar();
  let tempEnemyHp = 1;
  enemy.style.left = '110%';

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
      disableHotbar()
      updateScore(Math.floor(Math.random() * 21) + 50)
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
basicBtn = document.getElementById('basicBtn')
const playerName = document.getElementById('playerName')
function selectHero(heros) {
  hero = heros;
  switch (hero) {
    case 'bodka':
      if (playerPortrait) {
        
        playerPortrait.style.backgroundImage = "url('https://lh3.googleusercontent.com/d/1GZtuUiAZ7RML6HIC12HXH35ZfjUOafzG')";
      }
      randomBtn.textContent = 'Задум Молодого Джури'
      strikeBtn.textContent = 'Залп із Засідки'
      basicBtn.textContent = 'Штабний Удар'
      healBtn.textContent = 'Гетьманське Натхнення'
      playerName.textContent = 'Бодька Хмель'
      heroBuff = 1.25;
      document.body.style.backgroundImage = "url('https://lh3.googleusercontent.com/d/1SVuVSK0z2QougDlakw4Xn3y5xTh34yWR')";
      


      break;
    case 'baida':
      if (playerPortrait) {
      randomBtn.textContent = 'Хортицький Хитрощ'
      strikeBtn.textContent = 'Гарматний Залп Хортиці'
      basicBtn.textContent = 'Шабельний Випад'
      healBtn.textContent = 'Мед-Пиво з Хортиці'
        playerPortrait.style.backgroundImage = "url('https://lh3.googleusercontent.com/d/1i8lX1vupJFUOkvU0qsd4r9lARJGUstbe')";
      }
      playerName.textContent = 'Байда Вишнелюб'
      heroBuff = 1;
      document.body.style.backgroundImage = "url('https://lh3.googleusercontent.com/d/1g9S7a0mPpsssC_0xdQ5Z0QGnmc9QJlPU')";
      break;
    case 'olezhko':
      if (playerPortrait) {
        
        playerPortrait.style.backgroundImage = "url('https://lh3.googleusercontent.com/d/1s-crFw98YTLUCE8CryYUqP0xGSmf6cSZ')";
      }
      randomBtn.textContent = 'Хитрість Віщого'
      strikeBtn.textContent = 'Стріла Долі'
      basicBtn.textContent = 'Княжа Дружина'
      healBtn.textContent = 'Варязьке Братерство'
      playerName.textContent = 'Олежко Передбач'
      heroBuff = 1;
      document.body.style.backgroundImage = "url('https://lh3.googleusercontent.com/d/1cnOuhXontzpYSMX8qnHVfqCp8NWVoYGN')";
      break;
  }
        document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
}

function resetAllCooldowns() {
  roundsHeal = 0;
  roundsRand = 0;
  roundsStr = 0;

  if (healBtn) healBtn.disabled = false;
  if (randomBtn) randomBtn.disabled = false;
  if (strikeBtn) strikeBtn.disabled = false;
}

/* ========================================================
   ПРОСТА СИСТЕМА МАГАЗИНУ, ІНВЕНТАРЮ ТА БОЙОВОГО МІШКА
   ======================================================== */

// Товари в магазині (прості об'єкти без типів та ускладнень)
const shopCatalog = [
  {
    id: 'barmatska_pot',
    name: 'Бармацька настоянка',
    price: 50,
    description: 'Відновлює 30 HP',
    icon: '🧪'
  },
  {
    id: 'monocat_gold',
    name: 'Золота морда кота Монобанку',
    price: 150,
    description: '+50% до знайдених монет',
    icon: '🐱'
  },
  {
    id: 'sword_volodya',
    name: 'Меч Володьки Великого',
    price: 200,
    description: '+10 до урону на кожен удар',
    icon: '⚔️'
  },
  {
    id: 'cossack_saber',
    name: 'Загартована козацька шабля',
    price: 60,
    description: '+5 до урону на кожен удар',
    icon: '🗡️'
  },
  {
    id: 'trident_unr',
    name: 'Тризуб УНР',
    price: 180,
    description: '-10 отримуваного урону',
    icon: '🔱'
  },
  {
    id: 'iron_kuntush',
    name: 'Залізний кунтуш',
    price: 50,
    description: '-3 отримуваного урону',
    icon: '🛡️'
  },
  {
    id: 'rusty_nail',
    name: 'Іржавий цвях старухи',
    price: 1,
    description: 'Звичайний іржавий цвях... Чи ні?',
    icon: '📌'
  }
];

// Масиви інвентарю та мішка
const INVENTORY_SIZE = 20;
const BAG_SIZE = 5;

let inventory = new Array(INVENTORY_SIZE).fill(null);
let bag = new Array(BAG_SIZE).fill(null);

let draggedItem = null;
let countScore = 0; 

// DOM елементи
const shop = document.getElementById('shop');
const score = document.getElementById('score');
const shopScore = document.getElementById('ShopScore');
const shopGoodsList = document.getElementById('shopGoodsList');
const inventoryGrid = document.getElementById('inventoryGrid');
const bagGrid = document.getElementById('bagGrid');
const battleBagGrid = document.getElementById('battleBagGrid');
const invCountEl = document.getElementById('invCount');
const bagCountEl = document.getElementById('bagCount');
const trashZone = document.getElementById('trashZone');
const shopToast = document.getElementById('shopToast');

let toastTimer = null;

// Нарахування монет (з перевіркою кота Монобанку)
function updateScore(x) {
  let coins = x;
  if (coins > 0) {
    if (hasInBag('Золота морда кота Монобанку')) {
      coins = Math.floor(coins * 1.5);
    }
  }

  countScore += coins;
  if (score) score.textContent = countScore + ' Монет';
  if (shopScore) shopScore.textContent = countScore + ' Монет';
}

// Повідомлення в магазині
function showShopToast(message, isError = false) {
  if (!shopToast) return;

  clearTimeout(toastTimer);
  shopToast.textContent = message;
  shopToast.className = `shop-toast ${isError ? 'error' : 'success'}`;
  shopToast.classList.remove('hidden');

  toastTimer = setTimeout(() => {
    shopToast.classList.add('hidden');
  }, 2500);
}

// Використання зілля або предмета з мішка
function useBagItem(index) {
  let item = bag[index];
  if (!item) return;

  if (item.name === 'Бармацька настоянка') {
    heal(30, player);
    bag[index] = null;
    renderBag();
    showShopToast('Використано: Бармацька настоянка (+30 HP)', false);
  }
}

// Рендеринг списку товарів у магазині
function renderShopGoods() {
  if (!shopGoodsList) return;
  shopGoodsList.innerHTML = '';

  shopCatalog.forEach(item => {
    const card = document.createElement('div');
    card.className = 'shop-item';
    card.innerHTML = `
      <div class="item-main">
        <div class="item-icon">${item.icon}</div>
        <div class="item-text">
          <div class="item-title" title="${item.name}">${item.name}</div>
          <div class="item-desc">${item.description}</div>
        </div>
      </div>
      <div class="item-buy-row">
        <div class="item-price">🪙 ${item.price} золота</div>
        <button class="buy-btn" onclick="buyItem('${item.id}')">Купити</button>
      </div>
    `;
    shopGoodsList.appendChild(card);
  });
}

// Купівля товару в магазині
function buyItem(itemId) {
  const item = shopCatalog.find(i => i.id === itemId);
  if (!item) return;

  if (countScore < item.price) {
    showShopToast('Не вистачає золота!', true);
    return;
  }

  // Знаходимо перший вільний null в інвентарі
  const emptyIndex = inventory.indexOf(null);
  if (emptyIndex === -1) {
    showShopToast('Інвентар заповнено (20/20)!', true);
    return;
  }

  countScore -= item.price;
  inventory[emptyIndex] = { ...item };

  updateScore(0);
  renderInventory();
  showShopToast(`Куплено: ${item.name}!`, false);
}

// Рендеринг сітки інвентарю
function renderInventory() {
  if (!inventoryGrid) return;
  inventoryGrid.innerHTML = '';

  let occupied = 0;
  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const slot = document.createElement('div');
    slot.className = 'inv-slot';
    slot.dataset.index = i;
    slot.dataset.type = 'inventory';

    const item = inventory[i];
    if (item) {
      occupied++;
      slot.appendChild(createItemElement(item, 'inventory', i));
    }

    attachSlotDropEvents(slot, 'inventory', i);
    inventoryGrid.appendChild(slot);
  }

  if (invCountEl) invCountEl.textContent = `${occupied}/${INVENTORY_SIZE}`;
}

// Рендеринг сітки мішка
function renderBag() {
  if (!bagGrid) return;
  bagGrid.innerHTML = '';

  let occupied = 0;
  for (let i = 0; i < BAG_SIZE; i++) {
    const slot = document.createElement('div');
    slot.className = 'inv-slot bag-slot';
    slot.dataset.index = i;
    slot.dataset.type = 'bag';

    const item = bag[i];
    if (item) {
      occupied++;
      slot.appendChild(createItemElement(item, 'bag', i));
    }

    attachSlotDropEvents(slot, 'bag', i);
    bagGrid.appendChild(slot);
  }

  if (bagCountEl) bagCountEl.textContent = `${occupied}/${BAG_SIZE}`;

  // Оновлюємо нижній бойовий мішок
  renderBattleBag();
}

// Рендеринг нижньої панелі мішка у бою
function renderBattleBag() {
  if (!battleBagGrid) return;
  battleBagGrid.innerHTML = '';

  for (let i = 0; i < BAG_SIZE; i++) {
    const item = bag[i];
    const slot = document.createElement('div');
    slot.className = `battle-bag-slot ${item ? 'filled' : 'empty'}`;
    slot.dataset.index = i;

    const keyBadge = `<span class="slot-key">${i + 1}</span>`;

    if (item) {
      slot.innerHTML = `
        ${keyBadge}
        <div class="battle-item-icon">${item.icon}</div>
        <div class="battle-item-name" title="${item.name}">${item.name}</div>
        <div class="item-tooltip">
          <div class="tt-title">${item.name}</div>
          <div class="tt-desc">${item.description}</div>
          <div class="tt-hint">Клік або клавіша [${i + 1}] щоб використати</div>
        </div>
      `;
      slot.onclick = () => useBagItem(i);
    } else {
      slot.innerHTML = `
        ${keyBadge}
        <div class="battle-item-empty-icon">·</div>
        <div class="battle-item-empty-label">Порожньо</div>
      `;
    }

    battleBagGrid.appendChild(slot);
  }
}

// Створення елемента предмета (для перетягування та кліків)
function createItemElement(item, type, index) {
  const itemEl = document.createElement('div');
  itemEl.className = 'inv-item';
  itemEl.draggable = true;

  const hintText = type === 'inventory'
    ? 'Клік: перенести в мішок'
    : 'Клік: повернути на склад / використати';

  itemEl.innerHTML = `
    <div class="inv-item-icon">${item.icon}</div>
    <div class="item-tooltip">
      <div class="tt-title">${item.name}</div>
      <div class="tt-desc">${item.description}</div>
      <div class="tt-hint">${hintText}</div>
    </div>
  `;

  // Клік по предмету
  itemEl.onclick = (e) => {
    e.stopPropagation();
    handleItemClick(type, index);
  };

  // Drag & Drop
  itemEl.ondragstart = (e) => {
    draggedItem = { type, index };
    itemEl.style.opacity = '0.5';
    e.dataTransfer.setData('text/plain', '');
    e.dataTransfer.effectAllowed = 'move';
  };

  itemEl.ondragend = () => {
    itemEl.style.opacity = '1';
    draggedItem = null;
    clearAllDragHighlights();
  };

  return itemEl;
}

// Переміщення предмета кліком між інвентарем і мішком
function handleItemClick(sourceType, sourceIndex) {
  if (sourceType === 'inventory') {
    const emptyBagIndex = bag.indexOf(null);
    if (emptyBagIndex === -1) {
      showShopToast('Бойовий мішок заповнено (макс. 5)!', true);
      return;
    }

    bag[emptyBagIndex] = inventory[sourceIndex];
    inventory[sourceIndex] = null;
    renderInventory();
    renderBag();
  } else if (sourceType === 'bag') {
    const emptyInvIndex = inventory.indexOf(null);
    if (emptyInvIndex === -1) {
      showShopToast('Склад заповнено (20/20)!', true);
      return;
    }

    inventory[emptyInvIndex] = bag[sourceIndex];
    bag[sourceIndex] = null;
    renderInventory();
    renderBag();
  }
}

// Drag and Drop для слотів
function attachSlotDropEvents(slot, targetType, targetIndex) {
  slot.ondragover = (e) => {
    e.preventDefault();
    if (draggedItem) {
      e.dataTransfer.dropEffect = 'move';
      slot.classList.add('drag-over');
    }
  };

  slot.ondragleave = () => {
    slot.classList.remove('drag-over');
  };

  slot.ondrop = (e) => {
    e.preventDefault();
    slot.classList.remove('drag-over');
    if (!draggedItem) return;

    const { type: srcType, index: srcIndex } = draggedItem;
    if (srcType === targetType && srcIndex === targetIndex) return;

    const srcArray = srcType === 'inventory' ? inventory : bag;
    const tgtArray = targetType === 'inventory' ? inventory : bag;

    const temp = tgtArray[targetIndex];
    tgtArray[targetIndex] = srcArray[srcIndex];
    srcArray[srcIndex] = temp;

    renderInventory();
    renderBag();
  };
}

// Налаштування смітника
function setupTrashZone() {
  if (!trashZone) return;

  trashZone.ondragover = (e) => {
    e.preventDefault();
    if (draggedItem) {
      e.dataTransfer.dropEffect = 'move';
      trashZone.classList.add('drag-over');
    }
  };

  trashZone.ondragleave = () => {
    trashZone.classList.remove('drag-over');
  };

  trashZone.ondrop = (e) => {
    e.preventDefault();
    trashZone.classList.remove('drag-over');
    if (!draggedItem) return;

    const { type: srcType, index: srcIndex } = draggedItem;
    const srcArray = srcType === 'inventory' ? inventory : bag;
    const itemName = srcArray[srcIndex] ? srcArray[srcIndex].name : 'Предмет';

    srcArray[srcIndex] = null;
    draggedItem = null;

    renderInventory();
    renderBag();
    showShopToast(`«${itemName}» видалено!`, false);
  };

  trashZone.onclick = () => {
    showShopToast('Перетягніть сюди предмет для видалення 🗑️', false);
  };
}

function clearAllDragHighlights() {
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}

// Відкриття / закриття магазину
function showShop() {
  if (!shop) return;
  shop.classList.toggle('hidden');
  updateScore(0);

  if (!shop.classList.contains('hidden')) {
    renderShopGoods();
    renderInventory();
    renderBag();
  }
}
const PickHeros = document.querySelectorAll('.hero-tab')
const herosInfo = document.querySelectorAll('.char-details')
function pickingHero(x){
PickHeros.forEach(el => {
  el.classList.remove('active');
 PickHeros[x].classList.add('active')
});


herosInfo.forEach(el => {
  el.classList.add('hidden');
 herosInfo[x].classList.remove('hidden')
});
}

setupTrashZone();
renderShopGoods();
renderInventory();
renderBag();

updateScore(0);
selectHero('bodka');
animate();
update();
disableHotbar();
showMenu('Головне Меню', 'Натисніть кнопку для початку');