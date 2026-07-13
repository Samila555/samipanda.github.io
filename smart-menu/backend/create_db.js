const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || '127.0.0.1',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || ''
        });
        const dbName = process.env.MYSQL_DB || 'smart_menu';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database ${dbName} created or already exists.`);
        connection.end();
    } catch (error) {
        console.error('Error creating database:', error.message);
    }
}

createDatabase();
