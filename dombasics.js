
var moveDirection = 0;
var speed = 5;

var interval = setInterval(Move, 1);

var player = document.getElementById('ship');

var bulletBuffer = [20];
var isShooting = false;
PositionPlayer();

function PositionPlayer()
{
   for(var x = 0; x < 20; x++)
   {
      bulletBuffer[x] = null;
   }
   player.style.position = 'absolute';
   var bottom = window.innerHeight;
   player.style.bottom = '0px';
   player.style.left = '0px';
   player.style.height = '50px';
   player.style.width = '100px';
   console.log(player.offsetLeft);
   console.log(window.innerHeight);
   console.log(player.style.left, player.style.right, player.style.top, player.style.bottom);
   console.log(player.style.height);
}

document.addEventListener('keydown', function(event) {
   if (event.key == 'ArrowLeft') {
      event.preventDefault(); // prevent it from doing default behavior, like downarrow moving page downward
      if(player.offsetLeft > 1)
      {
         //player.style.left = player.offsetLeft - 3 + 'px';
         moveDirection = -1;
      }
   }
   if (event.key == 'ArrowRight') {
      //event.preventDefault(); // prevent it from doing default behavior, like downarrow moving page downward
      if(player.offsetLeft < window.innerWidth - 120)
      {
         //player.style.left = player.offsetLeft + 3 + 'px';
         moveDirection = 1;
      }
      const d = new Date();
      console.log(d.getTime());
   }
   if(event.key == 'ArrowUp')
   {
      console.log("space");
      if(isShooting == false)
      {
         isShooting = true;
         SpawnBullet();
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
         isShooting = false;
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

   for(var x = 0; x < 20; x++)
   {
      if(bulletBuffer[x] != null)
      {
         console.log("bullet");
      }
   }
}

function SpawnBullet()
{
   const para = document.createElement("p");
   para.innerText = "This is a paragraph";
   para.style.position = 'absolute';
   document.body.appendChild(para);
   for(var x = 0; x < 20; x++)
   {
      if(bulletBuffer[x] == null)
      {
         bulletBuffer[x] = para;
      }
   }
}