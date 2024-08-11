import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: '103.216.118.120',
  user: 'root',     
  password: 'Blms123.',  
  database: 'o6u_onlineq'  
});

connection.connect((err: any) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

export default connection;
