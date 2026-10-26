import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

// Helper to generate signed JWT token for session
function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'aura_fallback_secret_key';
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );
}

// Controller: Register new user (POST /api/auth/signup)
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if email already registered
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password with bcrypt salt rounds = 10
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user via User model
    const newUser = await UserModel.create({
      name,
      email,
      passwordHash,
      role: 'client',
    });

    // Generate session JWT token
    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.created_at,
      },
      token,
    });
  } catch (err) {
    console.error('AuthController.signup error:', err);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
}

// Controller: Sign in existing user (POST /api/auth/login)
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error('AuthController.login error:', err);
    return res.status(500).json({ error: 'Failed to sign in. Please try again.' });
  }
}

// Controller: Get current session user (GET /api/auth/me)
export async function getMe(req, res) {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User session not found.' });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('AuthController.getMe error:', err);
    return res.status(500).json({ error: 'Failed to retrieve session.' });
  }
}
