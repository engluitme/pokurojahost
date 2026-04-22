
fetch('http://localhost:5000/api/properties')
  .then(res => res.json())
  .then(properties => {
    console.log('Properties in system:');
    properties.forEach(p => {
      console.log(`  ID: ${p.id}, Title: ${p.title}, Status: ${p.status}`);
    });
    console.log(`\nTotal: ${properties.length} properties`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
