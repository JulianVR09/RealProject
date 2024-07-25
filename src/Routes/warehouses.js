import { Router } from "express";
import path from "path";
import { readFs } from "../helpers/readDBFile.helper.js";
import { writeFs } from "../helpers/WriteDBFile.helper.js";
import { fileURLToPath } from "url";

const routerWarehouse = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const warehouseFilePath = path.join(__dirname, "../../data/warehouses.json");
const vehicleFilePath = path.join(__dirname, "../../data/vehicles.json");

routerWarehouse.post("/", async (req, res) => {
  const warehouse = await readFs(warehouseFilePath);
  const vehicle = await readFs(vehicleFilePath);
  if (req.body.vehicleId) {
      if (!vehicle.find((v) => v.id === req.body.vehicleId))
        return res.status(404).send("Vehicle not found");
    const newWarehouse = {
      id: warehouse.length + 1,
      name: req.body.name,
      location: req.body.location,
      vehicleId: req.body.vehicleId
    };
    warehouse.push(newWarehouse);
    await writeFs(warehouseFilePath, warehouse);
    res.status(201).send(`Warehouse created successfully ${newWarehouse}`);
    return;
  }
  const newWarehouse = {
    id: warehouse.length + 1,
    name: req.body.name,
    location: req.body.location,
    vehicleId: null, // Default value
  };
  warehouse.push(newWarehouse);
  await writeFs(warehouseFilePath, warehouse);
  res.status(201).send(`Warehouse created successfully ${newWarehouse}`);
});

routerWarehouse.get("/", async (req, res) => {
  const warehouse = await readFs(warehouseFilePath);
  res.send(warehouse);
});

routerWarehouse.get("/:id", async (req, res) => {
  const warehouse = await readFs(warehouseFilePath);
  const foundWarehouse = warehouse.find(
    (w) => w.id === parseInt(req.params.id)
  );
  if (!foundWarehouse) {
    return res.status(404).send("Warehouse not found");
  }
  res.json(foundWarehouse);
});

routerWarehouse.put("/:id", async (req, res) => {
  const warehouse = await readFs(warehouseFilePath);
  const IndexWarehouse = warehouse.findIndex(
    (w) => w.id === parseInt(req.params.id)
  );
  if (IndexWarehouse === -1) return res.status(404).send(`warehouse not found`);
  const updatedWarehouse = {
    ...warehouse[IndexWarehouse],
    name: req.body.name,
    location: req.body.location,
  };
  warehouse[IndexWarehouse] = updatedWarehouse;
  await writeFs(warehouseFilePath, warehouse);
  res.send(`Warehouse updated successfully ${updatedWarehouse}`);
});

routerWarehouse.delete("/:id", async (req, res) => {
  const warehouse = await readFs(warehouseFilePath);
  const IndexWarehouse = warehouse.findIndex(
    (w) => w.id === parseInt(req.params.id)
  );
  if (IndexWarehouse === -1) return res.status(404).send(`warehouse not found`);
  const deleteWarehouse = warehouse.splice(IndexWarehouse, 1);
  await writeFs(warehouseFilePath, warehouse);
  res.status(204).send(`Warehouse deleted successfully ${deleteWarehouse}`);
});

export default routerWarehouse;
