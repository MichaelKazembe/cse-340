const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

function checkEJSSyntax(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      checkEJSSyntax(fullPath);
    } else if (file.name.endsWith('.ejs')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        ejs.compile(content);
        console.log(`✓ ${fullPath}: No syntax errors`);
      } catch (error) {
        console.log(`✗ ${fullPath}: Syntax error - ${error.message}`);
      }
    }
  }
}

checkEJSSyntax('./views');
