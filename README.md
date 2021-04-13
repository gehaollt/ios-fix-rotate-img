## Github地址
由于之前那个大神写的插件不符合commonjs规范，所以我fork了一份

## 问题
ios13.4以下的系统版本调用相机拍照或者上传相机拍照的照片，会有图片翻转的问题。
为了解决这个问题需要做下面两个步骤：

- 判断系统版本是否为13.4以下
- 如果为13.4以下的话就需要进行校正
  
## 使用

监听input的事件拿到event

```
    const { target } = event;
    if (target && target.files && target.files.length > 0) {
        const file = target.files[0];
        changeImg(file).then(res => {
                            console.log(res)
        });
    } else {
        console.log("请上传图片");
    }
```
