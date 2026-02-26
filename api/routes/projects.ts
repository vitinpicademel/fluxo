import { Router } from 'express';
import {
  createProject,
  submitSalesData,
  getMyProjects,
  getProjectDetails,
  getAllProjects,
  getProjectFinancials,
  getAllUsers
} from '../controllers/projectController';
import { authenticateToken, requireAdmin, requireUser } from '../middleware/auth';

const router = Router();

// Rotas para USER (incorporadora)
router.post('/', authenticateToken, requireUser, createProject);
router.post('/:projectId/sales-data', authenticateToken, requireUser, submitSalesData);
router.get('/my-projects', authenticateToken, requireUser, getMyProjects);
router.get('/:projectId', authenticateToken, requireUser, getProjectDetails);

// Rotas exclusivas para ADMIN
router.get('/admin/all', authenticateToken, requireAdmin, getAllProjects);
router.get('/admin/users', authenticateToken, requireAdmin, getAllUsers);
router.get('/admin/:projectId/financials', authenticateToken, requireAdmin, getProjectFinancials);

export default router;
