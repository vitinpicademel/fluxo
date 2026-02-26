"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Rotas para USER (incorporadora)
router.post('/', auth_1.authenticateToken, auth_1.requireUser, projectController_1.createProject);
router.post('/:projectId/sales-data', auth_1.authenticateToken, auth_1.requireUser, projectController_1.submitSalesData);
router.get('/my-projects', auth_1.authenticateToken, auth_1.requireUser, projectController_1.getMyProjects);
router.get('/:projectId', auth_1.authenticateToken, auth_1.requireUser, projectController_1.getProjectDetails);
// Rotas exclusivas para ADMIN
router.get('/admin/all', auth_1.authenticateToken, auth_1.requireAdmin, projectController_1.getAllProjects);
router.get('/admin/users', auth_1.authenticateToken, auth_1.requireAdmin, projectController_1.getAllUsers);
router.get('/admin/:projectId/financials', auth_1.authenticateToken, auth_1.requireAdmin, projectController_1.getProjectFinancials);
exports.default = router;
//# sourceMappingURL=projects.js.map