const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Creating a Database Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1128',
  database: 'crowdfunding_db'
});

// Connecting to the database
connection.connect((err) => {
  if (err) {
    console.error('Failed to connect to database: ' + err.stack);
    return;
  }
  console.log('Successfully connected to the database, Connection ID: ' + connection.threadId);
});

// Get all active fundraisers
router.get('/fundraisers', (req, res) => {
  const query = `
    SELECT f.*, c.NAME as CATEGORY_NAME
    FROM fundraiser f
    JOIN category c ON f.CATEGORY_ID = c.CATEGORY_ID
    WHERE f.ACTIVE = TRUE
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query failed: ' + err.stack);
      res.status(500).send('Server error');
      return;
    }
    console.log('Returned data:', JSON.stringify(results)); // Add Log
    res.json(results);
  });
});

// Get all categories
router.get('/categories', (req, res) => {
  const query = 'SELECT * FROM category';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query failed: ' + err.stack);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Search for active fundraisers by criteria
router.get('/search', (req, res) => {
  const { organizer, city, category } = req.query;
  let query = `
    SELECT f.*, c.NAME as CATEGORY_NAME
    FROM fundraiser f
    JOIN category c ON f.CATEGORY_ID = c.CATEGORY_ID
    WHERE f.ACTIVE = TRUE
  `;
  const conditions = [];
  if (organizer) conditions.push(`f.ORGANIZER LIKE '%${organizer}%'`);
  if (city) conditions.push(`f.CITY LIKE '%${city}%'`);
  if (category) conditions.push(`c.NAME LIKE '%${category}%'`);
  if (conditions.length > 0) query += ' AND ' + conditions.join(' AND ');

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Query failed: ' + err.stack);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Get fundraiser details by ID
router.get('/fundraiser/:id', (req, res) => {
  const { id } = req.params;
  const fundraiserQuery = `
    SELECT f.*, c.NAME as CATEGORY_NAME
    FROM fundraiser f
    JOIN category c ON f.CATEGORY_ID = c.CATEGORY_ID
    WHERE f.FUNDRAISER_ID = ?
  `;
  const donationQuery = `
    SELECT * FROM donation
    WHERE FUNDRAISER_ID = ?
    ORDER BY DATE DESC
  `;

  connection.query(fundraiserQuery, [id], (err, fundraiserResults) => {
    if (err) {
      console.error('Inquiry Failure: ' + err.stack);
      res.status(500).send('server error');
      return;
    }
    if (fundraiserResults.length === 0) {
      res.status(404).send('No fundraisers found');
      return;
    }

    connection.query(donationQuery, [id], (err, donationResults) => {
      if (err) {
        console.error('Inquiry Failure: ' + err.stack);
        res.status(500).send('server error');
        return;
      }

      const fundraiser = fundraiserResults[0];
      fundraiser.donations = donationResults;
      res.json(fundraiser);
    });
  });
});

// Get all donations
router.get('/donations', (req, res) => {
  const query = 'SELECT * FROM donation';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询失败: ' + err.stack);
      res.status(500).send('服务器错误');
      return;
    }
    res.json(results);
  });
});

// Add a new donation
router.post('/donations', (req, res) => {
  const { DATE, AMOUNT, GIVER, FUNDRAISER_ID } = req.body;
  const query = `
    INSERT INTO donation (DATE, AMOUNT, GIVER, FUNDRAISER_ID)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(query, [DATE, AMOUNT, GIVER, FUNDRAISER_ID], (err, results) => {
    if (err) {
      console.error('插入失败: ' + err.stack);
      res.status(500).json({ error: '服务器错误', details: err.message });
      return;
    }
    res.status(201).json({ message: '捐款记录添加成功' });
  });
});

// Add a new fundraiser
router.post('/fundraisers', (req, res) => {
  const { ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID } = req.body;
  const query = `
    INSERT INTO fundraiser (ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  connection.query(query, [ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID], (err, results) => {
    if (err) {
      console.error('Insertion failed: ' + err.stack);
      res.status(500).send('server error');
      return;
    }
    res.status(201).send('Donation record added successfully');
  });
});

// Update an existing fundraiser
router.put('/fundraisers/:id', (req, res) => {
  const { id } = req.params;
  const { ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID } = req.body;
  const query = `
    UPDATE fundraiser
    SET ORGANIZER = ?, CAPTION = ?, TARGET_FUNDING = ?, CURRENT_FUNDING = ?, CITY = ?, ACTIVE = ?, CATEGORY_ID = ?
    WHERE FUNDRAISER_ID = ?
  `;
  connection.query(query, [ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID, id], (err, results) => {
    if (err) {
      console.error('update failure: ' + err.stack);
      res.status(500).send('server error');
      return;
    }
    res.send('Fundraising Event Updates Successful');
  });
});

// Delete an existing fundraiser
router.delete('/fundraisers/:id', (req, res) => {
  const { id } = req.params;
  const checkDonationsQuery = `
    SELECT COUNT(*) as donationCount
    FROM DONATION
    WHERE FUNDRAISER_ID = ?
  `;
  const deleteQuery = `
    DELETE FROM fundraiser
    WHERE FUNDRAISER_ID = ?
  `;

  connection.query(checkDonationsQuery, [id], (err, results) => {
    if (err) {
      console.error('Inquiry Failure: ' + err.stack);
      res.status(500).send('server error');
      return;
    }
    if (results[0].donationCount > 0) {
      res.status(400).send('Fundraising campaigns with existing donation records that cannot be deleted');
      return;
    }

    connection.query(deleteQuery, [id], (err, results) => {
      if (err) {
        console.error('Failed to delete: ' + err.stack);
        res.status(500).send('server error');
        return;
      }
      res.send('Fundraiser Delete Successful');
    });
  });
});

module.exports = router;
