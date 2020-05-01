#!/bin/sh

if [ $(ps -e -o uid,cmd | grep $UID | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
	export PATH=/usr/local/bin:$PATH
	cd /srv/blender/server
	forever start -l blender2.log --append -o blender2Out.log -e blender2Error.log server.js >> /home/deploy/.forever/blender2Restart.log 2>&1
fi
