import { promises as fs } from 'fs';

export const readFs = async (pathToTargetDBFile) => {
    try {
        const data = await fs.readFile(pathToTargetDBFile);
        return JSON.parse(data);
    } catch (err) {
        throw new Error(`Error a la promesa ${err}`);
    };
};