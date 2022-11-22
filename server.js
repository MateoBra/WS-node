const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const { Server } = require("socket.io")

const port = 5000
const app = express()

app.use(bodyParser.json({ type: "*/*" }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const io = new Server(5000, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})



const { Sequelize, DataTypes } = require('sequelize');


//kreiranje istance
const sequelize = new Sequelize('Table_1', 'sa', 'password123', {
    dialect: 'mssql',
    dialectOptions: {
        // Observe the need for this nested `options` field for MSSQL
        options: {
            // Your tedious options here
            useUTC: false,
            dateFirst: 1
        }
    }
});

//Kreiranje modela
//Pazit na automatski dodane stvari (id, timestamps,createdAt,updatedAt), id mora postojat osim ako se ne postavi primaryKey na neki
const Data = sequelize.define("iotData", {
    seqId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    temp: {
        type: DataTypes.DOUBLE
    },
    humidity: {
        type: DataTypes.DOUBLE
    },
    pressure: {
        type: DataTypes.DOUBLE
    },
    gas_resistance: {
        type: DataTypes.DOUBLE
    }

}, {

    //freezeTableName: true
    tableName: "iotData",
    timestamps: false,
    createdAt: false,
    updatedAt: false,


})
//update tablice .sync( { alter: true}).
/*
setTimeout(() => {

    Data.sync({ alter: true })
        .then(() => 
            //Unos u bazu se radi s .create({})
            // .bulkCreate([]) unosi niz podataka
            Data.create({
                temp: Math.random() * 10,
                humidity: Math.random() * 10,
                pressure: Math.random() * 10,
                gas_resistance: Math.random() * 10

            })
        ).then((data) => { console.log(data) })
        .then(()=>Data.findAll({
            limit: 10,
            order: [["seqId", "desc"]]
        }))
        .then((data)=>console.log(data))

        .catch((e) => { console.log(e) })
}, 1000);
*/



let i = 0
let x= 10

io.on("connection", socket => {    
    setInterval(() => {
        console.log(i)
        
        socket.emit("response", {
            
            seqId: i++,
            temp: Math.random() * 10,
            humidity: Math.random() * 10,
            pressure: Math.random() * 10,
            gas_resistance: Math.random() * 10
        })

    }, 1000)
    
})



