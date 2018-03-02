const adapter = require('./test-adapter')
const promisesAplusTests = require('promises-aplus-tests')

promisesAplusTests(adapter, function(err){
  console.log(err);
})
