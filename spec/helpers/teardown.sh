#!/bin/sh -e

# Shut down any open serverless connections
kill -9 "$(lsof -i:3000 | awk '{print $2}' | grep -v '^PID')"

# Shut down any open serverless dynamodb local connections
kill -9 "$(lsof -i:8000 | awk '{print $2}' | grep -v '^PID')"
