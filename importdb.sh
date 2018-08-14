#!/bin/bash
DB=craftist
USER=root
PW=Exploited121
HOST=localhost

ssh parana <<PLUTO
     
     mysqldump -hlocalhost craftist -uroot -pz10mz10m11 >/tmp/craftist.dump.sql

PLUTO


if [ -f /tmp/craftist.dump.sql ];then
     rm /tmp/craftist.dump.sql
fi

scp parana:/tmp/craftist.dump.sql /tmp 

if [ -f /tmp/craftist.dump.sql ];then
     echo "Dumped SQL from parana is ready on /tmp/craftist.dump.sql"
     echo -n "Are you sure you like to override your database with it? [Y/n]"
     read confirm
     if [ $confirm == "Y" ]; then
          echo -n "Overriding database with pluto dump.."
          mysql -h$HOST $DB -u$USER -p$PW < /tmp/craftist.dump.sql
     else
          echo Ok..so chao!
          echo
     fi
else
     echo "No such file /tmp/craftist.dump.sql .. Check your script and try again.."
fi     

