import pool from '../db.js';

class ItemModel {
  // Format PostgreSQL database row to match frontend contract
  static format(row) {
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      filterCategory: row.filter_category,
      location: row.location,
      camera: row.camera,
      image: row.image,
      alt: row.alt,
      featured: row.featured,
      description: row.description,
      specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : row.specs,
      price: Number(row.price),
      edition: row.edition,
      createdAt: row.created_at,
    };
  }

  // Fetch all gallery artworks, optionally filtered by category
  static async findAll(filterCategory = null) {
    let query = 'SELECT * FROM items ORDER BY created_at DESC;';
    let params = [];

    if (filterCategory && filterCategory !== 'All Works') {
      query = 'SELECT * FROM items WHERE filter_category = $1 ORDER BY created_at DESC;';
      params = [filterCategory];
    }

    const result = await pool.query(query, params);
    return result.rows.map(ItemModel.format);
  }

  // Fetch a single artwork by its unique slug ID
  static async findById(id) {
    const query = 'SELECT * FROM items WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return ItemModel.format(result.rows[0]);
  }

  // Insert a new artwork into PostgreSQL
  static async create({
    id,
    title,
    category,
    filterCategory,
    location = 'Studio Series',
    camera = 'Hasselblad • Medium Format',
    image = '/assets/images/architecture-minimal.jpg',
    alt = '',
    featured = 'standard',
    description = '',
    specs = [],
    price = 350.00,
    edition = 'Curated Fine Art Edition',
  }) {
    const query = `
      INSERT INTO items (
        id, title, category, filter_category, location, camera,
        image, alt, featured, description, specs, price, edition
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const result = await pool.query(query, [
      id,
      title.trim(),
      category.trim(),
      filterCategory ? filterCategory.trim() : category.trim(),
      location.trim(),
      camera.trim(),
      image.trim(),
      alt.trim() || title.trim(),
      featured || 'standard',
      description.trim(),
      JSON.stringify(specs || []),
      Number(price) || 350.00,
      edition.trim(),
    ]);
    return ItemModel.format(result.rows[0]);
  }
}

export default ItemModel;
