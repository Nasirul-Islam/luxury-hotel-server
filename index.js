const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');

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

        app.post('/rooms', async (req, res) => {
            const room = req.body;
            console.log(room);
            const result = await roomsCollection.insertOne(room);
            res.json(result);
        });
        app.get('/rooms', async (req, res) => {
            const result = await roomsCollection.find({}).toArray();
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