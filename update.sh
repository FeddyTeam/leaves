#!/bin/sh

cd /var/www/home/leaves

git pull

npm install

docker-compose build
docker-compose down
docker-compose up -d
