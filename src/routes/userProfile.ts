import { UserProfileController } from '../controllers/UserProfileController';
import router, { type BunRequest } from './router';

const userProfileController = new UserProfileController();
const APP_VERSION = 'v1';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       required:
 *         - auth_user_id
 *         - user_type
 *       properties:
 *         id:
 *           type: string
 *         auth_user_id:
 *           type: string
 *         user_type:
 *           type: string
 *           enum: [Business, Rider, Customer]
 *         profile_picture:
 *           type: string
 *         verification_status:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Business:
 *       type: object
 *       properties:
 *         registration_number:
 *           type: string
 *         logo:
 *           type: string
 *         location:
 *           type: string
 *         banner:
 *           type: string
 *         description:
 *           type: string
 *         website:
 *           type: string
 *         resident_permit:
 *           type: string
 *         passport:
 *           type: string
 *     Rider:
 *       type: object
 *       properties:
 *         license:
 *           type: string
 *         vehicle_type:
 *           type: string
 *         vehicle_registration_number:
 *           type: string
 *         vehicle_insurance:
 *           type: string
 *         experience_years:
 *           type: string
 *         availability_status:
 *           type: boolean
 *         notification_preferences:
 *           type: boolean
 *         location:
 *           type: string
 *     Customer:
 *       type: object
 *       properties:
 *         resident_permit:
 *           type: string
 *         passport:
 *           type: string
 *         student_id:
 *           type: string
 *         notification_preferences:
 *           type: boolean
 *         location:
 *           type: string
 */

/**
 * @swagger
 * /v1/profiles:
 *   post:
 *     tags:
 *       - Profiles
 *     summary: Create user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_type
 *               - profile_picture
 *               - profileData
 *             properties:
 *               user_type:
 *                 type: string
 *                 enum: [Business, Rider, Customer]
 *               profile_picture:
 *                 type: string
 *               profileData:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/Business'
 *                   - $ref: '#/components/schemas/Rider'
 *                   - $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Invalid input
 */
router.add('POST', `/${APP_VERSION}/profiles`, async (request: BunRequest) => {
  const result = await userProfileController.create(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/profiles:
 *   put:
 *     tags:
 *       - Profiles
 *     summary: Update user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_type
 *             properties:
 *               user_type:
 *                 type: string
 *                 enum: [Business, Rider, Customer]
 *               profile_picture:
 *                 type: string
 *               profileData:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/Business'
 *                   - $ref: '#/components/schemas/Rider'
 *                   - $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Profile not found
 */
router.add('PUT', `/${APP_VERSION}/profiles`, async (request: BunRequest) => {
  const result = await userProfileController.update(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/profiles:
 *   delete:
 *     tags:
 *       - Profiles
 *     summary: Delete user's profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auth_user_id
 *             properties:
 *               auth_user_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       400:
 *         description: auth_user_id is required
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Internal server error
 */
router.add('DELETE', `/${APP_VERSION}/profiles`, async (request: BunRequest) => {
  const result = await userProfileController.delete(request);
  return new Response(JSON.stringify(result.body), {
    headers: { "Content-Type": "application/json" },
    status: result.statusCode,
  });
});

export default router;
