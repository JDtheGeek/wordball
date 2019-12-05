import React from 'react';
import { MAX_LETTERS, levelList } from '../../model/config'
import { Link } from 'react-router-dom';
import Seed from '../../model/seed'
import Level from '../../model/level'
import Game from '../../model/SkillGame'
import Layout from '../components/Layout'

export default function Home() {

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
  }

  const getWord = () => {
    return levelList[getRandomInt(0, levelList.length)]
  }

  const getSeed = () => {
    return new Seed(getWord())
  }

  const getLevel = () => {
    return new Level(getSeed(), MAX_LETTERS)
  }

  const getGame = () => {
    return new Game(getLevel())
  }

  return (
    <Layout>
      <div className='buttons is-centered'>
        <p className="control">
          <Link to={{
            pathname: './skillgame',
            playGame: getGame(),
          }}>
            <button id='playbutton' className='button is-rounded is-primary is-inverted is-outlined'>Random Level</button>
          </Link>

        </p>
        <p className="control">
          <Link to={'./levels'}>
            <button className='button is-rounded is-primary is-outlined is-inverted'>See Levels</button>
          </Link>
        </p>
        <p className="control">
          <Link to={'./scoreboard'}>
            <button className='button is-rounded is-primary is-outlined is-inverted'>Scoreboard</button>
          </Link>
        </p>
      </div>
    </Layout>
  )
}
