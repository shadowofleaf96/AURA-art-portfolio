import ServiceModel from '../models/Service.js';

// Controller: Get all photography commission services (GET /api/services)
export async function getServices(req, res) {
  try {
    const services = await ServiceModel.findAll();

    return res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (err) {
    console.error('ServicesController.getServices error:', err);
    return res.status(500).json({ error: 'Failed to retrieve photography services.' });
  }
}
