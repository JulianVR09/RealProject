import { Router } from "express";
import { promises as fs } from 'fs';
import { fileURLToPath } from "url";
import path from "path";

const routerDriver = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const driverFilePath = path.join(__dirname, '../../data/driver.json');

const readDriversFs = async () => {
    try{
        const drivers = await fs.readFile(driverFilePath);
        return JSON.parse(drivers);
    } catch (err){
        throw new Error(`Error en la promesa ${err}`);
    };
};

const writeDriversFs = async (drivers) => {
    await fs.writeFile(driverFilePath, JSON.stringify(drivers, null, 2));
}

routerDriver.post('/', async (req, res) => {
    const drivers = await readDriversFs();
    const newDriver = {
        id: drivers.length + 1,
        name: req.body.name
    };
    drivers.push(newDriver);
    await writeDriversFs(drivers);
    res.status(201).send(`Driver created successfully ${newDriver}`);
});

routerDriver.get('/', async (req, res) => {
    const drivers = await readDriversFs();
    res.send(drivers);
});


export default routerDriver