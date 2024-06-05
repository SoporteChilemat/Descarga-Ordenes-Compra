import express, { Application } from "express";
import cors from "cors";
import expressWs from "express-ws";

import Api from "./controllers"; // Asegúrese de que la ruta es correcta.
import config from '../src/config';
import { startScheduler } from '../src/utils/scheduler';

const PORT = config.port;
const expressApp: Application = express();
const { app, applyTo, getWss } = expressWs(expressApp);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Api(app); // Asegúrate de que tu módulo Api esté correctamente configurado para usar con express-ws si es necesario.

app.listen(PORT, () => {
  startScheduler(); // Iniciar el scheduler automáticamente
  console.log(`Server is running on port http://localhost:${PORT}`);
});
