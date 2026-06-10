// Простейший JSON "драйвер" БД.
// Структура построена так, чтобы легко мигрировать на SQLite:
// каждый файл = таблица, каждый объект = строка, поля плоские.
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

export async function readTable(table) {
  const file = path.join(DATA_DIR, `${table}.json`);
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

export async function writeTable(table, rows) {
  const file = path.join(DATA_DIR, `${table}.json`);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(rows, null, 2), 'utf-8');
  return rows;
}
