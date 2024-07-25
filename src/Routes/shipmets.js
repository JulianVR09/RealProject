import { Router } from "express";
import { promises as fs } from 'fs';
import { fileURLToPath } from "url";
import path from "path";

const routerShipment = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const shipmentFilePath = path.join(__dirname, '../../data/shipment.json');

const readFileFs = async () => {
    try {
        const shipments = await fs.readFile(shipmentFilePath);
        return JSON.parse(shipments);
    } catch (err) {
        throw new Error(`Error al leer el archivo: ${err}`);
    }
};

const writeFileFs = async (shipments) => {
    try {
        await fs.writeFile(shipmentFilePath, JSON.stringify(shipments, null, 2));
    } catch (err) {
        throw new Error(`Error al escribir el archivo: ${err}`);
    }
};

routerShipment.post('/', async (req, res) => {
    const shipments = await readFileFs(shipmentFilePath);
    const newShipment = {
        id: shipments.length + 1,
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: req.body.warehouseId
    };
    shipments.push(newShipment);
    await writeFileFs(shipmentFilePath, shipments);
    res.status(201).send(`Shipment created successfully ${newShipment}`);
});

routerShipment.get('/', async (req, res) => {
    const shipments = await readFileFs(shipmentFilePath);
    res.send(shipments);
});

routerShipment.get('/:id', async (req, res) => {
    const shipments = await readFileFs(shipmentFilePath);
    const foundShipment = shipments.find(s => s.id === parseInt(req.params.id));
    if (!foundShipment) {
        return res.status(404).send('Shipment not found');
    }
    res.json(foundShipment);
});

routerShipment.put('/:id', async (req, res) => {
    const shipments = await readFileFs(shipmentFilePath);
    const indexShipment = shipments.findIndex(s => s.id === parseInt(req.params.id));
    if (indexShipment === -1) return res.status(404).send('Shipment not found');
    const updatedShipment = {
        ...shipments[indexShipment],
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: req.body.warehouseId
    };
    shipments[indexShipment] = updatedShipment;
    await writeFileFs(shipmentFilePath, shipments);
    res.send(`Shipment updated successfully ${updatedShipment}`);
});

routerShipment.delete('/:id', async (req, res) => {
    const shipments = await readFileFs(shipmentFilePath);
    const indexShipment = shipments.findIndex(s => s.id === parseInt(req.params.id));
    if (indexShipment === -1) return res.status(404).send('Shipment not found');
    const deletedShipment = shipments.splice(indexShipment, 1);
    await writeFileFs(shipmentFilePath, shipments);
    res.status(204).send(`Shipment deleted successfully ${deletedShipment}`);
});

export default routerShipment;