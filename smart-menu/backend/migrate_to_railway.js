const { Sequelize } = require('sequelize');

const LOCAL = new Sequelize('smart_menu', 'root', '', {
    host: '127.0.0.1', dialect: 'mysql', logging: false,
});

const CLOUD = new Sequelize('railway', 'root', 'GKoxZVoROCucSXbKIAqeCNkeeJCXvtmR', {
    host: 'tokaido.proxy.rlwy.net', port: 42180, dialect: 'mysql', logging: false,
    dialectOptions: { connectTimeout: 30000 },
});

async function migrate() {
    try {
        console.log('Connecting to local MySQL...');
        await LOCAL.authenticate();
        console.log('✓ Local connected');

        console.log('Connecting to Railway MySQL...');
        await CLOUD.authenticate();
        console.log('✓ Railway connected');

        const tables = ['Users', 'Categories', 'Meals', 'Feedbacks', 'Payments', 'QRCodes'];

        // Get local schema and create tables on cloud
        console.log('\nCreating schema on Railway...');
        for (const table of tables) {
            try {
                const [schema] = await LOCAL.query(`SHOW CREATE TABLE \`${table}\``);
                if (schema.length > 0) {
                    let createSQL = schema[0]['Create Table'];
                    // Remove AUTO_INCREMENT value if present
                    createSQL = createSQL.replace(/AUTO_INCREMENT=\d+/g, '');
                    // Drop and recreate on cloud
                    await CLOUD.query(`DROP TABLE IF EXISTS \`${table}\``);
                    await CLOUD.query(createSQL);
                    console.log(`✓ Table '${table}' created`);
                }
            } catch (e) {
                console.log(`  - Table '${table}' not found locally, skipping`);
            }
        }

        // Migrate data
        console.log('\nMigrating data...');
        for (const table of tables) {
            try {
                const [rows] = await LOCAL.query(`SELECT * FROM \`${table}\``);
                if (rows.length === 0) {
                    console.log(`  - '${table}': empty, skipped`);
                    continue;
                }
                // Insert rows in batches
                const cols = Object.keys(rows[0]).map(c => `\`${c}\``).join(', ');
                for (const row of rows) {
                    const vals = Object.values(row).map(v =>
                        v === null ? 'NULL' : CLOUD.escape(v)
                    ).join(', ');
                    await CLOUD.query(`INSERT IGNORE INTO \`${table}\` (${cols}) VALUES (${vals})`);
                }
                console.log(`✓ '${table}': ${rows.length} rows migrated`);
            } catch (e) {
                console.log(`  - '${table}': ${e.message}`);
            }
        }

        console.log('\n✅ Migration complete! Your Railway database is ready.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
