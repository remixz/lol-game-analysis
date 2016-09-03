const csvStringify = require('csv-stringify')
const moment = require('moment')

const TRINKET_IDS = [3340, 3341, 3363, 3364]
const KEYSTONES = [6161, 6162, 6164, 6361, 6362, 6363, 6261, 6262, 6263]

function formatTime (ms) {
  let min = (ms / 1000 / 60) << 0
  let sec = (ms / 1000) % 60 << 0

  return min + ',' + (sec < 10 ? '0' : '') + sec
}

function generateCsv (game, cb) {
  let input = []

  // headers for player data
  input.push(['PLAYER', 'CHAMPID', 'PLAYERNAME', 'SSPELL1', 'SSPELL2', 'K', 'D', 'A', 'ITEM1', 'ITEM2', 'ITEM3', 'ITEM4', 'ITEM5', 'ITEM6', 'ITEM7', 'GOLD', 'CS', 'KEYSTONEID'])

  // add player data
  Object.keys(game.playerStats).forEach((key) => {
    let player = game.playerStats[key]
    let playerData = []

    // push all data up to items
    playerData.push(`Player ${key}`, player.championId, player.summonerName, player.summonersSpell1, player.summonersSpell2, player.kills, player.deaths, player.assists)
    // add items
    let trinket = ''
    let playerItems = []
    player.items.forEach((item, i) => {
      if (TRINKET_IDS.indexOf(item) > -1) {
        trinket = item
        return
      }
      playerItems.push(item)
    })
    playerItems[6] = trinket
    playerData = playerData.concat(playerItems)
    // push gold and cs
    playerData.push(player.tg, player.mk)
    // find keystone and push
    let keystone = player.masteries.find((obj) => KEYSTONES.indexOf(obj.masteryId) > -1)
    playerData.push(keystone.masteryId)

    // finally push to input
    input.push(playerData)

    let playersTeam = game.teamStats[String(player.teamId)]
    // while we're here, let's add some extra team stats for later
    if (!playersTeam.extras) {
      playersTeam.kills = 0
      playersTeam.gold = 0
      playersTeam.extras = true
    }
    playersTeam.kills += player.kills
    playersTeam.gold += player.tg
  })

  // headers for team data
  input.push(['TEAMID', 'KILLS', 'GOLD', 'TOWER', 'DRAGONS', 'BARONS', 'RIFTHERALDS'].concat(new Array(11)))

  // add team data
  Object.keys(game.teamStats).forEach((key) => {
    let team = game.teamStats[key]

    // everything except riftheralds :\
    input.push([key, team.kills, team.gold, team.towersKilled, team.dragonsKilled, team.baronsKilled, ''].concat(new Array(11)))
  })

  // metadata about game
  let date = moment()
  let winningTeam = Object.keys(game.teamStats).find((key) => game.teamStats[key].matchVictory === 1)
  input.push(['DATE', 'GAMELENGTH', 'WINNER', 'BLUEBAN1', 'BLUEBAN2', 'BLUEBAN3', 'REDBAN1', 'REDBAN2', 'REDBAN3', 'STARTTIMEUTC', 'PATCH'].concat(new Array(7)))
  input.push([date.format('M/D/Y'), formatTime(game.t), winningTeam.charAt(0), '', '', '', '', '', '', '', ''].concat(new Array(7)))
  csvStringify(input, (err, out) => {
    if (err) return cb(err)

    let csv = out + '\n'
    cb(null, csv)
  })
}

module.exports = generateCsv
