#!/bin/bash

echo "Stopping running server"
killall screen

cp ~/tmp_release/* ~/release/
screen -dm bash -c "source ~/.profile; ~/release/portfolio-web-api; read"
