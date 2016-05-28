import React from 'react'
import { roundToDecimal } from '../../utils/round'

const SUMMONER_IDS = {
  '1': 'SummonerBoost',
  '3': 'SummonerExhaust',
  '4': 'SummonerFlash',
  '6': 'SummonerHaste',
  '7': 'SummonerHeal',
  '11': 'SummonerSmite',
  '12': 'SummonerTeleport',
  '14': 'SummonerDot',
  '21': 'SummonerBarrier'
}

const TRINKET_IDS = [3340, 3341, 3363, 3364]
function filterItems (items, name) {
  let uniqs = []
  let trinket = 0
  let els = []

  items.forEach((item) => {
    if (TRINKET_IDS.indexOf(item) > -1) {
      trinket = item
      return
    }
    if (name === 'CLG Huhi' && item === 3111 && window.Config.ddragon.indexOf('6.8.1') > -1) return // he did not buy this item ever, but the riot data has it for some reason. only case where this happened though, so can make exception
    if (uniqs.indexOf(item) === -1) uniqs.push(item)
  })

  uniqs.push(trinket)

  uniqs.forEach((item) => {
    els.push((
      <div key={item} className={`item-icon float-left ${TRINKET_IDS.indexOf(item) > -1 ? 'item-icon-trinket' : ''}`}>
        <img src={`${window.Config.ddragon}/img/item/${item}.png`} />
      </div>
    ))
  })

  return els
}

function PlayerTable (props) {
  let { data } = props

  data.teamStats['100'].totalDamageToChampions = 0
  data.teamStats['100'].totalGold = 0
  data.teamStats['100'].playersKilled = 0
  data.teamStats['200'].totalDamageToChampions = 0
  data.teamStats['200'].totalGold = 0
  data.teamStats['200'].playersKilled = 0
  Object.keys(data.playerStats).forEach((key) => {
    let player = data.playerStats[key]
    data.teamStats[String(player.teamId)].totalDamageToChampions += player.tdc
    data.teamStats[String(player.teamId)].totalGold += player.tg
    data.teamStats[String(player.teamId)].playersKilled += player.kills
  })

  let bluePlayers = []
  let redPlayers = []
  Object.keys(data.playerStats).forEach((key) => {
    let player = data.playerStats[key]

    if (player.teamId === 100) {
      bluePlayers.push(player)
    } else {
      redPlayers.push(player)
    }
  })

  function renderList (players, teamId) {
    let team = data.teamStats[teamId]

    return (
      <ul className='float-left'>
        <li className={`team-stats team-${teamId}`}>
          <span className='team-kills'>{team.playersKilled}</span>
          <span className='team-gold'>Gold: {roundToDecimal(team.totalGold / 1000, -1)}k</span>
          <span className='team-barons'>Barons: {team.baronsKilled}</span>
          <span className='team-dragons'>Dragons: {team.dragonsKilled}</span>
          <span className='team-towers'>Towers: {team.towersKilled}</span>
        </li>
        {players.map((player) => {
          return (
            <li key={player.participantId}>
              <div className='player-icon float-left'>
                <img src={`${window.Config.ddragon}/img/champion/${player.championName}.png`} />
                <span className='player-level'>{player.level}</span>
                <div className='player-summoners'>
                  <img src={`${window.Config.ddragon}/img/spell/${SUMMONER_IDS[String(player.summonersSpell1)]}.png`} />
                  <img src={`${window.Config.ddragon}/img/spell/${SUMMONER_IDS[String(player.summonersSpell2)]}.png`} />
                </div>
              </div>
              <div className='player-details float-left'>
                <div className='player-name'> {player.summonerName} </div>
                <div className='player-health'>
                  <div className='health-bar' style={{ width: (player.h / player.maxHealth) * 100 + '%' }}></div>
                  <span className='health-text'> {player.h} / {player.maxHealth} </span>
                </div>
                <div className='player-health'>
                  <div className='health-bar mana-bar' style={{ width: (player.p / player.maxPower) * 100 + '%' }}></div>
                  <span className='health-text'> {player.p} / {player.maxPower} </span>
                </div>
                <div className='player-items'>
                  {filterItems(player.items, player.summonerName)}
                </div>
              </div>
              <div className='player-details player-details-right float-left'>
                {player.kills} / {player.deaths} / {player.assists} <br />
                {player.mk} CS / {Math.round(player.mk / (data.t / 1000 / 60) * 10)} CS per 10 <br />
                {player.cg} Gold / {player.tg} Total Gold <br />
                {team.totalDamageToChampions !== 0 ? Math.round(player.tdc / team.totalDamageToChampions * 100) : 0}% of Team's Damage
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className='player-table'>
      {renderList(bluePlayers, '100')}
      {renderList(redPlayers, '200')}
    </div>
  )
}

export default PlayerTable
