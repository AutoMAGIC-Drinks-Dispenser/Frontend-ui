// backend/src/server.ts
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { arduinoRouter } from './modules/arduino/arduinoRoutes';
import { arduinoService } from './modules/arduino/arduinoService';

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: '16p37.h.filess.io',
  user: 'AUTOmagic_shadownot',
  password: '865d3ef511c9f3d3b13d1d573d5139447b9809a1',
  database: 'AUTOmagic_shadownot',
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection at startup
pool.getConnection()
  .then(connection => {
    console.log('Database connection established successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });

// Add Arduino routes
app.use('/api/arduino', arduinoRouter);

// Arduino data handler
arduinoService.on('data', async (data: string) => {
  try {
    console.log('Processing Arduino data:', data);
    
    // Example: If the Arduino sends data in format "user:id"
    if (data.startsWith('user:')) {
      const userId = data.split(':')[1];
      await pool.execute(
        'UPDATE DB_1 SET alltime = alltime + 1 WHERE id = ?',
        [userId]
      );
      console.log(`Updated alltime counter for user ${userId}`);
    }
  } catch (error) {
    console.error('Error processing Arduino data:', error);
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT id, username FROM DB_1'
    );
    res.json(rows);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Database error' });
  }
});

// Increment alltime counter
app.post('/api/increment-alltime/:id', async (req, res) => {
  try {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
      'UPDATE DB_1 SET alltime = alltime + 1 WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows > 0) {
      const [rows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT alltime FROM DB_1 WHERE id = ?',
        [req.params.id]
      );
      
      res.json({ 
        success: true, 
        message: 'Alltime incremented successfully',
        newValue: rows[0].alltime
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Database error' });
  }
});

// Database test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1');
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      result: rows 
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown database error'
    });
  }
});

// Check if ID exists in database
app.get('/api/check-id/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(
      'SELECT username FROM DB_1 WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length > 0) {
      res.json({ exists: true, username: rows[0].username as string });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Database error' });
  }
});

// Add new user
app.post('/api/add-user', async (req, res) => {
  const { username } = req.body;
  
  try {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
      'INSERT INTO DB_1 (username) VALUES (?)',
      [username]
    );
    
    res.json({ 
      success: true, 
      id: result.insertId,
      message: 'User added successfully'
    });
  } catch (err) {
    const error = err as Error & { code?: string };
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: error.message || 'Database error' });
    }
  }
});

// Remove user
app.delete('/api/remove-user/:id', async (req, res) => {
  try {
    const [result] = await pool.execute<mysql.ResultSetHeader>(
      'DELETE FROM DB_1 WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'User removed successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'Database error' });
  }
});

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server shutdown gracefully
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await arduinoService.disconnect();
  await pool.end();
  server.close(() => {
    console.log('Server shut down complete');
    process.exit(0);
  });
});