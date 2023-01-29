/*********************************************************************************
* BTI425 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Andrii Sych Student ID: 125752212 Date: 2022-01-28
* Cyclic Link: https://shy-rose-hedgehog-hem.cyclic.app
*
********************************************************************************/
const express = require('express')
const handlebars = require('express-handlebars')
const cors = require('cors')
require('dotenv').config()
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const app = express()
app.use(express.static('public'))

app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: '.hbs'
}));

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index')
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
        res.status(200).json(movie)
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