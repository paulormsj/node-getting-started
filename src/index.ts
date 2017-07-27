import { GraphQLString, GraphQLID } from './../typings/modules/graphql/index.d';
import { GraphQLObjectType } from 'graphql/index';
import { Db, MongoClient, MongoClientOptions  } from 'mongodb/index'
import { createServer  } from 'http'


var url = "mongodb://usuario:solutis@172.29.40.43:27017/ezvida"

let database: Db

let json = require('./reports')

MongoClient.connect(url).then( (db) => {    
    console.log("connected")    
    database = db    
})
/*.then( (any) =>  
    database.collection('records').insertMany( json, (err, res) => {
        if (err) throw err;
        console.log('registros inseridos com sucesso')
    }))*/
.then( () => {      
    const  reportType = new GraphQLObjectType({
        name: 'records',
        fields:  {
            reportIdentifier: {
                type: GraphQLID
            }
        }
    })
    database.close()
        
})   
.catch( (reason) => console.log(reason)) 





