import { UserController } from '../controllers/UserController';
import router, { type BunRequest } from './router';

const userController = new UserController();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
// const getAllUsers = userController.getAllUsers.bind(userController);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
// const createUser = userController.createUser.bind(userController);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john.doe@example.com
 */
// export const userRoutes = {
//     GET: getAllUsers,
//     POST: createUser,
// }


const APP_VERSION = 'v1';

/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user profile
 *     description: Returns the user profile with associated business/rider profiles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       404:
 *         description: User not found
 */
router.add('GET', `/${APP_VERSION}/users/:id`, async (request: BunRequest) => {
  const result = await new UserController().getUserProfile(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create user profile
 *     description: Create a new user profile with optional business details
 *     responses:
 *       201:
 *         description: User profile created successfully
 *       400:
 *         description: Invalid input data
 */
router.add('POST', `/${APP_VERSION}/users`, async (request: BunRequest) => {
  const result = await new UserController().createUserProfile(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     description: Update an existing user profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       404:
 *         description: User not found
 */
router.add('PUT', `/${APP_VERSION}/users/:id`, async (request: BunRequest) => {
  const result = await new UserController().updateUserProfile(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/users/{id}/verification:
 *   post:
 *     tags:
 *       - Users
 *     summary: Request verification
 *     description: Request verification for business or rider profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verification requested successfully
 *       400:
 *         description: Invalid request
 */
router.add('POST', `/${APP_VERSION}/users/:id/verification`, async (request: BunRequest) => {
  const result = await new UserController().requestVerification(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});

/**
 * @swagger
 * /v1/users/{id}/documents:
 *   post:
 *     tags:
 *       - Users
 *     summary: Upload document
 *     description: Upload a document for user verification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *       400:
 *         description: Invalid file or request
 */
router.add('POST', `/${APP_VERSION}/users/:id/documents`, async (request: BunRequest) => {
  const result = await new UserController().uploadDocument(request);
  return new Response(JSON.stringify(result.body), {
    headers: { 'Content-Type': 'application/json' },
    status: result.statusCode
  });
});