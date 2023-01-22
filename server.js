const express = require('express')
const cors = require('cors')
require('dotenv').config()
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({message: 'API listening'})
})

app.post('/api/movies', async (req, res) => {
    try {
        const movie = await db.addNewMovie(req.body)
        res.status(201).json({newMovie: movie})
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
})

app.get('/api/movies', async (req, res) => {
    try {
        const movies = await db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
        res.status(200).json(movies)
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
})

app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await db.getMovieById(req.params.id)
        res.status(200).json({foundMovie: movie})
    }
    catch(err) {
        res.status(500).json({message: `no movie found with ${req.params.id} id`})
    }
})

app.put('/api/movies/:id', async (req, res) => {
    try {
        await db.updateMovieById(req.body, req.params.id)
        res.status(200).json({message: `user with id ${req.params.id} updated successfully`})
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
})

app.delete('/api/movies/:id', async (req, res) => {
    try {
        await db.deleteMovieById(req.params.id)
        res.status(200).json({message: `user with id ${req.params.id} deleted successfully`})
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
})

db.initialize(process.env.MONGODB_CONN_STRING)
.then(()=>{
    app.listen(8080, ()=>{
    console.log(`server listening on: ${8080}`);
    });
})
.catch((err)=>{
    console.log(err);
});