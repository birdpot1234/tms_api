

var sqlConfig= function() {
    var config = {
      user: 'WebProduction',
      password: 'dplusProduction',
      server: '192.168.3.21',
      database: 'Data_TransportApp',
      requestTimeout: 300000,
      pool: {
          idleTimeoutMillis: 300000,
          max: 100
      },
   
  };
return config;
};
 
const dbConnectDplusSystem = {
    user: 'webproduction',
    password: 'dplusProduction',
    server: '192.168.3.21', // You can use 'localhost\\instance' to connect to named instance
    database: 'Data_DplusSystem',
    requestTimeout: 300000,
      pool: {
          idleTimeoutMillis: 300000,
          max: 100
      },
      options: {
        encrypt: true, // Use this if you're on Windows Azure
    }
}

 
module.exports = { 
    condb1: sqlConfig, 
    dbConnectDplusSystem:dbConnectDplusSystem,
  };