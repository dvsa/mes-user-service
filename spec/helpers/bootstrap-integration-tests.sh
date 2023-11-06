#!/bin/bash

function echo_ok() { echo -e '\033[1;32m'"$1"'\033[0m'; }
function echo_warn() { echo -e '\033[1;33m'"$1"'\033[0m'; }
function echo_error() { echo -e '\033[1;31mERROR: '"$1"'\033[0m'; }

echo_warn "Waiting for SLS to spin up..."

server_port=3000
dynamodb_port=8000

kill_process_on_port() {
    local port
    local pid

    port=$1

    pid=$(lsof -i:"$port" | awk 'NR>1 {print $2}')

    if [[ -n $pid ]]; then
        kill -9 "$pid"
        echo "Killed process $pid listening on port $port"
    fi
}

# Call the function for each port just to ensure nothing open/running
kill_process_on_port $server_port
kill_process_on_port $dynamodb_port

# Stop polling after 60s
timeout=60
elapsed_time=0

# Poll the server to see if it's ready
while ! curl --silent http://localhost:$server_port/ > /dev/null; do
  # Retry every 1 second
  sleep 1

  # Record elapsed time
  elapsed_time=$((elapsed_time + 1))

  # Bail out after timeout is reached
   if [ $elapsed_time -ge $timeout ]; then
      echo_error "SLS server did not respond within $timeout seconds"
      exit 1
    fi
done

echo_ok "SLS initialised."
