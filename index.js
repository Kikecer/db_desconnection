import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from './Db.js';



const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Servidor corriendo perfectamente' });
});

app.get('/movies', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM movies');
        res.json(rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/movies', async (req, res) => {
    console.log("BODY:", req.body);
    try {
        const { title, year, genre } = req.body;
        const [result] = await pool.query(
            'INSERT INTO movies (title, year, genre) VALUES (?, ?, ?)',
            [title, year, genre]
        );
        res.json({ id: result.insertId, title, year, genre });
    } catch (err) {
        res.status(500).json(err);
    }
});

app.delete("/movies/:id", async (req, res) =>{
    const id = req.params;
    try{
        const [result] = await pool.query("SELECT FROM movies WHERE id=?", [id]);

        if(result.affectedRows == 0){
           return res. status(404).json ({ message: "Pelicula no encontrada" })
        }
        
        res.status(200).send({ message: "Pelicula eliminada correctamate" })
    }catch (error){
        res.status(500).json({ message: "Error del servidor al eliminar", err: error })
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});



