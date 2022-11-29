import Phaser from 'phaser';

//what Score will show as (text at the end of the function) eg. Score: 5
const formatScore = (score) => `Score: ${score}`

export default class scoreLabel extends Phaser.GameObjects.Text
{
    constructor(scene, x, y, score, style)
    {   
        //the information the extended class expects
        super(scene, x, y, formatScore(score), style)

        //initial score
        this.score = score
    }

    //sets the value and updates
    setScore(score)
    {
        this.score = score
        this.updateScoreText()
    }

    //adds given points to current score value
    add(points)
    {
        this.setScore(this.score + points)
    }

    updateScoreText()
    {
        this.setText(formatScore(this.score))
    }
}