let player;
let bullets = [];
let enemies = [];
let score = 0;
let timeLeft = 60;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
  setInterval(createEnemy, 1000);
  setInterval(countdown, 1000);
}

function draw() {
  background(220);

  // 更新角色
  player.update();
  player.show();

  // 更新子彈
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();

    // 檢查子彈是否擊中敵人
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bullets[i].hits(enemies[j])) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score++;
        break;
      }
    }

    // 移除超出畫面的子彈
    if (bullets[i] && bullets[i].offscreen()) {
      bullets.splice(i, 1);
    }
  }

  // 更新敵人
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].show();

    // 檢查敵人是否碰撞到角色
    if (enemies[i].hits(player)) {
      gameOver();
    }

    // 移除超出畫面的敵人
    if (enemies[i] && enemies[i].offscreen()) {
      enemies.splice(i, 1);
    }
  }

  // 顯示計分和倒數時間
  textSize(20);
  text("Score: " + score, 30, 30);
  text("Time: " + timeLeft, 30, 60);

  // 檢查遊戲勝利條件
  if (score >= 30) {
    winGame();
  }
}

function mouseClicked() {
  player.shoot();
}

function createEnemy() {
  let enemy = new Enemy();
  enemies.push(enemy);
}

function countdown() {
  timeLeft--;
  if (timeLeft <= 0) {
    gameOver();
  }
}

function gameOver() {
  noLoop();
  background(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  fill(255);
  text("Game Over", width / 2, height / 2);
}

function winGame() {
  noLoop();
  background(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  fill(255);
  text("You Win!", width / 2, height / 2);
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.speed = 5;
    this.size = 30;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    } else if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    } else if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }

  show() {
    fill(0, 255, 0);
    rect(this.x, this.y, this.size, this.size);
  }

  shoot() {
    let bullet = new Bullet(this.x + this.size / 2, this.y);
    bullets.push(bullet);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.size = 10;
  }

  update() {
    this.y -= this.speed;
  }

  show() {
    fill(0);
    ellipse(this.x, this.y, this.size, this.size);
  }

  offscreen() {
    return this.y < 0;
  }

  hits(enemy) {
    let distance = dist(this.x, this.y, enemy.x, enemy.y);
    return distance < this.size / 2 + enemy.size / 2;
  }
}

class Enemy {
  constructor() {
    this.x = random(width);
    this.y = -50;
    this.speed = random(2, 5);
    this.size = 30;
  }

  update() {
    this.y += this.speed;
  }

  show() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.size, this.size);
  }

  offscreen() {
    return this.y > height;
  }

  hits(player) {
    let distance = dist(this.x, this.y, player.x, player.y);
    return distance < this.size / 2 + player.size / 2;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}