import jwt from 'jsonwebtoken';

export const generateToken = (id, role = 'patient') => {
  const secret = process.env.JWT_SECRET || 'healthcare_plus_super_secret_jwt_key_2025';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;
