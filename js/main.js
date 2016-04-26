window.onload = function () {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game(500 , 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    
    function preload() 
    {
        //characters
        //game.load.spritesheet('player', 'assets/player.png', 32, 32); 
        game.load.spritesheet('player', 'assets/player_small.png', 25, 25);
        //map
        game.load.tilemap('map', 'assets/test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tile1', 'assets/tile1.png');
        game.load.image('tile2', 'assets/tile2.png');
        //enemy
        game.load.spritesheet('bat', 'assets/enemy_sheet.png', 32, 32, 3);        
        //objects
        game.load.image('rock', 'assets/bigrock.png');
        game.load.image('dirt', 'assets/dirt.png');
        game.load.image('chest', 'assets/collect.png');
        game.load.image('treasure', 'assets/gem.png');
        game.load.image('food', 'assets/food.png');
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('map', 'assets/map_piece.png');
        game.load.image('final', 'assets/end_treasure.png');
        game.load.image('bar', 'assets/bar.png');
        //animation
        game.load.spritesheet('chestAni', 'assets/Heal6.png', 100, 100, 30);
        game.load.spritesheet('attack1', 'assets/Attack1.png', 110, 110, 4);
        game.load.spritesheet('fire', 'assets/fire.png', 110, 110, 28);
        //bars
        game.load.image('healthbar', 'assets/healthbar_bar.png');
        game.load.image('healthbarBackground', 'assets/healthbar_background.png');
        game.load.image('attentionbar', 'assets/healthbar_bar2.png');
        game.load.image('redBar', 'assets/red_bar.png');
        //Pause and game over screens
        game.load.image('pause_button', 'assets/pause_button.png');
        game.load.image('pauseScreen', 'assets/pause_screen.png');
        game.load.image('gameoverScreen', 'assets/gameover_screen.png');
        game.load.image('restartButton', 'assets/restart_button.png');
        game.load.image('winScreen', 'assets/win_screen.png');
        //start menu
        game.load.image('menu', 'assets/menu.png');
        //music
        game.load.audio('explode', 'assets/explode.wav'); //for bomb collision
        game.load.audio('boost', 'assets/boost.wav'); //for food collision
        game.load.audio('goodchest', 'assets/goodchest.wav'); //for opening "good" chest
        game.load.audio('badchest', 'assets/badchest.wav'); //for opening "bad" chest
        game.load.audio('gemsound', 'assets/gemsound.wav') ; //for picking up gem 
        game.load.audio('batsound', 'assets/batsound.wav') ; //for colliding with bats 
        game.load.audio('dead', 'assets/dead.wav') ; //for being dead 
        game.load.audio('cheer', 'assets/cheer.mp3'); //for winning 
        game.load.audio('mapsound', 'assets/mapsound.wav'); //for picking up maps; 
                    
    }
    
    
    var healthbar;
    var healthbarBackground;
    var healthbarWidth;
    var hungerIsRed = false;
    var hungerIsGreen = true;
    var attentionIsRed = false;
    var attentionIsGreen = true;
    var redBarLimit = 600;
    
    var pauseScreen;
    var gameoverScreen;
    var restartButton;
    
    var attentionbar;
    var attentionbarBackground;
    var attentionbarWidth;    
    var pauseButton;
    
    var map;
    var tileset;
    var layer;
    var p;
    var cursors;
    var key1;    
    
    //text
    var message;
    var location;
    var hungerText;
    var attentionText;
    var mapText;
    
    //objects
    var ground;
    var rocks;
    var chests;
    var treasures;
    var enemies;
    var foods;
    var bombs;
    var map;
    var endPrize;
    var endX = game.rnd.between(0, 99)*32;
    var endY = game.rnd.between(0, 99)*32;
    //var endX = 1650;
    //var endY = 1650;
    var bar;
    
    
    //animations
    var addAni;
    var animate;    
    
    //in game stats
    var mapPieceCount = 0;
    var hunger = 3000;
    var hungerMax = 3000;
    var attention = 3000;
    var attentionMax = 3000;
    var attentionMax = 3000;
    var score = 0;
    var speed = 200;
    
    var gameover = false;
    //var dirtCount = 0;
    var time = 0;
    
    var bombTime = 0;
    var oldBombTime = 0;    
    
    //start menu
    var menu;
    
    //audio
    var explode; 
    var boost;
    var goodchest;
    var badchest; 
    var gemsound; 
    var batsound;
    var dead; 
    var cheer;
    var mapsound; 
    
    function create() 
    {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#000000';
        
        
        //make world
        map = game.add.tilemap('map');
        map.addTilesetImage('tile1', 'tile1');
        map.addTilesetImage('tile2', 'tile2');       
        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();
        
        //make stuff
        
        //endgame prize
        endPrize = game.add.physicsGroup();
        var end = endPrize.create(endX, endY, 'final');  
        endPrize.visible = false;
        
        //add map pieces
        map = game.add.physicsGroup();
        var piece = map.create(game.rnd.between(0, 50)*32,game.rnd.between(0, 50)*32, 'map');
        piece = map.create(game.rnd.between(49, 99)*32,game.rnd.between(0, 50)*32, 'map');
        piece = map.create(game.rnd.between(0, 50)*32,game.rnd.between(49, 99)*32, 'map');
        piece = map.create(game.rnd.between(49, 99)*32,game.rnd.between(49, 99)*32, 'map');
 
        //var piece = map.create(1500,1500, 'map');
        //piece = map.create(1550, 1500, 'map');
        //piece = map.create(1600, 1500, 'map');
        //piece = map.create(1650, 1500, 'map');
        
        //add food
        foods = game.add.physicsGroup();
        for(var i = 0; i < 9; i++){
            var f = foods.create(game.rnd.between(0, 99)*32,game.rnd.between(0, 99)*32, 'food');
        }        
        var f = foods.create(1700,1700, 'food');
        
        //add tresure
        treasures = game.add.physicsGroup();
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < 100; j++){
                var rnd = game.rnd.between(0, 100)
                if(rnd < 10){       
                    if(!(i == 50 && j == 50)){
                        var t = treasures.create(32*i,j*32, 'treasure');
                    }  
                }
              }
        }         
        
       
        //treasure chest
        chests = game.add.physicsGroup();
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < 100; j++){
                var rnd = game.rnd.between(0, 100)
                if(rnd == 5){     
                    if(!(i == 50 && j == 50)){
                        var c = chests.create(32*i,j*32, 'chest');
                    }
                }
              }
        }  

        //create dirt
        ground = game.add.group();
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < 100; j++){
                var rnd = game.rnd.between(0, 100)
                if(rnd > 10){    
                    if(!(i == 50 && j == 50)){
                        var d = ground.create(32*i,j*32, 'dirt');
                        game.physics.arcade.enable(d);                        
                    }
                }
              }
        }        
        
        //make bombs
        bombs = game.add.physicsGroup();
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < 100; j++){
                var rnd = game.rnd.between(0, 100);
                if(rnd > 95){
                    if(!(i == 50 && j == 50)){
                        var b = bombs.create(32*i,j*32, 'bomb');
                        b.body.mass = -80;                                
                    }
                }

            }
        }         
        
        //make rock   
        rocks = game.add.physicsGroup();
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < 100; j++){
                var rnd = game.rnd.between(0, 100);
                if(rnd > 70){
                    if(!(i == 50 && j == 50)){
                        var r = rocks.create(32*i,j*32, 'rock');
                        r.body.mass = -100;                            
                    }            
                }
            }
        } 
        
        //make enemies
        var y = 2400
        enemies = game.add.physicsGroup();
        for(var i = 0; i < 5; i++){
            var e = enemies.create(game.world.randomX, y, 'bat');
            e.body.velocity.x = game.rnd.between(200, 400);
            var move = e.animations.add('fly');
            e.animations.play('fly',10, true);            
            y += 128;
        }
    
        //make player
        p = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        game.physics.enable(p);     
        p.body.collideWorldBounds = true;
        p.animations.add('right', [3, 4, 5], 10, true);
        p.animations.add('up', [9, 10, 11], 10, true);
        p.animations.add('down', [0, 1, 2], 10, true);
        p.animations.add('left', [6, 7, 8], 10, true);         
        
        //game camera
        game.camera.follow(p);     
        
        //controls
        cursors = game.input.keyboard.createCursorKeys();
        key1 = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        
        //black bar
        bar = game.add.group();
        var b = bar.create(0, -60, 'bar');
        b = bar.create(0, 460, 'bar');
        bar.fixedToCamera = true;
        
        //text
        message = game.add.text(10, 470, 'move with arrow keys and action with [ Z ]', { fontSize: '10px', fill: '#fff' });
        message.fontSize = 15;
        message.font = 'Arial Black';
        message.fixedToCamera = true;
        
        location = game.add.text(10, 10, 'X: ' + p.x + ' Y: ' + p.y, { fontSize: '10px', fill: '#fff' });
        location.fontSize = 15;
        location.font = 'Arial Black';
        location.fixedToCamera = true;
        
        mapText = game.add.text(360, 10, 'Map Pieces: ' + mapPieceCount + '/4', { fontSize: '10px', fill: '#fff' });
        mapText.fontSize = 15;
        mapText.font = 'Arial Black';
        mapText.fixedToCamera = true;        
        
        //Add healthbar background and bar
        healthbarBackground = game.add.image(10,50,'healthbarBackground');
        healthbarBackground.fixedToCamera = true;     
        healthbar = game.add.image(healthbarBackground.x+5,healthbarBackground.y+5,'healthbar');
        healthbar.fixedToCamera = true;
        healthbarWidth = healthbar.width;
        
        //Add attentionbar background and bar
        attentionbarBackground = game.add.image(10,90,'healthbarBackground');
        attentionbarBackground.fixedToCamera = true;     
        attentionbar = game.add.image(attentionbarBackground.x+5,attentionbarBackground.y+5,'attentionbar');
        attentionbar.fixedToCamera = true;
        attentionbarWidth = attentionbar.width;
        
        //hunger bar and attention bar text
        hungerText = game.add.text(20, 58, 'HUNGER ', { fontSize: '10px', fill: '#fff' });
        hungerText.fontSize = 10;
        hungerText.font = 'Arial';
        hungerText.fixedToCamera = true;    
        attentionText = game.add.text(20, 98, 'ATTENTION SPAN ', { fontSize: '10px', fill: '#fff' });
        attentionText.fontSize = 10;
        attentionText.font = 'Arial';
        attentionText.fixedToCamera = true;            
        
        //Add pause button
        
        pauseButton = this.game.add.image(450, 450, 'pause_button');
        pauseButton.scale.setTo(0.05, 0.05);
        pauseButton.fixedToCamera = true;
        pauseButton.inputEnabled = true;
        pauseButton.events.onInputUp.add(pause,this);
        this.game.input.onDown.add(unpause,this);
        
        
         //Add pause screen
        pauseScreen = game.add.image(250,250,'pauseScreen');
        pauseScreen.fixedToCamera = true;
        pauseScreen.anchor.setTo(0.5, 0.5);
        pauseScreen.visible = false;
        
        //Add menu
        menu = game.add.image(0,0,'menu');
        game.paused = true;
        this.game.input.onDown.add(restart,this);
        
        //Add audio
        explode = game.add.audio('explode'); explode.volume = 1;
        boost = game.add.audio('boost'); boost.volume = 1; 
        goodchest = game.add.audio('goodchest'); goodchest.volume = 1;
        badchest = game.add.audio('badchest'); badchest.volume = 1; 
        gemsound = game.add.audio('gemsound'); gemsound.volume = 1; 
        batsound = game.add.audio('batsound'); batsound.volume = 1; 
        dead = game.add.audio('dead'); dead.volume = 1; 
        cheer = game.add.cheer('cheer'); cheer.volume = 1; 
        mapsound = game.add.mapsound('mapsound') ; mapsound.volume = 1; 
    }
    
    
     function restart()
    {
        menu.visible = false;
        game.paused = false;
    }
    
    
    function pause()
    {
        pauseScreen.visible = true;
        game.paused = true;
    }
    
    function unpause()
    {
       if(this.game.paused)    
       {
           pauseScreen.visible = false;
           this.game.paused = false;
       }
    } 
    
    function gameOver()
    {
        dead.play();
        attention = 0;
        hunger = 0;
        message.text = 'GAMEOVER. SCORE = ' + score;
        
        p.animations.stop();
        p.body.velocity.setTo(0, 0);
       
        
        gameoverScreen = game.add.image(250,250,'gameoverScreen');
        gameoverScreen.fixedToCamera = true;
        gameoverScreen.anchor.setTo(0.5, 0.5);     
        
        restartButton = game.add.image(250, 290, 'restartButton');
        restartButton.scale.setTo(0.5, 0.5);
        restartButton.fixedToCamera = true;
        restartButton.anchor.setTo(0.5, 0.5);     
        restartButton.inputEnabled = true;
        pauseButton.inputEnabled = false;      
        gameover = true;   
     
    }
    
    function restartGame()
    {
        attention = 3000;
        hunger = 3000;
        gameover = false;
        score = 0;
        time = 0; 
        bombTime = 0;   
        oldBombTime = 0;     
        mapPieceCount = 0;
        gameover = false;
        game.state.restart();
    }
    
    function gameWin(){
        cheer.play(); 
        message.text = 'WIN. SCORE = ' + score;
        
        p.animations.stop();
        p.body.velocity.setTo(0, 0);   

        gameoverScreen = game.add.image(250,250,'winScreen');
        gameoverScreen.fixedToCamera = true;
        gameoverScreen.anchor.setTo(0.5, 0.5);           
        restartButton = game.add.image(250, 290, 'restartButton');
        restartButton.scale.setTo(0.5, 0.5);
        restartButton.fixedToCamera = true;
        restartButton.anchor.setTo(0.5, 0.5);     
        restartButton.inputEnabled = true;
        pauseButton.inputEnabled = false;      
        gameover = true;           
    }
    
    function update() 
    {        
        if(!gameover)
        {
            game.physics.arcade.collide(p, layer);
            game.physics.arcade.collide(p, ground, groundCollision, null, this);
            game.physics.arcade.overlap(p, chests, itemCollision, null, this);
            game.physics.arcade.overlap(p, treasures, treasureCollision, null, this);        
            game.physics.arcade.collide(p, ground);
            game.physics.arcade.collide(p, rocks, rockCollision, null, this);
            game.physics.arcade.collide(p, bombs, bombCollision, null, this);
            enemies.forEach(checkPos, this);
            game.physics.arcade.overlap(p, enemies, enemyCollision, null, this);
            game.physics.arcade.overlap(p, foods, foodCollision, null, this);
            game.physics.arcade.overlap(p, map, mapCollision, null, this);
            if(mapPieceCount == 4){
                game.physics.arcade.overlap(p, endPrize, endCollision, null, this);
            }

            p.body.velocity.x = 0;
            p.body.velocity.y = 0;
            
            if (cursors.left.isDown){
                p.body.velocity.x = -(speed);
                p.animations.play('left');
            }
            else if (cursors.right.isDown){
                p.body.velocity.x = speed;
                p.animations.play('right');
            }
            else if (cursors.up.isDown){
                p.body.velocity.y = -(speed);
                p.animations.play('up');
            }
            else if (cursors.down.isDown){
                p.body.velocity.y = speed;
                p.animations.play('down');
            }
            else{
                //  Stand still
                p.animations.stop();
                //p.frame = 2;
            } 

            time++;
            if(time%100 == 0){
                hunger = hunger - (1/2);
                attention--;
            }

            checkStats();

            //location.text = 'X: ' + Math.floor(p.x) + ' Y: ' + Math.floor(p.y) + ' time: ' + time;
            location.text = 'X: ' + Math.floor(p.x) + ' Y: ' + Math.floor(p.y);
            updateStats();
        }
        else
        {
            restartButton.events.onInputUp.add(restartGame,this);
        }
    }
    
    
    //kill dirt
    function groundCollision (o1, o2) 
    { 
        o2.kill();
        attention = attention - (1/2);
        hunger = hunger - (1);
    }

    
    function rockCollision(o1, o2)
    {
        hunger = hunger - (1/5);
        attention = attention - (1/100);
    }
    
    function bombCollision(o1, o2)
    {
        explode.play();
        hunger = hunger - (1/5);
        attention = attention - (1/100);
        bombTime = bombTime + 1;
        if(bombTime == 20){
            //animate
            addAni = game.add.sprite(o2.x-20, o2.y-50, 'fire');   
            animate = addAni.animations.add('fireAction');     
            addAni.animations.play('fireAction', 40, false);            
            o2.kill();
            bombTime = 0; 
            hunger = hunger - 150;
            message.text = 'Oops!';         
        }            
    }    
    
   function itemCollision (o1, o2) {
       if(key1.isDown){
           addAni = game.add.sprite(o2.x-40, o2.y-25, 'chestAni');                
           animate = addAni.animations.add('chestAction');
           addAni.animations.play('chestAction', 50, false);        
           o2.kill();     
           var rnd = game.rnd.between(0, 100);
           var effect = 10;
           if(rnd > 90){
               //speed up
               goodchest.play(); 
               speed = speed+100;
               message.text = 'Opened a chest. Found speed potion. Speed + 100';
           }
           else if(rnd > 80){
               //speed down
               badchest.play(); 
               speed = speed - 50;
               message.text = 'Opened a chest. Injured by spider. Speed - 100';
           }
           else if(rnd > 50){
               //attention up
               goodchest.play(); 
               effect = 100;
               if(rnd > 60){
                message.text = 'Opened a chest. Found green gems.';
               }
               else if(rnd > 70){
                message.text = 'Opened a chest. Found yellow gems.';
               }
               else{
                message.text = 'Opened a chest. Found purple gems.';
                }
           }
           else if(rnd > 10){
               //attention down
               badchest.play(); 
               effect = -100;
                message.text = 'Opened a chest. Found nothing.';
           }
           else{
               //food up
                goodchest.play(); 
                message.text = 'Opened a chest. Found potatoes.';
                hunger = hunger + 100;
               if(hunger > hungerMax){
                   hunger = hungerMax;
               }              
           }
           attention = attention + effect;
           if(attention > attentionMax){
               attention = attentionMax;
           }
           score = score + 100;
       }
    }   

    function checkPos (enemy) {
        if (enemy.x > 3200)
        {
            enemy.x = -100;
        }

    }    
    
    function treasureCollision (o1, o2)
    {
        if (key1.isDown)
        {        
            gemsound.play(); 
            o2.kill();     
            message.text = 'Yay! Treasure!';
           attention = attention + 5;
           if(attention > attentionMax){
               attention = attentionMax;
           }
            score = score + 100;
        }
    }
    
    function enemyCollision(p, e)
    {
        //player gets more hungry
        //score affected
        batsound.play(); 
        message.text = 'OUCH!';
        hunger = hunger - 50;
        attention = attention - 50;
        addAni = game.add.sprite(p.x, p.y, 'attack1'); 
        addAni.anchor.setTo(0.5, 0.5);
        animate = addAni.animations.add('enemyAtk');  
        animate.killOnComplete = true;
        addAni.animations.play('enemyAtk', 30, false);        
    }
    
    function foodCollision(p, f)
    {
        if (key1.isDown)
        {
            f.kill();
            boost.play();
            message.text = 'Yummy!';
            
           hunger = hunger + 100;
           if(hunger > hungerMax){
               hunger = hungerMax;
           }   
            score = score + 5;
        }        
    }  
    
    function mapCollision(p, piece)
    {
        if (key1.isDown)
        {
            mapsound.play(); 
            piece.kill();
            message.text = 'Found map piece.';
            mapPieceCount++;
            mapText.text = 'Map Pieces: ' + mapPieceCount + '/4';
           attention = attention + 100;
           if(attention > attentionMax){
               attention = attentionMax;
           }
            score = score + 200;
            if(mapPieceCount == 4){
                mapText.text = 'X:' + endX + ' Y:' + endY;
                endPrize.visible = true;
            }
        }        
    }    
    
    function endCollision(p, end)
    {
        if (key1.isDown)
        {
            end.kill();
            score = score + 10000000;
            message.text = 'END';
            gameWin();
        }        
    }  
    
    function updateStats()
    {
        hungerText.text = 'HUNGER ' ;
        attentionText.text = 'ATTENTION SPAN ';
        if(hunger <= redBarLimit && !hungerIsRed)
        {
            healthbar.loadTexture('redBar'); 
            hungerIsRed = true;
            hungerIsGreen = false;
        }
        else if(hunger > redBarLimit && !hungerIsGreen)
        {
            healthbar.loadTexture('healthbar');
            hungerIsRed = false;
            hungerIsGreen = true;
            
        }
        
        if(attention <= redBarLimit && !attentionIsRed)
        {
            attentionbar.loadTexture('redBar'); 
            attentionIsRed = true;
            attentionIsGreen = false;
        }
        else if(attention > redBarLimit && !attentionIsGreen)
        {
            attentionbar.loadTexture('healthbar');
            attentionIsRed = false;
            attentionIsGreen = true;
            
        }
        
        
        healthbar.crop(new Phaser.Rectangle(0, 0, (healthbarWidth * hunger)/hungerMax, healthbar.height));
        attentionbar.crop(new Phaser.Rectangle(0, 0, (attentionbarWidth * attention)/attentionMax, attentionbar.height));
    }
    
    function checkStats()
    {
        if(hunger <= 0 || attention <= 0)
        {
            gameOver();
        }
        
    }

};
