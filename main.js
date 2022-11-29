import Phaser from 'phaser';

import gameScene from './scenes/gameScene';

const config ={
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 }
      }
    },
    scene: [gameScene]
};

export default new Phaser.Game(config)