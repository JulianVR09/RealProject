import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readFs } from "../helpers/readDBFile.helper.js";
import { writeFs } from "../helpers/WriteDBFile.helper.js";

const routerVehicle = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vehicleFilePath = path.join(__dirname, '../../data/vehicles.json');
// const driverFilePath = path.join(__dirname, '../../data/drivers.json');

routerVehicle.post('/', async (req, res) => {
    const vehicles = await readFs(vehicleFilePath);
    const newVehicle = {
        id: vehicles.length + 1,
        model: req.body.model,
        year: req.body.year,
        driverId: req.body.driverId,
    };
    vehicles.push(newVehicle);
    await writeFs(vehicleFilePath, vehicles);
    res.status(201).send(`Vehicle created successfully ${newVehicle}`);
});

routerVehicle.get('/', async (req, res) => {
    const vehicles = await readFs(vehicleFilePath);
    res.send(vehicles);
});

routerVehicle.get('/:id', async (req, res) => {
    const vehicles = await readFs(vehicleFilePath);
    const foundVehicle = vehicles.find(v => v.id === parseInt(req.params.id));        
    if (!foundVehicle) {
        return res.status(404).send('Vehicle not found');
    }
    res.json(foundVehicle);
});

routerVehicle.put('/:id', async (req, res) => {
    const vehicles = await readFs(vehicleFilePath);
    const indexVehicle = vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if (indexVehicle === -1) return res.status(404).send('Vehicle not found');
    const updatedVehicle = {
        ...vehicles[indexVehicle],
        model: req.body.model,
        year: req.body.year,
        driverId: req.body.driverId,
    };
    vehicles[indexVehicle] = updatedVehicle;
    await writeFs(vehicleFilePath, vehicles);
    res.send(`Vehicle updated successfully ${updatedVehicle}`);
});

routerVehicle.delete('/:id', async (req, res) => {
    const vehicles = await readFs(vehicleFilePath);
    const indexVehicle = vehicles.findIndex(v => v.id === parseInt(req.params.id));
    if (indexVehicle === -1) return res.status(404).send('Vehicle not found');
    const deletedVehicle = vehicles.splice(indexVehicle, 1);
    await writeFs(vehicleFilePath, vehicles);
    res.status(204).send(`Vehicle deleted successfully ${deletedVehicle}`);
});

export default routerVehicle;