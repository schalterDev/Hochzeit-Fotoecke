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

  app.ws('/', function(ws, req) {
    // ws.on('message', function(msg) {
    //   console.log("Message:", msg);
    // })
  });

  app.post('/', (request, response) => {
    console.log('POST /');
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end();

    // console.log(request)
    photoTaken(request.body)
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

function photoTaken(path) {
  console.log("photo taken:", path);
  const fileName = path.split("/").pop();

  const downloadUrl = URL_CAMERA + path;
  fileDownloadStart(downloadUrl);

  let options = {
    url: downloadUrl,
    dest: 'data/' + fileName
  };

  download.image(options)
    .then(({ filename, image }) => {
      fileDownloadEnd(fileName);
    })
    .catch((err) => fileDownloadError(err.message))
}

function fileDownloadStart(downloadUrl) {
  console.log("file download start:", downloadUrl);
  sendDataOverWs("download-start", "");
}

function fileDownloadEnd(fileName) {
  console.log("file downloaded:", fileName);

  sendDataOverWs("downloaded", `http://localhost${folder}/${fileName}`);
}

function fileDownloadError(error) {
  console.log("file download error:", error);

  sendDataOverWs("error", error.toString());
}

startServer();
