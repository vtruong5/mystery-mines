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
    }
    
    
    var healthbar;
    var healthbarBackground;
    var healthbarWidth;
    
    var attentionbar;
    var attentionbarBackground;
    var attentionbarWidth;
    
    
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
    var hungerMax = 5000;
    var attention = 3000;
    var attentionMax = 5000;
    var score = 0;
    
    var gameover = false;
    //var dirtCount = 0;
    var time = 0;
    
    var bombTime = 0;
    var oldBombTime = 0;    
    
    
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
        for(var i = 0; i < 5; i++){
            var f = foods.create(game.rnd.between(0, 99)*32,game.rnd.between(0, 99)*32, 'food');
        }        
        var f = foods.create(1700,1700, 'food');
        
        //add tresure
        treasures = game.add.physicsGroup();
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < 100; j++){
                var rnd = game.rnd.between(0, 100)
                if(rnd < 10){                
                    var t = treasures.create(32*i,j*32, 'treasure');
                }
              }
        }         
        
       
        //treasure chest
        chests = game.add.physicsGroup();
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < 100; j++){
                var rnd = game.rnd.between(0, 100)
                if(rnd == 5){                
                    var c = chests.create(32*i,j*32, 'chest');
                }
              }
        }  

        //create dirt
        ground = game.add.group();
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < 100; j++){
                var rnd = game.rnd.between(0, 100)
                if(rnd > 10){                
                    var d = ground.create(32*i,j*32, 'dirt');
                    game.physics.arcade.enable(d);
                }
              }
        }        
        
        //make bombs
        bombs = game.add.physicsGroup();
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < 100; j++){
                var rnd = game.rnd.between(0, 100);
                if(rnd > 95){
                    var b = bombs.create(32*i,j*32, 'bomb');
                    b.body.mass = -80;                   
                }

            }
        }         
        
        //make rock   
        rocks = game.add.physicsGroup();
        for (var i = 0; i < 100; i++){
            for (var j = 0; j < 100; j++){
                var rnd = game.rnd.between(0, 100);
                if(rnd > 70){
                    var r = rocks.create(32*i,j*32, 'rock');
                    r.body.mass = -100;                   
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

  

        attentionText = game.add.text(10, 90, 'Attention span: ' + attention, { fontSize: '10px', fill: '#fff' });
        attentionText.fontSize = 15;
        attentionText.font = 'Arial Black';
        attentionText.fixedToCamera = true;    
        
        //Add healthbar background and bar
        healthbarBackground = game.add.image(10,50,'healthbarBackground');
        healthbarBackground.fixedToCamera = true;     
        healthbar = game.add.image(healthbarBackground.x+5,healthbarBackground.y+5,'healthbar');
        healthbar.fixedToCamera = true;
        healthbarWidth = healthbar.width;
        
        //Add attentionbar background and bar
        attentionbarBackground = game.add.image(10,120,'healthbarBackground');
        attentionbarBackground.fixedToCamera = true;     
        attentionbar = game.add.image(attentionbarBackground.x+5,attentionbarBackground.y+5,'attentionbar');
        attentionbar.fixedToCamera = true;
        attentionbarWidth = attentionbar.width;
        
        //hunger bar
        hungerText = game.add.text(20, 58, 'HUNGER ' + hunger, { fontSize: '10px', fill: '#fff' });
        hungerText.fontSize = 10;
        hungerText.font = 'Arial';
        hungerText.fixedToCamera = true;          
    }

    function update() 
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
            p.body.velocity.x = -200;
            p.animations.play('left');
        }
        else if (cursors.right.isDown){
            p.body.velocity.x = 200;
            p.animations.play('right');
        }
        else if (cursors.up.isDown){
            p.body.velocity.y = -200;
            p.animations.play('up');
        }
        else if (cursors.down.isDown){
            p.body.velocity.y = 200;
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
    
    
    //kill dirt
    function groundCollision (o1, o2) 
    {
        o2.kill();
        attention = attention - (1/4);
        hunger = hunger - (1/10);
    }

    
    function rockCollision(o1, o2)
    {
        hunger = hunger - (1/5);
        attention = attention - (1/100);
    }
    
    function bombCollision(o1, o2)
    {
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
            hunger = hunger - 100;
            message.text = 'Bomb Exploded!';         
        }            
    }    
    
   function itemCollision (o1, o2) {
       if(key1.isDown){
           addAni = game.add.sprite(o2.x-40, o2.y-25, 'chestAni');                
           animate = addAni.animations.add('chestAction');
           addAni.animations.play('chestAction', 50, false);        
           o2.kill();     
           message.text = 'Opened a chest';
           
           attention = attention + 10;
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
            o2.kill();     
            message.text = 'Picked up treasure';
           attention = attention + 5;
           if(attention > attentionMax){
               attention = attentionMax;
           }
            score = score + 10;
        }
    }
    
    function enemyCollision(p, e)
    {
        //player gets more hungry
        //score affected
        message.text = 'OUCH!';
        hunger = hunger - 50;
        attention = attention - 50;
        addAni = game.add.sprite(e.x-20, e.y-50, 'attack1');                
        animate = addAni.animations.add('enemyAtk');     
        addAni.animations.play('enemyAtk', 30, false);          
    }
    
    function foodCollision(p, f)
    {
        if (key1.isDown)
        {
            f.kill();
            message.text = 'Ate food';
            
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
            piece.kill();
            message.text = 'Found map piece';
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
        }        
    }  
    
    function updateStats()
    {
        hungerText.text = 'HUNGER ' + Math.floor(hunger);
        attentionText.text = 'Attention span: ' + Math.floor(attention);
        healthbar.crop(new Phaser.Rectangle(0, 0, (healthbarWidth * hunger)/hungerMax, healthbar.height));
        attentionbar.crop(new Phaser.Rectangle(0, 0, (attentionbarWidth * attention)/attentionMax, attentionbar.height));
    }
    
    function checkStats()
    {
        if(hunger <= 0 || attention <= 0){
            hunger = 0;
            attention = 0
            gameover == true;
            message.text = 'GAMEOVER. SCORE = ' + score;
            cursors = game.input.keyboard.disable = true;
        }
        
    }

};
