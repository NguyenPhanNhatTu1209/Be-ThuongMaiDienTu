#!/bin/bash

# Give permission for everything in the express-app directory
sudo chmod -R 777 /home/ubuntu/file/ec-2021
sudo chmod -R 777 /home/ubuntu/file/ec-2021/dist

# Navigate into our working directory where we have all our github files
cd /home/ubuntu/file/ec-2021

# Install yarn dependencies
yarn

# Build docker image
sudo docker build -t lambiengcode/ec-b010 .

# Run docker container
sudo docker run -d --name ec-b010 -p 8080:8080 --env-file .env lambiengcode/ec-b010:latest