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
     
      // get all document
      app.get("/tour", async(req,res) => {
        const query = {}
        const cursor = tour.find(query)
        const result = await cursor.toArray()
        res.send(result)
      })
    //   get single tour
    app.get("/tour/:id",async(req,res) =>{
        const id = req.params.id
        const query = {_id:ObjectId(id)}
        const result = await tour.findOne(query)
        res.send(result)
    })
      app.post("review", async(req,res) => {
        const doc = {
            title: "from review",
            content: "No bytes, no problem. Just insert a document, in MongoDB",
          }
          const result = await review.insertOne(doc)
          res.send(result)
      })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})