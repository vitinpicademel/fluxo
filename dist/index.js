"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333;
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por IP
    message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Rotas
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Rota não encontrada
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});
// Inicialização do servidor
async function startServer() {
    try {
        // Testar conexão com o banco
        await prisma.$connect();
        console.log('✅ Conectado ao banco de dados');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🔄 Desligando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map