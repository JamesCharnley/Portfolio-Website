window.addEventListener("load", OnLoad);

var startBtn = document.getElementById('start-button');
startBtn.addEventListener("click", StartGame)

var leftControlButton = document.getElementById('left-control');
leftControlButton.addEventListener("touchend", ResetMoveDirection);
leftControlButton.addEventListener("touchstart", function(event){
   if(gameActive)
   {
      event.preventDefault();
      SetMoveDirectionLeft();
   }
   
});
var rightControlButton = document.getElementById('right-control');
rightControlButton.addEventListener("touchend", ResetMoveDirection);
rightControlButton.addEventListener("touchstart", function(event){
   if(gameActive)
   {
      event.preventDefault();
      SetMoveDirectionRight();
   }
   
});
var shootControlButton = document.getElementById('shoot-control');
shootControlButton.addEventListener("touchend", function(event){
   if(gameActive)
   {
      event.preventDefault();
      Shoot();
   }
   
});
var controlsImage = null;

var touchControlWidth = 50;
var touchControlHeight = 50;
var touchControlSpacing = 30;
function OnLoad()
{
   console.log(window.innerWidth);
   if(window.innerWidth < 1000)
   {
      //startBtn.remove();
      enemyWidth = enemyWidth / 4;
      enemyHeight = enemyHeight / 4;
      enemySpacingVertical = enemySpacingVertical / 4;
      enemySpacingHorizontal = enemySpacingHorizontal / 4;
      playerWidth = playerWidth / 3;
      playerHeight = playerHeight / 3;

      bulletWidth = bulletWidth / 4;
      bulletheight = bulletheight / 4;

      screenStopBuffer = screenStopBuffer / 3;

      leftControlButton.style.bottom = '100px';
      leftControlButton.style.left = window.innerWidth - (touchControlWidth + touchControlSpacing) * 2 + 'px';

      

      rightControlButton.style.bottom = '100px';
      rightControlButton.style.left = window.innerWidth - (touchControlWidth + touchControlSpacing) + 'px';

     

      shootControlButton.style.bottom = '100px';
      shootControlButton.style.left = 0 + touchControlSpacing + 'px';
   }
   else
   {
      
   controlsImage = document.createElement("img");
      controlsImage.setAttribute("src", "SIControls.png");
      controlsImage.style.position = 'absolute';
      document.body.appendChild(controlsImage);
      controlsImage.style.opacity = 0;

      controlsImage.style.bottom = '50px';
      controlsImage.style.left = window.innerWidth / 2 - 100 + 'px';
   }
   leftControlButton.style.opacity = 0;
   rightControlButton.style.opacity = 0;
   shootControlButton.style.opacity = 0;
}

var moveDirection = 0;
var speed = 2;
var bulletSpeed = 1;
var interval = null;
var enemiesMoveInterval = null;
var enemiesMoveIntervalValue = 300;
var bulletMoveInterval = null;
var shootInterval = null;
var player = null;

var bulletBuffer = [20];
var enemies = [[12], [12], [12], [12], [12], [12]];
var isShooting = false;
var gameActive = false;
var increaseSpeed = false;
var enemySprites = ["SIB.png", "SIR.png", "SIG.png"];
function ResetMoveDirection()
{
   moveDirection = 0;
}
function SetMoveDirectionLeft()
{
   moveDirection = -1;
}
function SetMoveDirectionRight()
{
   moveDirection = 1;
}
function StartGame()
{
   if(gameActive)
   {
      StopGame();
      return;
   }
   if(window.innerWidth < 1000)
   {
      leftControlButton.style.opacity = 1;
      rightControlButton.style.opacity = 1;
      shootControlButton.style.opacity = 1;
   }
   document.getElementById("main").style.animation = "transition-black 3s forwards";
   document.getElementById("body").style.animation = "transition-black 3s forwards";
   if(controlsImage != null)
   {
      controlsImage.style.opacity = 1;
   }
   
   var titleBox = document.getElementById("title-box");
   titleBox.style.opacity = 0;

   for(var x = 0; x < 20; x++)
   {
      bulletBuffer[x] = null;
   }
   SpawnPlayer();
   SpawnEnemies();

   curRow = 5;
   enemyMoveDirection = 1;

   interval = setInterval(Move, 1);
   enemiesMoveInterval = setInterval(MoveEnemies, enemiesMoveIntervalValue);
   bulletMoveInterval = setInterval(MoveBullets, 50);
   gameActive = true;

   startBtn.innerHTML = "Stop";
}

function StopGame()
{
   if(window.innerWidth < 1000)
   {
      leftControlButton.style.opacity = 0;
      rightControlButton.style.opacity = 0;
      shootControlButton.style.opacity = 0;
   }
   document.getElementById("main").style.animation = "transition-black-back 3s forwards";
   document.getElementById("body").style.animation = "transition-black-back 3s forwards";
   gameActive = false;
   if(controlsImage != null)
   {
      controlsImage.style.opacity = 0;
   }
   
   player.remove();
   player = null;
   for(var x = 0; x < 6; x++)
   {
      for(var y = 0; y < 12; y++)
      {
         if(enemies[x][y] != null)
         {
            enemies[x][y].remove();
            enemies[x][y] = null;
         }
      }
   }
   for(var x = 0; x < 20; x++)
   {
      if(bulletBuffer[x] != null)
      {
         bulletBuffer[x].remove();
         bulletBuffer[x] = null;
      }
   }
   clearInterval(interval);
   clearInterval(enemiesMoveInterval);
   enemiesMoveIntervalValue = 300;
   clearInterval(MoveBullets);
   var titleBox = document.getElementById("title-box");
   titleBox.style.opacity = 1;

   startBtn.innerHTML = "Play";
}
var playerWidth = 100;
var playerHeight = 50;
function SpawnPlayer()
{
   
   player = document.createElement("img");
   player.setAttribute("src", "player.png");
   player.style.position = 'absolute';
   document.body.appendChild(player);

   var bottom = window.innerHeight;
   player.style.bottom = '0px';
   player.style.left = window.innerWidth / 2 - playerWidth / 2 + 'px';
   player.style.height = playerHeight+'px';
   player.style.width = playerWidth + 'px';
   //player.style.backgroundColor = "#2E71F9";
  
}
var enemyWidth = 50;
var enemyHeight = 50;
var enemySpacingHorizontal = 20;
var enemySpacingVertical = 10;
function SpawnEnemies()
{
   var horizontalStart = window.innerWidth / 2 - (((enemyWidth + enemySpacingHorizontal) * 12) / 2);
   var horizontalOffset = 1;
   var verticalOffset = window.innerHeight * 0.9;

   var spriteIndex = 0;
   for(var x = 0; x < 6; x++)
   {
      horizontalOffset = horizontalStart;
      for(var y = 0; y < 12; y++)
      {
         var para = document.createElement("img");
         para.setAttribute("src", enemySprites[spriteIndex]);
         //elem.setAttribute("height", "768");
         //elem.setAttribute("width", "1024");
         //elem.setAttribute("alt", "Flower");
         //document.getElementById("placehere").appendChild("elem");

         //const para = document.createElement("div");
         para.style.position = 'absolute';
         document.body.appendChild(para);
         enemies[x][y] = para;
         enemies[x][y].style.bottom = '0px';
         enemies[x][y].style.left = '0px';
         enemies[x][y].style.height = enemyHeight + 'px';
         enemies[x][y].style.width = enemyWidth + 'px';
         //enemies[x][y].style.backgroundColor = "#88FB45";
         enemies[x][y].style.bottom = verticalOffset+'px';
         enemies[x][y].style.left = horizontalOffset+'px';

         horizontalOffset = horizontalOffset + enemyWidth + enemySpacingHorizontal;
      }
      verticalOffset = verticalOffset - (enemyHeight + enemySpacingVertical);

      spriteIndex++;
      if(spriteIndex == enemySprites.length)
      {
         spriteIndex = 0;
      }
   }
}
document.addEventListener('keydown', function(event) {
   if (event.key == 'ArrowLeft') {
      if(gameActive)
      {
         event.preventDefault(); // prevent it from doing default behavior, like downarrow moving page downward
         if(player.offsetLeft > 1)
         {
         //player.style.left = player.offsetLeft - 3 + 'px';
         moveDirection = -1;
         }
      }
      
   }
   if (event.key == 'ArrowRight') {
      if(gameActive)
      {
         event.preventDefault(); // prevent it from doing default behavior, like downarrow moving page downward
         if(player.offsetLeft < window.innerWidth - 120)
         {
            //player.style.left = player.offsetLeft + 3 + 'px';
            moveDirection = 1;
         }
      }
      
      const d = new Date();
      console.log(d.getTime());
   }
   if(event.key == 'ArrowUp')
   {
      if(gameActive)
      {
         event.preventDefault();
         Shoot();
      }
      
   }
});
function Shoot()
{
   if(isShooting == false)
   {
      isShooting = true;
      SpawnBullet();
   }
}
document.addEventListener('keyup', function(event) {
   if (event.key == 'ArrowLeft') {
      event.preventDefault(); // prevent it from doing default behavior, like downarrow moving page downward
      moveDirection = 0;
   }
   if (event.key == 'ArrowRight') {
      //event.preventDefault(); // prevent it from doing default behavior, like downarrow moving page downward
      moveDirection = 0;
      
   }
   if(event.key == 'ArrowUp')
   {
      if(isShooting == true)
      {
         //isShooting = false;
      }
   }
});

var rightScreenStopBuffer = 20;
function Move()
{
   if(moveDirection != 0)
   {
      console.log("Moveing");
      if(moveDirection == 1)
      {
         if(player.offsetLeft >= window.innerWidth - (playerWidth + screenStopBuffer))
         {
            return;
         }
      }
      if(moveDirection == -1)
      {
         if(player.offsetLeft < screenStopBuffer)
         {
            return;
         }
      }
      player.style.left = player.offsetLeft + speed * moveDirection + 'px';
   }

   
}

function MoveBullets()
{
   for(var x = 0; x < 20; x++)
   {
      if(bulletBuffer[x] != null)
      {
         console.log("move bullet");
         bulletBuffer[x].style.bottom = (window.innerHeight - bulletBuffer[x].offsetTop) + bulletSpeed + 'px';
         BulletCollisionCheck(x);
      }
   }
}

var curRow = 5;
var enemyMoveDirection = 1;
function MoveEnemies()
{
   for(var y = 0; y < 12; y++)
   {
      if(enemies[curRow][y] != null)
      {
         enemies[curRow][y].style.left = enemies[curRow][y].offsetLeft + (enemyWidth * enemyMoveDirection) +'px';
      }
   }
   curRow--;
   if(curRow == -1)
   {
      curRow = 5;

      if(enemyMoveDirection == 1)
      {
         for(var x = 0; x < 6; x++)
         {
            for(var y = 0; y < 12; y++)
            {
               if(enemies[x][y] != null)
               {
                  if(enemies[x][y].offsetLeft + enemyWidth * 2 >= window.innerWidth)
                  {
                     enemyMoveDirection = -1;
                     MoveEnemiesDown();
                     return;
                  }
               }
            }
         }
      }
      else
      {
         for(var x = 0; x < 6; x++)
         {
            for(var y = 0; y < 12; y++)
            {
               if(enemies[x][y] != null)
               {
                  if(enemies[x][y].offsetLeft <= enemyWidth)
                  {
                     enemyMoveDirection = 1;
                     MoveEnemiesDown();
                     return;
                  }
               }
            }
         }
      }
   }
   if(increaseSpeed == true)
   {
      increaseSpeed = false;
      
      clearInterval(enemiesMoveInterval);
      enemiesMoveInterval = setInterval(MoveEnemies, enemiesMoveIntervalValue);
   }
}

function MoveEnemiesDown()
{
   for(var x = 0; x < 6; x++)
   {
      for(var y = 0; y < 12; y++)
      {
         if(enemies[x][y] != null)
         {
            enemies[x][y].style.bottom = (window.innerHeight - enemies[x][y].offsetTop) - enemyHeight * 2 + 'px';
            if(window.innerHeight - enemies[x][y].offsetTop - 50 <= window.innerHeight - player.offsetTop)
            {
               console.log("Lose");
               StopGame();
               return;
            }
         }
      }
   }
}
var bulletWidth = 20;
var bulletheight = 20;
function SpawnBullet()
{
   shootInterval = setInterval(UnlockShooting, 500);
   const para = document.createElement("img");
   para.setAttribute("src", "SIBullet.png");
   para.style.position = 'absolute';
   document.body.appendChild(para);
   for(var x = 0; x < 20; x++)
   {
      if(bulletBuffer[x] == null)
      {
         bulletBuffer[x] = para;
         bulletBuffer[x].style.bottom = '0px';
         bulletBuffer[x].style.left = '0px';
         bulletBuffer[x].style.height = bulletheight + 'px';
         bulletBuffer[x].style.width = bulletWidth + 'px';
         //bulletBuffer[x].style.backgroundColor = "#88FB45";
         bulletBuffer[x].style.bottom = playerHeight + 'px';

         bulletBuffer[x].style.left = player.offsetLeft + playerWidth / 2 - bulletWidth / 2 + 'px';

         break;
      }
   }
}

function UnlockShooting()
{
   isShooting = false;
   clearInterval(shootInterval);
}

function BulletCollisionCheck(_bulletIndex)
{
   if(window.innerHeight - bulletBuffer[_bulletIndex].offsetTop >= window.innerHeight)
   {
      console.log("bullet off screen");
      bulletBuffer[_bulletIndex].remove();
      bulletBuffer[_bulletIndex] = null;
   }

   for(var x = 0; x < 6; x++)
   {
      for(var y = 0; y < 12; y++)
      {
         if(enemies[x][y] != null && bulletBuffer[_bulletIndex] != null)
         {
            if(window.innerHeight - bulletBuffer[_bulletIndex].offsetTop >= window.innerHeight - enemies[x][y].offsetTop && window.innerHeight - bulletBuffer[_bulletIndex].offsetTop <= window.innerHeight - enemies[x][y].offsetTop + enemyHeight)
            {
               if(bulletBuffer[_bulletIndex].offsetLeft + bulletWidth >= enemies[x][y].offsetLeft && bulletBuffer[_bulletIndex].offsetLeft <= enemies[x][y].offsetLeft + enemyWidth)
               {
                  bulletBuffer[_bulletIndex].remove();
                  bulletBuffer[_bulletIndex] = null;
                  enemies[x][y].remove();
                  enemies[x][y] = null;
                  increaseSpeed = true;
                  enemiesMoveIntervalValue = enemiesMoveIntervalValue - 4;
               }
            }
         }
         
      }
   }
   var allNull = true;
   for(var x = 0; x < 6; x++)
   {
      for(var y = 0; y < 12; y++)
      {
         if(enemies[x][y] != null)
         {
            allNull = false;
         }
      }
   }
   if(allNull == true)
   {
      StopGame();
   }
}