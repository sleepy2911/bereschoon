
const fs = require('fs');
console.log('Node is working');
try {
    fs.writeFileSync('test_node_output.txt', 'Node write success');
    console.log('Write success');
} catch (e) {
    console.error('Write failed:', e);
}
