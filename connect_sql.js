

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
 


 
module.exports = { 
    condb1: sqlConfig, 
  
  };