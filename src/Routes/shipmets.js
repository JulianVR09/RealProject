import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readFs } from "../helpers/readDBFile.helper.js";
import { writeFs } from "../helpers/WriteDBFile.helper.js";

const routerShipment = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const shipmentFilePath = path.join(__dirname, '../../data/shipments.json');

routerShipment.post('/', async (req, res) => {
    const shipments = await readFs(shipmentFilePath);
    const newShipment = {
        id: shipments.length + 1,
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: req.body.warehouseId
    };
    shipments.push(newShipment);
    await writeFs(shipmentFilePath, shipments);
    res.status(201).send(`Shipment created successfully ${newShipment}`);
});

routerShipment.get('/', async (req, res) => {
    const shipments = await readFs(shipmentFilePath);
    res.send(shipments);
});

routerShipment.get('/:id', async (req, res) => {
    const shipments = await readFs(shipmentFilePath);
    const foundShipment = shipments.find(s => s.id === parseInt(req.params.id));
    if (!foundShipment) {
        return res.status(404).send('Shipment not found');
    }
    res.json(foundShipment);
});

routerShipment.put('/:id', async (req, res) => {
    const shipments = await readFs(shipmentFilePath);
    const indexShipment = shipments.findIndex(s => s.id === parseInt(req.params.id));
    if (indexShipment === -1) return res.status(404).send('Shipment not found');
    const updatedShipment = {
        ...shipments[indexShipment],
        item: req.body.item,
        quantity: req.body.quantity,
        warehouseId: req.body.warehouseId
    };
    shipments[indexShipment] = updatedShipment;
    await writeFs(shipmentFilePath, shipments);
    res.send(`Shipment updated successfully ${updatedShipment}`);
});

routerShipment.delete('/:id', async (req, res) => {
    const shipments = await readFs(shipmentFilePath);
    const indexShipment = shipments.findIndex(s => s.id === parseInt(req.params.id));
    if (indexShipment === -1) return res.status(404).send('Shipment not found');
    const deletedShipment = shipments.splice(indexShipment, 1);
    await writeFs(shipmentFilePath, shipments);
    res.status(204).send(`Shipment deleted successfully ${deletedShipment}`);
});

export default routerShipment;