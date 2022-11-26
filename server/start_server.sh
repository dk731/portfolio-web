#!/bin/bash

echo "Stopping running server"
killall screen

screen -dm bash -c "source ~/.profile; ./target/release/portfolio-web-api; read"
