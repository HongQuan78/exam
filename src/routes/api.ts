import { Router } from 'express';
import connection from '../db/connection';
import crypto from 'crypto';
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         content:
 *           type: string
 *         answer:
 *           type: string
 *     Test:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         courseID:
 *           type: integer
 *         instructorName:
 *           type: string
 */

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: List of all questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 */
router.get('/questions', (req, res) => {
    connection.query('SELECT * FROM question', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the question
 *     responses:
 *       200:
 *         description: A single question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 */
router.get('/questions/:id', (req, res) => {
    connection.query('SELECT * FROM question WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /api/count/test:
 *   get:
 *     summary: Get the total count of tests
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: Total count of tests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTest:
 *                   type: integer
 */
router.get('/count/test', (req, res) => {
    connection.query('SELECT COUNT(*) as totalTest FROM test', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Get all tests
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: List of all tests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 */
router.get('/tests', (req, res) => {
    connection.query('SELECT t.id, t.name, t.courseID, instructor.name AS instructorName FROM `test` t INNER JOIN instructor ON t.instructorID = instructor.id', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     summary: Get a test by ID
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the test
 *     responses:
 *       200:
 *         description: A single test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Test not found
 */
router.get('/tests/:id', (req, res) => {
    connection.query('SELECT * FROM test WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});



router.post('/add-student', (req, res) => {
    try {
        const { id, name, email, password, phone } = req.body;
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        connection.query('INSERT INTO student (id, name, email, password, phone) VALUES (?, ?, ?, ?, ?)', [id, name, email, hashedPassword, phone], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id });
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }

});


router.post('/add-lecture-admin', (req, res) => {
    try {
        const { id, name, email, password, phone, isAdmin } = req.body;
        // Mã hóa mật khẩu bằng MD5
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        connection.query('INSERT INTO instructor (id, name, email, password, phone, isAdmin) VALUES (?, ?, ?, ?, ?, ?)', [id, name, email, hashedPassword, phone, isAdmin], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id });
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }

});
export default router;
