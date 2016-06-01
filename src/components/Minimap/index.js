import React from 'react'
import scaleLinear from 'simple-linear-scale'

const SUMMONERS_RIFT_DOMAIN = {
  min: {x: -120, y: -120},
  max: {x: 14870, y: 14980}
}
const MINIMAP_SIZE = { width: 512, height: 512 }
const IMAGE_SIZES = {
  tower: { width: 24, height: 28 },
  inhibitor: { width: 26, height: 26 },
  dragon: { width: 26, height: 22 },
  baron: { width: 26, height: 18 }
}

let xScale = scaleLinear([SUMMONERS_RIFT_DOMAIN.min.x, SUMMONERS_RIFT_DOMAIN.max.x], [0, MINIMAP_SIZE.width])
let yScale = scaleLinear([SUMMONERS_RIFT_DOMAIN.min.y, SUMMONERS_RIFT_DOMAIN.max.y], [MINIMAP_SIZE.height, 0])

function BuildingEventSprite (event, i) {
  let buildingType = (event.buildingType === 'TOWER_BUILDING' ? 'tower' : 'inhibitor')
  let img = `/img/${buildingType}_${event.teamId}.png`
  let { width, height } = IMAGE_SIZES[buildingType]
  return <image key={i} xlinkHref={img} x={xScale(event.position.x) - (width / 2)} y={yScale(event.position.y) - (height / 2)} width={width} height={height} />
}

function MonsterEventSprite (event, i) {
  if (event.monsterType === 'RIFTHERALD') return
  let monsterType = (event.monsterType === 'DRAGON' ? 'dragon' : 'baron')
  let teamId = (event.killerId > 5 ? 200 : 100)
  let img = `/img/${monsterType}_${teamId}.png`
  let { width, height } = IMAGE_SIZES[monsterType]
  return <image key={i} xlinkHref={img} x={xScale(event.position.x) - (width / 2)} y={yScale(event.position.y) - (height / 2)} width={width} height={height} />
}

function Minimap (props) {
  let { data, events } = props

  return (
    <div className='minimap'>
      <svg width={MINIMAP_SIZE.width} height={MINIMAP_SIZE.height}>
        <image
          xlinkHref='/img/minimap.jpg'
          x={0}
          y={0}
          width={MINIMAP_SIZE.width}
          height={MINIMAP_SIZE.height} />
        <defs className='player-defs'>
          {Object.keys(data.playerStats).map((id) => {
            let player = data.playerStats[id]

            return (
              <pattern key={id} id={`player-portrait-${id}`} width={32} height={32}>
                <image xlinkHref={`${window.Config.ddragon}/img/champion/${player.championName}.png`} width={34} height={34} x={-1} y={-1} />
              </pattern>
            )
          })}
        </defs>
        <g>
          {events.map((event, i) => {
            if (event.timestamp > data.t) return null

            if (event.type === 'BUILDING_KILL') return BuildingEventSprite(event, i)
            if (event.type === 'ELITE_MONSTER_KILL') return MonsterEventSprite(event, i)
            return null
          })}
        </g>
        <g>
          {Object.keys(data.playerStats).sort((a, b) => {
            let playerA = data.playerStats[a]
            let playerB = data.playerStats[b]

            return playerA.h - playerB.h
          }).map((id) => {
            let player = data.playerStats[id]
            let circleProps = {
              key: id,
              r: 16,
              stroke: (player.teamId === 100 ? '#2747e8' : '#cb2124'),
              strokeWidth: 2,
              className: 'player' + (player.h === 0 ? ' player-dead' : ''),
              style: {
                fill: `url(#player-portrait-${id})`,
                transform: `translate(${xScale(player.x)}px, ${yScale(player.y)}px)`,
                transitionDuration: (props.seeking ? `${props.speed}ms` : '0ms')
              }
            }

            return (
              <circle {...circleProps} />
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export default Minimap
