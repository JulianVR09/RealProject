import { promises as fs } from 'fs';

export const writeFs = async (pathTotargetDBFile, variables) => {
    try {
        await fs.writeFile(pathTotargetDBFile, JSON.stringify(variables, null, 2));
    } catch (err) {
        throw new Error(`Error al escribir el archivo: ${err}`);
    }
};