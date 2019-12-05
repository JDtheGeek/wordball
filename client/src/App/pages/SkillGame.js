import React, { Component } from 'react';
import { DEFAULT_TIMER, CANVAS_WIDTH, CANVAS_HEIGHT, sizeRatio, levelList } from '../../model/config'
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../../style/skillgame.css'
import Letter from '../../model/letter'
import Ball from '../../model/ball'
import Canvas from '../components/Canvas'
import Layout from '../components/Layout';

class SkillGame extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = { game: props.location.playGame, mouseX: 0, mouseY: 0 }
  }

  _onMouseMove(event) {
    const canvas = document.getElementById('canvas')
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    this.setState({
      mouseX: (event.clientX - rect.left) * scaleX,
      mouseY: (event.clientY - rect.top) * scaleY
    })

    console.log('state:', this.state)
  }

  componentDidMount() {
    $("#navnext").hide()
    $("#skillscore").hide()
    $("#smartscore").hide()
    const letter = new Letter()

    const game = this.state.game
    const canvas = document.getElementById('canvas')
    const canvas2 = document.getElementById('canvas2')
    const ctx = canvas.getContext('2d')
    const ctx2 = canvas2.getContext('2d')
    const timeInterval = setInterval(countdown, 1000)

    let interval
    $("#score").show()
    let timeLeft
    var xVal
    if (process.env.NODE_ENV === 'production') {
      xVal = null
      timeLeft = DEFAULT_TIMER
    } else {
      xVal = 250
      timeLeft = 12
    }

    function countdown() {
      if (timeLeft === 0) {
        game.forceGameOver()
        clearInterval(timeInterval)
      } else {
        $('#timer').text(timeLeft + ' seconds remaining')
        timeLeft--
      }
    }

    countdown()
    console.log('game:', game)
    game.letters.forEach(letter => game.balls.push(new Ball(750, 15, letter, canvas)))
    var ball = game.balls[0]

    interval = setInterval(draw, 10)

    let x2
    let y2
    const foulLine = (CANVAS_HEIGHT * sizeRatio) * 0.9

    function inBounds(y) {

      return true
    }

    $('#canvas').bind('mousemove', function (e) {
      x2 = this.state.mouseX
      y2 = this.state.mouseY
      $('#canvas').mousedown(function (canvas) {
        x2 = this.state.mouseX
        y2 = this.state.mouseY
        $('#canvas').mouseup(function (canvas) {
          if (inBounds(y2)) {
            ball.giveVelocity(ball.xPos, ball.yPos, x2, y2)
          }
        })
      })
    })

    function draw() {
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3

      $('#score').text('Current Score: ' + game.score)
      fillBalls()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = '20px Arial'
      game.checkBallDone(ball)
      game.isBallinScoreHole(ball)
      game.isBallinWordHole(ball)
      game.isBallInTheAbyss(ball)
      checkGameOver()
      drawRectangle()
      drawHoles(game.holeArray)
      if (ball.isDone === true) {
        ball = game.currentBall()
      } else {
        drawBall(ball)
      }
      ctx.fillStyle = 'white'
      ctx.fillText('Foul Line!', canvas.width, foulLine * 0.9)
      ctx.beginPath();
      ctx.moveTo(0, foulLine);
      ctx.lineTo(CANVAS_HEIGHT * sizeRatio, foulLine);
      ctx.stroke();
    }

    function drawHoles(array) {
      array.forEach(function drawHole(item) {
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(item.xPos, item.yPos, item.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = 'white'
        ctx.fillText('x' + item.score, item.xPos - 9, item.yPos + 5)
      })
    }

    function drawPath(ctx, colour, x1, y1, x2, y2) {
      ctx.strokeStyle = colour
      ctx.beginPath()
      ctx.lineWidth = 3
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.lineWidth = 3
    }

    function fillBalls() {
      ctx2.strokeStyle = 'white'
      ctx2.lineWidth = 3
      const radius = game.balls[0].radius
      ctx2.font = '20px Arial'
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
      var y = 920
      game.balls.forEach(function (item) {
        if (item.isClicked === false) {
          ctx2.beginPath()
          ctx2.strokeStyle = item.colour
          ctx2.arc(canvas2.width / 2, y, radius, 0, 2 * Math.PI)
          ctx2.stroke()
          y -= 40
        }
      })
    }

    function drawRectangle() {
      const radius = game.balls[0].radius
      var x = game.tLeftCorner[0] + radius
      ctx.beginPath()
      ctx.rect(game.tLeftCorner[0], game.tRightCorner[1], game.tRightCorner[0] - game.tLeftCorner[0], game.bRightCorner[1] - game.tLeftCorner[1])
      ctx.stroke()
      ctx.fillStyle = 'black'
      ctx.fillStyle = 'white'
      ctx.fillText('Throw in here to make a word!', 115, 830)
      game.word.forEach(function (item) {
        ctx.fillStyle = letter.getColour(item)
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.arc(x, game.tRightCorner[1] + 35, radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = 'white'
        ctx.fillText(item, x - 10, game.tRightCorner[1] + 41)
        x += radius * 2
      })
    }

    function drawBall(ball) {
      ball.position()
      const x = ball.xPos
      const y = ball.yPos
      if (inBounds(y2) && ball.isClicked === false) {
        drawPath(ctx, ball.colour, ball.xPos, ball.yPos, x2, y2)
      }
      ctx.strokeStyle = ball.colour
      ctx.beginPath()
      ctx.arc(x, y, ball.radius, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fillText(ball.letter, x + 5, y + 30)
    }

    function checkGameOver() {
      if (game.isGameOver() === true) {
        clearInterval(interval)
        $("#bankedletters").attr('value', game.word.join(''))
        $("#skillscore").attr('value', game.score)
        $("#navnext").trigger("click");
      }
    }
  }


  render() {

    function styleWidthMain() {
      return Math.round(CANVAS_WIDTH * sizeRatio) + "px"
    }

    function styleWidthHopper() {
      return Math.round((CANVAS_WIDTH / 8) * sizeRatio) + "px"
    }

    function styleHeightMain() {
      return Math.round(CANVAS_HEIGHT * sizeRatio) + "px"
    }

    function styleHeightHopper() {
      return Math.round(CANVAS_HEIGHT * sizeRatio) + "px"
    }

    return (
      <Layout>
        <div className='container is-centered' id="skillapp" >
          <span className="details" align="center" ><div id="timer"></div></span> <span className="details"><div id="score"></div></span>
          <div onMouseMove={this._onMouseMove.bind(this)} className='container level'>
            <Canvas CanvasId='canvas' styleWidth={styleWidthMain()} styleHeight={styleHeightMain()} height={CANVAS_HEIGHT} width={CANVAS_WIDTH} />
            <Canvas CanvasId='canvas2' styleWidth={styleWidthHopper()} styleHeight={styleHeightHopper()} height={CANVAS_HEIGHT} width={CANVAS_WIDTH / 10} />
          </div>
          <Link to={'./smartgame'}>
            <button className='button is-primary is-inverted is-outline' id="navnext">
              next
        </button>
          </Link>
        </div>
      </Layout>
    );
  }
}

export default SkillGame;