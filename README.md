jQuery Pure Image Uploader
==========================

Description
--------------------------
Image upload widget with mutilple image selection, preview images, progress bars, two preview mode (list and grid view) for jQuery.
Works with any server-side platform(PHP, Java, Ruby, phtyon, Nodejs, Go)that supports standard HTML form file uploads.
Features
--------------------------
* **Multiple images upload:**
	Allows to select multiple images at once and upload them simultaneously.
* **Upload progress bar:**
	Shows a progress bar indicating the upload progress for individual images.
* **Preview images:**
	Two mode(list and grid) preview of image can be displayed before uploading with uploading with browsers supporting the required APIs.
* **No browser plugins (e.g. Adobe Flash) required:**
	The implementation is based on open standards like HTML5 and JavaScript and requires no additional browser plugins.
* **Graceful fallback for legacy browsers:**
	Uploads files via XMLHttpRequests if supported
* **Customizable and extensible:**
	Provides an API to set individual options and define callBack methods for various upload events.
* **Compatible with any server-side application platform:**
	Works with any server-side platform (PHP, Python, Ruby on Rails, Java, Node.js, Go etc.) that supports standard HTML form file uploads.

Requirements
--------------------------
* [jQuery v1.6+](http://jquery.com/)
* [JavaScript File APIs](http://www.w3.org/TR/FileAPI/)
* [XMLHttpRequest Level2](http://www.w3.org/TR/XMLHttpRequest2/)

Setup
--------------------------
* **Download the zip package, It's FREE.**
* **Unzip the package and upload the following files into a folder on you website:**
	ImageUpload.js
	ImageUpload.css
	images
	jQuery v1.6+
* **On the page you are implementing ImageUpload on, add a reference to the jQuery library.**

```
<link href="ImageUpload.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="js/libs/jquery-1.9.1.js"></script>
<script type="text/javascript" src="ImageUpload.js"></script>
```

* **Initialize ImageUpload on the page.**

```
<div class="container" id="ImageUpload"></div>
```

```
<script type="text/javascript">
$("#ImageUpload").iUpload({
	EnableSwitchView: true,
	GridColumnsNum: 5,
	UploadWidth : '70%',
	OnSelected: function(key, name, size, type){
		/* alert(key + " " + name + " " + size + " " + type); */
	},
	OnProgress : function(key, name, type, uploaded, total){
		/* console.log(key + "-" + name + "-" + uploaded +"-" + total); */
	},
	OnStart : function(key, name, size, type){
		/* console.log(key + "-" + name + "-" + size +"-" + type); */
	},
	OnSuccess: function(key, name, size, type){
		/* console.log(key + "-" + name + "-" + size +"-" + type); */
	}
});
</script>
```

Options
---------------------------
* **ListViewMinHeight**
Indicate the min height of the list view, default 128px.
* **GridViewMinheight**
Indicate the min height of the grid view, default 256px.
* **UploadWidth**
Indicate the width of the ImageUploader widget, the value can be either a string or a number(such as 800, '80%') default '80%'.
* **Multiple**
Indicate wheather multiple selection of image allowed. default true. 
* **View**
Indicate which view do you want to show when ImageUploader loaded. The value can be either 'Grid' or 'List', default 'Grid'
* **EnableSwitchView**
Indicate wheather switch view between grid and list allowed, default true.
* **GridColumnsNum**
Indicate the number the image columns every row on the grid view. default 5.
* **GridImageHeight**
Indicate the height of the image preview on the grid view. default 170px.
* **MaxSize**
Indicate the max size allowed to upload, default 15MB
* **AutoDeleteSuccess**
Indicate if delete the images that upload successfully automatically, default false.
* **FormDatas**
Indicate the additional datas user want to pass to server. it's a javascript pure object, like {mydata: 'data1', mydata2: 'data2'}

Events
--------------------------
* **Onselected**
Rised when an image is selected, arguments: key, name, size, type.
key is the unique ID of the image selected.
* **OnStart**
Rised when an image is uploaded right now,  arguments: key, name, size, type.
key is the unique ID of the image selected.
* **OnProgress**
Rised when an image is on the progress of uploading, arguments: key, name, uploadedSize, totalSize.
* **OnError**
Rised when error occurred during uploading.
* **OnSuccess**
Rised when an image is uploaded successfully.
