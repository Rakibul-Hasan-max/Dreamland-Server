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
        const purchaseCollection = database.collection("purchase");
        const usersCollection = database.collection("users");
        const reviewCollection = database.collection("review");

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

        //GET API
        app.get('/purchase', async (req, res) => {
            const email = req.query.email;
            const query = {email: email}
            const cursor = purchaseCollection.find(query);
            const purchase = await cursor.toArray();
	        res.send(purchase);
        })

        // POST for user purchase data
        app.post('/purchase', async (req, res) => {
            const document = req.body;
            console.log('hit the post api', document);

            const result = await purchaseCollection.insertOne(document);
            console.log(result);
            res.json(result);
        });

        // POST for users data
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('hit the post api', user);

            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // POST API for review
        app.post('/review', async (req, res) => {
            const docu = req.body;
            console.log('hit the post api', docu);

            const result = await reviewCollection.insertOne(docu);
            console.log(result);
            res.json(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        //GET single service
        app.get('/properties/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const property = await propertiesCollection.findOne(query);
            res.json(property);
        })
        
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
