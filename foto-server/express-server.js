const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const download = require('image-downloader');
const app = express();
const expressWs = require('express-ws')(app);
const port = 80;
const folder = '/images';

const URL_CAMERA = "http://192.168.178.21";

/*
WS protocol
{
  command: "download-start"|"downloaded"|"error",
  data: null|download-path|error
}
 */

function startServer() {
  app.use(cors());
  app.use(bodyParser.text());
  app.use(folder, express.static('data'));

  app.ws('/', function(ws, req) {});

  app.post('/', (request, response) => {
    console.log('POST /');
    photoTaken(request.body).then((success) => {
      if (success) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end();
      } else {
        console.error('Error loading image from camera');
        response.writeHead(400);
        response.end();
      }
    });
  });

  app.get('/thumbnails', (request, response) => {
    const directoryPath = path.join(__dirname, 'data');
    fs.readdir(directoryPath, ((err, files) => {
      if (!err) {
        response.status(200);
        response.send(JSON.stringify(files.reverse()))
      } else {
        console.error('Error reading files:', err);
        response.writeHead(400);
        response.end();
      }
    }));
  });

  app.listen(port, () => console.log(`Listening on port ${port}!`));
}

function sendDataOverWs(command, data) {
  expressWs.getWss().clients.forEach((ws) => {
    const dataToSend = {
      command: command,
      data: data
    };

    ws.send(JSON.stringify(dataToSend));
  })
}

async function photoTaken(path) {
  console.log("photo taken:", path);
  const fileName = path.split("/").pop();

  const downloadUrl = URL_CAMERA + path;
  fileDownloadStart(downloadUrl, filename);

  let options = {
    url: downloadUrl,
    dest: 'data/' + fileName
  };

  try {
    const { filename, image } = await download.image(options);
    fileDownloadEnd(filename);
    return true;
  } catch (err) {
    fileDownloadError(err.message, fileName);
    return false;
  }
}

function fileDownloadStart(downloadUrl, filename) {
  console.log("file download start:", downloadUrl);
  sendDataOverWs("download-start", getAddressFromFilename(filename));
}

function fileDownloadEnd(filename) {
  console.log("file downloaded:", filename);
  sendDataOverWs("downloaded", getAddressFromFilename(filename));
}

function fileDownloadError(error, filename) {
  console.log("file download error:", error);
  sendDataOverWs("error", getAddressFromFilename(filename));
}

function getAddressFromFilename(filename) {
  return `http://localhost${folder}/${filename}`;
}

startServer();
