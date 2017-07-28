import { GraphQLString, GraphQLID } from 'graphql/index';
import { GraphQLObjectType } from 'graphql/index';
import { Db, MongoClient, MongoClientOptions, Collection, ObjectID  } from 'mongodb/index'
import { createServer  } from 'http'
import { makeExecutableSchema  } from 'graphql-tools'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import  * as express  from 'express'

import  * as bodyParser from 'body-parser'

var url = "mongodb://usuario:solutis@172.29.40.43:27017/ezvida"

let database: Db

let json = require('./reports')

let Reports: Collection

const prepare = (o: any) => {
  o._id = o._id.toString()
  return o
}

const typeDefs: string[] = [`
    type Report  {
        _id: String
        reportIdentifier: String
        reportPosition: Location!        
    }
    type Location {
        latitude: Float!
        longitude: Float!
        altitude: Float!
    }
    type Query  {
        report(_id: String): Report
        reports: [Report]    
    }
    schema {
        query: Query
    }`
] 

const resolvers = {
    Query: {
        report: async (root: any, {_id} : {_id: string}) => {
            return prepare(await Reports.findOne(new ObjectID(_id)))
        },
        reports: async () => {
            return (await Reports.find({}).toArray()).map(prepare)
        }
    }
}

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

MongoClient.connect(url).then( (db) => {    
    console.log("connected")    
    database = db    
})
/*.then( (any) =>  
    database.collection('reports').insertMany( json, (err, res) => {
        if (err) throw err;
        console.log('registros inseridos com sucesso')
    }))*/
.then( async () => {      

    Reports = await database.collection("reports")

    console.log('reports recuperados do banco')

    const app = express()

    app.use('/graph',bodyParser.json(), graphqlExpress({schema}))

    app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graph'   
    }))

    app.listen(8080)

        
})   
.catch( (reason) => console.log(reason)) 





