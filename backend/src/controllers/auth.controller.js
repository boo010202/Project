const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth'
    });
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    // Read from cookie (Express doesn't parse cookies by default unless cookie-parser middleware is installed)
    // Wait, if we don't use cookie-parser, we can extract from header or cookies string manually, or install cookie-parser.
    // Let's parse req.headers.cookie manually to avoid introducing too many dependencies or we can write a helper.
    // It's easy to write a helper to parse cookies or just extract from cookie header. Let's do a helper!
    const cookieHeader = req.headers.cookie || '';
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts.length === 2) {
        cookies[parts[0].trim()] = parts[1].trim();
      }
    });

    const refreshToken = cookies['refreshToken'];

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found.' });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET || 'your_super_secret_jwt_key', async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token.' });
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const accessToken = generateAccessToken(user);
      res.json({
        success: true,
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'full_name', 'role']
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  refresh,
  me
};
