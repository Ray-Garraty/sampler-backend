#!/bin/bash
chromium index.html --window-size=800,480 --new-window --user-data-dir=$(mktemp -d) &
sudo "$(which node)" main.js &
NODE_PID=$!
read -p "Press Enter to close the terminal..."
trap "kill $NODE_PID" EXIT