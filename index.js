const express =require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const app = express();
const port = process.env.POTT || 5000;

//midleware

app.use(cors());
app.use(express.json());



// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rtsqfuv.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);





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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

   

    const productDataCollection = client.db("addproductDB").collection("addproducts");
    const userCollection =client.db('addproductDB').collection("user");

    app.get("/addproduct", async (req, res) => {
      const cursor = productDataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post("/addproduct", async (req, res) => {
      const product = req.body;
      const result = await productDataCollection.insertOne(product);
      console.log(result);
      res.send(result);
    });
    
   

    app.get("/addproduct/:id", async (req, res) => {
      
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productDataCollection.findOne(query);
      res.send(result);
    });

    app.post('/addproduct/:brand/:id', async(req, res) => {
      const brand =req.params.brand;
      const newProduct = req.body;
      console.log('new product', newProduct);
      const result = await productDataCollection.insertOne(newProduct);
      res.send(result);
    })

    app.delete("/addproduct/:id", async (req, res) => {
      const id = req.params.id;
     console.log('please delete from database',id);
     const query ={_id: new ObjectId(id)}
     const result =await productDataCollection.deleteOne(query);
     res.send(result)
    })
    

    app.put("/addproduct:id", async (req, res) => {
     
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { usert: true };
      const product = req.body;
      const updateProduct = {
        $set: {
          name: product.name,
          photo: product.photo,
          rating:product.rating,
          price: product.price,
          brand: product.brand,
          
          
        },
      };
      const result = await productDataCollection.updateOne(
        filter,
        updateProduct,
        options
      );
      res.send(result);
    });

// user related api
     app.get('/user', async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
     app.post('/user', async(req, res) => {
      const user = req.body;
      console.log('new user', user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

     
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/' , (req, res) => {
    res.send('Brand_shop running')
})


app.listen(port, () => {
   console.log(`Brand shop  IS RUNNUNG on port, ${port}`)
})