import EXIF from "exif-js";
import {
    isIos,
    getIosVerStr,
    isVerLessThan
} from './func';

function createBlob(image, width, height) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);
    return convertCanvasToBlob(canvas);
}

function convertCanvasToBlob(canvas) {
    let format = "image/jpeg";
    let base64 = canvas.toDataURL(format);
    let code = window.atob(base64.split(",")[1]);
    let aBuffer = new window.ArrayBuffer(code.length);
    let uBuffer = new window.Uint8Array(aBuffer);
    for (let i = 0; i < code.length; i++) {
        uBuffer[i] = code.charCodeAt(i);
    }
    let Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
    if (Builder) {
        let builder = new Builder();
        builder.append(uBuffer);
        return builder.getBlob(format);
    } else {
        return new window.Blob([uBuffer], {
            type: format
        });
    }
}

function change(data, ori, quality) {
    return new Promise(resolve => {
        let image = new Image();
        image.src = data;
        image.onload = () => {
            let degree = 0;
            let drawWidth = image.naturalWidth;
            let drawHeight = image.naturalHeight;
            let width = 0;
            let height = 0;
            let canvas = document.createElement("canvas");
            canvas.width = width = drawWidth;
            canvas.height = height = drawHeight;
            let context = canvas.getContext("2d");
            if (isIos()) {
                let iosVer = getIosVerStr();
                console.log(iosVer,isVerLessThan(iosVer, '13.4'));
                if (isVerLessThan(iosVer, '13.4')) {
                    //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
                    switch (ori) {
                    //iphone横屏拍摄，此时home键在左侧
                    case 3:
                        degree = 180;
                        drawWidth = -width;
                        drawHeight = -height;
                        break;
                        //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
                    case 6:
                        canvas.width = height;
                        canvas.height = width;
                        degree = 90;
                        drawWidth = width;
                        drawHeight = -height;
                        break;
                        //iphone竖屏拍摄，此时home键在上方
                    case 8:
                        canvas.width = height;
                        canvas.height = width;
                        degree = 270;
                        drawWidth = -width;
                        drawHeight = height;
                        break;
                    }
                }
            }
            //使用canvas旋转校正
            context.rotate((degree * Math.PI) / 180);
            context.drawImage(image, 0, 0, drawWidth, drawHeight);
            let selectImg = canvas.toDataURL("image/png", quality);
            let selectImgObj = new Image();
            selectImgObj.src = selectImg;
            selectImgObj.onload = () => {
                let canvasData = createBlob(
                    selectImgObj,
                    canvas.width,
                    canvas.height
                );
                resolve({
                    imgWidth: canvas.width,
                    imgHeight: canvas.height,
                    selectImg,
                    canvasData
                });
            };
        };
    });
}

function changeImg(file) {
    return new Promise(resolve => {
        let quality = 1;
        const size = file.size / 1024;
        if (size >= 600) {
            quality = 600 / size;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = ({
            currentTarget
        }) => {
            EXIF.getData(file, function () {
                let orientation = EXIF.getTag(this, "Orientation");
                change(currentTarget.result, orientation, quality).then(res => {
                    resolve(res);
                });
            });
        };
    });
}

export default changeImg;
