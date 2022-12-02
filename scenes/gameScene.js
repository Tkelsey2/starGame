import Phaser from 'phaser';
import scoreLabel from '../ui/scoreLabel';
import bombSpawner from './bombSpawner';

//created key for ease of duplication
const GROUND_KEY = 'ground';
const PLAYER_KEY = 'player';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';
let stars 

//extend and export the class in one line

export default class gameScene extends Phaser.Scene
{
    constructor()
    {
        //providing an id
        super({key: 'game-scene'})

        this.gameOver = false
    };

    preload()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image(GROUND_KEY, 'assets/platform.png');
        this.load.image(STAR_KEY, 'assets/star.png');
        this.load.image(BOMB_KEY, 'assets/bomb.png');

        this.scoreLabel = this.createScoreLabel(16, 16, 0)
       
        this.load.spritesheet(PLAYER_KEY, 'assets/dude.png',
            {frameWidth: 50, frameHeight: 37}
        );
    };

    create()
    {
        //adding images to the scene (x position,y position, image) 
        this.add.image(400,300, 'sky');

        //tidied code up to make coding the collider between player and platform simpler
        const platforms = this.createPlatforms();
        this.player = this.createPlayer();
        this.stars = this.createStars();

        //bomb spawning calls
        this.bombSpawner = new bombSpawner(this, BOMB_KEY)
        const bombGroup = this.bombSpawner.group
  
        //text on screen calls
        this.scoreLabel = this.createScoreLabel(16, 16, 0)
        this.gameOverText = this.add.text(400, 300, 'Game Over', {fontSize: '32px', fill: '#000'})
        this.gameOverText.setOrigin(0.5)
        this.gameOverText.visible = false

        //collider calls
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.stars, platforms)
        this.physics.add.collider(bombGroup, platforms)
        this.physics.add.collider(this.player, bombGroup, this.hitBomb, null, this)

        //keyboard input calls
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)

    };

    //keybinding and movement creation
    update()
    {
        if(this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160)

            this.player.anims.play('left', true)

            this.player.setFlipX(true)
        }
        else if(this.cursors.right.isDown)
        {
            this.player.setVelocityX(160)

            this.player.anims.play('right', true)

            this.player.setFlipX(false)
        }
        else{
            this.player.setVelocityX(0)
            this.player.anims.play('turn',true)
        };

        if(this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330)
            this.player.anims.play('up')
            
  
        }

        if(this.cursors.up.isDown &! this.player.body.touching.down)
        {
            this.player.anims.play('up')
        }
    };


    //creating various platforms of size and position
    createPlatforms()
    {
        const platforms = this.physics.add.staticGroup();

        //adding platforms to their x ad y position
        platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();
        platforms.create(650, 375, GROUND_KEY);
        platforms.create(100,250, GROUND_KEY);
        platforms.create(750,200, GROUND_KEY);

        return platforms
    };

    createPlayer()
    {
    //configuring player physics and collisions with worldbounds
        const player = this.physics.add.sprite(100, 450, PLAYER_KEY);
        player.setScale(2)
        player.setSize(26,32)

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

    //configuring player animations

        this.anims.create({
            key:'left',
            frames: this.anims.generateFrameNumbers(PLAYER_KEY, {start:8, end: 13}),
            frameRate: 10,
            repeat: -1,

        });


        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers(PLAYER_KEY, {start:0, end: 3}),
            frameRate: 5,


        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(PLAYER_KEY, {start:8, end: 13}),
            frameRate:10,
            repeat: -1
        });

        this.anims.create({
            key:'up',
            frames: this.anims.generateFrameNumbers(PLAYER_KEY, {start: 16, end: 25}),
            frameRate: 10,
  
        })

        return player
    };

    createStars()
    {
        //creating stars and coding physics to bounce around and move 
        const stars = this.physics.add.group({
            key: STAR_KEY,
            //creating 12 of them
            repeat: 11,
            //starts on x 12 then repeats every 70 pixels
            setXY: {x:12, y:0, stepX: 70}
        });
        
        //each star is a child of the above star group
 
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true)})
        
        return stars
    };

    //collection of stars logic
    collectStar(player, star)
        {
            star.disableBody(true,true)
         

            this.scoreLabel.add(10)

            console.log('collected')

            //creation of bomb logic and spawning of new stars
            if (this.stars.countActive(true) === 0) {
                // A new batch of stars to collect
                this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
                child.setBounce(1)
                child.setCollideWorldBounds(true)
                child.setVelocity(Phaser.Math.Between(-100, 100), 10)
                });
                this.bombs = this.bombSpawner.spawn(player.x)


        }
        

        };


        //score label creation logic
    createScoreLabel(x, y, score)
        {
            const style = { fontSize: '32px', fill: '#000'}
            const label = new scoreLabel(this, x, y, score, style)

            this.add.existing(label)

            return label
        }


        //Game Over logic
    hitBomb(player, bomb)
    {
        this.physics.pause()

        player.setTint(0xff0000)

        player.anims.play('turn')

        this.gameOver = true

        this.gameOverText.visible = true

        this.input.on('pointerdown', () => this.scene.restart('game-scene'))
    }

};
