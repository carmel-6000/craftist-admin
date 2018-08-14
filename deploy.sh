#!/bin/bash

npm run-script build && pm2 reload admin.craftist.online
