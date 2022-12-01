import Phaser from 'phaser';

import gameScene from './scenes/gameScene';

import preloadScene from './scenes/preloadScene';

const config ={
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [preloadScene, gameScene],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 }
      }
    },

};

export default new Phaser.Game(config)