import React from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'

function App ({ children }) {
  return (
    <div className='app-view'>
      <Helmet
        titleTemplate='%s - League Interactive Timeline'
        defaultTitle='League Interactive Timeline'
        link={[
          {rel: 'dns-prefetch', href: 'https://timeline-cdn.bruggie.com/'},
          {rel: 'dns-prefetch', href: 'https://ddragon.leagueoflegends.com/'},
          {rel: 'dns-prefetch', href: 'https://lol-mh-proxy.now.sh/'}
        ]}
      />
      <div className='about'>
        <p> Created by <strong><a href='https://twitter.com/zachbruggeman' target='_blank'>@zachbruggeman</a></strong> | <Link to='/' href='/'>About</Link> | <a href='https://github.com/remixz/lol-game-analysis' target='_blank'>View on GitHub</a> </p>
      </div>
      {children}
      <p className='fineprint'> League Interactive Timeline isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends &copy; Riot Games, Inc. </p>
    </div>
  )
}

export default App
