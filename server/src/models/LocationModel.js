import db from '../config/database.js';

export function createLocation({ address, latitude, longitude }) {
  const stmt = db.prepare(
    `INSERT INTO locations (address, latitude, longitude) VALUES (@address, @latitude, @longitude)`
  );
  const result = stmt.run({ address, latitude, longitude });
  return findById(result.lastInsertRowid);
}

export function findById(id) {
  return db.prepare(`SELECT * FROM locations WHERE id = ?`).get(id);
}

export function findAllOrderedByNewest() {
  return db
    .prepare(`SELECT * FROM locations ORDER BY datetime(created_at) DESC`)
    .all();
}

export function deleteById(id) {
  const stmt = db.prepare(`DELETE FROM locations WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}
