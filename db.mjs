import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://mercyayala:dbaguantalamusica@aguantalamusica.fb0ld.mongodb.net/?retryWrites=true&w=majority&appName=aguantalamusica";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true, // Garantiza API moderna
        deprecationErrors: true, // Muestra advertencias si usas funciones en desuso
    },
});

// Conexión reusable para otras partes de la app
export async function connectToDB() {
    try {
        await client.connect(); // Conectar al clúster
        console.log("Conectado a MongoDB");
        return client.db("aguantalamusica"); // Cambia al nombre real de tu base de datos
    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
        throw error; // Lanza el error para que el servidor lo maneje
    }
}

export default client;



