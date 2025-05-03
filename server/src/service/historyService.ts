// src/service/historyService.ts
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// compute __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define a City class with name and id properties
export class City {
  constructor(
    public id: string,
    public name: string
  ) {}
}

class HistoryService {
  // now uses the correct dirname
  private readonly filePath = path.join(__dirname, '../data/searchHistory.json');

  private async read(): Promise<City[]> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      const data = JSON.parse(raw) as Array<{ id: string; name: string }>;
      return data.map(item => new City(item.id, item.name));
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  }

  private async write(cities: City[]): Promise<void> {
    const raw = JSON.stringify(cities, null, 2);
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, raw, 'utf-8');
  }

  public async getCities(): Promise<City[]> {
    return this.read();
  }

  public async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(uuidv4(), cityName);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  public async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const filtered = cities.filter(c => c.id !== id);
    await this.write(filtered);
  }
}

export default new HistoryService();
