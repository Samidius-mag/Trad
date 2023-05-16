const { spawn } = require('child_process');

function runScript(scriptPath) {
  const child = spawn('node', [scriptPath]);

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function run() {
  runScript('loadprice.js');
  setTimeout(() => {
    
    runScript('bot.js');
  }, 5000);
}

run();
setInterval(run, 600000); // 10 minutes
