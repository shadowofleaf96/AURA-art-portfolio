import pool from '../db.js';

class ServiceModel {
  static format(row) {
    if (!row) return null;
    return {
      id: row.id,
      tag: row.tag,
      name: row.name,
      price: row.price,
      rateUnit: row.rate_unit,
      badge: row.badge,
      description: row.description,
      features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features,
      featured: Boolean(row.featured),
    };
  }

  // Fetch all photography commission services
  static async findAll() {
    const query = 'SELECT * FROM services ORDER BY created_at ASC;';
    const result = await pool.query(query);
    return result.rows.map(ServiceModel.format);
  }

  // Fetch single service by id
  static async findById(id) {
    const query = 'SELECT * FROM services WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return ServiceModel.format(result.rows[0]);
  }
}

export default ServiceModel;
