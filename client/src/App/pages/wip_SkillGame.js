import React, { createRef, useRef, useLayoutEffect, useEffect, useState } from 'react';
import { MAX_LETTERS, DEFAULT_TIMER, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../model/config'
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../../style/skillgame.css'
import Letter from '../../model/letter'
import Ball from '../../model/ball'
import Layout from '../components/Layout'
import Canvas from '../components/Canvas'

export default function SkillGame(props) {

  console.log(props)

  const [game, setGame] = useState(props.location.playGame)
  const [activeBall, setActiveBall] = useState(game.balls[0])
  const [gameRunning, setGameRunning] = useState(true)

  const [widthMain, setWidthMain] = useState(CANVAS_WIDTH)
  const [heightMain, setHeightMain] = useState(CANVAS_HEIGHT)
  const [widthHopper, setWidthHopper] = useState(CANVAS_WIDTH)
  const [heightHopper, setHeightHopper] = useState(CANVAS_HEIGHT)

  const containerMain = createRef()
  const containerHopper = createRef()
  const canvasMain = createRef()
  const canvasHopper = createRef()

  useEffect(() => {
    // setGame(props.location.playGame)
  })

  function setupCanvas() {
    let pixelRatio = Math.round(window.devicePixelRatio) || 1
    let adjustedWidthMain = CANVAS_WIDTH * pixelRatio
    let adjustedWidthHopper = (CANVAS_WIDTH / 10) * pixelRatio
    let adjustedHeightMain = CANVAS_HEIGHT * pixelRatio
    let adjustedHeightHopper = adjustedHeightMain

    setWidthMain(Math.round(adjustedWidthMain / pixelRatio) + "px")
    setWidthHopper(Math.round(adjustedWidthHopper / pixelRatio) + "px")

    setHeightMain(Math.round(adjustedHeightMain / pixelRatio) + "px")
    setHeightHopper(Math.round(adjustedHeightHopper / pixelRatio) + "px")
  }

  useEffect(() => {
    setupCanvas()
    drawCanvas()
  })

  const ctxMain = () => {
    canvasMain.current.getContext('2d')
  }

  const ctxHopper = () => {
    canvasHopper.current.getContext('2d')
  }

  function drawCanvas() {
    $("#navnext").hide()
    $("#skillscore").hide()
    $("#smartscore").hide()
    const letter = new Letter()

    const timeInterval = setInterval(countdown, 1000)
    console.log('canvasMain: ', canvasMain)
    console.log('canvasMain.current: ', canvasMain.current)

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

    function setupBalls() {
      game.letters.forEach(letter => game.balls.push(new Ball(750, 15, letter, canvasMain)))
    }

    interval = setInterval(draw, 10)

    let x2
    let y2

    function inBounds(y) {
      if (y < 600) {
        return false
      }
      return true
    }

    $('#canvas').mousedown(function (canvas) {
      const offset = $(this).offset()
      $('#canvas').bind('mousemove', function (e) {
        x2 = e.pageX - offset.left
        y2 = e.pageY - offset.top
        $('#canvas').mouseup(function (canvas) {
          if (inBounds(y2)) { activeBall.giveVelocity(activeBall.xPos, activeBall.yPos, x2, y2) }
        })
      })
    })


    function draw() {
      $('#score').text('Current Score: ' + game.score)
      fillBalls()
      ctxMain.clearRect(0, 0, canvasMain.width, canvasMain.height)
      ctxMain.font = '20px Arial'
      game.checkBallDone(activeBall)
      game.isBallinScoreHole(activeBall)
      game.isBallinWordHole(activeBall)
      game.isBallInTheAbyss(activeBall)
      checkGameOver()
      drawRectangle()
      drawHoles(game.holeArray)
      if (activeBall.isDone === true) {
        setActiveBall(game.currentBall())
      } else {
        drawBall(activeBall)
      }
      ctxMain.fillStyle = 'white'
      ctxMain.fillText('Foul Line!', 200, 620)
      ctxMain.beginPath();
      ctxMain.moveTo(0 + 0.5, 600 + 0.5);
      ctxMain.lineTo(500 + 0.5, 600 + 0.5);
      ctxMain.stroke();
    }
    function drawHoles(array) {
      array.forEach(function drawHole(item) {
        ctxMain.fillStyle = 'black'
        ctxMain.beginPath()
        ctxMain.arc(item.xPos, item.yPos, item.radius, 0, 2 * Math.PI)
        ctxMain.fill()
        ctxMain.stroke()
        ctxMain.fillStyle = 'white'
        ctxMain.fillText('x' + item.score, item.xPos - 8, item.yPos)
      })
    }
    function drawPath(ctx, colour, x1, y1, x2, y2) {
      ctx.strokeStyle = colour
      ctx.beginPath()
      ctx.lineWidth = 5
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 1
    }

    function fillBalls() {
      const radius = activeBall.radius
      ctxHopper.font = '20px Arial'
      ctxHopper.clearRect(0, 0, canvasHopper.width, canvasHopper.height)
      var y = 920
      game.balls.forEach(function (item) {
        if (item.isClicked === false) {
          ctxHopper.beginPath()
          ctxHopper.fillStyle = item.colour
          ctxHopper.lineWidth = 0
          ctxHopper.arc(canvasHopper.width / 2, y, radius, 0, 2 * Math.PI)
          ctxHopper.fill()
          ctxHopper.stroke()
          y -= 40
        }
      })
    }
    function drawRectangle() {
      const radius = game.balls[0].radius
      var x = game.tLeftCorner[0] + radius
      ctxMain.beginPath()
      ctxMain.rect(game.tLeftCorner[0], game.tRightCorner[1], game.tRightCorner[0] - game.tLeftCorner[0], game.bRightCorner[1] - game.tLeftCorner[1])
      ctxMain.stroke()
      ctxMain.fillStyle = 'black'
      ctxMain.fill()
      ctxMain.fillStyle = 'white'
      ctxMain.fillText('Throw in here to make a word!', 115, 830)
      game.word.forEach(function (item) {
        ctxMain.fillStyle = letter.getColour(item)
        ctxMain.beginPath()
        ctxMain.lineWidth = 1
        ctxMain.arc(x, game.tRightCorner[1] + 35, radius, 0, 2 * Math.PI)
        ctxMain.fill()
        ctxMain.stroke()
        ctxMain.fillStyle = 'white'
        ctxMain.fillText(item, x - 10, game.tRightCorner[1] + 41)
        x += radius * 2
      })

    }
    function drawBall(ball) {
      ball.position()
      const x = ball.xPos
      const y = ball.yPos
      if (inBounds(y2) && ball.isClicked === false) {
        drawPath(ctxMain, ball.colour, ball.xPos, ball.yPos, x2, y2)
      }
      ctxMain.fillStyle = ball.colour
      ctxMain.beginPath()
      ctxMain.arc(x, y, ball.radius, 0, 2 * Math.PI)
      ctxMain.fill()
      ctxMain.stroke()
      ctxMain.fillStyle = 'white'
      ctxMain.fillText(ball.letter, x + 5, y + 30)
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



  return (
    <Layout>
      <div className='container is-centered' id="skillapp">
        <span className="details" align="center" ><div id="timer"></div></span> <span className="details"><div id="score"></div></span>
        <div className='container level-center'>
          <div ref={containerMain}>
            <Canvas ref={canvasMain} styleWidth={widthMain} styleHeight={heightMain} height={CANVAS_HEIGHT} width={CANVAS_WIDTH} />
          </div>
          <div ref={containerHopper}>
            <Canvas ref={canvasHopper} styleWidth={widthHopper} styleHeight={heightHopper} height={CANVAS_HEIGHT} width={CANVAS_WIDTH / 10} />
          </div>
        </div>
        <Link to={'./smartgame'}>
          <button className='button is-primary is-inverted is-outline' id="navnext">
            Next
        </button>
        </Link>
      </div>
    </Layout>

  );
}

