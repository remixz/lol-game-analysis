import './index.css'
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

const xScale = scaleLinear([SUMMONERS_RIFT_DOMAIN.min.x, SUMMONERS_RIFT_DOMAIN.max.x], [0, MINIMAP_SIZE.width])
const yScale = scaleLinear([SUMMONERS_RIFT_DOMAIN.min.y, SUMMONERS_RIFT_DOMAIN.max.y], [MINIMAP_SIZE.height, 0])

function BuildingEventSprite (event, i) {
  const buildingType = (event.buildingType === 'TOWER_BUILDING' ? 'tower' : 'inhibitor')
  const img = `/img/${buildingType}_${event.teamId}.png`
  const { width, height } = IMAGE_SIZES[buildingType]
  const style = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${Math.round(xScale(event.position.x) - (width / 2))}px, ${Math.round(yScale(event.position.y) - (width / 2))}px)`,
    backgroundImage: `url(${img})`
  }
  return (
    <div key={i} className='event-sprite' style={style} />
  )
}

function MonsterEventSprite (event, i) {
  if (event.monsterType === 'RIFTHERALD') return
  const monsterType = (event.monsterType === 'DRAGON' ? 'dragon' : 'baron')
  const teamId = (event.killerId > 5 ? 200 : 100)
  const img = `/img/${monsterType}_${teamId}.png`
  const { width, height } = IMAGE_SIZES[monsterType]
  const style = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${Math.round(xScale(event.position.x) - (width / 2))}px, ${Math.round(yScale(event.position.y) - (width / 2))}px)`,
    backgroundImage: `url(${img})`
  }
  return (
    <div key={i} className='event-sprite' style={style} />
  )
}

function Minimap (props) {
  const { data, events } = props

  return (
    <div className='minimap'>
      <div className='minimap-image' />
      <div className='events'>
        {events.filter(({ timestamp }) => timestamp < data.t).map((event, i) => {
          if (event.type === 'BUILDING_KILL') return BuildingEventSprite(event, i)
          if (event.type === 'ELITE_MONSTER_KILL') return MonsterEventSprite(event, i)
          return null
        })}
      </div>
      <div className='players'>
        {Object.keys(data.playerStats).sort((a, b) => {
          const playerA = data.playerStats[a]
          const playerB = data.playerStats[b]

          return playerA.h - playerB.h
        }).map((id) => {
          const player = data.playerStats[id]
          const style = {
            transform: `translate(${Math.round(xScale(player.x) - 17)}px, ${Math.round(yScale(player.y) - 17)}px)`,
            transitionDuration: (props.seeking ? `${props.speed}ms` : '0ms'),
            backgroundImage: `url(${window.Config.ddragon}/img/champion/${player.championName}.png)`,
            borderColor: (player.teamId === 100 ? '#2747e8' : '#cb2124'),
            opacity: (player.h === 0 ? 0.4 : 1)
          }

          return (
            <div key={id} className='player-sprite' style={style} />
          )
        })}
      </div>
    </div>
  )
}

export default Minimap
