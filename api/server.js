const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const port = 3000;

// Parsing request bodies with the body-parser middleware
app.use(bodyParser.json());

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

// Provision of static documents(提供静态文件)
app.use(express.static(path.join(__dirname, '../clientside/public')));

// Start the server
app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});

// Get all active fundraisers(获取所有活跃的筹款活动)
app.get('/fundraisers', (req, res) => {
    const query = `
      SELECT f.*, c.NAME as CATEGORY_NAME
      FROM FUNDRAISER f
      JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
      WHERE f.ACTIVE = TRUE
    `;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Query failed: ' + err.stack);
        res.status(500).send('Server error');
        return;
      }
      res.json(results);
    });
});


// Get all categories(获取所有类别)
app.get('/categories', (req, res) => {
    const query = 'SELECT * FROM CATEGORY';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Query failed: ' + err.stack);
        res.status(500).send('Server error');
        return;
      }
      res.json(results);
    });
  });



  // Search for active fundraisers by criteria(根据条件搜索活跃的筹款活动)
app.get('/search', (req, res) => {
    const { organizer, city, category } = req.query;
    let query = `
      SELECT f.*, c.NAME as CATEGORY_NAME
      FROM FUNDRAISER f
      JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
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
  
  // Get fundraiser details by ID, get fundraiser details and a list of their donations(根据 ID 获取筹款活动的详细信息，获取筹款活动详情及其捐款列表)
  app.get('/fundraiser/:id', (req, res) => {
    const { id } = req.params;
    const fundraiserQuery = `
      SELECT f.*, c.NAME as CATEGORY_NAME
      FROM FUNDRAISER f
      JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
      WHERE f.FUNDRAISER_ID = ?
    `;
    const donationQuery = `
      SELECT * FROM DONATION
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

  // Add a new contribution record(添加新的捐款记录)
app.post('/donations', (req, res) => {
  const { date, amount, giver, fundraiser_id } = req.body;
  const query = `
    INSERT INTO DONATION (DATE, AMOUNT, GIVER, FUNDRAISER_ID)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(query, [date, amount, giver, fundraiser_id], (err, results) => {
    if (err) {
      console.error('Insertion failed: ' + err.stack);
      res.status(500).send('server error');
      return;
    }
    res.status(201).send('Donation record added successfully');
  });
});

// Add a new fundraiser(添加新的筹款活动)
app.post('/fundraisers', (req, res) => {
  const { organizer, caption, target_funding, current_funding, city, active, category_id } = req.body;
  const query = `
    INSERT INTO FUNDRAISER (ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  connection.query(query, [organizer, caption, target_funding, current_funding, city, active, category_id], (err, results) => {
    if (err) {
      console.error('Insertion failed: ' + err.stack);
      res.status(500).send('server error');
      return;
    }
    res.status(201).send('Donation record added successfully');
  });
});
