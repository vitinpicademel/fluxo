import { Response } from 'express';
import { AuthRequest } from '../types';
export declare const createProject: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const submitSalesData: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyProjects: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProjectDetails: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllProjects: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProjectFinancials: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllUsers: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=projectController.d.ts.map