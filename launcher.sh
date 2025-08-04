#!/bin/bash
sudo "$(which node)" main.js
NODE_PID=$!
read -p "Press Enter to close the terminal..."
trap "kill $NODE_PID" EXIT