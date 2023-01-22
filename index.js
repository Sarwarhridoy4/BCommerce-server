const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = process.env.uri
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const UserCollection = client.db("DbUser").collection("UserCollection");
        const ProductCollections = client.db("DbUser").collection("ProductCollections");
        //add consumers while registering
        app.put('/customers', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await UserCollection.insertOne(user);
            console.log(result);
            res.send(result);
        });
        //Show inventory products
        app.get('/products', async (req, res) => {
            const query = {}
            const result = await ProductCollections.find(query).toArray();
            res.send(result);
            
        })
        
    }
    finally {
        
    }
}

run().catch(err => console.log(err))



app.get('/', async (req, res) => {
    res.send('B-Commerce server is running');
})

app.listen(port, () => console.log(`B-Commerce server running on ${port}`))