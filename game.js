var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });



function preload() {



    game.load.image('bullet', 'assets/player_bullet.jpg');

    game.load.image('enemyBullet', 'assets/enemy_bullet.jpg');

    game.load.image('virus', 'assets/enemy.png');

    game.load.spritesheet('player','assets/player.png',128,128,13);

    game.load.spritesheet('buttons', 'assets/buttons.png',110,110,3);

    game.load.image('background', 'assets/background.jpg');

    if(game.device.desktop == false){
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    }
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

}



var player;

var player;

var playerRight;

var aliens;

var bullets;

var bulletTime = 0;

var cursors;

var fireButton;

var explosions;

var background;

var score = 0;

var scoreString = '';

var scoreText;

var lives;

var enemyBullet;

var firingTimer = 0;

var stateText;

var livingEnemies = [];

var lifeSprite;

var virtualFireButton;

var virtualFireButtonPt;

var virtualLeftButton;

var virtualLeftButtonPt;

var virtualRightButton;

var virtualRightButtonPt;

var isVirtualLeftDown;

var isVirtualRightDown;

var isVirtualFireDown;

var btnRadius;



function create() {



    game.physics.startSystem(Phaser.Physics.ARCADE);



    //  The scrolling background

    background = game.add.tileSprite(0, 0, 800, 600, 'background');



    //  Our bullet group

    bullets = game.add.group();

    bullets.enableBody = true;

    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(30, 'bullet');

    bullets.setAll('anchor.x', 0.5);

    bullets.setAll('anchor.y', 1);

    bullets.setAll('outOfBoundsKill', true);

    bullets.setAll('checkWorldBounds', true);



    // The enemy's bullets

    enemyBullets = game.add.group();

    enemyBullets.enableBody = true;

    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

    enemyBullets.createMultiple(30, 'enemyBullet');

    enemyBullets.setAll('anchor.x', 0.5);

    enemyBullets.setAll('anchor.y', 1);

    enemyBullets.setAll('outOfBoundsKill', true);

    enemyBullets.setAll('checkWorldBounds', true);



    //  The hero!

    player = game.add.sprite(400, 500, 'player');

    player.anchor.setTo(0.5, 0.5);

    player.frame = 6;

    player.animations.add('left', [0,1,2,3,4,5],15,true);

    player.animations.add('right', [7,8,9,10,11,12],15,true);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.setSize(110,110);



    //  The baddies!

    aliens = game.add.group();

    aliens.enableBody = true;

    aliens.physicsBodyType = Phaser.Physics.ARCADE;



    createAliens();



    //  Virtual controls for mobile users

    virtualFireButton = game.add.sprite(680,450, 'buttons',0);

    virtualFireButton.alpha = 0.4;

    virtualFireButtonPt = new Phaser.Point(680, 450)

    virtualLeftButton = game.add.sprite(10,450, 'buttons',1);

    virtualLeftButton.alpha = 0.4;

    virtualLeftButtonPt = new Phaser.Point(10,450);

    virtualRightButton = game.add.sprite(125,450, 'buttons',2);

    virtualRightButton.alpha = 0.4;

    virtualRightButtonPt = new Phaser.Point(125,450);

    btnRadius = 110;

    console.info(game.input.pointers);

    //  The score

    scoreString = 'Score : ';

    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#000' });



    //  Lives

    lives = game.add.group();

    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#000' });



    //  Text

    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#000' });

    stateText.anchor.setTo(0.5, 0.5);

    stateText.visible = false;



    for (var i = 0; i < 3; i++) 

    {

        var soul = lives.create(game.world.width - 100 + (30 * i), 60, 'player');

        soul.scale.setTo(0.25, 0.25);

        soul.anchor.setTo(0.5, 0.5);

        soul.angle = 90;

    }



    //  An explosion pool

    /*
    explosions = game.add.group();

    explosions.createMultiple(30, 'kaboom');

    explosions.forEach(setupInvader, this);
    */



    //  And some controls to play the game with

    cursors = game.input.keyboard.createCursorKeys();

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function isPointerOverButton(buttonLocation, pointer){

    // check if virtual buttons are being touched.

    var d = buttonLocation.distance(pointer.position);

    if(pointer.isDown && d < btnRadius){
        return true;
    }

    return false;
}

function createAliens () {



    for (var y = 0; y < 4; y++)

    {

        for (var x = 0; x < 10; x++)

        {

            var alien = aliens.create(x * (32+ 20), y * (32+ 20), 'virus');

            alien.anchor.setTo(0.5, 0.5);

            alien.body.moves = false;

        }

    }



    aliens.x = 100;

    aliens.y = 50;



    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.

    var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);



    //  When the tween loops it calls descend

    tween.onLoop.add(descend, this);

}



function setupInvader (invader) {



    invader.anchor.x = 0.5;

    invader.anchor.y = 0.5;

    //invader.animations.add('kaboom');



}



function descend() {

    game.add.tween(aliens).to( { y: aliens.y + 10 }, 200, Phaser.Easing.Linear.None, true)

    //aliens.y + 10;



}

function moveLeft(){


    player.body.velocity.x = -200;

    player.play('left');

}

function moveRight(){

    player.body.velocity.x = 200;

    player.play('right');
}

function resetVirtualButtons(){
    isVirtualFireDown = false;
    isVirtualLeftDown = false;
    isVirtualRightDown = false;
}

function update() {

    //  Scroll the background

    //background.tilePosition.y += 2;

    resetVirtualButtons();

    if (player.alive)

    {
        // Check if virtual buttons are touched on a touch enabled device

        game.input.pointers.forEach(function(pointer){
            if(isPointerOverButton(virtualFireButtonPt, pointer)){
                isVirtualFireDown  = true;
            }
            else if(isPointerOverButton(virtualLeftButtonPt, pointer)){
                isVirtualLeftDown = true;
            }
            else if(isPointerOverButton(virtualRightButtonPt, pointer)){
                isVirtualRightDown = true;
            }
        });

        //  Reset the player, then check for movement keys

        player.body.velocity.setTo(0, 0);


        if (cursors.left.isDown || isPointerOverButton(virtualLeftButtonPt,game.input.mousePointer) || isVirtualLeftDown)

        {
            moveLeft();
        }

        else if (cursors.right.isDown || isPointerOverButton(virtualRightButtonPt,game.input.mousePointer) || isVirtualRightDown)

        {
            moveRight();

        }

        else
        {
            player.animations.stop();
            
            player.frame = 6;
        }


        //  Firing?

        if (fireButton.isDown || isPointerOverButton(virtualFireButtonPt,game.input.mousePointer) || isVirtualFireDown)

        {

            fireBullet();

            player.frame = 6;

        }



        if (game.time.now > firingTimer)

        {

            enemyFires();

        }



        //  Run collision

        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);

        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);

    }



}



function render() {



    // for (var i = 0; i < aliens.length; i++)

    // {

    //     game.debug.body(aliens.children[i]);

    // }
    game.input.pointers.forEach(function(p) {

        game.debug.pointer(p);

    });
    game.debug.pointer(game.input.mousePointer);
    

}



function collisionHandler (bullet, alien) {



    //  When a bullet hits an alien we kill them both

    bullet.kill();

    alien.kill();



    //  Increase the score

    score += 20;

    scoreText.text = scoreString + score;



    //  And create an explosion :)

    /*
    var explosion = explosions.getFirstExists(false);

    explosion.reset(alien.body.x, alien.body.y);

    explosion.play('kaboom', 30, false, true);
    */



    if (aliens.countLiving() == 0)

    {

        score += 1000;

        scoreText.text = scoreString + score;



        enemyBullets.callAll('kill',this);

        stateText.text = " You Won, \n Click to restart";

        stateText.visible = true;



        //the "click to restart" handler

        game.input.onTap.addOnce(restart,this);

    }



}



function enemyHitsPlayer (player,bullet) {

    

    bullet.kill();



    live = lives.getFirstAlive();



    if (live)

    {

        live.kill();

    }



    //  And create an explosion :)

    /*
    var explosion = explosions.getFirstExists(false);

    explosion.reset(player.body.x, player.body.y);

    explosion.play('kaboom', 30, false, true);
    */



    // When the player dies

    if (lives.countLiving() < 1)

    {

        player.kill();

        enemyBullets.callAll('kill');



        stateText.text=" GAME OVER \n Click to restart";

        stateText.visible = true;



        //the "click to restart" handler

        game.input.onTap.addOnce(restart,this);

    }



}



function enemyFires () {



    //  Grab the first bullet we can from the pool

    enemyBullet = enemyBullets.getFirstExists(false);



    livingEnemies.length=0;



    aliens.forEachAlive(function(alien){



        // put every living enemy in an array

        livingEnemies.push(alien);

    });





    if (enemyBullet && livingEnemies.length > 0)

    {

        

        var random=game.rnd.integerInRange(0,livingEnemies.length-1);



        // randomly select one of them

        var shooter=livingEnemies[random];

        // And fire the bullet from this enemy

        enemyBullet.reset(shooter.body.x, shooter.body.y);



        game.physics.arcade.moveToObject(enemyBullet,player,120);

        firingTimer = game.time.now + 2000;

    }



}



function fireBullet () {



    //  To avoid them being allowed to fire too fast we set a time limit

    if (game.time.now > bulletTime)

    {

        //  Grab the first bullet we can from the pool

        bullet = bullets.getFirstExists(false);



        if (bullet)

        {

            //  And fire it

            bullet.reset(player.x + 7, player.y - 28);

            bullet.body.velocity.y = -400;

            bulletTime = game.time.now + 200;

        }

    }



}



function resetBullet (bullet) {



    //  Called if the bullet goes out of the screen

    bullet.kill();



}



function restart () {



    //  A new level starts

    

    //resets the life count

    lives.callAll('revive');

    //  And brings the aliens back from the dead :)

    aliens.removeAll();

    createAliens();



    //revives the player

    player.revive();

    //hides the text

    stateText.visible = false;



}
