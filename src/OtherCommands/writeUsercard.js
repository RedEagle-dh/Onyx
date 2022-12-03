var Jimp = require("jimp");
const fileName = './test.png';
const imageCaption = 'Image caption';
let loadedImage;
Jimp.read(fileName)
    .then(function (image) {
        loadedImage = image;
        return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    })
    .then(function (font) {
        loadedImage.print(font, 200, 10, imageCaption)
            .write(fileName);
    })
    .catch(function (err) {
        console.error(err);
    });


