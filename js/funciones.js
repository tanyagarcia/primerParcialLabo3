var http = new XMLHttpRequest;
var fechaSeteada;
var trClick;

window.onload = function()
{
    var fecha = new Date();
    fechaSeteada =  fecha.getFullYear() + "-" + (fecha.getMonth()+ 1) +  "-" + fecha.getDate();

    http.onreadystatechange = callbackGrilla;
    http.open("GET", "http://localhost:3000/materias", true);
    http.send();
    document.getElementById("idSpinner").hidden = false;

    var btnCerrar = document.getElementById("btnCerrar");
    btnCerrar.addEventListener("click", Cerrar);
    var btnModificar = document.getElementById("btnModificar");
    btnModificar.addEventListener("click", Modificar);
    var btnEliminar = document.getElementById("btnEliminar");
    btnEliminar.addEventListener("click", Eliminar);
}

function callbackGrilla()
{
    if(http.readyState == 4 && http.status == 200)
    {
        armarGrilla(JSON.parse(http.responseText));
    }
}

function armarGrilla(jsonObj)
{
    var tCuerpo = document.getElementById("tCuerpo");

    for(var i = 0; i<jsonObj.length; i++)
    {
        var row = document.createElement("tr");
        
        var cel0 = document.createElement("td");
        var text0 = document.createTextNode(jsonObj[i].id);
        cel0.appendChild(text0);
        row.appendChild(cel0);
        cel0.hidden = true;

        var cel1 = document.createElement("td");
        var text1 = document.createTextNode(jsonObj[i].nombre);
        cel1.appendChild(text1);
        row.appendChild(cel1);

        cel2 = document.createElement("td");
        text2 = document.createTextNode(jsonObj[i].cuatrimestre);
        cel2.appendChild(text2);
        row.appendChild(cel2);
     
 
        cel3 = document.createElement("td");
        text3 = document.createTextNode(jsonObj[i].turno);
        cel3.appendChild(text3);
        row.appendChild(cel3);

        cel4 = document.createElement("td");
        text4 = document.createTextNode(jsonObj[i].fechaFinal);
        cel4.appendChild(text4);
        row.appendChild(cel4);

        row.addEventListener("dblclick", clickGrilla);
        tCuerpo.appendChild(row);

    }

    document.getElementById("idSpinner").hidden = true;
}

function clickGrilla(evento)
{
    trClick = evento.target.parentNode;
    document.getElementById("idInput").value = trClick.childNodes[0].innerHTML;
    document.getElementById("fname").value = trClick.childNodes[1].innerHTML;
    document.getElementById("cuatrimestre").value = trClick.childNodes[2].innerHTML;
  
    if(trClick.childNodes[3].innerHTML == "Mañana")
    {
        document.getElementById("tMañana").checked = true;
    }
    else
    {
        document.getElementById("tNoche").checked = true;
    }

    var fecha = trClick.childNodes[4].innerHTML;
    var fechaArray = fecha.split("/");
    var date = fechaArray[2] + "-" + fechaArray[1] + "-" + fechaArray[0];
    document.getElementById("fechaMateria").value = date;
    var contenedor = document.getElementById("contenedorId");
    contenedor.hidden = false;

    document.getElementById("fname").className = "sinError";
    document.getElementsByName("btnRadio").className = "sinError";
    document.getElementById("fechaMateria").className = "sinError";
}

function Cerrar(evento)
{
    var contenedor = document.getElementById("contenedorId");
    contenedor.hidden = true;
}

function Modificar(evento)
{
    var data = {};
    var idObtenido = document.getElementById("idInput").value;
    var idInt = parseInt(idObtenido);
    var materia = document.getElementById("fname").value;
    var cuatrimestreObtenido = document.getElementById("cuatrimestre").value;
    var cuatrimestreInt = parseInt(cuatrimestreObtenido);
    var fechaIngresada = document.getElementById("fechaMateria").value;
    var fechaIngresadaArray = fechaIngresada.split("-");
    var fechaModificada = fechaIngresadaArray[2] + "/" + fechaIngresadaArray[1] + "/" +  fechaIngresadaArray[0];
    var turno;
    var contenedor = document.getElementById("contenedorId");
    var fechaSeteadaArray = fechaSeteada.split("-");
    
    if(document.getElementById("tMañana").checked == true)
    {
        turno = "Mañana";
    }
    else
    {
        turno = "Noche";
    }

    if(materia.length < 6)
    {
        document.getElementById("fname").className = "error";
    }
    else if(fechaIngresadaArray[0] < fechaSeteadaArray[0] || fechaIngresadaArray[1] < fechaSeteadaArray[1] || fechaIngresadaArray[2] < fechaSeteadaArray[2])
    {
        console.log(fechaIngresadaArray[0]);
        console.log(fechaSeteadaArray[0]);
        console.log(fechaIngresadaArray[1]);
        console.log(fechaSeteadaArray[1]);
        console.log(fechaIngresadaArray[2]);
        console.log(fechaSeteadaArray[2]);
        document.getElementById("fechaMateria").className = "error";
    }
    else
    {
        data = {"id": idInt , "nombre": materia, "cuatrimestre": cuatrimestreInt, "fechaFinal": fechaModificada, "turno": turno};
    }

    http.onreadystatechange = function()
    {
        if(http.readyState == 4 && http.status == 200)
        {
            document.getElementById("idSpinner").hidden = true;
            
            var respuesta = JSON.parse(http.responseText);
            if(respuesta.type == "ok")
            {
                trClick.childNodes[1].innerHTML = materia;
                if(turno == "Mañana")
                {
                    trClick.childNodes[3].innerHTML = "Mañana";
                }
                else
                {
                    trClick.childNodes[3].innerHTML = "Noche";
                }
                trClick.childNodes[4].innerHTML = fechaModificada;

                document.getElementById("contenedorId").hidden = true;
            }
            else if(respuesta.type == "error")
            {
                alert("Hubo un error en los datos ingresados");
                contenedor.hidden = false;
            }
        }
    }

    http.open("POST", "http://localhost:3000/editar", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(data));
    document.getElementById("idSpinner").hidden = false;
    contenedor.hidden = true;
}

function Eliminar(evento)
{
    var idObtenido = document.getElementById("idInput").value;
    var data = {};
    var idInt = parseInt(idObtenido);
    data = {"id": idInt};
    var contenedor = document.getElementById("contenedorId");

    http.onreadystatechange = function()
    {
        if(http.readyState == 4 && http.status == 200)
        {
            document.getElementById("idSpinner").hidden = true;
            
            var respuesta = JSON.parse(http.responseText);
            if(respuesta.type == "ok")
            {
                trClick.remove();
            }
            else if(respuesta.type == "error")
            {
                alert("Hubo un error");
            }
        }
    }

    http.open("POST", "http://localhost:3000/eliminar", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(data));
    document.getElementById("idSpinner").hidden = false;
    contenedor.hidden = true;
}