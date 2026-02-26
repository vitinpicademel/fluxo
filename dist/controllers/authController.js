"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    name: zod_1.z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(1, 'Senha é obrigatória'),
});
const register = async (req, res) => {
    try {
        const validatedData = createUserSchema.parse(req.body);
        const userExists = await prisma.user.findUnique({
            where: { email: validatedData.email }
        });
        if (userExists) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(validatedData.password, 10);
        const user = await prisma.user.create({
            data: {
                ...validatedData,
                password: hashedPassword,
                role: 'USER'
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
        if (!JWT_SECRET || !JWT_EXPIRES_IN) {
            throw new Error('JWT_SECRET and JWT_EXPIRES_IN must be defined');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user,
            token
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: error.errors
            });
        }
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email }
        });
        if (!user) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        const validPassword = await bcryptjs_1.default.compare(validatedData.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
        if (!JWT_SECRET || !JWT_EXPIRES_IN) {
            throw new Error('JWT_SECRET and JWT_EXPIRES_IN must be defined');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const { password, ...userWithoutPassword } = user;
        res.json({
            message: 'Login realizado com sucesso',
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: error.errors
            });
        }
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                projects: {
                    select: {
                        id: true,
                        companyName: true,
                        status: true,
                        createdAt: true
                    }
                }
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map