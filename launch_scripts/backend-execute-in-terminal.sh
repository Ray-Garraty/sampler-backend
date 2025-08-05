#!/bin/bash
BACKGRND_NODE_PROCESSES=$(pgrep -f "main.js")

if [[ -n "$BACKGRND_NODE_PROCESSES" ]]; then
        echo "Main.js Node process is already running with PIDs:"
	echo "$BACKGRND_NODE_PROCESSES"
	read -p "Press ENTER to quit..."
    else
        sudo "$(which node)" /home/vlabe/Desktop/sampler/main.js &
	NODE_PID=$!
	read -p "Press ENTER to shutdown the app and exit..."
	trap "kill $NODE_PID" EXIT
    fi