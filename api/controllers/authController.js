const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
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

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

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

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user,
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // MODO TESTE: Aceita qualquer email/senha
    if (process.env.NODE_ENV !== 'production') {
      const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
      const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
      
      const testUser = {
        id: 'test-user-id',
        email: validatedData.email,
        name: 'Usuário Teste',
        role: 'USER',
        createdAt: new Date().toISOString()
      };

      const token = jwt.sign(
        { userId: testUser.id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.json({
        message: 'Login realizado com sucesso (modo teste)',
        user: testUser,
        token
      });
    }

    // MODO PRODUÇÃO: Verificação normal
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const validPassword = await bcrypt.compare(validatedData.password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

    if (!JWT_SECRET || !JWT_EXPIRES_IN) {
      throw new Error('JWT_SECRET and JWT_EXPIRES_IN must be defined');
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password, ...userWithoutPassword } = user;

    res.json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

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
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
