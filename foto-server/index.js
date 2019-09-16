const WS = require("./express-server");

// const FtpSrv = require('ftp-srv');
// const ftpServer = new FtpSrv({url: 'ftp://0.0.0.0:21', anonymous: true});

// ftpServer.on('login', (({connection, username, password}, resolve, reject) => {
//   resolve();
//
//   connection.on('STOR', (error, fileName) => {
//     if (error == null) {
//       fileUploaded(fileName)
//     } else {
//       fileUploadError(error)
//     }
//   })
// }));
//
// ftpServer.listen().then(() => {
//   console.log("ftp server is listening")
// });
