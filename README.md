jQuery Pure Image Uploader
==========================

Description
--------------------------
	Image upload widget with mutilple image selection, preview images, progress bars, two preview mode (list and grid view) for jQuery.
	Works with any server-side platform(PHP, Java, Ruby, phtyon, Nodejs, Go)that supports standard HTML form file uploads.
Features
--------------------------
	* Multiple images upload:
		*Allows to select multiple images at once and upload them simultaneously.
	* Upload progress bar:
		*Shows a progress bar indicating the upload progress for individual images.
	* Preview images:
		*Two mode(list and grid) preview of image can be displayed before uploading with uploading with browsers supporting the required APIs.
	* No browser plugins (e.g. Adobe Flash) required:
		*The implementation is based on open standards like HTML5 and JavaScript and requires no additional browser plugins.
	* Graceful fallback for legacy browsers:
		*Uploads files via XMLHttpRequests if supported
	* Customizable and extensible:
		*Provides an API to set individual options and define callBack methods for various upload events.
	* Compatible with any server-side application platform:
		*Works with any server-side platform (PHP, Python, Ruby on Rails, Java, Node.js, Go etc.) that supports standard HTML form file uploads.

Requirements
--------------------------
	* [jQuery v1.6+](http://jquery.com/)
	* [JavaScript File APIs](http://www.w3.org/TR/FileAPI/)
	* [XMLHttpRequest Level2](http://www.w3.org/TR/XMLHttpRequest2/)
Setup
--------------------------
	1, Download the zip package, It's FREE.
	2, Unzip the package and upload the following files into a folder on you website:
		*ImageUpload.js
		*ImageUpload.css
		*images
		*jQuery v1.6+
	3, On the page you are implementing ImageUpload on, add a reference to the jQuery library.
	`<link href="ImageUpload.css" rel="stylesheet" type="text/css">
    	<script type="text/javascript" src="js/libs/jquery-1.9.1.js"></script>
    	<script type="text/javascript" src="ImageUpload.js"></script>`
	4, Initialize ImageUpload on the page.
	`<div class="container" id="ImageUpload"></div>`
	`<script type="text/javascript">
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
	</script>`
