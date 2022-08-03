const path = require('path');
const express = require('express')
const fs = require('fs')
const fsPromises = fs.promises;

const app = express()
const archiver = require('archiver')

app.get('/', async function(req, res) {
  
  res.setHeader('Content-disposition', 'attachment; filename=mon-archive.zip');
    
  const archive = archiver('zip');

  archive.on('error', function(err) {
    res.status(500).send({error: err.message});
  });

  //on stream closed we can end the request
  archive.on('end', function() {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  //set the archive name
  res.attachment('mon-archive.zip');

  //this is the streaming magic
  archive.pipe(res);

  const files = await fsPromises.readdir('./files')
  console.log(files)

  console.log(__dirname)
  for (const file of files) {
    archive.file(`${__dirname}/files/${file}`, { name: file })
  }

  // const files = [__dirname + '/files/上午.png', __dirname + '/files/中午.json'];

  // for(const i in files) {
  //   archive.file(files[i], { name: path.basename(files[i]) });
  // }

  archive.finalize();

});

app.listen(4000)