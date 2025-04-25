import jsonwebtoken from 'jsonwebtoken' 

function verifyToken(req, res, next) {
const authHeader = req.header('Authorization');
const token = authHeader.split(' ')[1]
if (!token) return res.status(401).json({ error: 'Access denied' });
console.log(token);
try {
 const decoded = jsonwebtoken.verify(token, 'pranav');
 req.userId = decoded.userId;
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };

export const VerifyToken = verifyToken;