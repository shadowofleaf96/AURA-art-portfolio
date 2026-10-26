import ItemModel from '../models/Item.js';

// Controller: Get all portfolio gallery items (GET /api/items)
export async function getItems(req, res) {
  try {
    const { category } = req.query;
    const items = await ItemModel.findAll(category);

    return res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    console.error('ItemsController.getItems error:', err);
    return res.status(500).json({ error: 'Failed to retrieve portfolio items.' });
  }
}

// Controller: Get single artwork by ID (GET /api/items/:id)
export async function getItemById(req, res) {
  try {
    const { id } = req.params;
    const item = await ItemModel.findById(id);

    if (!item) {
      return res.status(404).json({ error: 'Artwork not found.' });
    }

    return res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    console.error(`ItemsController.getItemById error for ${req.params.id}:`, err);
    return res.status(500).json({ error: 'Failed to retrieve artwork details.' });
  }
}

// Controller: Create a new artwork (POST /api/items)
export async function createItem(req, res) {
  try {
    const {
      title,
      category,
      filterCategory,
      location,
      camera,
      image,
      alt,
      featured,
      description,
      specs,
      price,
      edition,
    } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({
        error: 'Title, category, and price are required to create a new artwork.',
      });
    }

    // Generate slug ID based on title + short timestamp
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `${baseSlug || 'work'}-${Date.now().toString().slice(-4)}`;

    const newItem = await ItemModel.create({
      id,
      title,
      category,
      filterCategory: filterCategory || category,
      location: location || 'Studio Archive',
      camera: camera || 'Leica SL2 • 50mm',
      image: image || '/assets/images/architecture-minimal.jpg',
      alt: alt || `${title} fine art photography print`,
      featured: featured || 'standard',
      description: description || `Original fine art print entitled "${title}".`,
      specs: Array.isArray(specs) ? specs : (specs ? [specs] : ['Medium Format', 'Archival Edition']),
      price: Number(price),
      edition: edition || 'Curated Archival Edition',
    });

    return res.status(201).json({
      success: true,
      message: 'New artwork successfully added to the portfolio.',
      data: newItem,
    });
  } catch (err) {
    console.error('ItemsController.createItem error:', err);
    return res.status(500).json({ error: 'Failed to add artwork to database.' });
  }
}
