#!/bin/bash

#################################################################
# Script de automação de projeto
# Requisitos: docker, docker-compose
#
# Descrição: Script de inicialização de projeto docker
#
# uso: bash start.sh   ou sh start.sh
#
#################################################################


echo '_______  _______  ________
|  ____| |  ____| | _____|
| |__    | |__    | |
|  __|   |  __|   | |
| |____  | |      | |____ 
|______| |_|      |______|'
echo ''
echo ''

echo '  -- build  -- \n'
docker-compose up -d --build


