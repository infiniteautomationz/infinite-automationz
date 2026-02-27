const fs = require('fs');

const file = 'index.html';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes('<section id="services">'));
if (startIndex === -1) { console.error('Could not find start index'); process.exit(1); }

let endIndex = -1;
for (let i = startIndex + 1; i < lines.length; i++) {
    // The section ends right around line 5274, let's keep an eye out for </section> matching the <section id="services"> opening.
    // The previous section <section style="padding-top: 60px;"> ended. Next is Services. And after services is <section style="background: rgba(255,255,255,.01);"> (Guarantees). 

    // I will just look for the `<!-- Guarantees -->` line.
    if (lines[i].includes('<!-- Guarantees -->')) {
        endIndex = i - 1; // get the line right before
        break;
    }
}

if (endIndex === -1) { console.error('Could not find end index'); process.exit(1); }

console.log('Extracting from', startIndex, 'to', endIndex);

const servicesContent = lines.splice(startIndex, endIndex - startIndex + 1);

// Now find where the Problem Section starts
const problemIndex = lines.findIndex(l => l.includes('<!-- Problem Section -->'));
if (problemIndex === -1) { console.error('Could not find Problem index'); process.exit(1); }

// Insert services section BEFORE problem section
lines.splice(problemIndex, 0, ...servicesContent);

fs.writeFileSync(file, lines.join('\n'));
console.log('Successfully completed movement.');
