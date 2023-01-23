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
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const UserCollection = client.db("DbUser").collection("UserCollection");
        const ProductCollections = client.db("DbUser").collection("ProductCollections");
        const CartCollections = client.db("DbUser").collection("CartCollections");
        //add consumers while registering
        app.put('/customers', async (req, res) => {
            const user = req.body
            const email = user.email
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await UserCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        
        //add product to cart
        app.post('/cart', async (req, res) => {
            const cartinfo = req.body;
            console.log(cartinfo);
            const result = await CartCollections.insertOne(cartinfo);
            console.log(result);
            res.send(result);
        });
        //Show inventory products
        app.get('/products', async (req, res) => {
            const query = {}
            const result = await ProductCollections.find(query).toArray();
            res.send(result);
            
        });
        //geting individual product detailse
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {}
            const allproduct = await ProductCollections.find(query).toArray();
            const product = allproduct.filter(pro => pro._id == id)
            console.log(product);
            res.send(product);
            
        });
        
        //geting individual users cart
        //get order customer and admin
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = {}
            const orders = await CartCollections.find(query).toArray();
            const users = await UserCollection.findOne({ email: email });

            if (users?.role === 'admin') {
                res.send(orders)
            }
            else {
                const order = orders?.filter(order => order.email === email)
                res.send(order);
            }
        });

        // delete a cart item
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await CartCollections.deleteOne(query);
            res.send(result);
        });

        //Routes for admin panel
        // getting all customer list
        app.get('/customers', async (req, res) => {
            const query = {}
            const result = await UserCollection.find(query).toArray();
            res.send(result);
            
        });

        //Show All orders
        app.get('/orders', async (req, res) => {
            const query = {}
            const result = await CartCollections.find(query).toArray();
            res.send(result);
            
        });
        
    }
    finally {
        
    }
}

run().catch(err => console.log(err))



app.get('/', async (req, res) => {
    res.send('B-Commerce server is running');
})

app.listen(port, () => console.log(`B-Commerce server running on ${port}`))