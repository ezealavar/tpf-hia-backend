import express from "express";
import usersRoutes from "./routes/users.routes.js";
import morgan from "morgan";
import cors from "cors";
import { PORT } from "./config.js";

const app = express();

// Middlewares
app.use(morgan("dev"));

// Configuración de CORS para permitir solicitudes desde el dominio de Netlify
const allowedOrigins = ["https://idyllic-pothos-c76aef.netlify.app"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use(usersRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log("Server on port", PORT);
});
