#!/bin/bash

echo "Stopping running server"
killall screen

tar -xzvf ~/tmp_release/portfolio-web-api.tar.gz -C ~/release --overwrite
screen -dm bash -c "source ~/.profile; ~/release/portfolio-web-api; read"
