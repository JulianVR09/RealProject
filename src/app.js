import express from 'express';
import dotenv from 'dotenv';
import errorhandler from './Middleware/error.handler.js';
import routerWarehouse from './Routes/warehouses.js';
import routerShipment from './Routes/shipmets.js';
import routerDriver from './Routes/drivers.js';
import routerVehicle from './Routes/vehicles.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/warehouses', routerWarehouse );
app.use('/shipments', routerShipment);
app.use('/drivers', routerDriver);
app.use('/vehicles', routerVehicle)
app.use(errorhandler);

app.listen(PORT, () => {
    console.log(`El puerto esta siendo escuchado correctamente en http://localhost:${PORT}`)
})