#!/bin/zsh

# Number of requests to send
REQUESTS=20

# URL of your load balancer
URL="http://localhost:8000"

# Loop to send requests 
for ((i = 1; i <= REQUESTS; i++)); do
  curl $URL &
  sleep 0.1
done

wait
echo "All requests have been sent."