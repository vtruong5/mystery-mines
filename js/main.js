window.onload = function() {
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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    
    function preload() {

        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        
        game.load.image('player', 'assets/star.png');
        game.load.spritesheet('veggies', 'assets/fruitnveg32wh37.png', 32, 32);
        

    }
    
    var sprite;
    var group;
    var cursors;
    var platforms;
    var collect = 0;

    function create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //background
        game.add.sprite(0, 0, 'sky');
        
        //platforms

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 5, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create ledges
        var ledge = platforms.create(-50, 75, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(450, 75, 'ground');
        ledge.body.immovable = true;

        //player
        sprite = game.add.sprite(400, 40, 'player');
        game.physics.arcade.enable(sprite);
 
        //items
            group = game.add.physicsGroup();

            for (var i = 0; i < 500; i++)
            {
                var c = group.create(game.rnd.between(0, 770), game.rnd.between(100, 570), 'veggies', game.rnd.between(0, 35));
                c.body.mass = -100;
            }

            for (var i = 0; i < 5; i++)
            {
                var c = group.create(game.rnd.between(0, 770), game.rnd.between(400, 570), 'veggies', 17);
            }

            cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
        if (game.physics.arcade.collide(sprite, group, collisionHandler, processHandler, this))
                {
                    console.log('boom');
                }
        game.physics.arcade.collide(sprite, platforms);
        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
        if (cursors.left.isDown)
        {
            sprite.body.velocity.x = -200;
        }
        else if (cursors.right.isDown)
        {
            sprite.body.velocity.x = 200;
        }

        if (cursors.up.isDown)
        {
            sprite.body.velocity.y = -200;
        }
        else if (cursors.down.isDown)
        {
            sprite.body.velocity.y = 200;
        }


        if (collect >= 5){
            game.add.text(16, 16, 'YOU\'RE RICH!!', { font: '18px Arial', fill: '#ffffff' });
            //play sound
        }
 
    }
    
    function processHandler (player, veg) {

        return true;

    }

    function collisionHandler (player, veg) {

        if (veg.frame == 17)
        {
            veg.kill();
            collect = collect + 1;
        }

    }

};
