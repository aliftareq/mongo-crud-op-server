const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('colors')
const app = express()

//middlewares
app.use(cors())
app.use(express.json())

//user : dbusers2
//password : lt3QHib2p9VEYIC0

//connecting uri & client
const uri = "mongodb+srv://dbusers2:lt3QHib2p9VEYIC0@cluster0.preca8g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect() {
    try {
        await client.connect()
        console.log('Database succesfully connected'.yellow);
    }
    catch (error) {
        console.log('something went wrong', error.message.red.bold);
    }
}

dbConnect()

//database and collection
const MyUsers = client.db('MyDataBase').collection('MyUsers')

// actions(endPoints)

//1 insert data in database;
app.post('/users', async (req, res) => {
    // start of try catch
    try {
        // inserting the data
        const result = await MyUsers.insertOne(req.body)

        //sending respont based on result
        if (result.insertedId) {
            res.send({
                success: true,
                data: result
            })
        }
        else {
            res.send({
                success: false,
                data: 'Something went wrong'
            })
        }
    }
    catch (error) {
        res.send({
            success: false,
            data: error.message
        })
    }
})

//2 read data from database;
app.get('/users', async (req, res) => {
    try {
        const cursor = MyUsers.find({})
        const savedUsers = await cursor.toArray()
        res.send({
            success: true,
            message: 'succesfully got the data',
            data: savedUsers
        })
    }
    catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

//3 delete data from database
app.delete('/user/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await MyUsers.findOne({ _id: ObjectId(id) })
        if (!user?._id) {
            res.send({
                success: 'false',
                message: "No user exist in this name"
            });
            return;
        }
        const result = await MyUsers.deleteOne({ _id: ObjectId(id) })
        res.send({
            success: true,
            message: 'User have been removed from data-base successfully',
            data: result
        })
    }
    catch (error) {
        res.send({
            success: false,
            message: 'something went wrong'
        })
    }
})

//4 get single data by id
app.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await MyUsers.findOne({ _id: ObjectId(id) })
        if (user?._id) {
            res.send({
                success: true,
                message: 'User Data found',
                data: user
            })
        }
        else {
            res.send({
                success: false,
                message: 'User data not found'
            })
        }
    }
    catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})
//5 update single data by id
app.patch('/user/:id', async (req, res) => {
    const id = req.params.id
    try {
        const result = await MyUsers.updateOne({ _id: ObjectId(id) }, { $set: req.body })
        res.send({
            success: true,
            message: 'Data Updates successfully',
            data: result
        })
    }
    catch (error) {
        res.send({
            success: true,
            message: error.message
        })
    }
})




app.listen(5000, () => {
    console.log(`This server is running in port ${5000}`);
})


// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });