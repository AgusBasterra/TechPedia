function Connection (){
	 this.API_ROOT = "http://172.25.47.132";
	 this.search = function(searchtext, mode) {//search term in title or body content
        console.log("SEARCH****************"+searchtext+"  "+mode);
        var xmlhttp;
        var master=this;
        var endpoint="/api.php?action=query&list=search&srsearch="+encodeURIComponent(searchtext)+"&utf8=&format=json&srwhat="+mode;
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
        	if (xmlhttp.readyState==4 && xmlhttp.status==200){
                var textToGo="";
                console.log(xmlhttp.responseText);
                document.getElementById("results-container-mobile-"+mode).innerHTML="";
        		var response = JSON.parse(xmlhttp.responseText);
                var results=response.query;
                if("undefined" === typeof results){
                    console.log("getcategorias fue null");
                }
                else{
                    results=results.search;
                    if(results.length!=0){
                        if(mode=="title"){
                            textToGo+='<p class="blue-grey-text text-lighten-2" style="font-size: 30px; margin-top: 10px; margin-bottom: 0px; text-align: center;">By title</p>';
                        }    
                        else{
                            textToGo+='<p class="blue-grey-text text-lighten-2" style="font-size: 30px; margin-top: 10px; margin-bottom: 0px; text-align: center;">By text</p>';
                        }
                           

                    }
                    var lastChar="!";
                    for(var index=0;index<results.length;index++){
                        var result=results[index];
                        if(!result.title.startsWith(lastChar)){
                            lastChar=result.title.charAt(0);
                            if(textToGo!=""){
                                textToGo+="</tbody></table>";
                            }
                            textToGo+='<h2>'+lastChar+'</h2>'+
                                '<div class="divider"></div>'+
                                '<table>'+
                                '<tbody>';
                        }
                        textToGo+='<tr><td><a href="detalles.html?title='+encodeURIComponent(result.title)+'">'+result.title+'</a></td></tr>';
                    }
                    
                    if(results.length!=0){
                       textToGo+="</tbody></table>";
                    }
                    else if(mode=="title"){
                        textToGo+='<p class="blue-grey-text text-lighten-2" style="font-size: 30px; margin-top: 10px; margin-bottom: 0px; text-align: center;">The page "'+searchtext+'" does not exist. <a href="create.html">Create it yourself!</a></p>';

                    }
                }
        		console.log(response);
                $("#results-container-mobile-"+mode).append(textToGo);
                
                    
        	}
        };
        console.log(this.API_ROOT+endpoint);
        xmlhttp.open("GET",this.API_ROOT+endpoint,true);
        xmlhttp.send();        
    };
    this.getArticle = function(title) {
        var xmlhttp;
        var endpoint="/api.php?action=query&prop=revisions&rvprop=content&format=json&titles="+encodeURIComponent(title);
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                console.log(xmlhttp.responseText);
                var response = JSON.parse(xmlhttp.responseText);
                var result=response.query;
                if(result){
                    result=result.pages;
                    for(var index in result){
                        var container=document.getElementById("content");
                        result=result[index];
                        if(container){//individual page
                            document.getElementById("titulo").innerHTML=result.title;
                            var spaceUbic=result.title.indexOf(" ");
                            document.getElementById("subtitle").innerHTML="";
                            if(spaceUbic!=-1){
                                if(result.title.charAt(spaceUbic+1)=="("){
                                    document.getElementById("subtitle").innerHTML=result.title.substr(spaceUbic+1);
                                    document.getElementById("titulo").innerHTML=result.title.substr(0, spaceUbic);
                                }
                            }
                            container.innerHTML=result.revisions[0]["*"]; 
                            document.getElementById("btnpencil").href="create.html?title="+encodeURIComponent(result.title);
                        }else{//  edition page
                            
                            $('#textcontent').froalaEditor('html.set', result.revisions[0]["*"]);  
                        }
                        break;
                    }
                }
                console.log(response)
            }
        };
        console.log(this.API_ROOT+endpoint);
        xmlhttp.open("GET",this.API_ROOT+endpoint,true);
        xmlhttp.send();
        
    };
    this.getCategories = function(page) {//gets the direct cateegories of given category
        var xmlhttp;
        var endpoint="/api.php?action=query&list=categorymembers&cmtitle="+encodeURIComponent(page)+"&prop=categoryinfo&format=json";
        //var endpoint = "/api.php?action=query&generator=categorymembers&gcmtitle="+encodeURIComponent(page)+"&gcmtype=subcat&gcmlimit=500&prop=categoryinfo&format=json";
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                console.log(xmlhttp.responseText);
                var response = JSON.parse(xmlhttp.responseText);
                var results=response.query;
                document.getElementById("slide-out").innerHTML="";
                document.getElementById("control-desk").innerHTML="";
                $("#slide-out").append('<div class="section indigo" style="padding-top: 20%;"></div>');
                //$("#slide-out").append('<div class="section indigo"></div>');
                if(page!="Category:MainCat")
                        $("#slide-out").append('<li id="tituloCat2" onClick="window.history.back();"><a class="black-text"><i class="fa fa-arrow-left left"></i>'+page.substr(9)+'</a></li>');
                if("undefined" === typeof results){
                    console.log("getcategorias fue null");
                }
                else{
                    results=results.categorymembers;
                    results.sort(function(a, b) {
                        return a.title.localeCompare(b.title);
                    });
                    for(var index=0;index<results.length;index++){
                        console.log(results[index].title);
                        if(!results[index].title.startsWith("Category:"))
                            continue;
                        var tituloclean=results[index].title.substr(9);
                        $("#slide-out").append('<li><a href="subCategory.html?cmtitle='+encodeURIComponent(results[index].title)+'" class="black-text">'+tituloclean+'<i class="fa fa-arrow-right right"></i></a></li>');
                        $("#control-desk").append('<a href="subCategory.html?cmtitle='+encodeURIComponent(results[index].title)+'" class="collection-item black-text grey lighten-2">'+tituloclean+'<i class="fa fa-arrow-right right indigo-text"></i></a>');
                        //$("#listcat").append('<li><a href="articlesFromCategory.html?cmtitle='+encodeURIComponent(results[index].title)+'"><span class="tab">'+results[index].title+'</span></a></li>');
                    }
                }
                $("#slide-out").append('<li><a class="waves-effect waves-light btn indigo" style="width: 90%;" href="create.html?categoria=true&base='+encodeURIComponent(page)+'"">Add category</a></li>');
                $("#control-desk").append('<a class="waves-effect waves-light btn indigo" style="width: 100%;" href="create.html?categoria=true&base='+encodeURIComponent(page)+'"">Add category</a>');
                console.log(response)
            }
        };
        console.log(this.API_ROOT+endpoint);
        xmlhttp.open("GET",this.API_ROOT+endpoint,true);
        xmlhttp.send();
        
    };
    this.articlesFromCategory = function(category) {//set the direct articles of given category
        document.getElementById("tituloCat").innerHTML='<i class="fa fa-arrow-left left indigo-text"> '+category.substr(9);
        $("#tituloCat").attr("onclick",'window.history.back();');
        $("#tituloCat2").attr("style",'');
        var xmlhttp;
        var endpoint="/api.php?action=query&list=categorymembers&cmtitle="+encodeURIComponent(category)+"&format=json";
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                console.log(xmlhttp.responseText);
                var response = JSON.parse(xmlhttp.responseText);
                var results=response.query.categorymembers;
                results.sort(function(a, b) {
                    return a.title.localeCompare(b.title);
                });
                var textToGo="";
                var lastChar="!";
                for(var index=0;index<results.length;index++){
                    var result=results[index];
                    console.log(result);
                    if(!result.title.startsWith("Category:")){
                        if(!result.title.startsWith(lastChar)){
                            lastChar=result.title.charAt(0);
                            if(textToGo!=""){
                                textToGo+="</tbody></table>";
                            }
                            textToGo+='<h3>'+lastChar+'</h3>'+
                                '<div class="divider"></div>'+
                                '<table>'+
                                '<tbody>';
                        }
                        textToGo+='<tr><td><a href="detalles.html?title='+encodeURIComponent(result.title)+'"><span class="tab">'+result.title+'</span></a></td></tr>';
                    }
                        
                }
                document.getElementById("contentArticlesBig").innerHTML=textToGo;
                document.getElementById("contentArticlesSmall").innerHTML=textToGo;
                console.log(response)
            }
        };
        console.log(this.API_ROOT+endpoint);
        xmlhttp.open("GET",this.API_ROOT+endpoint,true);
        xmlhttp.send();
        
    };
    this.findCategories = function(name) {//set the direct articles of given category
        if(name=="")
            return null;
        var xmlhttp;
        var endpoint="/api.php?action=query&list=allcategories&aclimit=500&acprefix="+encodeURIComponent(name)+"&format=json";
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                document.getElementById("bigresults").innerHTML="";
                document.getElementById("smallresults").innerHTML="";
                console.log(xmlhttp.responseText);
                var response = JSON.parse(xmlhttp.responseText);
                var results=response.query.allcategories;   
                for(var index=0;index<results.length;index++){
                    var result=results[index]["*"];
                    console.log(result);
                    $("#smallresults").append('<li><a onClick="addType(\''+result+'\')" class="black-text">'+result+' </a></li>');
                    $("#bigresults").append('<a onClick="addType(\''+result+'\')" class="collection-item black-text grey lighten-2">'+result+'</a>');
                    
                }
                console.log(response)
            }
        };
        console.log(this.API_ROOT+endpoint);
        xmlhttp.open("GET",this.API_ROOT+endpoint,true);
        xmlhttp.send();
        
    };
}
function findGetParameter(parameterName) {//returns get parameter
    var result = null,
    tmp = [];
    location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
    tmp = item.split("=");
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
}
function setSearchInput(){
    $("#searchtop").keyup(function(event){
        if(event.keyCode == 13){
            window.location="index.html?searchTerm="+encodeURIComponent(document.getElementById("searchtop").value);
        }
    });
}