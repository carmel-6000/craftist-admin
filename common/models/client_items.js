'use strict';
var assert = require('assert');

//const dataSourceConfig = require('../datasources.json');
const loopback = require('loopback');
const dataSourceConfig = require('../../server/datasources.json');
const ds = new loopback.DataSource(dataSourceConfig['msql']);

const stores=["ebay","amazon","craftist.online","pinterest"];
const findObjByKeys=function(arr,keysArr){

//[{key:'store',value:'ebay'},{key:'native_id',value:item.id}]
//console.log("find obj by keys is launched");
  
  
  let noMatch=false;
  let foundObj=null;
  arr.forEach(entry=>{

    noMatch=false;
    
    //console.log("\n\nEntry:",entry);
    keysArr.forEach(keyEntry=>{

      
      //console.log("Looking for entry["+keyEntry.key+"] that is equals to "+keyEntry.value);
      if (entry[keyEntry.key] && entry[keyEntry.key] == keyEntry.value){
          //console.log("~~~~~~~~~~~~~~~~Found");
      }else{
        noMatch=true;
      }

    });

    if (!noMatch){
      foundObj=entry;
    }


  });

  return foundObj;


}

//var DataSource = require('loopback-datasource-juggler').DataSource;
//var ds = new DataSource('mysql');

module.exports = function(ClientItems) {
  
 

    
    ClientItems.findByClient = function(where, cb) {
      

      console.log("findByClient is launched with where",where);
      let userName=where.userName;
      //let sql="select ii.store,ii.foreign_link,ii.is_success,i.id,i.user_name,i.title,i.usd_price,i.category,i.sub_category from ids_indexes as ii left join items as i on i.id=ii.native_id where ii.etsy_user_name='"+userName+"'";
      let sql="select id,category,sub_category,title,usd_price,user_name from items where user_name = '"+userName+"'";
      //console.log("SQL:"+sql);

      ds.connector.execute(sql, null, (err,res)=>{

        //console.log("items results",res);
        
        
        if (res!==undefined && res.length>0){
          
          const idsArr=res.map(row=>row.id);
          //console.log("idsArr",idsArr);
          let sq="select native_id,store,foreign_link from ids_indexes where native_id in ("+idsArr.join(",")+")";
          console.log("sq",sq);
          
          ds.connector.execute(sq, null, (er,re)=>{

            console.log("IDS INDEXES RES",re);
            
            let link=null;
            res.forEach((item)=>{

              stores.forEach(store=>{

                link=findObjByKeys(re,[{key:'store',value:store},{key:'native_id',value:item.id}]);
              
                let storeKey=store.replace(".","");

                if (link!=null){
                  //console.log("Looking for link for item",item);
                  console.log("~~~~~~~~~~~~~~FOUND LINK",link);  
                  if (store=='ebay'){

                    item['ebay_link']="http://ebay.com/"+link.foreign_link;  
                  }else{

                    let href=link.foreign_link;
                    if (!href || href==''){
                      
                      item[storeKey+"_link"]='';
                    
                    }else{

                      if (href.indexOf('http://')!==-1){
                        item[storeKey+"_link"]=link.foreign_link;  
                      }else{
                        item[storeKey+"_link"]="http://"+link.foreign_link;  
                      }

                    }
                    
                    
                    
                  }
                  
                }else{
                  item[storeKey+'_link']=null;
                  //console.log("No ebay link for item");
                }

              });


              


              

            });


            cb(null, res);


          });


        }else{
          cb(null,[]);
        }

        

      });



      
    }

    ClientItems.remoteMethod('findByClient', {
          http:{
            verb:'get'
          },
          accepts: {arg: 'where', type: 'object'},
          returns: {arg: 'res', type: 'object',root:true}
    });


};

/*
  
  ClientItems.checkPermission = function(scope, model, property, accessType, callback) {
    this.resolveRelatedModels();
    var aclModel = this.aclModel;
    //assert(aclModel,'ACL model must be defined before Scope.checkPermission is called');

    this.findOne({where: {name: scope}}, function(err, scope) {
      
      if (err) {
        if (callback) callback(err);
      } else {
        
      }
    });
  };

*/
