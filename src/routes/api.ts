import { Router } from 'express';
import connection from '../db/connection';
import crypto from 'crypto';
import { RowDataPacket } from 'mysql2';
const router = Router();

router.get('/questions', (req, res) => {
    connection.query('SELECT * FROM question', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


router.get('/questions/:id', (req, res) => {
    connection.query('SELECT * FROM question WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

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

router.post('/reset-password', async (req, res) => {
    try {
        const { email, password, isLecturer } = req.body;
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        const tableName = isLecturer ? 'Instructor' : 'Student';
        const updateQuery = `UPDATE ${tableName} SET password = ? WHERE email = ?`;
        const selectQuery = `SELECT id FROM ${tableName} WHERE email = ?`;

        await connection.promise().query(updateQuery, [hashedPassword, email]);  // Update password
        const [selectResults] = await connection.promise().query<RowDataPacket[]>(selectQuery, [email]);  // Fetch the id

        if (selectResults.length > 0) {
            const user = selectResults[0];  // Already typed as RowDataPacket, no need for manual cast
            res.json({ id: user.id });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/get-tests-result', (req, res) => {
    connection.query(`
SELECT 
    t.id AS TestID,
    t.name AS TestName,
    COUNT(r.id) AS FailedAttempts
FROM 
    test t
JOIN 
    result r ON t.id = r.testID
JOIN 
    test_settings ts ON r.settingID = ts.id
WHERE 
    ((SELECT getResultGrade(r.id) * 100 / getResultMaxGrade(r.id)) < ts.passPercent)
GROUP BY 
    t.id, t.name;
    `, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


export default router;
