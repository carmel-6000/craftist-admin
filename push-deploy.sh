#!/bin/bash

rsync --exclude='build' --exclude='node_modules' --exclude='server/datasources.json' -rvza . parana:/home/mogo/www/prod/admin.craftist.online


ssh parana <<PARANA
     

     cd /home/mogo/www/prod/admin.craftist.online
     npm run-script build && pm2 reload admin.craftist.online

PARANA

