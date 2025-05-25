// middlewares/roleMiddleware.js
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied: Admins only' });
};

const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }
        next();
    };
};

module.exports = {
    adminOnly,
    allowRoles
};