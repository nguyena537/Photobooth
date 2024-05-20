/* const Pool = require("pg").Pool;
require("dotenv").config();


const devConfig = {
    user: process.env.PG_USER,
    
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT
}
//const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const proConfig = {
    connectionString: process.env.DATABASE_URL //heroku addons, not in .env a.
}


const pool = new Pool(process.env.NODE_ENV === "production"?devConfig:proConfig);
 module.exports = pool; */

 const Pool = require("pg").Pool;
 require("dotenv").config();
 
 
 const devConfig = {
     user: process.env.PG_USER,
     
     password: process.env.PG_PASSWORD,
     database: process.env.PG_DATABASE,
     host: process.env.PG_HOST,
     port: process.env.PG_PORT
 
}
//const pool = new Pool(devConfig);

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
      rejectUnauthorized: false // Enable this if using SSL with self-signed certificates
    }
});

module.exports = pool;