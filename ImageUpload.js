(function(global, jQ){
	"use strict";
	
	var Views = {
			list : -1,
			grid : 1
	};
    
    var ImageFile = function(file){
    	this.key = ImageUpload.Util.generateKey(file);
    	this.File = file;
    };
    
	var ImageUpload = {

		view : Views.list,//default grid
		
		gridImageWidth : 160,
		gridImageHeight : 160,//default size
		maxAllowedSize : 5*1024*1024,
		currentSize : 0,
		
		selectedFiles : [],
		
		showViewControl: function(){
			if(this.view === Views.list){
				jQ("#ViewControl > .listView").show();
				jQ("#ViewControl > .gridView").hide();
			}else{
				jQ("#ViewControl > .listView").hide();
				jQ("#ViewControl > .gridView").show();
			}
		},
		showSpecificView: function(){
			if(this.Util.length(this.selectedFiles) == 0){
				return;
	        }
			this.hideSelectControl();
			if(this.view === Views.list){
				jQ("#ViewArea > .listView").show();
				jQ("#ViewArea > .gridView").hide();
			}else{
				jQ("#ViewArea > .gridView").show();
				jQ("#ViewArea > .listView").hide();
			}
			
		},
		switchView : function(){
			this.view = (-this.view);
			this.showViewControl();
			this.showSpecificView();
		},
		cleanView : function(){
			jQ("#ViewArea > .gridView > div").remove();
			jQ("#ViewArea > .listView > table > tbody > tr").remove();
		},
		drawView : function(files){
			this.drawListView(files);
			this.drawGridView(files);
			this.showSpecificView();
		},
		drawListView : function(files){
			jQ.each(files, function(i, file){
				if(!ImageUpload.Util.isImage(file)){
					return;
				}
				var reader = new FileReader();
	            reader.onload = function(e){
	            	var lv = jQ(ImageUpload.UI.$listView);
	            	lv.attr("id", "lv_" + file.key);
	            	lv.attr("size", file.File.size);
	            	lv.find(".thumbnail > img").attr("src", e.target.result);
	            	lv.find(".nameSize > .name").html(file.File.name);
	            	lv.find(".nameSize > .size").html(ImageUpload.Util.readSize(file.File.size));
	                $("#ViewArea tbody").append(lv);
	            };
	            reader.readAsDataURL(file.File);
			});
		},
		drawGridView : function(files){
			jQ.each(files, function(i, file){
				if(!ImageUpload.Util.isImage(file)){
	        		return;
	        	}
				var reader = new FileReader();
	            reader.onload = function(e){
	            	var gv = jQ(ImageUpload.UI.$gridView);
	            	gv.attr("id", "gv_" + file.key);
	            	gv.children(".imageBody").children("img").attr({src: e.target.result, width: ImageUpload.gridImageWidth, height: ImageUpload.gridImageHeight});
	            	gv.children(".imageBody").children("span").html(file.File.name);
	                $("#ViewArea .gridView").append(gv);
	            };
	            reader.readAsDataURL(file.File);
			});
		},
		fileSelected : function(files, onSelected){
			var file_lists = files;
	        this.cleanView();
	        jQ.each(file_lists, function(i, file){
	        	if(!ImageUpload.Util.isImage(file)){
	        		alert("Sorry, the file "+file.name+" you selected is not image, we will automatically ignore it, please select one or more images.");
	        		return;
	        	}
	        	ImageUpload.currentSize += file.size;
	        	if(ImageUpload.currentSize>ImageUpload.maxAllowedSize){
	        		alert("Sorry, you selected too much images. We will automatically subtract the excess images.");
	        		ImageUpload.currentSize -= file.size;
		        	return false;
	        	}
	        	//name_type_size as a unique key
	        	var ifile = new ImageFile(file);
	        	if(ImageUpload.Util.contains(ImageUpload.selectedFiles, ifile)){
	        		if(!confirm("The image " + file.name + " has been selected, would you want to override it?")){
	        			return;
	        		}else{
	        			ImageUpload.Util.remove(ImageUpload.selectedFiles, ifile.key);
	        		}
	        	}
	        	ImageUpload.selectedFiles.push(ifile);
	        	if(onSelected) onSelected.call(global, ifile.key, ifile.File.name, ifile.File.size, ifile.File.type);
	        });
	        this.showDescArea();
	        this.showUploadTriger();
	        this.drawView(this.selectedFiles);
		},
		deleteFile : function(fileKey){
			this.Util.remove(this.selectedFiles, fileKey);
			var gv = jQ("#gv_"+fileKey);
			var lv = jQ("#lv_"+fileKey);
			var size = parseInt(lv.attr("size"));
			this.currentSize -= size;
	        gv.fadeOut();
	        lv.fadeOut();
	        if(this.Util.length(this.selectedFiles) == 0){
	        	jQ("#UploadControl > .descArea > span").html("There are no images selected.");
	        	this.showSelectControl();
	        	this.hideUploadTriger();
	        }else{
		        this.showDescArea();
		        this.showUploadTriger();
	        }
		},
		upload : function(	url,/* upload URL*/
							formDatas,/*object*/ 
							onStart,/*call back function*/
							onProgress,/*call back function*/
							onError,/*call back function*/
							onSuccess,/*call back function*/
							autoDelete){
	        jQ.each(this.selectedFiles, function(i, file/**ImageFile*/){
	            if(!ImageUpload.Util.isImage(file)){
	                return;
	            }
	            var formData = new FormData();
	            formData.append("image" + i, file.File);
	            
	            if(formDatas && typeof formDatas === 'object'){
	            	for(var attr in formDatas){
	            		formData.append(attr, formDatas[attr]);
	            	}
	            }
	            
	            var xhr = new XMLHttpRequest();

	            xhr.upload.addEventListener("progress", function(e){
	            	if(e.lengthComputable){
	            		jQ("#gv_" + file.key +" .progressBar").width(((e.loaded * 100)/(e.total)).toFixed(1) + "%");
	            		
	            		var $lvp = jQ("#lv_" + file.key +" .progress > div");
	            		$lvp.width(((e.loaded * 100)/(e.total)).toFixed(1) + "%");
	            		var $lvs = jQ("#lv_" + file.key +" .progress > span");
	            		$lvs.html(((e.loaded * 100)/(e.total)).toFixed(1) + "%");
	            	}
	            	if(onProgress) onProgress.call(global, file.key, file.File.name, 
	            			file.File.type, e.loaded, e.total);
	            }, false);
	            xhr.addEventListener("loadstart", function(e){
	            	var $gvf = jQ("#gv_" + file.key +" .imageFooter");
	            	$gvf.show();
	            	if(onStart) onStart.call(global, file.key, file.File.name, 
	            			file.File.size, file.File.type);
	            }, false);
	            xhr.addEventListener("load", function(e){
	            	if(this.status == 200){
	            		jQ("#gv_" + file.key +" .opacityCover").show();
	            		jQ("#gv_" + file.key +" .imageFooter").hide();
	            		jQ(document).off("mouseenter", ".gridViewBlock");
	            		jQ(document).off("mouseleave", ".gridViewBlock");
	            		
	            		var $lvp = jQ("#lv_" + file.key +" .progress > div");
	            		$lvp.width("100%");
	            		var $lvs = jQ("#lv_" + file.key +" .progress > span");
	            		$lvs.html("100%");
	            		
	            		if(autoDelete) ImageUpload.deleteFile(file.key);
	            		else ImageUpload.Util.remove(ImageUpload.selectedFiles, file.key);//remove from the queue
	            		
	            		if(onSuccess) onSuccess.call(global, file.key, file.File.name, 
		            			file.File.size, file.File.type);
	            	}
	            }, false);
	            xhr.addEventListener("error", function(e){
	            	if(onError) onError.apply(global, file.key, file.File.name, 
	            			file.File.size, file.File.type);
	            }, false);
	            
	            xhr.open("POST", url, true);
	            xhr.send(formData);
	        });
	    },
        calImageWidth : function(columns){
        	var uploaderWidth = jQ("#ViewArea").width();
        	var scrollWidth = 20;
        	uploaderWidth = uploaderWidth - scrollWidth;
        	if(columns < 3)columns = 3;
        	var marginWidth = 16;
        	this.gridImageWidth = uploaderWidth / columns - marginWidth;
        },
        calImageHeight : function(height){
        	this.gridImageHeight = height;
        },
        setMaxAllowedSize : function(max){
        	this.maxAllowedSize = max;
        },
        showDescArea: function(){
        	jQ("#UploadControl > .descArea > span").html(this.Util.length(this.selectedFiles) + " images are selected, total size is "+ this.Util.legibleSize(this.selectedFiles));
        },
        showUploadTriger: function(){
        	jQ("#UploadControl > .uploadArea").show();
        },
        hideUploadTriger: function(){
        	jQ("#UploadControl > .uploadArea").hide();
        },
        hideSelectControl : function(){
			jQ("#ViewArea > .selectWrapper").hide();
			jQ("#UploadControl > .selectAnother").show();
		},
		showSelectControl : function(){
			jQ("#ViewArea > .selectWrapper").show();
			jQ("#UploadControl > .selectAnother").hide();
			jQ("#ViewArea > .gridView").hide();
			jQ("#ViewArea > .listView").hide();
		}
	};
	
	ImageUpload.UI = {
		$viewControl : "<div id='ViewControl' class='row'>" +
						"<div class='listView'>" +
							"<div></div>" +
						"</div>" +
						"<div class='gridView'>" +
							"<div></div>" +
						"</div>" +
					"</div>",
		$viewArea : "<div id='ViewArea' class='row'>" +
				   		"<div class='selectWrapper'>" +
				   			"<span>" +
				                "<input id='InputFiles' type='file' multiple/>" +
				                "<div id='InputFilesWrapper'></div>" +
				            "</span>" +
				   		"</div>" +
				    	"<div class='listView'>" +
				    		"<table><tbody></tbody></table>" +
				    	"</div>" +
				    	"<div class='gridView'>" +
				    	"</div>" +
				    "</div>",
		$uploadControl : "<div id='UploadControl' class='row'>" +
					       	"<div class='descArea'>" +
					       		"<span>There are no images selected.</span>" +
					       	"</div>" +
					        "<div class='uploadArea' style='display:none;'>" +
					        	"<div id='UploadTriger'></div>" +
					        "</div>" +
					        "<div class='selectAnother'>" +
							"<span class='wrapper'>" +
				                "<input id='InputAnotherFiles' type='file' multiple/>" +
				                "<div id='InputAnotherFilesWrapper'></div>" +
				            "</span>" +
				            "</div>" +
					    "</div>",
		$gridView : "<div class='gridViewBlock' id='" +/**file.key */"'>" +
                    "<div class='imageHeader'>" +
                    	"<a class='deleteIcon'>" + 
                    		"<div></div>" +
                    	"</a>" +
                    "</div>" +
                    "<div class='imageBody'>" +
                    	"<img src=" + /**e.target.result */ ">" +
                    	"<span></span>" +
                    "</div>" +
                    "<div class='imageFooter'>" +
                    	"<span class='progressBar'>&nbsp;</span>" +
                    "</div>" +
                    "<div class='opacityCover'>" +
                    	"<div></div>" +
                    "</div>" + 
                    "</div>",
		$listView : "<tr class='listViewBlock' id='" +/**file.key */"'>" +
                	"<td class='thumbnail' style='padding: 8px; width: 20%;'>"+
                		"<img src=" + /**e.target.result */ ">" +
                	"</td>" +
                	"<td class='nameSize' style='padding: 8px; width: 20%;'>" + 
                		"<div class='name'></div>"+
                		"<div class='size'></div>"+
                	"</td>" +
                    "<td class='statusBar' style='padding: 8px;'>" +
                    	"<div  class='progress'>" +
                    	"<span style='font-size: 12pt;'></span>" +
                    	"<div></div>" +
                    	"</div>" +
                    "</td>" +
                    "<td class='deleteIcon' style='padding: 8px; width: 10%;'>" +
                    	"<div></div>" +
                    "</td>" + 
                    "</tr>"
	};
	
	ImageUpload.Util = {
			specialChars : /[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)(\`)]/g,
	    	generateKey : function(file){
	    		return (file.name+"_"+file.type+"_"+file.size).replace(this.specialChars, "");
	    	},    
	    	contains : function(files, file){
	    		if(!file || !file instanceof ImageFile){
	    			return false;
	    		}
	    		for(var i = 0; i < files.length; i++){
	    			if(!files[i] || !files[i].key) continue;
	    			if(file.key === files[i].key) return true;
	    		}
	    	},
	    	remove : function(files, key){
	    		for(var i = 0; i < files.length; i++){
	                if(!files[i] || !files[i] instanceof ImageFile){
	                	continue;
	                }
	                if(files[i].key === key){
	                	files[i] = null;
	                }
	            }
	    	},
	        isImage : function(file/**File or ImageFile*/){
	        	if(!file) return false;
	        	
	        	if(file instanceof ImageFile 
	        			&& file.File 
	        			&& file.File instanceof File 
	        			&& /image\/.*/g.test(file.File.type))
	        	return true;
	        	
	        	if(file instanceof File && /image\/.*/g.test(file.type)){
	        		return true;
	        	}
	        	
	        	return false;
	        },
	        length : function(files){
	        	var count = 0;
	        	for(var i = 0; i < files.length; i++){
	        		if(this.isImage(files[i])){
	        			count++;
	        		}
	        	}
	        	return count;
	        },
	        /** return a string include B, KB, MB represent a legible size*/
	        legibleSize :function(files){
	        	var size = 0;
	        	for(var i = 0; i < files.length; i++){
	        		if(this.isImage(files[i]) && files[i].File){
	        			size += files[i].File.size;
	        		}
	        	}
	        	return this.readSize(size);
	        },
	        readSize : function(oriSize){
	        	if(oriSize < 1024){
	        		return oriSize + " B";
	        	}else if (oriSize < 1024 * 1024){
	        		return (oriSize / 1024).toFixed(2) + " KB";
	        	}else{
	        		return (oriSize / (1024*1024)).toFixed(2) +" MB";
	        	};
	        }
	        
	};
	
	ImageUpload.API = {
			init : function(options){
				var $this = $(this);
				$this.children().remove();
				var dsettings = {//default settings.
					URL : "uploadController.do?method=upload",
					ListViewMinHeight : 128, 
					GridViewMinHeight : 256, 
					UploadWidth : "80%",//
					Multiple : true,//
					View : "Grid",//or List
					EnableSwitchView : true,//
					GridColumnsNum : 5,//default
					GridImageHeight : 170,//default
					MaxSize : 15*1024*1024,//default as 5MB
					FormDatas : {},
					AutoDeleteSuccess : false,
					OnSelected: function(key, name, size, type){},//fileKey, fileObject
	    			OnStart: function(key, name, size, type){},
	    			OnProgress: function(key, name, type, uploadedSize, totalSize){}, 
	    			OnError: function(key, name, size, type){},
	    			OnSuccess : function(key, name, size, type){}
				};
				var settings = jQ.extend(dsettings, options);
				
				$this.width(settings.UploadWidth);
				$this.append(jQ(ImageUpload.UI.$viewControl));
				$this.append(jQ(ImageUpload.UI.$viewArea));
				$this.append(jQ(ImageUpload.UI.$uploadControl));
				
				ImageUpload.view = (settings.View === "List")? Views.list: Views.grid;
				ImageUpload.showViewControl();

				if(settings.EnableSwitchView){
					jQ("#ViewControl > .listView").click(function(){
						ImageUpload.switchView();
					});
					jQ("#ViewControl > .gridView").click(function(){
						ImageUpload.switchView();
					});
				}
				if(!settings.Multiple){
					jQ("#InputFiles").attr("multiple", false);
					jQ("#InputAnotherFiles").attr("multiple", false);
				}
				
				ImageUpload.calImageWidth(settings.GridColumnsNum);
				ImageUpload.calImageHeight(settings.GridImageHeight);
				ImageUpload.setMaxAllowedSize(settings.MaxSize);
				
				jQ("#InputFiles").change(function(){
					var files = this.files;
					ImageUpload.fileSelected(files, settings.OnSelected);
				});
				jQ("#InputAnotherFiles").change(function(){
					var files = this.files;
					ImageUpload.fileSelected(files, settings.OnSelected);
				});
			    jQ(document).on("mouseenter", ".gridViewBlock", function(event){
			    	jQ(this).children(".imageHeader").fadeIn();
			    	jQ(this).children(".imageBody").children("span").fadeIn();
			    }).on("mouseleave", ".gridViewBlock", function(event){
			    	jQ(this).children(".imageHeader").fadeOut();
			    	jQ(this).children(".imageBody").children("span").fadeOut();
			    });
			    jQ(document).on("click", ".gridViewBlock .deleteIcon", function(event){
			        var fileKey = jQ(this).parent().parent().attr("id").replace("gv_", "");
			        ImageUpload.deleteFile(fileKey);
			    });
			    jQ(document).on("click", ".listViewBlock .deleteIcon", function(event){
			    	var fileKey = jQ(this).parent().attr("id").replace("lv_", "");
			        ImageUpload.deleteFile(fileKey);
			    });
			    jQ("#UploadTriger").click(function(){
			    	ImageUpload.upload(settings.URL, settings.FormDatas, 
			    			settings.OnStart, settings.OnProgress, settings.OnError,
			    			settings.OnSuccess, settings.AutoDeleteSuccess);
			    });
			}
	};
	
	/**
	 * Extends jQuery object.
	 * ***/
	jQ.fn.iUpload = function(options){
		if(typeof options === "string"){
			
		}else if(typeof options === "object"){
			ImageUpload.API.init.apply(this, arguments);
		}
	};
	
})(window, jQuery);