import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Week 2 Hardcoded Gallery Items to move into PostgreSQL
const SEED_ITEMS = [
  {
    id: "monolith-in-ochre",
    title: "Monolith in Ochre",
    category: "Architecture",
    filterCategory: "Architecture",
    location: "Valencia, Spain",
    camera: "Hasselblad H6D • 50mm",
    image: "/assets/images/architecture-minimal.jpg",
    alt: "Minimalist brutalist architecture illuminated by afternoon sun with deep geometric shadows",
    featured: "wide",
    description:
      "An exploration of monolithic minimalism under the raw Mediterranean sun. The warm ochre pigment interacts with razor-sharp diagonal shadows, turning architectural space into pure sculptural abstraction.",
    specs: ["Medium Format Hasselblad", "f/8.0", "1/500s", "ISO 64"],
    price: 420.00,
    edition: "Limited Edition of 10",
  },
  {
    id: "luminescence-iv",
    title: "Luminescence IV",
    category: "Editorial",
    filterCategory: "Editorial & Fashion",
    location: "Vogue Italia Feature",
    camera: "Leica SL2 • 85mm f/1.4",
    image: "/assets/images/editorial-portrait.jpg",
    alt: "Editorial high-fashion portrait with soft dramatic side illumination and sculptural styling",
    featured: "tall",
    description:
      "Commissioned editorial series exploring human countenance through gentle chiaroscuro. Shot on location in Milan with natural ambient directional light and custom diffusion panels.",
    specs: ["Leica SL2", "85mm f/1.4", "1/250s", "ISO 100"],
    price: 380.00,
    edition: "Curated Archival Edition",
  },
  {
    id: "golden-solitude",
    title: "Golden Solitude",
    category: "Atmosphere",
    filterCategory: "Atmosphere & Nature",
    location: "Dolomites, Italy",
    camera: "Fujifilm GFX 100S • 45mm",
    image: "/assets/images/golden-landscape.jpg",
    alt: "Golden hour mountain horizon with soft glowing mist and serene atmospheric depth",
    featured: "standard",
    description:
      "Early autumn sunrise at 2,400 meters altitude. Layers of alpine mist catch the first rays of horizontal amber light, creating profound atmospheric depth.",
    specs: ["Fujifilm GFX 100S", "45mm f/2.8", "1/125s", "ISO 100"],
    price: 350.00,
    edition: "Signed Fine Art Print",
  },
  {
    id: "organic-flora-iii",
    title: "Organic Flora III",
    category: "Fine Art",
    filterCategory: "Atmosphere & Nature",
    location: "Studio Series",
    camera: "Canon R5C • 100mm Macro f/2.8L",
    image: "/assets/images/botanical-fineart.jpg",
    alt: "Fine art macro study of botanical flora with delicate translucent petal textures",
    featured: "standard",
    description:
      "Macro focus stacking capturing translucent cellular structures and the fleeting architecture of desert flora. Printed on handmade Japanese Awagami paper.",
    specs: ["Canon R5C", "100mm Macro f/2.8L", "Focus Stack (24 exp.)"],
    price: 290.00,
    edition: "Awagami Washi Print",
  },
  {
    id: "nocturne-profile",
    title: "Nocturne Profile",
    category: "Studio Mono",
    filterCategory: "Studio Mono",
    location: "Paris Studio",
    camera: "Leica M11 Monochrom • 50mm",
    image: "/assets/images/studio-portrait.jpg",
    alt: "High-contrast monochromatic studio fine art portrait exploring negative space",
    featured: "tall",
    description:
      "An intense study in low-key tonal graduation, using a single strip softbox with grid to isolate form against pure obsidian darkness.",
    specs: ["Leica M11 Monochrom", "50mm f/1.4", "1/160s", "ISO 125"],
    price: 450.00,
    edition: "Silver Halide Print",
  },
  {
    id: "aegean-textures",
    title: "Aegean Textures",
    category: "Aerial Fine Art",
    filterCategory: "Atmosphere & Nature",
    location: "Milos Coastline",
    camera: "Phase One IQ4 150MP • 80mm",
    image: "/assets/images/ocean-aerial.jpg",
    alt: "Dramatic aerial abstract perspective of ocean waves breaking over dark coastal reefs",
    featured: "wide",
    description:
      "Perpendicular aerial frame isolating the collision of deep oceanic indigo against sea foam and volcanic basalt shelf. Certified limited edition of 5.",
    specs: ["Phase One IQ4 150MP", "Schneider 80mm", "1/1000s", "ISO 50"],
    price: 520.00,
    edition: "Certified Edition of 5",
  },
  {
    id: "sanctuary-rays",
    title: "Sanctuary Rays",
    category: "Architecture",
    filterCategory: "Architecture",
    location: "Copenhagen, Denmark",
    camera: "Hasselblad X2D 100C • 38mm",
    image: "/assets/images/interior-light.jpg",
    alt: "Architectural interior illuminated by striking morning sunbeams filtering through skylights",
    featured: "standard",
    description:
      "Documenting Nordic architectural restraint where volumetric shafts of light transform an austere concrete sanctuary into an ethereal meditation chamber.",
    specs: ["Hasselblad X2D 100C", "XCD 38mm f/2.5", "1/60s", "ISO 200"],
    price: 390.00,
    edition: "Museum Rag Print",
  },
];

// Week 2 Hardcoded Services to move into PostgreSQL
const SEED_SERVICES = [
  {
    id: "architectural",
    tag: "Commercial & Design",
    name: "Architectural & Interior",
    price: "From €2,800",
    rate_unit: "/ Day Shoot",
    badge: null,
    description:
      "Comprehensive architectural studies focusing on natural lighting transitions, structural rhythm, and material textures. Delivered in full-resolution medium format.",
    features: [
      "Comprehensive site survey & sun angle study",
      "Dawn, midday, and twilight golden-hour captures",
      "High-res retouched architectural plates (TIFF + Web)",
      "Full commercial licensing for press and monographs",
    ],
    featured: false,
  },
  {
    id: "editorial",
    tag: "Publications & Brands",
    name: "Editorial & Fashion",
    price: "From €3,400",
    rate_unit: "/ Production",
    badge: "Most Requested",
    description:
      "Art-directed storytelling for fashion houses, independent designers, and editorial magazines. Concept development through final museum-grade color grading.",
    features: [
      "Mood board creation & lighting concept",
      "Full-day production (Studio or On-Location)",
      "Complete wardrobe styling and digital tech crew",
      "Fast 72-hour curated contact sheet delivery",
    ],
    featured: true,
  },
  {
    id: "portraiture",
    tag: "Private Clients & Artists",
    name: "Fine Art Portraiture",
    price: "From €1,600",
    rate_unit: "/ Session",
    badge: null,
    description:
      "Intimate, sculptural portrait sessions designed to reflect individual essence without pretension. Shot with vintage primes or medium format monochromes.",
    features: [
      "3-hour relaxed studio or private residence session",
      "Black & white or warm ambient color palette",
      "15 Master-grade retouched exhibition prints",
      "Hand-signed archival museum print included",
    ],
    featured: false,
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seed script...');

  try {
    // 1. Create Tables using schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('✅ Schema tables verified/created (users, items, services, orders).');

    // 2. Seed Items
    console.log(`🖼️  Seeding ${SEED_ITEMS.length} gallery artworks...`);
    for (const item of SEED_ITEMS) {
      await pool.query(
        `INSERT INTO items (
          id, title, category, filter_category, location, camera,
          image, alt, featured, description, specs, price, edition
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          filter_category = EXCLUDED.filter_category,
          location = EXCLUDED.location,
          camera = EXCLUDED.camera,
          image = EXCLUDED.image,
          alt = EXCLUDED.alt,
          featured = EXCLUDED.featured,
          description = EXCLUDED.description,
          specs = EXCLUDED.specs,
          price = EXCLUDED.price,
          edition = EXCLUDED.edition;`,
        [
          item.id,
          item.title,
          item.category,
          item.filterCategory,
          item.location,
          item.camera,
          item.image,
          item.alt,
          item.featured,
          item.description,
          JSON.stringify(item.specs),
          item.price,
          item.edition,
        ]
      );
    }
    console.log('✅ Artworks successfully seeded.');

    // 3. Seed Services
    console.log(`💼 Seeding ${SEED_SERVICES.length} photography service packages...`);
    for (const service of SEED_SERVICES) {
      await pool.query(
        `INSERT INTO services (
          id, tag, name, price, rate_unit, badge, description, features, featured
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          tag = EXCLUDED.tag,
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          rate_unit = EXCLUDED.rate_unit,
          badge = EXCLUDED.badge,
          description = EXCLUDED.description,
          features = EXCLUDED.features,
          featured = EXCLUDED.featured;`,
        [
          service.id,
          service.tag,
          service.name,
          service.price,
          service.rate_unit,
          service.badge,
          service.description,
          JSON.stringify(service.features),
          service.featured,
        ]
      );
    }
    console.log('✅ Services successfully seeded.');

    // 4. Seed Demo User for easy assessment evaluation
    const demoEmail = 'demo@auragallery.com';
    const demoPassword = 'password123';
    const passwordHash = await bcrypt.hash(demoPassword, 10);

    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1;', [demoEmail]);
    if (userCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4);`,
        ['Demo Collector', demoEmail, passwordHash, 'client']
      );
      console.log(`👤 Seeded demo user: ${demoEmail} (Password: ${demoPassword})`);
    } else {
      console.log(`👤 Demo user already exists: ${demoEmail}`);
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
