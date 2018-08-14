/*
'use strict';



const loopback = require('loopback');
const promisify = require('util').promisify;
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdirp = promisify(require('mkdirp'));

const DATASOURCE_NAME = 'msql';
const dataSourceConfig = require('../datasources.json');
const db = new loopback.DataSource(dataSourceConfig[DATASOURCE_NAME]);
const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Exploited121",
  database: "craftist"
});

var tables=[];


module.exports = function(app, callback) {
  

function getTables(cb){

  try{
        con.connect((err)=> {
          if (err) throw err;
          con.query("show tables",  (err, mres, fields) => {
              if (err) throw err;
              tables=mres.map((val,i,arr)=>{
                return val['Tables_in_craftist']}
                );
              cb();
          });
        });

    }catch(err){
        console.error("err",err);
    }

    

}

    

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}


async function discover() {
  
    
    await asyncForEach(tables,async (table)=>{

      console.log("Syncing table: "+table);
      const options = {relations: true};
      const schemas = await db.discoverSchemas(table, options);
      //console.log("table: "+table,schemas);    

      console.log("table: "+table,JSON.stringify(schemas['craftist.'+table]));
    
      await mkdirp('common/models');
      await writeFile('common/models/'+table+'.json',JSON.stringify(schemas['craftist.'+table], null, 2));
      
      // Expose models via REST API
      const configJson = await readFile('server/model-config.json', 'utf-8');
      const config = JSON.parse(configJson);
      config[schemas['craftist.'+table]['name']] = {dataSource: DATASOURCE_NAME, public: true};
      await writeFile('server/model-config.json',JSON.stringify(config, null, 2));

    });



}


//getTables(()=>{console.log("tables",tables);  discover().then(success => process.exit(),error => { console.error('UNHANDLED ERROR:\n', error); process.exit(1); },);    });



//let Items=app.models.Items;
//Items.find({include:'userrel',limit: 1}, function(err, items) { 
//  console.log("item",items);
//});


      

};

*/