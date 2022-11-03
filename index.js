const express = require('express');
const app= express();
const cors = require('cors');
const port=process.env.PORT || 5000;

require('dotenv').config()

// midle ware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c5dej4c.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run (){
    try{
        // dabaseCollection;
        const serviceCollection=client.db('geniusCar').collection('services')
        const orderCollection =client.db('geniusCar').collection('orders')
        
        
        // load data mongodb => server side
        // lo
        app.get('/services', async (req,res)=>{
            const query={}
            const cursor= serviceCollection.find(query);
            const services= await cursor.toArray();
            res.send(services)
        });
        app.get('/services/:id', async(req,res)=>{
            const id =req.params.id;
            const query= {_id:ObjectId(id)};
            const service= await serviceCollection.findOne(query);
            res.send(service)
        })

        // orders api 
        // create. serverSide=>mongodb
        app.post('/orders', async(req, res)=>{
            // je kono data client side theke body tei pathano hoy.
            const orders =req.body;
            // must include await;
            const result= await orderCollection.insertOne(orders);
            res.send(result);
            
        })

        // get orders mongoDb => server
        app.get('/orders',async(req,res)=>{
            let query= {};

            //load data by query parameter
            if (req.query.email){
                query={
                    email: req.query.email
                }
            }
            const cursor=orderCollection.find(query)
            const orders= await cursor.toArray();
            res.send(orders)
        })

        // delete orders from mongo database;
        app.delete('/orders/:id',async(req, res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)}
            const result= await orderCollection.deleteOne(query)
            res.send(result)
        })

 
        // update a document by patch method
        app.patch('/orders/:id',async(req, res)=>{
            const id = req.params.id;
            const status=req.body.status
            const query ={_id: ObjectId(id)}
            const updateDoc={
                $set:{
                    status: status
                }
            }
            const result= await orderCollection.updateOne(query,updateDoc)
            res.send(result)
        })

    }
    finally{

    }
}
run().catch(err=>console.log(err))



app.get('/',(req, res)=>{
    res.send('server api is running')
});


app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
})

