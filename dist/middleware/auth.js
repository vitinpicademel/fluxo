"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token de acesso necessário' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true, role: true }
        });
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Token inválido' });
    }
};
exports.authenticateToken = authenticateToken;
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
            error: 'Acesso negado. Permissão de administrador necessária.'
        });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireUser = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({
            error: 'Acesso negado. Usuário não autenticado.'
        });
    }
    next();
};
exports.requireUser = requireUser;
//# sourceMappingURL=auth.js.map