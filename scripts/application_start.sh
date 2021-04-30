#!/bin/bash

# Give permission for everything in the express-app directory
sudo chmod -R 777 /home/ubuntu/file/ec-2021
sudo chmod -R 777 /home/ubuntu/file/ec-2021/dist

# Navigate into our working directory where we have all our github files
cd /home/ubuntu/file/ec-2021

# Install yarn dependencies
yarn

# Run pm2
yarn pm2