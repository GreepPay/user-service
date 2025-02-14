import { VerificationController } from '../controllers/VerificationController';
import router, { type BunRequest } from './router';

const verificationController = new VerificationController();
const APP_VERSION = 'v1';

/**
 * @swagger
 * components:
 *   schemas:
 *     Verification:
 *       type: object
 *       required:
 *         - auth_user_id
 *         - user_type
 *         - document_type
 *         - document_url
 *       properties:
 *         id:
 *           type: string
 *         auth_user_id:
 *           type: string
 *         user_type:
 *           type: string
 *           enum: [Business, Rider, Customer]
 *         document_type:
 *           type: string
 *           enum: [International Passport, Resident Permit, Driver's License, Student ID]
 *         document_url:
 *           type: string
 *         status:
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *         verification_data:
 *           type: object
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /v1/verification:
 *   post:
 *     tags:
 *       - Verification
 *     summary: Submit a verification request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auth_user_id
 *               - user_type
 *               - document_type
 *               - document_url
 *             properties:
 *               auth_user_id:
 *                 type: string
 *               user_type:
 *                 type: string
 *                 enum: [Business, Rider, Customer]
 *               document_type:
 *                 type: string
 *                 enum: [International Passport, Resident Permit, Driver's License, Student ID]
 *               document_url:
 *                 type: string
 *               verification_data:
 *                 type: object
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Verification request submitted successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Verification request already exists
 */
router.add('POST', `/${APP_VERSION}/verification`, async (request: BunRequest) => {
  const result = await verificationController.create(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/verification/approve:
 *   post:
 *     tags:
 *       - Verification
 *     summary: Approve or reject a verification request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verificationId
 *               - status
 *               - auth_user_id
 *             properties:
 *               verificationId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected]
 *               auth_user_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification status updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Verification request not found
 */
router.add('POST', `/${APP_VERSION}/verification/approve`, async (request: BunRequest) => {
  const result = await verificationController.approveVerification(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

export default router;
