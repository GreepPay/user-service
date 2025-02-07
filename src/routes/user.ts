import { UserController } from '../controllers/UserController';
import router, { type BunRequest } from './router';

const userController = new UserController();
const APP_VERSION = 'v1';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserBio:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: object
 *           properties:
 *             first:
 *               type: string
 *             last:
 *               type: string
 *             full:
 *               type: string
 *         photo:
 *           $ref: '#/components/schemas/MediaOutput'
 *         phone:
 *           $ref: '#/components/schemas/Phone'
 *     
 *     MediaOutput:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *         type:
 *           type: string
 *         size:
 *           type: number
 *     
 *     Phone:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         number:
 *           type: string
 *     
 *     Location:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: ['Point']
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country:
 *           type: string
 *     
 *     UserAccount:
 *       type: object
 *       properties:
 *         rankings:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *               lastUpdatedAt:
 *                 type: number
 *         ratings:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *             count:
 *               type: number
 *             average:
 *               type: number
 *         application:
 *           type: object
 *           nullable: true
 *           properties:
 *             accepted:
 *               type: boolean
 *             message:
 *               type: string
 *         trips:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             properties:
 *               trips:
 *                 type: number
 *               debt:
 *                 type: number
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         savedLocations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Location'
 *         settings:
 *           type: object
 *           properties:
 *             notifications:
 *               type: boolean
 *             driverAvailable:
 *               type: boolean
 *     
 *     UserTypeData:
 *       oneOf:
 *         - type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [driver]
 *             license:
 *               $ref: '#/components/schemas/MediaOutput'
 *         - type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [vendor]
 *             vendorType:
 *               type: string
 *               enum: [foods, items]
 *             name:
 *               type: string
 *             banner:
 *               $ref: '#/components/schemas/MediaOutput'
 *             email:
 *               type: string
 *             contactNumber:
 *               $ref: '#/components/schemas/Phone'
 *             description:
 *               type: string
 *             website:
 *               type: string
 *             location:
 *               $ref: '#/components/schemas/Location'
 *             passport:
 *               $ref: '#/components/schemas/MediaOutput'
 *             residentPermit:
 *               $ref: '#/components/schemas/MediaOutput'
 *         - type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [customer]
 *             passport:
 *               $ref: '#/components/schemas/MediaOutput'
 *             studentId:
 *               $ref: '#/components/schemas/MediaOutput'
 *             residentPermit:
 *               $ref: '#/components/schemas/MediaOutput'
 *     
 *     UserVendorData:
 *       type: object
 *       properties:
 *         schedule:
 *           type: object
 *           nullable: true
 *           properties:
 *             timezone:
 *               type: string
 *             schedule:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   from:
 *                     $ref: '#/components/schemas/Time'
 *                   to:
 *                     $ref: '#/components/schemas/Time'
 *         tags:
 *           type: object
 *           additionalProperties:
 *             type: number
 *         averagePrepTimeInMins:
 *           type: object
 *           nullable: true
 *           properties:
 *             from:
 *               type: number
 *             to:
 *               type: number
 *     
 *     Time:
 *       type: object
 *       properties:
 *         hour:
 *           type: number
 *         minute:
 *           type: number
 *     
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         bio:
 *           $ref: '#/components/schemas/UserBio'
 *         dates:
 *           type: object
 *           properties:
 *             createdAt:
 *               type: number
 *             deletedAt:
 *               type: number
 *               nullable: true
 *         status:
 *           type: object
 *           properties:
 *             connections:
 *               type: array
 *               items:
 *                 type: string
 *             lastUpdatedAt:
 *               type: number
 *         account:
 *           $ref: '#/components/schemas/UserAccount'
 *         typeData:
 *           $ref: '#/components/schemas/UserTypeData'
 *         vendorData:
 *           $ref: '#/components/schemas/UserVendorData'
 *     
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         statusCode:
 *           type: integer
 */

/**
 * @swagger
 * /v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Returns paginated list of users with optional filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: userType
 *         schema:
 *           type: string
 *           enum: [driver, vendor, customer]
 *         description: Filter by user type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or username
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successfully retrieved users list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid query parameters
 */
router.add('GET', `/${APP_VERSION}/users`, async (request: BunRequest) => {
  const result = await userController.getUsers(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user profile
 *     description: Returns the current user's profile
 *     security:
 *       - AuthUserId: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 */
router.add('GET', `/${APP_VERSION}/users/profile`, async (request: BunRequest) => {
  const result = await userController.getUserProfile(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/users/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     description: Update the current user's profile
 *     security:
 *       - AuthUserId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: object
 *                     properties:
 *                       first:
 *                         type: string
 *                       last:
 *                         type: string
 *                   phone:
 *                     $ref: '#/components/schemas/Phone'
 *               account:
 *                 type: object
 *                 properties:
 *                   settings:
 *                     type: object
 *                     properties:
 *                       notifications:
 *                         type: boolean
 *                       driverAvailable:
 *                         type: boolean
 *                   savedLocations:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.add('PUT', `/${APP_VERSION}/users/profile`, async (request: BunRequest) => {
  const result = await userController.updateUserProfile(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/users/type:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user type
 *     description: Update the current user's type and related data
 *     security:
 *       - AuthUserId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserTypeData'
 *     responses:
 *       200:
 *         description: User type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.add('PUT', `/${APP_VERSION}/users/type`, async (request: BunRequest) => {
  const result = await userController.updateUserType(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/users/vendor:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update vendor data
 *     description: Update the current vendor user's specific data
 *     security:
 *       - AuthUserId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserVendorData'
 *     responses:
 *       200:
 *         description: Vendor data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid input data or user is not a vendor
 *       401:
 *         description: Unauthorized
 */
router.add('PUT', `/${APP_VERSION}/users/vendor`, async (request: BunRequest) => {
  const result = await userController.updateVendorData(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/users/media:
 *   post:
 *     tags:
 *       - Users
 *     summary: Upload media
 *     description: Upload user-related media (profile photo, documents, etc.)
 *     security:
 *       - AuthUserId: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - type
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 enum: [PROFILE_PHOTO, LICENSE, PASSPORT, STUDENT_ID, RESIDENT_PERMIT, VENDOR_BANNER]
 *                 description: Type of media being uploaded
 *     responses:
 *       200:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid file or media type
 *       401:
 *         description: Unauthorized
 */
router.add('POST', `/${APP_VERSION}/users/media`, async (request: BunRequest) => {
  const result = await userController.uploadMedia(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});