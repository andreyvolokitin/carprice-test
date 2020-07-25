/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const rimraf = require('rimraf');
const sharp = require('sharp');

const settings = require('./settings');

const src = path.resolve(settings.paths.src.base, `${settings.paths.src.img}/icons-source`);
const dest = path.resolve(settings.paths.src.base, `${settings.paths.src.img}/icons`);

const deviceIconSizes = {
  phone: 60,
  tablet: 72,
};
const highDensitySuffix = '@2x';

function processSource() {
  // Loop through all the files in the temp directory
  fsPromises
    .readdir(src)
    .then((files) => {
      files.forEach((file, index) => {
        // Make one pass and make the file complete
        const fromPath = path.join(src, file);
        const toPath = path.join(dest, file);
        const to2xPath = path.join(
          dest,
          file.replace(path.parse(file).ext, `${highDensitySuffix}$&`)
        );

        fsPromises
          .stat(fromPath)
          .then((stat) => {
            if (stat.isFile()) {
              console.log("'%s' is a file.", fromPath);
            } else if (stat.isDirectory()) {
              console.log("'%s' is a directory.", fromPath);
            }

            Object.keys(deviceIconSizes).forEach((device) => {
              sharp(fromPath)
                .resize({ width: deviceIconSizes[device] * 2 })
                .toFile(
                  to2xPath.replace(
                    `${highDensitySuffix}${path.parse(to2xPath).ext}`,
                    `-${device}$&`
                  ),
                  (err) => {
                    if (err) {
                      console.log(err);
                    }
                  }
                )
                .resize({ width: deviceIconSizes[device] })
                .toFile(toPath.replace(path.parse(toPath).ext, `-${device}$&`), (err) => {
                  if (err) {
                    console.log(err);
                  }
                });
            });
          })
          .catch((error) => {
            console.error('Error stating file.', error);
          });
      });
    })
    .catch((err) => {
      console.error('Could not list the directory.', err);
      process.exit(1);
    });
}

if (fs.existsSync(dest)) {
  rimraf(dest, (err) => {
    if (err) {
      console.error('Could not delete the directory.', err);
      process.exit(1);
    }

    fs.mkdirSync(dest);
    processSource();
  });
} else {
  fs.mkdirSync(dest);
  processSource();
}
