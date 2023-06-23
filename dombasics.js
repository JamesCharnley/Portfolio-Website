window.addEventListener("load", OnLoad);

var startBtn = document.getElementById('start-button');
startBtn.addEventListener("click", StartGame)

var controlsImage = null;
function OnLoad()
{
   console.log(window.innerWidth);
   if(window.innerWidth < 1000)
   {
      startBtn.remove();
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
function StartGame()
{
   if(gameActive)
   {
      StopGame();
      return;
   }
   document.getElementById("main").style.animation = "transition-black 3s forwards";
   document.getElementById("body").style.animation = "transition-black 3s forwards";
   controlsImage.style.opacity = 1;
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
   document.getElementById("main").style.animation = "transition-black-back 3s forwards";
   document.getElementById("body").style.animation = "transition-black-back 3s forwards";
   gameActive = false;
   controlsImage.style.opacity = 0;
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
function SpawnPlayer()
{
   
   player = document.createElement("img");
   player.setAttribute("src", "player.png");
   player.style.position = 'absolute';
   document.body.appendChild(player);

   var bottom = window.innerHeight;
   player.style.bottom = '0px';
   player.style.left = window.innerWidth / 2 - 50 + 'px';
   player.style.height = '50px';
   player.style.width = '100px';
   //player.style.backgroundColor = "#2E71F9";
  
}
function SpawnEnemies()
{
   var horizontalStart = window.innerWidth / 2 - 420;
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
         enemies[x][y].style.height = '50px';
         enemies[x][y].style.width = '50px';
         //enemies[x][y].style.backgroundColor = "#88FB45";
         enemies[x][y].style.bottom = verticalOffset+'px';
         enemies[x][y].style.left = horizontalOffset+'px';

         horizontalOffset = horizontalOffset + 70;
      }
      verticalOffset = verticalOffset - 60;

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
         if(isShooting == false)
         {
            isShooting = true;
            SpawnBullet();
         }
      }
      
   }
});
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

function Move()
{
   if(moveDirection != 0)
   {
      console.log("Moveing");
      if(moveDirection == 1)
      {
         if(player.offsetLeft >= window.innerWidth - 120)
         {
            return;
         }
      }
      if(moveDirection == -1)
      {
         if(player.offsetLeft < 1)
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
         enemies[curRow][y].style.left = enemies[curRow][y].offsetLeft + (50 * enemyMoveDirection) +'px';
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
                  if(enemies[x][y].offsetLeft + 100 >= window.innerWidth)
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
                  if(enemies[x][y].offsetLeft <= 50)
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
            enemies[x][y].style.bottom = (window.innerHeight - enemies[x][y].offsetTop) - 100 + 'px';
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
         //bulletBuffer[x].style.height = '20px';
         //bulletBuffer[x].style.width = '20px';
         //bulletBuffer[x].style.backgroundColor = "#88FB45";
         bulletBuffer[x].style.bottom = '50px';

         bulletBuffer[x].style.left = player.offsetLeft + 40 + 'px';

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
            if(window.innerHeight - bulletBuffer[_bulletIndex].offsetTop >= window.innerHeight - enemies[x][y].offsetTop && window.innerHeight - bulletBuffer[_bulletIndex].offsetTop <= window.innerHeight - enemies[x][y].offsetTop + 50)
            {
               if(bulletBuffer[_bulletIndex].offsetLeft + 20 >= enemies[x][y].offsetLeft && bulletBuffer[_bulletIndex].offsetLeft <= enemies[x][y].offsetLeft + 50)
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