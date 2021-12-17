const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.la6rz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connect successfully');
        const database = client.db("luxuryHotel");
        const roomsCollection = database.collection("rooms");
        const reviewCollection = database.collection("review");
        const bookingCollection = database.collection("booking");
        const usersCollection = database.collection("users");
        const resturentCollection = database.collection("resturent");
        // rooms api
        app.post('/rooms', async (req, res) => {
            const room = req.body;
            const result = await roomsCollection.insertOne(room);
            res.json(result);
        });
        app.get('/rooms', async (req, res) => {
            const result = await roomsCollection.find({}).toArray();
            res.json(result);
        });
        // review api
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find({}).toArray();
            res.json(result);
        });
        // booking api
        app.post('/booking', async (req, res) => {
            const book = req.body;
            const result = await bookingCollection.insertOne(book);
            res.json(result);
        });
        app.get('/booking', async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.json(result);
        });
        app.get('/userbooking', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await bookingCollection.find(query).toArray();
            res.json(result);
        });
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        });
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: { status: 'approved' } };
            const result = await bookingCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        // users api
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
        app.put('/user', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        app.put('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isadmin = false;
            if (user?.role === 'admin') {
                isadmin = true;
            }
            res.json({ admin: isadmin });
        })
        // resturent api 
        app.post('/resturent', async (req, res) => {
            const resturent = req.body;
            const result = await resturentCollection.insertOne(resturent);
            res.json(result);
        });
        app.get('/resturent', async (req, res) => {
            const result = await resturentCollection.find({}).toArray();
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Luxury Hotel!')
})

app.listen(port, () => {
    console.log(`Listening at port:${port}`)
})