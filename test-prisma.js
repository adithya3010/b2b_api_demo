const { execSync } = require('child_process');
const fs = require('fs');

try {
    execSync('npx prisma db push', { stdio: 'pipe' });
} catch (e) {
    fs.writeFileSync('full_error.txt', e.stderr.toString());
    console.log("Error written to full_error.txt");
}
