const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


//middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcu2phw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();
    
    const serviceCollection= client.db('geniusCar').collection('service');

    app.get('/service', async (req,res) =>{
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services)
    });


    app.post('/service', async(req,res)=>{
        const newService=req.body;
        const result = serviceCollection.insertOne(newService);
        res.send(result)

    })

    app.delete('/service/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await serviceCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/service/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.send(service)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    /* await client.close(); */
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Running Genius Server')
})

app.listen(port,()=>{
    console.log("listening to port",port);
})