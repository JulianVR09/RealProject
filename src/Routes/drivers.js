import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { writeFs } from "../helpers/WriteDBFile.helper.js";
import { readFs } from "../helpers/readDBFile.helper.js";

const routerDriver = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const driverFilePath = path.join(__dirname, '../../data/drivers.json');

routerDriver.post('/', async (req, res) => {
    const drivers = await readFs(driverFilePath);
    const newDriver = {
        id: drivers.length + 1,
        name: req.body.name
    };
    drivers.push(newDriver);
    await writeFs(driverFilePath, drivers);
    res.status(201).send(`Driver created successfully ${newDriver}`);
});

routerDriver.get('/', async (req, res) => {
    const drivers = await readFs(driverFilePath);
    res.send(drivers);
});

routerDriver.get('/:id', async (req, res) => {
    const drivers = await readFs(driverFilePath);
    const indexDriver = drivers.findIndex(d => d.id === parseInt(req.params.id));
    if(indexDriver === -1) return res.status(404).send('Driver nor found');
    res.json(indexDriver);
});

routerDriver.put('/:id', async (req, res) => {
    const drivers = await readFs(driverFilePath);
    const indexDriver = drivers.findIndex(d => d.id === parseInt(req.params.id));
    if(indexDriver === -1) return res.status(404).send('Driver not found');
    const updatedDriver = {
        ...drivers[indexDriver],
        name: req.body.name
    };
    drivers[indexDriver] = updatedDriver;
    await writeFs(driverFilePath, drivers);
    res.send(`Driver updated successfully ${updatedDriver}`);
});

routerDriver.delete('/:id', async (req, res) => {
    const drivers = await readFs(driverFilePath);
    const indexDriver = drivers.findIndex(d => d.id === parseInt(req.params.id));
    if(indexDriver === -1) return res.status(404).send('Driver not found');
    const deletedDriver = drivers.splice(indexDriver, 1);
    await writeFs(driverFilePath, drivers);
    res.status(204).send(`Driver deleted successfully ${deletedDriver}`);
});

export default routerDriver