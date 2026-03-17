import jwt from 'jsonwebtoken';

export function protect(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised — no token' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    // Catches both expired and malformed tokens without leaking which
    res.status(401).json({ message: 'Not authorised — invalid token' });
  }
}
