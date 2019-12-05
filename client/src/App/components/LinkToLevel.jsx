import React from 'react';
import { MAX_LETTERS } from '../../model/config'
import { Link } from 'react-router-dom';
import Seed from '../../model/seed'
import Level from '../../model/level'
import Game from '../../model/SkillGame'


export default function LinkToLevel(props) {

  const getSeed = () => {
    return new Seed(props.word)
  }

  const getLevel = () => {
    return new Level(getSeed(), MAX_LETTERS)
  }

  const getGame = () => {
    return new Game(getLevel())
  }

  return (
    <Link to={{
      pathname: './skillgame',
      playGame: getGame(),
    }}>
      {props.children}
    </Link>
  )
}