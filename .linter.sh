#!/bin/bash
cd /home/kavia/workspace/code-generation/reactflaskauth-115030-9768bcd4/login_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

