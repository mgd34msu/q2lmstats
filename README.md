# q2lmstats
This project is the web front-end for my fork of Q2 LMCTF https://github.com/mgd34msu/lmctf60. I have added extensive new in-game stat tracking to the game, and have also implemented lightweight database support through SQLite. This API hits the SQLite backend to allow players to access stats from outside of the Quake2 client.

API currently running at:
http://play.quakeagain.com

This requires an updated LMCTF 6.1.1 gamesx86 that I have not yet updated on github.  It will work with the current version of LMCTF 6.1.1 listed above, but you will need to alter the path to the lmctf.db file so that it is created in the directory that houses the files from this project.
