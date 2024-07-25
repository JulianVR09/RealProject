import { Router } from "express";
import { promises as fs } from 'fs';
import { fileURLToPath } from "url";
import path from "path";

const routerWarehouse = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const warehouseFilePath = path.join(_dirname, '../../data/warehouses.json');

const readWarehouseFs = async () => {
    try {
        const warehouse = await fs.readFile(warehouseFilePath);
        return JSON.parse(warehouse);
    } catch (err) {
        throw new Error(`Error a la promesa ${err}`);
    };
};

const writeWarehouseFs = async (warehouse) => {
    await fs.writeFile(warehouseFilePath, JSON.stringify(warehouse, null, 2));
};

routerWarehouse.post('/', async (req, res) => {
    const warehouse = await readWarehouseFs();
    const newWarehouse = {
        id: warehouse.length + 1,
        name: req.body.name,
        location: req.body.location
    };
    warehouse.push(newWarehouse);
    await writeWarehouseFs(warehouse);
    res.status(201).send(`Warehouse created successfully ${newWarehouse}`);
});

routerWarehouse.get('/', async (req, res) => {
    const warehouse = await readWarehouseFs();
    res.send(warehouse);
});

routerWarehouse.get('/:id', async (req, res) => {
    const warehouse = await readWarehouseFs();
    const foundWarehouse = warehouse.find(w => w.id === parseInt(req.params.id));
    if (!foundWarehouse) {
        return res.status(404).send('Warehouse not found');
    }
    res.json(foundWarehouse);
})

routerWarehouse.put('/:id', async (req, res) => {
    const warehouse = await readWarehouseFs();
    const IndexWarehouse = warehouse.findIndex(w => w.id === parseInt(req.params.id));
    if(IndexWarehouse === -1) return res.status(404).send(`warehouse not found`);
    const updateWarehouse = {
        ...warehouse[IndexWarehouse],
        name: req.body.name,
        location: req.body.location
    };
    warehouse[IndexWarehouse] = updateWarehouse;
    await writeWarehouseFs(warehouse);
    res.send(`Warehouse updated successfully ${updateWarehouse}`);
});

routerWarehouse.delete('/:id', async (req, res) => {
    const warehouse = await readWarehouseFs();
    const IndexWarehouse = warehouse.findIndex(w => w.id === parseInt(req.params.id));
    if(IndexWarehouse === -1) return res.status(404).send(`warehouse not found`);
    const deleteWarehouse = warehouse.splice(IndexWarehouse, 1);
    await writeWarehouseFs(warehouse);
    res.status(204).send(`Warehouse deleted successfully ${deleteWarehouse}`);
})

export default routerWarehouse;