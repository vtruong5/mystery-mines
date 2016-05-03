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
        game.load.audio('background_music','assets/background_music.mp3');
        game.load.audio('intense_music','assets/intense_music.mp3');
        //characters
        //game.load.spritesheet('player', 'assets/player.png', 32, 32); 
        game.load.spritesheet('player', 'assets/player_small.png', 25, 25);
        //map
        game.load.tilemap('map', 'assets/test.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tile1', 'assets/tile1.png');
        game.load.image('tile2', 'assets/tile2.png');
        game.load.image('dark', 'assets/dark.png')
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
        game.load.image('fullscreenButton', 'assets/fullscreen_button.png');
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
    
    var fullscreenButton;
    var backgroundMusic;
    var intenseMusic;
    var closeToMapPiece1;
    var closeToMapPiece2;
    var closeToMapPiece3;
    var closeToMapPiece4;
    var closeToPieceText;
    var playingAgain = false;
    var p1X;
    var p1Y;
    var p2X;
    var p2Y;
    var p3X;
    var p3Y;
    var p4X;
    var p4Y;
    var firstTimeIntenseMusicPlays;
    var menuIsActive;
    
    
    
    var healthbar;
    var healthbarBackground;
    var healthbarWidth;
    var hungerIsRed;
    var hungerIsGreen;
    var attentionIsRed;
    var attentionIsGreen;
    var redBarLimit;
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
    var hunger = 4000;
    var hungerMax = 4000;
    var attention = 3000;
    var attentionMax = 3000;
    var piece;
    var score = 0;
    var speed = 250;
    
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
        
        if(!playingAgain)
        {       
            backgroundMusic = game.add.audio('background_music');
            backgroundMusic.play();
            backgroundMusic.onStop.add(restartBackgroundMusic, this);
            menuIsActive = true;
        }
        else
        {
             restartBackgroundMusic();
             backgroundMusic.onStop.add(restartBackgroundMusic, this);
             menuIsActive = true;
        }
        
        intenseMusic = game.add.audio('intense_music');  
        intenseMusic.onStop.add(restartIntenseMusic, this);
        firstTimeIntenseMusicPlays = true;
        
        
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
        p1X = game.rnd.between(0, 40)*32;
        p1Y = game.rnd.between(0, 40)*32;
        piece = map.create(p1X,p1Y, 'map');
      
        
        p2X = game.rnd.between(60, 99)*32;
        p2Y = game.rnd.between(0, 40)*32;
        piece = map.create(p2X,p2Y, 'map');
        
        
        p3X = game.rnd.between(0, 40)*32;
        p3Y = game.rnd.between(60, 99)*32;
        piece = map.create(p3X,p3Y, 'map');
 
        
        p4X = 2700;
        p4Y = 2700;
        //p4X = game.rnd.between(60, 99)*32;
        //p4Y = game.rnd.between(60, 99)*32;
        piece = map.create(p4X,p4Y, 'map');
 
        //var piece = map.create(1500,1500, 'map');
        //piece = map.create(1550, 1500, 'map');
        //piece = map.create(1600, 1500, 'map');
        //piece = map.create(1650, 1500, 'map');
        
        //add food
        foods = game.add.physicsGroup();
        for(var i = 0; i < 20; i++){
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
        var y = 32*4;
        enemies = game.add.physicsGroup();
        for(var i = 0; i < 20; i++){
            var e = enemies.create(game.world.randomX, y, 'bat');
            e.body.velocity.x = game.rnd.between(200, 400);
            var move = e.animations.add('fly');
            e.animations.play('fly',10, true);            
            y += 32*5;
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
        
        //darkness
        var darkness = game.add.sprite(0, 0, 'dark');
        darkness.fixedToCamera = true;
        
        //text
        message = game.add.text(10, 476, 'Move with arrow keys and action with [ Z ]', { fontSize: '10px', fill: '#fff' });
        message.fontSize = 15;
        message.font = 'Inconsolata';
        message.fixedToCamera = true;
        
        location = game.add.text(10, 10, 'X: ' + p.x + ' Y: ' + p.y, { fontSize: '10px', fill: '#fff' });
        location.fontSize = 15;
        location.font = 'Inconsolata';
        location.fixedToCamera = true;
        
        mapText = game.add.text(360, 10, 'Map Pieces: ' + mapPieceCount + '/4', { fontSize: '10px', fill: '#fff' });
        mapText.fontSize = 15;
        mapText.font = 'Inconsolata';
        mapText.fixedToCamera = true;        
        
        //Add healthbar background and bar
        healthbarBackground = game.add.image(0,40,'healthbarBackground');
        healthbarBackground.fixedToCamera = true;     
        healthbar = game.add.image(healthbarBackground.x+5,healthbarBackground.y+5,'healthbar');
        healthbar.fixedToCamera = true;
        healthbarWidth = healthbar.width;
        
        //Add attentionbar background and bar
        attentionbarBackground = game.add.image(0,68,'healthbarBackground');
        attentionbarBackground.fixedToCamera = true;     
        attentionbar = game.add.image(attentionbarBackground.x+5,attentionbarBackground.y+5,'attentionbar');
        attentionbar.fixedToCamera = true;
        attentionbarWidth = attentionbar.width;
        
        //hunger bar and attention bar text
        hungerText = game.add.text(healthbarBackground.x+10, healthbarBackground.y+11, 'HUNGER ', { fontSize: '10px', fill: '#fff' });
        hungerText.fontSize = 12;
        hungerText.font = 'Inconsolata';
        hungerText.fixedToCamera = true;    
        attentionText = game.add.text(attentionbarBackground.x+10, attentionbarBackground.y+11, 'ATTENTION SPAN ', { fontSize: '10px', fill: '#fff' });
        attentionText.fontSize = 12;
        attentionText.font = 'Inconsolata';
        attentionText.fixedToCamera = true;            
        
        hungerIsRed = false;
        hungerIsGreen = true;
        attentionIsRed = false;
        attentionIsGreen = true;
        redBarLimit = 500;
        //Add pause button
        
        pauseButton = this.game.add.image(415, 463, 'pause_button');
        pauseButton.scale.setTo(0.04, 0.04);
        pauseButton.fixedToCamera = true;
        pauseButton.inputEnabled = true;
        pauseButton.visible = false;
        pauseButton.events.onInputUp.add(pause,this);
        this.game.input.onDown.add(unpause,this);
        
        //add fullscreen button
        fullscreenButton = this.game.add.image(460, 463, 'fullscreenButton');
        fullscreenButton.scale.setTo(0.25, 0.25);
        fullscreenButton.fixedToCamera = true;
        fullscreenButton.inputEnabled = true;
        fullscreenButton.visible = false;
        fullscreenButton.events.onInputUp.add(goFullscreen,this);
        
        //Add close text
        closeToPieceText = game.add.text(110, 120, 'There is a map piece nearby!', { fontSize: '10px', fill: 'white' });
        closeToPieceText.fontSize = 20;
        closeToPieceText.font = 'Inconsolata';
        closeToPieceText.fixedToCamera = true; 
        closeToPieceText.visible = false;
        closeToMapPiece1 = false;
        closeToMapPiece2 = false;
        closeToMapPiece3 = false;
        closeToMapPiece4 = false;
        
         //Add pause screen
        pauseScreen = game.add.image(250,250,'pauseScreen');
        pauseScreen.fixedToCamera = true;
        pauseScreen.anchor.setTo(0.5, 0.5);
        pauseScreen.visible = false;
        
        //Add menu
        menu = game.add.image(0,0,'menu');
        menu.fixedToCamera = true;
        this.game.input.onDown.add(killMenu,this);
        
        
          //Add audio
        explode = game.add.audio('explode'); 
        explode.volume = 0.3;
        boost = game.add.audio('boost'); boost.volume = 0.3; 
        goodchest = game.add.audio('goodchest'); goodchest.volume = 0.3;
        badchest = game.add.audio('badchest'); badchest.volume = 0.3; 
        gemsound = game.add.audio('gemsound'); gemsound.volume = 0.3; 
        batsound = game.add.audio('batsound'); batsound.volume = 0.3; 
        dead = game.add.audio('dead'); dead.volume = 0.3; 
        cheer = game.add.audio('cheer'); cheer.volume = 0.3; 
        mapsound = game.add.audio('mapsound') ; mapsound.volume = 0.3;
        
       game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        
    }
    
    function restartBackgroundMusic(sound)
    {
        backgroundMusic.restart();
    }

    function restartIntenseMusic(sound)
    {
        intenseMusic.restart();
    }
    

    function killMenu()
    {
        menu.visible = false;
        pauseButton.visible = true;
        fullscreenButton.visible = true;
        menuIsActive = false;
    }
    
    function goFullscreen() 
    {

        if (game.scale.isFullScreen)
        {
            game.scale.stopFullScreen();
        }
        else
        {
            game.scale.startFullScreen(false);
        }
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
    
    function getsInCloseRange1()
    {
        closeToPieceText.visible = true;
        closeToMapPiece1 = true;
        backgroundMusic.pause();
        if(firstTimeIntenseMusicPlays)
        {
            firstTimeIntenseMusicPlays = false;
            intenseMusic.play();
        }
        else
        {
             intenseMusic.resume();
        }
    }
    
    function leavesCloseRange1()
    {
        closeToPieceText.visible = false;
        closeToMapPiece1 = false;
        intenseMusic.pause();
        backgroundMusic.resume();
    }
    
    function getsInCloseRange2()
    {
        closeToPieceText.visible = true;
        closeToMapPiece2 = true;
        backgroundMusic.pause();
        if(firstTimeIntenseMusicPlays)
        {
            firstTimeIntenseMusicPlays = false;
            intenseMusic.play();
        }
        else
        {
             intenseMusic.resume();
        }
    }
    
    function leavesCloseRange2()
    {
        closeToPieceText.visible = false;
        closeToMapPiece2 = false;
        intenseMusic.pause();
        backgroundMusic.resume();
    }
    
    function getsInCloseRange3()
    {
        closeToPieceText.visible = true;
        closeToMapPiece3 = true;
        backgroundMusic.pause();
        if(firstTimeIntenseMusicPlays)
        {
            firstTimeIntenseMusicPlays = false;
            intenseMusic.play();
        }
        else
        {
             intenseMusic.resume();
        }
    }
    
    function leavesCloseRange3()
    {
        closeToPieceText.visible = false;
        closeToMapPiece3 = false;
        intenseMusic.pause();
        backgroundMusic.resume();
    }
    
    function getsInCloseRange4()
    {
        closeToPieceText.visible = true;
        closeToMapPiece4 = true;
        backgroundMusic.pause();
        if(firstTimeIntenseMusicPlays)
        {
            firstTimeIntenseMusicPlays = false;
            intenseMusic.play();
        }
        else
        {
             intenseMusic.resume();
        }
    }
    
    function leavesCloseRange4()
    {
        closeToPieceText.visible = false;
        closeToMapPiece4 = false;
        intenseMusic.pause();
        backgroundMusic.resume();
    }
    
    function restartGame()
    {
        if(closeToMapPiece1 || closeToMapPiece2 || closeToMapPiece3 || closeToMapPiece4)
        {
            intenseMusic.pause();
        }
          
        speed = 250;
        attentionMax = 3000;
        hungerMax = 4000;
        attention = 3000;
        hunger = 4000;
        gameover = false;
        score = 0;
        time = 0; 
        bombTime = 0;   
        oldBombTime = 0;     
        mapPieceCount = 0;
        gameover = false;
        playingAgain = true;
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
            
            if(!menuIsActive)
            {
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
                if(time%100 == 0)
                {
                    hunger = hunger - (1/4);
                    attention--;
                }
            }

            checkStats();

            //location.text = 'X: ' + Math.floor(p.x) + ' Y: ' + Math.floor(p.y) + ' time: ' + time;
            location.text = 'X: ' + Math.floor(p.x) + ' Y: ' + Math.floor(p.y);
            updateStats();
            if((game.math.distance(p.x, p.y, p1X, p1Y) < 300) && closeToMapPiece1 == false)
            {
                getsInCloseRange1();
            }
            if((game.math.distance(p.x, p.y, p2X, p2Y) < 300) && closeToMapPiece2 == false)
            {
                getsInCloseRange2();
            }
            if((game.math.distance(p.x, p.y, p3X, p3Y) < 300) && closeToMapPiece3 == false)
            {
                getsInCloseRange3();
            }
            if((game.math.distance(p.x, p.y, p4X, p4Y) < 300) && closeToMapPiece4 == false)
            {
                getsInCloseRange4();
            }
            
            
            if((game.math.distance(p.x, p.y, p1X, p1Y) > 300) && closeToMapPiece1 == true)
            {
                leavesCloseRange1();
            }
            if((game.math.distance(p.x, p.y, p2X, p2Y) > 300) && closeToMapPiece2 == true)
            {
                leavesCloseRange2();
            }
            if((game.math.distance(p.x, p.y, p3X, p3Y) > 300) && closeToMapPiece3 == true)
            {
                leavesCloseRange3();
            }
            if((game.math.distance(p.x, p.y, p4X, p4Y) > 300) && closeToMapPiece4 == true)
            {
                leavesCloseRange4();
            }
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
        attention = attention - (1);
        hunger = hunger - (1);
    }

    
    function rockCollision(o1, o2)
    {
        hunger = hunger - (1/5);
        attention = attention - (1/100);
    }
    
    function bombCollision(o1, o2)
    {
       // explode.play();
        hunger = hunger - (1/5);
        attention = attention - (1/100);
        bombTime = bombTime + 1;
        if(bombTime == 20)
        {
            //animate
             explode.play();
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
       if(key1.isDown)
       {
           addAni = game.add.sprite(o2.x-40, o2.y-25, 'chestAni');                
           animate = addAni.animations.add('chestAction');
           addAni.animations.play('chestAction', 50, false);        
           o2.kill();     
           var rnd = game.rnd.between(0, 100);
           var effect = 10;
           if(rnd > 90)
           {
               //speed up
               goodchest.play(); 
               speed = speed+100;
               message.text = 'Found speed potion. Speed + 100!';
           }
           else if(rnd > 85)
           {
               //speed down
               badchest.play(); 
               speed = speed - 50;
               message.text = 'Injured by spider. Speed - 50!';
           }
           else if(rnd > 50)
           {
               //attention up
                goodchest.play(); 
                effect = 100;
                if(rnd > 60)
                {
                   message.text = 'Opened a chest. Found green gems.';
                }
                else if(rnd > 70)
                {
                    message.text = 'Opened a chest. Found yellow gems.';
                }
                else
                {
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
            message.text = 'Yay! Gems!';
           attention = attention + 20;
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
            
           hunger = hunger + 400;
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
            if(closeToMapPiece1 == true)
            {
                p1X = -500;
                p1Y = -500;
            }
            if(closeToMapPiece2 == true)
            {
                p2X = -500;
                p2Y = -500;
            }
            if(closeToMapPiece3 == true)
            {
                p3X = -500;
                p3Y = -500;
            }
            if(closeToMapPiece4 == true)
            {
                p4X = -500;
                p4Y = -500;
            }
             
            mapsound.play(); 
            piece.kill();
            message.text = 'Found map piece.';
            mapPieceCount++;
            mapText.text = 'Map Pieces: ' + mapPieceCount + '/4';
            attention = attention + 100;
            hunger = hunger + 500;
            if(attention > attentionMax)
            {
               attention = attentionMax;
            }
          
            if(hunger > hungerMax)
            {
               hunger = hungerMax;
            }   
            score = score + 200;
            if(mapPieceCount == 4)
            {
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
            attentionbar.loadTexture('attentionbar');
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
