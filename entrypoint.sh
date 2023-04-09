#!/bin/bash

yarn generate
yarn migrate
exec "$@"
