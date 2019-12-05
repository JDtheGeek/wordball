import React from 'react'

export default function Canvas(props) {

  const canvasStyle = {
    width: props.styleWidth,
    height: props.styleHeight,
  }

  return (
    <div>
      <canvas style={canvasStyle} id={props.CanvasId} width={props.width} height={props.height}></canvas>
    </div>

  )
}