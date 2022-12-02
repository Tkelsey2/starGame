
export default class preloadScene extends Phaser.Scene {
    constructor(){
        super({key: 'preload-scene'})
    }

    preload(){
        this.load.image('logo', 'assets/logo.png')
        this.load.image('start', 'assets/start.png')
        
    }

    create(){
        this.add.image(400, 300, 'logo')
        const startButton = this.add.image(400,300, 'start')
        startButton.setInteractive()
        startButton.on('pointerup', () => {
            console.log('starting')
            this.scene.stop('preload-scene')
            this.scene.start('game-scene')
        })
        startButton.on('pointerdown', function (pointer){
            this.setTint(0xff0000)
        })


    }


}

