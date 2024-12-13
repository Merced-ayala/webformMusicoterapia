import express from "express";
import { connectToDB } from "./db.mjs";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

let db;
let contactsCollection;

async function initializeDatabase() {
    try {
        db = await connectToDB(); // Reutiliza la conexión de db.mjs
        contactsCollection = db.collection("contacts"); // Define la colección
        console.log("Conexión exitosa a la base de datos");
    } catch (err) {
        console.error("Error inicializando la base de datos:", err);
    }
}

initializeDatabase();

// Rutas y Métodos de la API
// Obtener todos los contactos
app.get("/contacts", async (req, res) => {
    try {
        const contacts = await contactsCollection.find().toArray();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener contactos", error: err.message });
    }
});

// Crear un nuevo contacto
app.post("/contacts", async (req, res) => {
    const { name, email, phone, message } = req.body;
    const newContact = { name, email, phone, message };

    try {
        const result = await contactsCollection.insertOne(newContact);
        res.status(201).json({
            message: "Contacto creado exitosamente",
            contact: { _id: result.insertedId, ...newContact },
        });
    } catch (err) {
        res.status(400).json({ message: "Error al crear el contacto", error: err.message });
    }
});

// Actualizar un contacto por ID
app.put("/contacts/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;
    const updatedContact = { name, email, phone, message };

    try {
        const result = await contactsCollection.updateOne(
            { _id: new MongoClient.ObjectId(id) },
            { $set: updatedContact }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Contacto no encontrado" });
        }
        res.json({ message: "Contacto actualizado", contact: updatedContact });
    } catch (err) {
        res.status(400).json({ message: "Error al actualizar el contacto", error: err.message });
    }
});

// Eliminar un contacto por ID
app.delete("/contacts/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await contactsCollection.deleteOne({
            _id: new MongoClient.ObjectId(id),
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Contacto no encontrado" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: "Error al eliminar el contacto", error: err.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
