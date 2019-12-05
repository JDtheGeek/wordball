import React from 'react'
import { levelList } from '../../model/config'
import LinkToLevel from './LinkToLevel';

export default function LevelRow(props) {

  function getWord() {
    let index = Number(props.levelId) - 1
    return levelList[index]
  }

  return (
    <tr>
      <td><LinkToLevel word={getWord()}>{props.levelId}</LinkToLevel> </td>
      {/* <td className='has-text-right'>{props.score}</td> */}
      <td className='has-text-right'>{props.highScore}</td>
    </tr>
  )
}