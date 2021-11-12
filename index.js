const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p5r6u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const database = client.db("dreamland");
        const propertiesCollection = database.collection("properties");

        //GET API
        app.get('/properties', async (req, res) => {
            const cursor = propertiesCollection.find({});
            const properties = await cursor.toArray();
	        res.send(properties);
        })

        // POST API
        app.post('/properties', async (req, res) => {
            const doc = req.body;
            console.log('hit the post api', doc);

            const result = await propertiesCollection.insertOne(doc);
            console.log(result);
            res.json(result);
        });

        //GET single service
        app.get('/properties/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const property = await propertiesCollection.findOne(query);
            res.json(property);
        })
        
        // DELETE API
        // app.delete('/services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const result = await servicesCollection.deleteOne(query);
        //     res.json(result);
        // });

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
	res.send('Running Dreamland server');
})

app.listen(port, () => {
	console.log('Listening Dreamland server on port', port);
})
