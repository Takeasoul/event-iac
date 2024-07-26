#!/bin/bash
npm run build
docker build --no-cache -t event-manager-frontend .
docker tag event-manager-frontend dragalone/event-manager-frontend
docker push dragalone/event-manager-frontend
