var bg,bgImg;
var player, shooterImg, shooter_shooting;
var hear1, heart1Img, heart2, heart2Img, heart3, heart3Img;
var zombie, zombieImg, zombieGroup;
var bullets = 70, bullet, bulletGroup, bulletImg;
var gameState = "fight";
var score = 0;
var life = 3;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png");
  shooter_shooting = loadImage("assets/shooter_3.png");

  bgImg = loadImage("assets/bg.jpeg");
  zombieImg = loadImage("assets/zombie.png");

  heart1Img = loadImage("assets/heart_1.png");
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png");

  winSound = loadSound("assets/win.mp3");
  loseSound = loadSound("assets/lose.mp3");
  explosionSound = loadSound("assets/explosion.mp3");
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20);
bg.addImage(bgImg);
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)

  heart1 = createSprite(displayWidth-150,40,20,20);
  heart1.addImage(heart1Img);
  heart1.scale = 0.45;
  heart2 = createSprite(displayWidth-100,40,20,20);
  heart2.addImage(heart2Img);
  heart2.scale = 0.45;
  heart3 = createSprite(displayWidth-150,40,20,20);
  heart3.addImage(heart3Img);
  heart3.scale = 0.45;

  zombieGroup = new Group();
  bulletGroup = new Group();
}

function draw() {
  background(0); 
if(gameState==="fight") {
  if(life===3) {
    heart3.visible = true;
    heart1.visible = false;
    heart2.visible = false;
  }
  if(life===2) {
    heart2.visible = true;
    heart1.visible = false;
    heart3.visible = false;
  }
  if(life===1) {
    heart1.visible = true;
    heart2.visible = false;
    heart3.visible = false;
  }
  if(life===0) {
    gameState = "lost";
  }
  if(score==20) {
    gameState = "won";
    winSound.play();
  }
  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  player.addImage(shooter_shooting)
  bullet = createSprite(displayWidth-1150,player.y-30,20,10);
  bullet.velocityX = 20;
  bulletGroup.add(bullet);
  bullets = bullets - 1;
  explosionSound.play();
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg);
}

if(bullets === 0) {
  gameState = "bullet";
  loseSound.play();
}

if(zombieGroup.isTouching(bulletGroup)) {
  for(var i = 0;i<zombieGroup.length;i++) {
    if(zombieGroup[i].isTouching(bulletGroup)) {
      zombieGroup[i].destroy();
      bulletGroup.destroyEach();
      score = score + 2;
      explosionSound.play();
    }
  }
}

if(zombieGroup.isTouching(player)) {
  loseSound.play();
  for(var i = 0;i<zombieGroup.length;i++) {
    if(zombieGroup[i].isTouching(player)) {
      zombieGroup[i].destroy();
      life = life - 1;
    }
  }
}
spawnZombies();
}
drawSprites();
textSize(20);
fill("white");
text("Bullets="+bullets,70,displayHeight/2-300);
text("Score="+score,70,displayHeight/2-260);
text("Lives="+life,70,displayHeight/2-220);
if(gameState === "lost") {
  fill("red");
  textSize(100);
  text("You Lost", 500, 200);
  zombieGroup.destroyEach();
  player.destroy();
  loseSound.play();
} 
else if(gameState === "won") {
  fill("yellow");
  textSize(100);
  text("You Won", 500, 200);
  zombieGroup.destroyEach();
  player.destroy();
  winSound.play();
}
else if(gameState === "bullet") {
  fill("yellow");
  textSize(50);
  text("You Ran Out of Bullets", 500, 200);
  zombieGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();
}
}

function spawnZombies() {
  if(frameCount%50===0) {
    zombie = createSprite(random(500,1100),random(100,500),40,40);
    zombie.addImage(zombieImg);
    zombie.velocityX = -3;
    zombie.scale = 0.16;
    zombieGroup.add(zombie);
  }
}

