## data-grabber

these are the tools that grab data from lolesports when a game is live, and merge it into a full dataset for the viz. very messy/hacky, so not really well documented, but brief how to use it:

```bash
mkdir live finished merged
node grab.js # run this before a game goes live; it'll automatically get all the current games, and log the data to a file every time the lolesports live socket updates. you should ideally run this before a game is live, so you can get all the data. this could actually be run on a server so it's always looking for live games 24/7 if you really wanted to
node merge.js # after you have a complete file from grab.js, run this, and it'll automatically turn those files into "merged" files with the proper data and file name
```

grab and merge could probably be just one script but i wrote this with a different idea in mind originally that needed them separated. oh well, maybe i'll do that later or something
