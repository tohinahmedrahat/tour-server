const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASSWORD}@cluster0.mk9rehn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      const tour = client.db("tourCollection").collection("tour");
      const review = client.db("tourCollection").collection("review")
     
      // get all tour
      app.get("/tour", async(req,res) => {
        const query = {}
        const cursor = tour.find(query)
        const result = await cursor.toArray()
        res.send(result)
      })
    //   get limit tour
    app.get("/tours",async(req,res) => {
        const query ={}
        const cursor = tour.find(query)
        const result = await cursor.limit(3).toArray()
        res.send(result)
    })
    //   get single tour
    app.get("/tour/:id",async(req,res) =>{
        const id = req.params.id
        const query = {_id:ObjectId(id)}
        const result = await tour.findOne(query)
        res.send(result)
    })
      app.post("/review", async(req,res) => {
        const reviews = req.body
          const result = await review.insertOne(reviews)
          res.send(result)
      })
      // get review with service name
      app.get("/review",async(req,res)=>{
        const service = req.query.name;
        const query = {serviceName:service}
        const cursor = review.find(query)
        const result = await cursor.toArray()
        res.send(result)
      })
      // get review with email 
      app.get("/reviews",async(req,res)=>{
        const email = req.query.email;
        const query = {userEmail:email}
        const cursor = review.find(query)
        const result = await cursor.toArray()
        res.send(result)
      })
      // delete review from user 
      app.delete("/review/:id",async(req,res)=>{
        const id = req.params.id;
        console.log(id)
        const query = {_id:ObjectId(id)}
        const result = await review.deleteOne(query)
        res.send(result)
      })
      app.get("/review/:id",async(req,res) =>{
        const id = req.params.id
        const query = {_id:ObjectId(id)}
        const result = await review.findOne(query)
        res.send(result)
    })
    app.put('/reviewUpdate/:id', async (req, res) => {
      const _id = req.params.id;
      const data = req.body;
      const query = { _id: ObjectId(_id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
            userName:data.userName,
            userReview:data.userReview
          }
      };
      const result = await review.updateOne(query, updateDoc, options);
      res.send(result)
      console.log(data)
  })

}
     finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})