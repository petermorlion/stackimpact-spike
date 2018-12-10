const stackimpact = require('stackimpact');

const agent = stackimpact.start({
  agentKey: '<key>',
  appName: 'LambdaDemoNode',
  appEnvironment: 'prod',
  autoProfiling: false,
  debug: true
});

function simulateCpuWork() {
  for(let i = 0; i < 1000000; i++) {
    Math.random();
  }
}

let mem;
function simulateMemAlloc() {
  let mem = [];
  for(let i = 0; i < 10000; i++) {
    mem.push({v: i});
  }
}

exports.handler = function(event, context, callback) {
  const span = agent.profile();

  simulateCpuWork();
  simulateMemAlloc();

  setTimeout(() => {
    let response = {
      statusCode: 200,
      body: 'Done.'
    };

    span.stop(() => {
      callback(null, response);
    });
  }, Math.random() * 10);
};
