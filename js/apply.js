function Sender (){
    this.API_ROOT = "http://172.25.47.132";
    this.edit = function(title, text, createonly) {//search term in title or body content
        var xmlhttp;
        var endpoint="/api.php?action=edit&format=json";
        xmlhttp = new XMLHttpRequest();        
        console.log(this.API_ROOT+endpoint);        
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () { 
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {               
                console.log(xmlhttp.responseText);
                var response = JSON.parse(xmlhttp.responseText);
                if(response.edit)
                    if(response.edit.result)
                        window.location="detalles.html?title="+encodeURIComponent(title);
                    else
                        alert("Error");
                else
                    alert("Error");
            }
        }
        title=encodeURIComponent(title);
        text=encodeURIComponent(text);

        var token=encodeURIComponent("+\\");
        var data = "title="+title+"&text="+text+"&token="+token;
        if(createonly){
            data+="&createonly=";
        }
        xmlhttp.open("POST", this.API_ROOT+endpoint, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(data);        
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