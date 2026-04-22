const fs = require('fs');
const path = require('path');
const properties = [
  {id:'1775828817229', image_url:'/uploads/1775828798974-WhatsApp_Image_2025-03-15_at_17.58.48_1af4b041.jpg'},
  {id:'1775829060568', image_url:'/uploads/1775829036775-feature7.jpg'},
  {id:'1776012973346', image_url:'/uploads/1776012918837-Space2.jpg'}
];
const rootUploads = path.join(process.cwd(), 'uploads');
const backendUploads = path.join(process.cwd(), 'backend', 'backend', 'uploads');
properties.forEach(p => {
  const rel = p.image_url.replace(/^\//, '');
  const root = path.join(rootUploads, path.basename(rel));
  const backend = path.join(backendUploads, path.basename(rel));
  console.log(p.id, p.image_url);
  console.log('  root exists:', fs.existsSync(root), root);
  console.log('  backend exists:', fs.existsSync(backend), backend);
});
