/////////////////////////////////////////////////////
// Blocks Online
// Desarrollo Juan Carlos Perez Casal
// Compañia AJU Software
// Realizado en 2015
// Todos los derechos reservados
/////////////////////////////////////////////////////





"use strict";

//-------------------------------------------------------------------------------------
//funciones globales

function AddEvent(elem, event_name, event_function) {
    if (elem.attachEvent) //Internet Explorer
        elem.attachEvent("on" + event_name, function () { event_function.call(elem); });
    else if (elem.addEventListener) //resto navegadores
        elem.addEventListener(event_name, event_function, false);
}

//var addEvent = function (elem, type, eventHandle) {
//    if (elem == null || typeof (elem) == 'undefined') return;
//    if (elem.addEventListener) {
//        elem.addEventListener(type, eventHandle, false);
//    } else if (elem.attachEvent) {
//        elem.attachEvent("on" + type, eventHandle);
//    } else {
//        elem["on" + type] = eventHandle;
//    }
//};

function RemoveEvent(elem, event_name, event_function) {
    if (elem.detachEvent) //Internet Explorer
        elem.detachEvent('on' + event_name, event_function);
    else if (elem.removeEventListener) //resto navegadores
        elem.removeEventListener(event_name, event_function, false);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function getWidth() {
    if (self.innerWidth)
        return self.innerWidth;
    if (document.documentElement && document.documentElement.clientWidth)
        return document.documentElement.clientWidth;
    if (document.body)
        return document.body.clientWidth;
    return screen.availWidth;
}

function getHeight() {
    if (self.innerHeight)
        return self.innerHeight;
    if (document.documentElement && document.documentElement.clientHeight)
        return document.documentElement.clientHeight;
    if (document.body)
        return document.body.clientHeight;
    return screen.availHeight;
}

function effectiveDeviceWidth() {
    var deviceWidth = window.orientation == 0 ? window.screen.width : window.screen.height;
    // iOS returns available pixels, Android returns pixels / pixel ratio
    if (navigator.userAgent.indexOf("Android") >= 0 && window.devicePixelRatio) {
        deviceWidth = deviceWidth / window.devicePixelRatio;
    }
    return deviceWidth;
}

function effectiveDeviceHeight() {
    var deviceHeight = window.orientation == 0 ? window.screen.height : window.screen.width;
    // iOS returns available pixels, Android returns pixels / pixel ratio
    if (navigator.userAgent.indexOf("Android") >= 0 && window.devicePixelRatio) {
        deviceHeight = deviceHeight / window.devicePixelRatio;
    }
    return deviceHeight;
}

function GetEscala() {
    var realWidth = getWidth(); //ancho real
    var realHeight = getHeight();

    var escala = Math.min(realWidth / Width, realHeight / Height);
    //escala = escala * 0.97; //reduce un poco
    //escala = Math.floor(escala * 100000) / 100000; //redondea
    //console.log(escala + ", " + RealWidth + ", " + RealHeight);

    return escala;
}

function SetCombo(cmb, valor) {
    var combo = document.getElementById(cmb);
    if (combo != null) {
        var options = combo.options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].value == valor) {
                combo.selectedIndex = i;
                break;
            }
        }
    }
}

function SetComboBoolean(cmb, valor) {
    if (valor)
        SetCombo(cmb, "Si");
    else
        SetCombo(cmb, "No");
}

function GetCombo(cmb) {
    var combo = document.getElementById(cmb);
    if (combo != null) {
        return combo.options[combo.selectedIndex].value;
    }
}

function GetComboBoolean(cmb) {
    var valor = GetCombo(cmb);
    if (valor == "Si")
        return true;
    else
        return false;
}

function TiempoDosCifras(t) {
    if (t < 10) {
        t = "0" + t;
    }
    return t;
}

function TiempoTresCifras(t) {
    if (t < 10)
        t = "0" + t;
    if (t < 100)
        t = "0" + t;
    return t;
}

function SetTipoPartida(tipoPartida)
{
    TipoPartida = tipoPartida;
    if (TipoPartida == TipoPartidaMaraton)
        MarcadorPosicionX = MarcadorPosicionXSinOponente;
    else
        MarcadorPosicionX = MarcadorPosicionXConOponente;
}



//-------------------------------------------------------------------------------------
//funcion iniciar juego

function IniciarPrincipal() {
    //por aqui se inicia el script principal +++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //IniciarMenuPrincipal(); //Inicia el menu principal del juego

    IniciarPruebas(true); //Inicia el modo de pruebas (inicio true)
}



//-------------------------------------------------------------------------------------
//funciones pantallas pruebas

function IniciarPruebas(inicio) {
	//inicio modo debug ------------------------------------++++++++++++++++++++++++++--------------------------------------
    Juego = false; //estamos en las pantallas, no en el juego

    IniciarDispositivo(); //para establecer parametros juego

    IniciarResolucion(true); //para calcular resolucion

    var msg = "";
    //resolucion
    var realWidth = getWidth(); //ancho real
    var realHeight = getHeight();
    var escala = GetEscala(); //escala
    escala = Math.floor(escala * 100000) / 100000;
    msg += "(" + Width + ", " + Height + ") -> " + escala + " (" + realWidth + ", " + realHeight + ")</br>";
    console.log("(" + Width + ", " + Height + ") -> " + escala + " (" + realWidth + ", " + realHeight + ")");

    //dispositivo
    if (Dispositivo == Movil)
        msg += "Movil</br>";
    else if (Dispositivo == PC)
        msg += "PC</br>";

    document.getElementById("divMensaje").innerHTML = msg;

    //cargar combos
    SetComboBoolean("cmbDebugActivo", DebugActivo);
    SetComboBoolean("cmbPublicidadActivo", PublicidadActivo);
    SetComboBoolean("cmbPiezasNuevasActivo", PiezasNuevasActivo);
    SetComboBoolean("cmbGemasNuevasActivo", GemasNuevasActivo);
    //SetCombo("cmbGemasTransparencia", GemasTransparencia);
	SetComboBoolean("cmbDebugGemasActivo", DebugGemasActivo);

    SetComboBoolean("cmbSonidoActivo", SonidoActivo);
    SetComboBoolean("cmbMusicaActivo", MusicaActivo);
    SetComboBoolean("cmbTecladoActivo", TecladoActivo);
    SetComboBoolean("cmbTouchActivo", TouchActivo);
    SetComboBoolean("cmbRatonActivo", RatonActivo);
    SetComboBoolean("cmbBotoneraActivo", BotoneraActivo);

    document.getElementById("divPruebas").style["display"] = "block";

    if (inicio) { //solo se ejecuta la primera vez
        //resto controles
        AddEvent(document.getElementById("btnEmpezar"), "click", PulsarEmpezar);
        AddEvent(document.getElementById("btnInfo"), "click", PulsarInfo);

        if (Dispositivo == PC) {
            //evento cambiar resolucion ventana navegador
            AddEvent(window, "resize", RedimensionarNavegador);
        }
    }

    //setTimeout(IniciarTitulo, 5000);
}

function PulsarEmpezar() {
    var bDebug = false;

    //pulsar boton empezar
    DebugActivo = GetComboBoolean("cmbDebugActivo");
    PublicidadActivo = GetComboBoolean("cmbPublicidadActivo");
    PiezasNuevasActivo = GetComboBoolean("cmbPiezasNuevasActivo");
    GemasNuevasActivo = GetComboBoolean("cmbGemasNuevasActivo");
    //GemasTransparencia = GetCombo("cmbGemasTransparencia");
	DebugGemasActivo = GetComboBoolean("cmbDebugGemasActivo");
	
    SonidoActivo = GetComboBoolean("cmbSonidoActivo");
    MusicaActivo = GetComboBoolean("cmbMusicaActivo");
    TecladoActivo = GetComboBoolean("cmbTecladoActivo");
    TouchActivo = GetComboBoolean("cmbTouchActivo");
    RatonActivo = GetComboBoolean("cmbRatonActivo");
    BotoneraActivo = GetComboBoolean("cmbBotoneraActivo");

    //eliminar evento onresize, no se debe ejecutar mas
    RemoveEvent(window, "resize", RedimensionarNavegador)

    if (DebugActivo && bDebug)
        alert("PulsarPruebas completado");

    IniciarMenuPrincipal();
}

function PulsarInfo() {
    //probabilidad piezas
    var prob = new Array(PiezaSize);
    var pieza;
    for (pieza = 0; pieza < PiezaSize; pieza++) {
        prob[pieza] = 0;
    }
    var max = 1000000;
    var i;
    for (i = 0; i < max; i++)
    {
        pieza = GetNuevaPieza();
        prob[pieza]++;
    }

    var msg = "";
    var p, t;
    for (pieza = 0; pieza < PiezaSize; pieza++) {
        p = prob[pieza] / max * 100;
        p = Math.round(p * 100) / 100;

        switch (pieza) {
            case PiezaI: t = "I"; //larga de 4
                break;
            case PiezaJ: t = "J";
                break;
            case PiezaL: t = "L";
                break;
            case PiezaO: t = "O";
                break;      
            case PiezaS: t = "S";
                break;
            case PiezaZ: t = "Z";
                break;
            case PiezaT: t = "T";
                break;
            case Pieza6: t = "6"; //larga de 6
                break;
            case Pieza8: t = "8"; //larga de 8
                break;
            case Pieza10: t = "10"; //larga de 10
                break;
            case Pieza2: t = "2"; //pieza de dos puntos
                break;
            case Pieza3: t = "3"; //pieza de 3 puntos con esquina
                break;
            case PiezaP: t = "P";
                break;
        }
        msg += "Pieza " + t + " = " + p + "</br>";
    }

    //intervalo por velocidad
    msg += "</br>";
    var v, i;
    for (v = 0; v < VelocidadSize; v++)
    {
        i = Math.pow((VelocidadSize - v) / VelocidadSize, 2) * 2000;
        i = Math.round(i * 100) / 100;
        msg += "Velocidad " + v + " = " + i + "</br>";
    }

    divInfo.innerHTML = msg;
}

function RedimensionarNavegador() {
    IniciarPruebas(false);
}



//-------------------------------------------------------------------------------------
//funciones pantallas titulo, menu, opciones, cargando, final, (juego)

function IniciarDispositivo() {
    //Dispositivo = PC;
    //Dispositivo = Movil;

    if (Dispositivo == PC) {
        TecladoActivo = true;
        BotoneraActivo = false; //prueba botonera con raton
        TouchActivo = false;
        RatonActivo = true;
    }
    else if (Dispositivo == Movil) {
        TecladoActivo = false;
        BotoneraActivo = true;
        TouchActivo = true; 
        RatonActivo = false;
    }
}

function IniciarResolucion(inicio) {
    //NumeroJugadores = 1; //prueba!!!

    //tamaño del canvas normal, sin fondo
    if ((NumeroJugadores == 1) || inicio)
        Width = WidthNormal; //un jugador
    else if (NumeroJugadores == 2)
        Width = WidthNormal * 2 + SeparadorTablero2Jugadores; //espacio para dos jugadores
    Height = HeightNormal;

    //pantalla real escalada, donde se dibuja lo que haya en la pantalla oculta
    if (typeof RealCanvas == "undefined") {
        RealCanvas = document.getElementById("IdCanvas");
        RealCtx = RealCanvas.getContext("2d");
    }

    //pantalla oculta sin escalar, donde se dibuja todo al principio
    if (typeof Canvas == "undefined") {
        Canvas = document.createElement("canvas");
        Canvas.id = "IdCanvasOculto";
        Ctx = Canvas.getContext("2d");
    }

    var realWidth = getWidth(); //ancho real dispositivo
    var realHeight = getHeight();

    //calcula la escala
    //Escala = GetEscala();
    Escala = Math.min(realWidth / Width, realHeight / Height);
    RealCanvas.width = realWidth; //pone el canvas al 100% del dispositivo
    RealCanvas.height = realHeight;

    //mira si hay que añadir fondo horizontal o vertical
    var bHorizontal = (Math.min(realWidth / Width, realHeight / Height) != realWidth / Width);
    var bVertical = !bHorizontal;

    //si el canvas se pone en un pc, el ancho es mas grande que el ancho maximo del fondo
    if ((NumeroJugadores == 1) || inicio) {
        if (WidthFondo * Escala < RealCanvas.width) {
            //Escala = Math.min(Escala, realWidth / WidthFondo);
            RealCanvas.width = WidthFondo * Escala;
            //RealCanvas.height = HeightFondo * Escala;
            bHorizontal = true;
        }
        if (HeightFondo * Escala < RealCanvas.height) {
            //Escala = Math.min(Escala, realHeight / HeightFondo);
            //RealCanvas.width = WidthFondo * Escala;
            RealCanvas.height = HeightFondo * Escala;
            bVertical = true;
        }
    }

    var tamano; //lo que ocupa el trozo de fondo junto al contenido, para canvas sin escalar
    if (bHorizontal) { //añade fondo horizontal
        tamano = ((RealCanvas.width - WidthNormal * Escala) / 2) / Escala; //uso WidthNormal en vez de Width pq si hay 2 jugadores descuadra
		//posicion del fondo
		CanvasFondoPosicionX = Math.round((WidthFondo - WidthNormal) / 2 - tamano); //uso WidthNormal en vez de Width pq si hay 2 jugadores descuadra
		//posicion del contenido
		CanvasPosicionX = Math.round(tamano); 
		//dimensiona el canvas a 640x1094 mas el fondo
		Canvas.width = Math.round(Width + tamano * 2);
    }
    else {
        CanvasFondoPosicionX = Math.round((WidthFondo - WidthNormal) / 2); //uso WidthNormal en vez de Width pq si hay 2 jugadores descuadra
        CanvasPosicionX = 0;
        Canvas.width = Width;
    }
    if (bVertical) { //añade fondo vertical
        tamano = Math.round(((RealCanvas.height - Height * Escala) / 2) / Escala);
        //posicion del fondo
		CanvasFondoPosicionY = Math.round((HeightFondo - Height) / 2 - tamano);
        //posicion del contenido
		CanvasPosicionY = Math.round(tamano);
        //dimensiona el canvas a 640x1094 mas el fondo
		Canvas.height = Math.round(Height + tamano * 2);
    } else {
        CanvasFondoPosicionY = Math.round((HeightFondo - Height) / 2);
        CanvasPosicionY = 0;
        Canvas.height = Height;
    }

    if (CanvasFondoPosicionX < 0) {
        CanvasFondoPosicionX = 0;
    }
    if (CanvasFondoPosicionY < 0) {
        CanvasFondoPosicionY = 0;
    }
    if (CanvasPosicionX < 0)
        CanvasPosicionX = 0;
    if (CanvasPosicionY < 0)
        CanvasPosicionY = 0;

    if ((NumeroJugadores == 2) && !inicio) { //partida a dobles
        CanvasFondoPosicionX = 0; //uso WidthNormal en vez de Width pq si hay 2 jugadores descuadra
        CanvasPosicionX = 0;
        Canvas.width = Width;
    }

    //hacer el escalado sin suavizado (puede acelerar el escalado!!!)
    /*RealCtx["imageSmoothingEnabled"] = false;
    ["o", "ms", "moz", "webkit"].forEach(function (v) {
        RealCtx[v + "ImageSmoothingEnabled"] = false;
    });*/
}

function PantallaIniciarDefinirTeclas() {
    if (TecladoActivo) {
        //definir teclas globales
        PantallaDefinirTeclasGlobales[TeclaSalir] = 27; //escape
        PantallaDefinirTeclasGlobales[TeclaDebug] = 54; //6
    }
}

function PantallaIniciarGlobales() {
    //inicializa variables globales
    PantallaSalir = false;
    //Debug = true; //se define en la pantalla de prueba

    PantallaTiempoPartida = new Date(); //hora inicial partida
    SetTipoPartida(TipoPartidaSin); //sin partida
}

function CargarJSON(fichero, asincrono, funcion) {   
	//carga un archivo del proyecto
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', fichero, asincrono);
    xobj.onreadystatechange = function () {
		if ((this.readyState == 4) && (this.status == "200")) {
		    // Required use of an anonymous callback funcion as .open will NOT return a value but simply returns undefined in asynchronous mode
		    funcion(this.responseText);
		}
    };
    xobj.send(null);
}

function PantallaIniciarMensajes() {
    //strJSON recibe el contenido del fichero JSON
    if (MensajesGenerar) {
        Mensaje = new IdiomaMensaje();
        //var strJSON = JSON.stringify(Mensaje);
        //alert(strJSON);
    }
    else {
        //carga mensajes en ingles (en) desde fichero (hay que actualizar el fichero de vez en cuando)
        try {
            //hay que dar permisos a esta ruta (acceder desde localhost en IIS)
            //var ruta = 'http://localhost/blocksonline/mensajes/en.txt';
            var ruta = 'mensajes/en.txt'; //funciona en movil y PC
            CargarJSON(ruta, false, function (response) {
                //convierte el string JSON en un objeto
                Mensaje = JSON.parse(response);
            });
        }
        catch (e) {
            alert(e.message);
        }
    }
}

function IniciarMenuPrincipal() {
    //modo release -----------------------------------------++++++++++++++++++++++++++++++-------------------------------------------

    var bDebug = false;

    Juego = false; //estamos en las pantallas, no en el juego

    //solo si modo pruebas !!!
    if (document.getElementById("divPruebas").style["display"] == "block")
        document.getElementById("divPruebas").style["display"] = "none";
    if (document.getElementById("divCanvas").style["display"] = "none")
        document.getElementById("divCanvas").style["display"] = "block";

	//IniciarDispositivo(); //no se puede volver a ejecutar pq perderiamos parametros de prueba
	
    IniciarResolucion(true); //establece los dos canvas, uno invisible para pintar y otro escalado para mostrar

    PantallaIniciarDefinirTeclas(); //definir teclas de ambos jugadores para los menus

    if (DebugActivo && bDebug)
        alert("IniciarMenuPrincipal antes mensajes");

    PantallaIniciarMensajes(); //objeto multiidioma

    if (DebugActivo && bDebug)
        alert("IniciarMenuPrincipal despues mensajes");

    if (!PantallaRecursos) { //si no estan cargados los recursos
		//establece pantalla y define los elementos de la pantalla actual
		CargarPantalla(PantallaMenuCargando); //mostrar el logo del juego que ya tenemos cargado en un img del documento (idem con el fondo) !!!

		PantallaCargarRecursos();

		if (DebugActivo && bDebug)
		    alert("IniciarMenuPrincipal despues cargar recursos");

        //codigo asincrono para bucle de espera de carga recursos
        IntervaloBucleRecursos = setInterval(PantallaBucleCargaRecursos, FrecuenciaCargaRecursos); //lanza funcion carga de recursos cada 50 milisegs
    }
    else {
		//establece pantalla y define los elementos de la pantalla actual
		CargarPantalla(PantallaMenuPrincipal);

		ContinuarCargarPantalla();
	}
}

function ContinuarCargarPantalla() {

    var bDebug = false;

    if (DebugActivo && bDebug)
        alert("ContinuarCargarPantalla ini");

    //continua la carga de la pantalla, despues de los recursos
    PantallaIniciarCapturarEntrada(); //crea e inicializa los eventos de teclado, debe hacerse al comenzar la partida (depende do como organize la respuesta a los eventos en las diferentes pantallas)

    PantallaIniciarGlobales();

    //ocultar loading
    //document.getElementById("divCanvas").style["display"] = "block";

    if (typeof RequestAnimationFrame == "undefined")
        RequestAnimationFrame = new AnimationFrame();
    IntervaloBucleJuego = RequestAnimationFrame.request(PantallaBucleJuego);
}



//-------------------------------------------------------------------------------------
// funciones cargar recursos

function ModificarImagenAnimales() {
    var bDebug = false;

    //if (DebugActivo && bDebug)
    //    alert("ModificarImagenAnimales inicio");

    //sombrear animales
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = iAnimales.width;
    canvas.height = iAnimales.height;
    context.drawImage(iAnimales, 0, 0);
    var datosImg = context.getImageData(0, 0, canvas.width, canvas.height);
    var datos = datosImg.data;

    for (var i = 0; i < datos.length; i += 4) {
        var avg = (datos[i] + datos[i + 1] + datos[i + 2]) / 3;
        datos[i] = avg;     // red
        datos[i + 1] = avg; // green
        datos[i + 2] = avg; // blue
    }
    context.putImageData(datosImg, 0, 0);
    
    var datosAnimalesSombra = canvas.toDataURL();
    iAnimalesSombra = new Image();
    iAnimalesSombra.src = datosAnimalesSombra;
    canvas = null; context = null;

    if (DebugActivo && bDebug)
        alert("ModificarImagenAnimales fin");
}

function ModificarImagenMenu(iMenu) {
    var bDebug = false;

    //if (DebugActivo && bDebug)
    //    alert("ModificarImagenMenu inicio");

    //de un archivo sprite con imagenes para menus hacer un sprite de diferentes tamaños, cargar el archivo con codigo a mano y separar las imagenes en diferentes variables
    //meter iPausa, iMusicaOn, iMusicaOff, iSonidoOn, iSonidoOff
	var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
	var x, y, h, v;
	var i;
	for (i = 0; i < MenuSize; i++) {
	    switch (i) {
	        case 0:
	            x = 0;
	            y = 0;
	            h = SpritePausa;
	            v = SpritePausa;
	            canvas.width = h;
	            canvas.height = v;
	            context.drawImage(iMenu, x, y, h, v, 0, 0, h, v);
	            iPausa = new Image();
	            iPausa.src = canvas.toDataURL();
	            break;
	        case 1:
	            x = 64;
	            y = 0;
	            h = SpriteMusica;
	            v = SpriteMusica;
	            canvas.width = h;
	            canvas.height = v;
	            context.drawImage(iMenu, x, y, h, v, 0, 0, h, v);
	            iMusicaOn = new Image();
	            iMusicaOn.src = canvas.toDataURL();
	            break;
	        case 2:
	            x = 114;
	            y = 0;
	            h = SpriteMusica;
	            v = SpriteMusica;
	            canvas.width = h;
	            canvas.height = v;
	            context.drawImage(iMenu, x, y, h, v, 0, 0, h, v);
	            iMusicaOff = new Image();
	            iMusicaOff.src = canvas.toDataURL();
	            break;
	        case 3:
	            x = 164;
	            y = 0;
	            h = SpriteSonido;
	            v = SpriteSonido;
	            canvas.width = h;
	            canvas.height = v;
	            context.drawImage(iMenu, x, y, h, v, 0, 0, h, v);
	            iSonidoOn = new Image();
	            iSonidoOn.src = canvas.toDataURL();
	            break;
	        case 4:
	            x = 214;
	            y = 0;
	            h = SpriteSonido;
	            v = SpriteSonido;
	            canvas.width = h;
	            canvas.height = v;
	            context.drawImage(iMenu, x, y, h, v, 0, 0, h, v);
	            iSonidoOff = new Image();
	            iSonidoOff.src = canvas.toDataURL();
	            break;
	    }
	}
	canvas = null; context = null;

	if (DebugActivo && bDebug)
	    alert("ModificarImagenMenu fin");
}

function PantallaCargarImagenes() {
    //iLogoPpal = new Image();
    //iLogoPpal.src = "images/menu_principal_24.png"; //png24
    //RecursosTotal++;
    //iLogoPpal.onload = function () {
    //    RecursosCargados++;
    //}

    //iFondoPpal = new Image();
    //iFondoPpal.src = "images/menu_principal_fondo.png";
    //RecursosTotal++;
    //iFondoPpal.onload = function () {
    //    RecursosCargados++;
    //}

    iFondoMapa = new Image();
    iFondoMapa.src = "images/fondo_mapa.jpg";
    RecursosTotal++;
    iFondoMapa.onload = function () {
        RecursosCargados++;
    }

    iAnimales = new Image();
    iAnimales.src = "images/animal_mapa.png";
    RecursosTotal++;
    RecursosTotal++; //otro por la imagen modificada sombreada
    iAnimales.onload = function () {
        RecursosCargados++;
        ModificarImagenAnimales();
        RecursosCargados++;
    }

    iAvatares = new Image();
    iAvatares.src = "images/avatar.png";
    RecursosTotal++;
    iAvatares.onload = function () {
        RecursosCargados++;
    }
	
	var iMenu = new Image();
    iMenu.src = "images/menu_varios.png";
    RecursosTotal++;
    RecursosTotal++; //otra por la tarea de dividir el sprite
    iMenu.onload = function () {
        RecursosCargados++;
        ModificarImagenMenu(iMenu);
        RecursosCargados++;    }
}

function ImportarSonido(sonido) {
    var bDebug = false;

    var obj;
    if (Dispositivo == PC) {
        var extension = ".mp3";
        var carpeta = "sounds/";
        obj = new Audio();
        obj.src = carpeta + sonido + extension;
        //RecursosTotal++;
        AddEvent(obj, "canplaythrough", function () {
            RecursosCargados++;
            if (DebugActivo && bDebug)
                alert("ImportarSonido " + sonido);
        });
    }
    else if (Dispositivo == Movil) { //solo android !!!
        var extension = ".mp3";
        var carpeta = "/android_asset/www/sounds/";
        obj = new Media(carpeta + sonido + extension,
            function () {
                //RecursosCargados++;
                if (DebugActivo && bDebug)
                    alert("ImportarSonido " + sonido);
            },
            function (e) {
                var error = "PantallaImportarSonido: " + sonido + ", Audio Error: " + e.message;
                console.log(error);
                if (DebugActivo)
                    alert(error);
                AudioActivo = false;
            }
        );
    }
    return obj;
}

function ImportarMusica(sonido) {
    //http://ilee.co.uk/looping-audio-with-phonegap/

    var bDebug = false;

    var obj;
    if (Dispositivo == PC) {
        var extension = ".mp3";
        var carpeta = "sounds/";
        obj = new Audio();
        obj.src = carpeta + sonido + extension;
        //RecursosTotal++;
        AddEvent(obj, "canplaythrough", function () {
            RecursosCargados++;
            if (DebugActivo && bDebug)
                alert("ImportarSonido " + sonido);
        });
        AddEvent(obj, "ended", function () {
            this.currentTime = 0;
            this.play();
        });

    }
    else if (Dispositivo == Movil) { //solo android !!!
        var extension = ".mp3";
        var carpeta = "/android_asset/www/sounds/";
        obj = new Media(carpeta + sonido + extension,
            function () {
                //RecursosCargados++;
                if (DebugActivo && bDebug)
                    alert("ImportarSonido " + sonido);
            },
            function (e) {
                var error = "PantallaImportarMusica: " + sonido + ", Audio Error: " + e.message;
                console.log(error);
                if (DebugActivo)
                    alert(error);
                AudioActivo = false;
            },
            function onStatus(status) {
                if (status == Media.MEDIA_STOPPED) {
                    this.play();
                }
            }
        );
    }
    return obj;
}

function PantallaCargarSonidos() {
    AudioActivo = true;

    if (Dispositivo == PC) {
        var audio = document.createElement("audio");
        var soportaMp3;
        if (audio.canPlayType) {
            //canPlayType devuelve "", "maybe" o "probably"
            soportaMp3 = "" != audio.canPlayType("audio/mpeg");
        }
        else {
            soportaMp3 = false;
        }

        if (soportaMp3) {
            RecursosTotal++;
            setTimeout(function () {
                sAbrirPanel = ImportarSonido("abrir_panel");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sChoqueError = ImportarSonido("choque_error");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sCargandoPartida = ImportarSonido("cargando_partida");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                //Musica del menu
                sMusicaMenu = ImportarMusica("The_Normandy_Reborn");
            }, 0);
        }
        else {
            AudioActivo = false;
        }
    }

    else if (Dispositivo == Movil) { //solo android !!!
        sAbrirPanel = ImportarSonido("abrir_panel");
        sChoqueError = ImportarSonido("choque_error");
        sCargandoPartida = ImportarSonido("cargando_partida");
        sMusicaMenu = ImportarMusica("The_Normandy_Reborn");
    }
}

function PantallaCargarRecursos() {
    TiempoRecursos = new Date(); //tiempo en que empieza la carga de recursos
    RecursosTotal = 0;
    RecursosCargados = 0;
    PantallaCargarImagenes(); //se cargan asincronamente, termina cuando RecursosCargados sea RecursosTotal
    PantallaCargarSonidos(); //se podria hacer barra de progreso con 100 * RecursosCargados / RecursosTotal
}

function PantallaBucleCargaRecursos() {
    var bDebug = false;

	//actualizar y dibujar el estado de la carga
    PantallaActualizarCargando();

    PantallaDibujarElementos();

    //dibuja en canvas real
	Flip();

    //espera hasta que se haya cargado la ultima imagen/sonido, o hasta que pase el tiempo limite de carga de recursos
    var ahora = new Date();
    if ((RecursosCargados >= RecursosTotal) || (ahora.getTime() - TiempoRecursos.getTime() > PantallaIntervaloRecursos)) {
    //if ((ahora.getTime() - TiempoRecursos.getTime() > PantallaIntervaloRecursos)) {
        //termina bucle de espera carga recursos
        clearInterval(IntervaloBucleRecursos);

        if (DebugActivo && bDebug)
            alert("PantallaBucleCargaRecursos salir bucle");

        //error de carga
        if (DebugActivo)
            if (RecursosCargados < RecursosTotal)
                alert("Error de carga pantalla, sobrepasado limite " + Math.floor(PantallaIntervaloRecursos / 1000) + " segs");

        PantallaRecursos = true; //indica que estan cargados

        CargarPantalla(PantallaMenuPrincipal);

        //alert("RecursosCargados: " + RecursosCargados + ", RecursosTotal: " + RecursosTotal + ", tiempo pasado: " + (ahora.getTime() - TiempoRecursos.getTime()) + ", PantallaIntervaloRecursos: " + PantallaIntervaloRecursos);

        ContinuarCargarPantalla();
    }
}


			
//-------------------------------------------------------------------------------------
//funciones salida sonora

function PonerSonido(sonido) {
    if (AudioActivo)
        if (SonidoActivo)
            if (typeof sonido != "undefined")
                sonido.play();
}

function PonerMusica(sonido) {
    if (AudioActivo)
        if (MusicaActivo)
            if (!MusicaSonando) //hay que parar la musica anterior
                if (typeof sonido != "undefined") {
                    MusicaActual = sonido;
                    sonido.play();
                    MusicaSonando = true;
                }
}

function PararMusica() {
    if (MusicaSonando)
        if (typeof MusicaActual != "undefined") {
            MusicaActual.pause();
            MusicaSonando = false;
        }
}

function ReanudarMusica() {
    if (AudioActivo)
        if (!MusicaSonando)
            if (typeof MusicaActual != "undefined") {
                MusicaActual.play();
                MusicaSonando = true;
            }
}



//-------------------------------------------------------------------------------------
//funciones definir pantallas

function DefinirBoton(x, y, h, v, texto, funcion, arg1) {
    PantallaDefinirBotones.push(new Boton());
    var boton = PantallaDefinirBotones.length - 1;
    PantallaDefinirBotones[boton].Set(x + CanvasPosicionX, y + CanvasPosicionY, h, v, texto, funcion, arg1);
}

function DefinirBotonMapa(x, y, h, v, texto, funcion, arg1) {
    //mapa no usa el canvasPosicionX
    PantallaDefinirBotones.push(new Boton());
    var boton = PantallaDefinirBotones.length - 1;
    PantallaDefinirBotones[boton].Set(x, y + CanvasPosicionY, h, v, texto, funcion, arg1);
}

function DefinirBotonImagen(x, y, h, v, spriteH, spriteV, imagen, funcion, arg1) {
    PantallaDefinirBotonesImagen.push(new BotonImagen());
    var boton = PantallaDefinirBotonesImagen.length - 1;
    PantallaDefinirBotonesImagen[boton].Set(x + CanvasPosicionX, y + CanvasPosicionY, h, v, spriteH, spriteV, imagen, funcion, arg1);
}

function DefinirBotonCircular(x, y, r, spriteH, spriteV, imagen, funcion, arg1) {
    //se define el centro y radio del boton, con el se forma el circulo en el que pulsar
    PantallaDefinirBotonesCircular.push(new BotonCircular());
    var boton = PantallaDefinirBotonesCircular.length - 1;
    PantallaDefinirBotonesCircular[boton].Set(x + CanvasPosicionX, y + CanvasPosicionY, r, spriteH, spriteV, imagen, funcion, arg1);
}

function DefinirBotonCircularMapa(x, y, r, spriteH, spriteV, imagen, funcion, arg1) {
    //mapa no usa el canvasPosicionX
    PantallaDefinirBotonesCircular.push(new BotonCircular());
    var boton = PantallaDefinirBotonesCircular.length - 1;
    PantallaDefinirBotonesCircular[boton].Set(x, y + CanvasPosicionY, r, spriteH, spriteV, imagen, funcion, arg1); 
}

function QuitarBotonResaltado() {
    PantallaDefinirBotonesResaltado = new Array();
}

function DefinirBotonResaltado(x, y, h, v, estilo) {
    PantallaDefinirBotonesResaltado.push(new BotonResaltado());
    var boton = PantallaDefinirBotonesResaltado.length - 1;
    PantallaDefinirBotonesResaltado[boton].Set(x + CanvasPosicionX, y + CanvasPosicionY, h, v, estilo);
}

function ModificarBotonResaltado(x, y, h, v, estilo) {
    //no pone el canvas porque ya viene en las coordenadas dadas
    PantallaDefinirBotonesResaltado.push(new BotonResaltado());
    var boton = PantallaDefinirBotonesResaltado.length - 1;
    PantallaDefinirBotonesResaltado[boton].Set(x, y, h, v, estilo);
}

function DefinirImagen(x, y, h, v, spriteH, spriteV, imagen) {
    PantallaDefinirImagenes.push(new BotonImagen());
    var boton = PantallaDefinirImagenes.length - 1;
    PantallaDefinirImagenes[boton].Set(x + CanvasPosicionX, y + CanvasPosicionY, h, v, spriteH, spriteV, imagen);
}

function DefinirEtiqueta(x, y, h, v, texto, estilo, color, fondo) {
    PantallaDefinirEtiquetas.push(new Etiqueta());
    var etiqueta = PantallaDefinirEtiquetas.length - 1;
    PantallaDefinirEtiquetas[etiqueta].Set(x + CanvasPosicionX, y + CanvasPosicionY, h, v, texto, estilo, color, fondo);
}

function DefinirEtiquetaMapa(x, y, h, v, texto, estilo, color, fondo) {
    //mapa no usa el canvasPosicionX
    PantallaDefinirEtiquetas.push(new Etiqueta());
    var etiqueta = PantallaDefinirEtiquetas.length - 1;
    PantallaDefinirEtiquetas[etiqueta].Set(x, y + CanvasPosicionY, h, v, texto, estilo, color, fondo);
}

function DefinirTexto(xc, x, yc, y, h, v, texto) {
    //xc es la pos x del canvas
    PantallaDefinirTextos.push(new Texto());
    var pos = PantallaDefinirTextos.length - 1;
    PantallaDefinirTextos[pos].Set(x, y, x + h, y + v, texto);

    var ctr = document.getElementById(texto);
    if (ctr != null) {
        var xr, yr, hr, vr; //canvas real con escala
        xr = (x + CanvasPosicionX) * Escala + xc;
        yr = (y + CanvasPosicionY) * Escala + yc;
        hr = h * Escala;
        vr = v * Escala;
        ctr.style.left = xr + "px";
        ctr.style.top = yr + "px";
        ctr.style.width = hr + "px";
        ctr.style.height = vr + "px";
        ctr.style["display"] = "block";
    }
}

function GetPosicionAvatar(fase) {
    var posicion = new Coordenadas();
    var r = PantallaDefinirBotonesCircular[fase].r;
    posicion.x = PantallaDefinirBotonesCircular[fase].x - r + AvatarSeparador.x;
    posicion.y = PantallaDefinirBotonesCircular[fase].y + AvatarSeparador.y;
    return posicion;
}

function PonerMapaScrollAvatar() {
    //mover scroll a la posicion del avatar
    PantallaMapaScrollX = Math.round(AvatarPosicion.x - Width / 2);

    PonerMapaScrollLimites();
}

function PonerMapaScrollLimites() {
    var max = iFondoMapa.width - Canvas.width; //limite de scroll
    if (PantallaMapaScrollX > max)
        PantallaMapaScrollX = max;
    if (PantallaMapaScrollX < 0)
        PantallaMapaScrollX = 0;
}

function CargarPantalla(pantalla) {
    //establece pantalla y define los elementos de la pantalla actual --------------------------++++++++++++++++++--------------------------

    //alert("pantalla " + pantalla);

    var pantallaAnterior = Pantalla;
    var pantallaAnteriorAntes = PantallaAnterior;
    //guardar pantallas anteriores en array y asociar a boton back para regresar !!!
    Pantalla = pantalla;

    //salir de mapa, una pantalla con eventos scroll que hay que quitar
    if ((pantallaAnterior == PantallaHistoriaMapa) && (Pantalla != pantallaAnterior)) {
        //eliminar evento mousemove/touchmove (se pone solo cuando se necesita, es costoso tenerlo activo)
        if (TouchActivo) {
            RemoveEvent(RealCanvas, "touchmove", PantallaCapturarTouchMove)
        }
        if (RatonActivo) {
            RemoveEvent(RealCanvas, "mousemove", PantallaCapturarMouseMove)
        }
    }

    //salir de avatar con cuadro de texto nombre, ocultar cuadros de textos
    var i;
    var ctr;
    if ((pantallaAnterior == PantallaHistoriaAvatar) && (Pantalla != pantallaAnterior)) {
        for (i = 0; i < PantallaDefinirTextos.length; i++) {
            ctr = document.getElementById(PantallaDefinirTextos[i].texto);
            if (ctr != null) {
                ctr.style["display"] = "none";
            }
        }
    }

    //salir de mapa, ocultar el banner superior
    if ((pantallaAnterior == PantallaHistoriaMapa) && (Pantalla != pantallaAnterior)) {
        if (Dispositivo == Movil)
            if (PublicidadActivo) {
                DibujarAdmob(false); //ocultar
                Banner = false;
            }
    }

    //salir de pantalla a dobles
    if (Dispositivo == PC)
        if (TipoPartida == TipoPartidaPCDobles) //cuando cambiase la resolucion
            if ((pantallaAnterior == PantallaJuegoPartida) || (pantallaAnterior == PantallaJuegoResultadoPartida)) {
                IniciarResolucion(true); //true para que quite resolucion dobles
            }

    PantallaDefinirBotones = new Array();
    PantallaDefinirBotonesImagen = new Array();
    PantallaDefinirBotonesCircular = new Array();
    PantallaDefinirBotonesResaltado = new Array();
	PantallaDefinirImagenes = new Array();
    PantallaDefinirEtiquetas = new Array();
    PantallaDefinirTextos = new Array();

    var x, y, h, v, s, r, msg;
    var sh = 50; //sh es margen horizontal de la pantalla (separador horizontal)
    var vb = 50; //vb es la altura de los botones (vertical boton)
    var x2, y2, h2, v2, s2;
	var estiloEtiqueta = "bold 20px Arial", colorEtiqueta = "rgb(255,255,255)", fondoEtiqueta = "rgb(66,66,66)"; //estilo tipico de las etiquetas con fondo
    //TAMAÑO PANTALLA 640x960

    switch (Pantalla) {
        case PantallaMenuCargando:
            PantallaAnterior = PantallaSinPantalla;

			msg = Mensaje.Cargando;
            y = 400; //debajo del logo
            h = Ctx.measureText(msg).width + 150;
            if (h > Width - sh * 2)
                h = Width - sh * 2;
            x = Math.round(Width / 2 - h / 2); //centrado
            v = vb;
            DefinirEtiqueta(x, y, h, v, msg, estiloEtiqueta, colorEtiqueta, fondoEtiqueta);
            s = 100;
            y += s;

            msg = RecursosCargados + "/" + RecursosTotal;
            h = Ctx.measureText(msg).width + 100;
            if (h > Width - sh * 2)
                h = Width - sh * 2;
            x = Math.round(Width / 2 - h / 2); //centrado
            v = vb;
            DefinirEtiqueta(x, y, h, v, msg, estiloEtiqueta, colorEtiqueta, fondoEtiqueta);
            DefinirEtiquetaCargando = 1; //id de la etiqueta cargando, para actualizarla durante la carga

            PosicionLogoPpalCargandoX = CanvasPosicionX;
            PosicionLogoPpalCargandoY = CanvasPosicionY;
            break;
			
        case PantallaMenuPrincipal:
            PantallaAnterior = PantallaMenuPrincipal;

            PonerMusica(sMusicaMenu); //musica del menu

            x = sh;
            y = 400;
            h = Width - sh * 2;
            v = vb;
            s = 20;

            DefinirEtiqueta(x, y, h, v, Mensaje.MenuPrincipal, estiloEtiqueta, colorEtiqueta, fondoEtiqueta);
            y += v + s * 2;

            DefinirBoton(x, y, h, v, Mensaje.Historia, "PulsarHistoriaPartidas", "");
            y += v + s;
            DefinirBoton(x, y, h, v, Mensaje.Multijugador, "PulsarMultijugador", "");
            y += v + s;
            DefinirBoton(x, y, h, v, Mensaje.Maraton, "PulsarMaraton", "");
            y += v + s;
            DefinirBoton(x, y, h, v, Mensaje.Tutorial, "PulsarTutorial", "");
            y += v + s;
            DefinirBoton(x, y, h, v, Mensaje.Opciones, "PulsarOpciones", "");

            PosicionLogoPpalX = CanvasPosicionX;
            PosicionLogoPpalY = CanvasPosicionY;
            break;

        case PantallaHistoriaPartidas:
            PantallaAnterior = PantallaMenuPrincipal;
			
			CargarPartidas();

            x = sh;
            y = 200;
            h = Width - sh * 2;
            v = vb;
            s = 20;

            DefinirEtiqueta(x, y, h, v, Mensaje.Historia, estiloEtiqueta, colorEtiqueta, fondoEtiqueta);
            y += v + s * 2;

            h = 320 - sh - s;
            x2 = 320; //posicion de los botones
            h2 = Width - (320 + sh * 2 + s);

            //ver si hay scroll
			var maxPanelPartidas = 500;
			if (Partidas.length * (v+s) > maxPanelPartidas) {
				PantallaPartidasScroll = true;
			}
			else
				PantallaPartidasScroll = false;
			
            //botones de scroll page up down !!!
            //if (PantallaPartidasScroll)

			//muestra partidas guardadas
			var p;
			for (p = 0; p < Partidas.length; p++) {		
				//var idPartida = p + 1;
				DefinirEtiqueta(x, y, h, v, Partidas[p].Nombre, estiloEtiqueta, colorEtiqueta, fondoEtiqueta);
				DefinirBoton(x2, y, h2, v, Mensaje.ContinuarPartida, "PulsarContinuarPartida", p);
				y += v + s;
			}
			
            y += v + s;
            x = sh;
            h = Width - sh * 2; //posicion fija
            DefinirBoton(x, y, h, v, Mensaje.NuevaPartida, "PulsarNuevaPartida", "");
            break;
			
		case PantallaHistoriaAvatar:
		    PantallaAnterior = PantallaHistoriaPartidas;

			//etiqueta nombre avatar
            x = sh;
            y = 200;
            h = 200;
            v = vb;
            DefinirEtiqueta(x, y, h, v, Mensaje.NombreAvatar, estiloEtiqueta, colorEtiqueta, fondoEtiqueta);
		
		    //poner cuadro de texto nombre
            x += h + sh;
            //y = 200;
            h = Width - x - sh;
            v = vb - 10;
            var xc = RealCanvas.offsetLeft; //x del canvas (para posicionarse)
            var yc = RealCanvas.offsetTop;
            DefinirTexto(xc, x, yc, y, h, v, "txtNombre");

            //poner el valor por defecto al cuadro texto
            if (document.getElementById(PantallaDefinirTextos[0].texto) != null)
                document.getElementById(PantallaDefinirTextos[0].texto).value = Mensaje.NombreAvatarInicial;
		
		    //pone todos los avatares 
            //falta ver cuales estan bloqueados (se consiguen al acabar modo historia o hacer logros)!!!
            y += vb * 2;
            h = Math.round(SpriteAvatar * 0.42);
            v = Math.round(SpriteAvatar * 0.42);
            var inicialX = sh + (Width - (h * 4 + sh * 2)) / 2; //centro los avatares
            x = inicialX;
            var MaxX = 4;
            var avatar;
            for (avatar = 0; avatar < AvatarSize; avatar++) {
                DefinirBotonImagen(x, y, h, v, SpriteAvatar, SpriteAvatar, "iAvatares", "PulsarAvatar", avatar);

                //avatar elegido
                //if (avatar == Partidas[PartidaActual].Avatar) {
                if (avatar == PartidaNueva.Avatar) {
                        DefinirBotonResaltado(x, y, h, v, PantallaBotonResaltadoAvatarEstilo);
                }

                x = x + h;
                if(avatar % MaxX == MaxX - 1) {
                    x = inicialX;
                    y = y + v;
                }
            }

            //boton continuar
            x = sh;
            y += vb;
            h = Width - sh * 2;
            v = vb;			
            DefinirBoton(x, y, h, v, Mensaje.EmpezarPartida, "PulsarEmpezarPartida", "");
            break;
			
        case PantallaHistoriaMapa:
            PantallaAnterior = PantallaHistoriaPartidas;

            //poner banner Admob
            if (Dispositivo == Movil)
                if (PublicidadActivo) {
                    if (!CrearBanner) {
                        CrearAdmob(Admob_BANNER, Admob_Banner_Superior_Mapa_Android, true, DebugActivo); //true = banner se pone arriba 
                        CrearBanner = true;
                    }
                    DibujarAdmob(true); //mostrar
                    Banner = true;

                    //rect = RealCanvas.getBoundingClientRect();
                    //alert(rect.left + "x" + rect.top + "," + rect.right + "x" + rect.bottom + "," + rect.left + " - " + RealCanvas.width + "x" + RealCanvas.height);
                    //bodyRect = document.body.getBoundingClientRect();
                    //alert(bodyRect.left + "x" + bodyRect.top + "," + bodyRect.right + "x" + bodyRect.bottom + " - " + document.body.clientWidth + "x" + document.body.clientHeight);
                }

            var img = "iAnimales";
            var idAnimal = 0;
            var sH, sV;
            sH = SpriteAnimal;
            sV = SpriteAnimal;

            r = 50; //tamaño animales
            //el +100 es para bajar los animales -\/
            DefinirBotonCircularMapa(1250, 805 + 100, r, sH, sV, img, "PulsarMapaAnimal", idAnimal++); //raton
            DefinirBotonCircularMapa(1105, 585 + 100, r, sH, sV, img, "PulsarMapaAnimal", idAnimal++); //topo
            DefinirBotonCircularMapa(835, 585 + 100, r, sH, sV, img, "PulsarMapaAnimal", idAnimal++);
            DefinirBotonCircularMapa(560, 585 + 100, r, sH, sV, img, "PulsarMapaAnimal", idAnimal++);
            DefinirBotonCircularMapa(280, 585 + 100, r, sH, sV, img, "PulsarMapaAnimal", idAnimal++);
            DefinirBotonCircularMapa(280, 300 + 100, r, sH, sV, img, "PulsarMapaAnimal", idAnimal++);
            DefinirBotonCircularMapa(560, 300 + 100, r, sH, sV, img, "PulsarMapaAnimal", idAnimal++);
            DefinirBotonCircularMapa(835, 300 + 100, r, sH, sV, img, "PulsarMapaAnimal", idAnimal++);
            DefinirBotonCircularMapa(1105, 300 + 100, r, sH, sV, img, "PulsarMapaAnimal", idAnimal++);
            r = 70; //jefe mas grande
            DefinirBotonCircularMapa(1385, 250 + 100, r, sH, sV, img, "PulsarMapaAnimal", idAnimal++);

            //poner el avatar a la izquierda del animal
            AvatarPosicion = GetPosicionAvatar(Partidas[PartidaActual].FaseActual);
            AnimacionAvatarMover = false;

            //mover el avatar
            if (Partidas[PartidaActual].GanarFase) {
                //solo si se abre una nueva fase, mover de fase anterior a fase nueva
                if (SiguienteFase(Partidas[PartidaActual].FaseActual) > Partidas[PartidaActual].FaseUltima) {
                    AnimacionAvatarMover = true;
                    AvatarMoverOrigen = GetPosicionAvatar(Partidas[PartidaActual].FaseActual);
                    AvatarMoverDestino = GetPosicionAvatar(SiguienteFase(Partidas[PartidaActual].FaseActual));
                }
                //aumenta la fase actual y ultima
                Partidas[PartidaActual].FaseActual = SiguienteFase(Partidas[PartidaActual].FaseActual);
                if (Partidas[PartidaActual].FaseActual > Partidas[PartidaActual].FaseUltima) 
                    Partidas[PartidaActual].FaseUltima = Partidas[PartidaActual].FaseActual;
                Partidas[PartidaActual].GanarFase = false;
            }

            //el animal actual (la siguiente fase) aparece resaltado, con animacion agrandar-encojer
			AnimacionAnimalUltimo = true;
			AnimalUltimoEscala = 1;
			AnimalUltimoCrece = true;
			
            //debajo de cada animal poner el resultado del marcador
			var fase, msg, encuentro;
			var estiloResultado = "Bold 16px Arial";
			var colorResultado = "rgb(0,0,0)";
			var fondoResultado = "";
			s = 15; //separador
			//va de la primera fase del mundo a la ultima del mundo actual
			var faseIni = Partidas[PartidaActual].MundoActual * FasesMundo;
			var faseFin = faseIni + FasesMundo;
            for(fase = faseIni; fase < faseFin; fase++) {
				encuentro = Partidas[PartidaActual].ResultadosFases[fase].EncuentroActual; //deberia ser el mejor encuentro pero no se ha calculado !!!
				if (encuentro != EncuentroSin) { //los que no se han jugado no tienen ningun resultado
					msg = Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].ResultadoAvatar + " - " + Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].ResultadoOponente;
					x = PantallaDefinirBotonesCircular[fase].x - Ctx.measureText(msg).width / 2; //esta centrado
					y = PantallaDefinirBotonesCircular[fase].y + PantallaDefinirBotonesCircular[fase].r + s; //debajo del animal
					h = Ctx.measureText(msg).width;
					v = 30;
					DefinirEtiquetaMapa(x, y, h, v, msg, estiloResultado, colorResultado, fondoResultado);
				}
			}

            //posicion scroll
            PonerMapaScrollAvatar();

            //inicializa scroll
            PantallaMapaScrollXMover = 0; //scroll sin movimiento
            PantallaMapaScrollXTouchInicio = 0;
            PantallaMapaScrollXInicio = PantallaMapaScrollX;

            //falta cargar el mapa del mundo actual!!!
			
			//boton jugar (la fase ultima)
            h = Ctx.measureText(Mensaje.MapaJugar).width + 100;
            x = Math.round(Canvas.width / 2 - h / 2); //centrado
            //var height = Height;
            //if (Banner)
            //    height = Math.round(Height - BannerH / Escala);
            //y = height - 100;
            y = Height - 100;
            v = vb;
			DefinirBotonMapa(x, y, h, v, Mensaje.MapaJugar, "PulsarMapaJugar", "");

            //crear evento mousemove/touchmove (se pone solo cuando se necesita, es costoso tenerlo activo)
            if (TouchActivo) {
                AddEvent(RealCanvas, "touchmove", PantallaCapturarTouchMove)
            }
            if (RatonActivo) {
                AddEvent(RealCanvas, "mousemove", PantallaCapturarMouseMove)
            }
            break;
			
		case PantallaOpciones:
			PantallaAnterior = pantallaAnterior;
			
            x = sh;
            y = 200;
            h = Width - sh * 2;
            v = vb;
            s = 20;

			msg = Mensaje.Opciones;
            DefinirEtiqueta(x, y, h, v, msg, estiloEtiqueta, colorEtiqueta, fondoEtiqueta);
            y += v + s * 2;

			h2 = Width - sh * 3 - s;
			x2 = Width - sh * 2;
            DefinirBoton(x, y, h2, v, Mensaje.Musica, "PulsarOpcionesMusica", "");
			if (MusicaActivo)
				img = "iMusicaOn";
			else
				img = "iMusicaOff";
			DefinirImagen(x2, y, SpriteMusica, SpriteMusica, SpriteMusica, SpriteMusica, img); //a la derecha del boton poner imagen de musica on/off
			PosicionMusica = 0;
            y += v + s;
			
            DefinirBoton(x, y, h2, v, Mensaje.Sonido, "PulsarOpcionesSonido", "");
			if (SonidoActivo)
				img = "iSonidoOn";
			else
				img = "iSonidoOff";
			DefinirImagen(x2, y, SpriteSonido, SpriteSonido, SpriteSonido, SpriteSonido, img); //a la derecha del boton poner imagen de sonido on/off
			PosicionSonido = 1;
            y += v + s;
			
            DefinirBoton(x, y, h, v, Mensaje.Idioma, "PulsarOpcionesIdioma", ""); //combo
            y += v + s;
            DefinirBoton(x, y, h, v, Mensaje.Sincronizacion, "PulsarOpcionesSincronizacion", "");
            y += v + s;
            DefinirBoton(x, y, h, v, Mensaje.Controles, "PulsarOpcionesControles", ""); //elegir entre los 3: botones normal, profesional o touch directo
            y += v + s;
            DefinirBoton(x, y, h, v, Mensaje.Partidas, "PulsarOpcionesPartidas", ""); //borrar partidas
            y += v + s;
			break;			

        case PantallaJuegoCargando:
            PantallaAnterior = pantallaAnterior; //desde que opcion de menu viene

            msg = Mensaje.Cargando;
            h = Ctx.measureText(msg).width + 150;
            if (h > Width - sh * 2)
                h = Width - sh * 2;
            x = Math.round(Width / 2 - h / 2); //centrado
            y = 400; //debajo del oponente enfrentado al avatar
            v = vb;
            DefinirEtiqueta(x, y, h, v, msg, estiloEtiqueta, colorEtiqueta, fondoEtiqueta);
            s = 100;
            y += s;

            msg = RecursosCargados + "/" + RecursosTotal;
            h = Ctx.measureText(msg).width + 100;
            if (h > Width - sh * 2)
                h = Width - sh * 2;
            x = Math.round(Width / 2 - h / 2); //centrado
            v = vb;
            DefinirEtiqueta(x, y, h, v, msg, estiloEtiqueta, colorEtiqueta, fondoEtiqueta);
            DefinirEtiquetaCargando = 1; //id de la etiqueta cargando, para actualizarla durante la carga
            break;
			
        case PantallaJuegoPartida:
            PantallaAnterior = pantallaAnteriorAntes; //desde que opcion de menu viene (evitar loading)

            //definir boton pausa
            x = Width - SpritePausa - 20;
            y = 0;
            h = SpritePausa;
            v = SpritePausa;
            DefinirBotonImagen(x, y, h, v, SpritePausa, SpritePausa, "iPausa", "PulsarPausa", 0);
            break;

        case PantallaJuegoResultadoPartida:

            msg = Mensaje.Resultado;
            h = Ctx.measureText(msg).width + 150;
            if (h > Width - sh * 2)
                h = Width - sh * 2;
            x = Math.round(Width / 2 - h / 2); //centrado
            y = 50; //arriba
            v = vb;
            DefinirEtiqueta(x, y, h, v, msg, estiloEtiqueta, colorEtiqueta, fondoEtiqueta);

            //definir boton continuar	
            x = sh;
            y = Height - vb * 2;
            h = Width - sh * 2;
            v = vb;
            DefinirBoton(x, y, h, v, Mensaje.ResultadoContinuar, "PulsarResultadoContinuar", "");
			
			//inicializa variables animaciones
			ResultadoMarcadorEscala = ResultadoMarcadorEscalaInicio;
			ResultadoMarcadorTiempo = new Date();
            break;

    }

    //alert("fin pantalla " + Pantalla);
}



//-------------------------------------------------------------------------------------
//funciones eventos pantallas

function PantallaSonidoBoton() {
    //sonido por pulsar un boton correcto
    PonerSonido(sAbrirPanel);
}

function PantallaSonidoError() {
    //sonido por pulsar un boton de error o aun no implementado
    PonerSonido(sChoqueError);
}

function PulsarMultijugador() {
    if (Dispositivo == PC) {
        PantallaSonidoBoton();

        NumeroJugadores = 2;
        SetTipoPartida(TipoPartidaPCDobles);

        PantallaSalir = true;
        PantallaVerSalir();

        //inicia el juego (Principal_Juego.js)
        IniciarJuego();
    }
    else {
        PantallaSonidoError();
    }
}

function PulsarMaraton() {
    PantallaSonidoBoton();

    NumeroJugadores = 1;
    SetTipoPartida(TipoPartidaMaraton);

    PantallaSalir = true;
    PantallaVerSalir();

    //inicia el juego (Principal_Juego.js)
    IniciarJuego();
}

function PulsarTutorial() {
    PantallaSonidoError();
}

function PulsarOpciones() {
    PantallaSonidoBoton();
	
	//establece pantalla y define los elementos de la pantalla actual
    CargarPantalla(PantallaOpciones);
}

function PulsarOpcionesMusica() {
    PantallaSonidoBoton();
   
    MusicaActivo = !MusicaActivo;
    if (MusicaActivo)
        ReanudarMusica();
    else
        PararMusica();

    PantallaActualizarOpciones();
}

function PulsarOpcionesSonido() {
    PantallaSonidoBoton();
   
	SonidoActivo = !SonidoActivo;
	PantallaActualizarOpciones();
}

function PulsarOpcionesIdioma() {
    PantallaSonidoError();
}

function PulsarOpcionesSincronizacion() {
    PantallaSonidoError();
}

function PulsarOpcionesControles() {
    PantallaSonidoError();
}

function PulsarOpcionesPartidas() {
    PantallaSonidoError();
}

function PulsarHistoriaPartidas() {
    PantallaSonidoBoton();

    SetFase(); //configura el modo historia: Novedad, AtaqueRecibido, MensajeFase

    //establece pantalla y define los elementos de la pantalla actual
    CargarPantalla(PantallaHistoriaPartidas);
}

function PulsarContinuarPartida(idPartida) {
    //PantallaSonidoError();
    //alert("Continuar Partida " + idPartida);
	
    PantallaSonidoBoton();
	CargarPartida(idPartida);
	
    //establece pantalla y define los elementos de la pantalla actual
    CargarPantalla(PantallaHistoriaMapa);	
}

function PulsarNuevaPartida() {
    PantallaSonidoBoton();

    NuevaPartida(); //se crea provisionalmente en una variable
	
    //establece pantalla y define los elementos de la pantalla actual
    CargarPantalla(PantallaHistoriaAvatar);
}

function PulsarEmpezarPartida() {
    //validar nombre y avatar
    var msg = ValidarPartida();
    if (msg == "")
    {
        PantallaSonidoBoton();

        CrearNuevaPartida(); //añade la partida provisional a la lista de partidas
        //guardar nombre partida
        if(document.getElementById(PantallaDefinirTextos[0].texto) != null) {
            Partidas[PartidaActual].Nombre = document.getElementById(PantallaDefinirTextos[0].texto).value;
        }
        GuardarPartidas();

        //establece pantalla y define los elementos de la pantalla actual
        CargarPantalla(PantallaHistoriaMapa);
    }
    else {
        PantallaSonidoError();
        //PantallaDefinirEtiquetas[1].texto = msg; //no creo la etiqueta pq ocupa espacio
        alert(msg); //mensaje de error para el usuario
    }
}

function PulsarAvatar(idAvatar) {
	//elegir el avatar de la partida
    PantallaSonidoBoton();

    //Partidas[PartidaActual].Avatar = idAvatar;
    NuevaPartida.Avatar = idAvatar;

    //resalta el elemento seleccionado
    QuitarBotonResaltado();
    ModificarBotonResaltado(PantallaDefinirBotonesImagen[idAvatar].x, PantallaDefinirBotonesImagen[idAvatar].y,
        PantallaDefinirBotonesImagen[idAvatar].h, PantallaDefinirBotonesImagen[idAvatar].v, PantallaBotonResaltadoAvatarEstilo);
}

function PulsarMapaAnimal(idAnimal) {
    if (idAnimal > Partidas[PartidaActual].FaseUltima) {
        PantallaSonidoError();
    }
    else {
        PantallaSonidoBoton();
        //alert("Fase Animal " + idAnimal);

        NumeroJugadores = 1;
        SetTipoPartida(TipoPartidaOponenteIA);

        Partidas[PartidaActual].FaseActual = idAnimal;
        Partidas[PartidaActual].MundoActual = GetMundoFase(idAnimal);
        Oponente = new OponenteIA();
        OponenteIASetNivel(idAnimal);

        PantallaSalir = true;
        PantallaVerSalir();

        IniciarModoHistoriaEncuentro(); //crea encuentro y resultado

        //inicia el juego (Principal_Juego.js)
        IniciarJuego();
    }
}

function PulsarMapaJugar() {
	//juega la fase siguiente (fase ultima)
    //alert("jugar fase ultima"); 

    PantallaSonidoBoton();
    //alert("Fase Animal " + idAnimal);

    NumeroJugadores = 1;
    SetTipoPartida(TipoPartidaOponenteIA);

    Partidas[PartidaActual].FaseActual = Partidas[PartidaActual].FaseUltima;
    Partidas[PartidaActual].MundoActual = GetMundoFase(Partidas[PartidaActual].FaseUltima);
    Oponente = new OponenteIA();
    OponenteIASetNivel(Partidas[PartidaActual].FaseUltima);

    PantallaSalir = true;
    PantallaVerSalir();

    IniciarModoHistoriaEncuentro(); //crea encuentro y resultado

    //inicia el juego (Principal_Juego.js)
    IniciarJuego();

}

function PulsarBotonAtras() {
    if (Pantalla == PantallaMenuPrincipal) {
        if (Dispositivo == Movil) {
            GuardarPartidas();
            navigator.app.exitApp(); //salir de la app
        }
    }
    else if (Juego) {
        GuardarPartidas();
        Salir = true; //volver al menu
        VerSalir(); //salir de bucle juego
        CargarPantalla(PantallaAnterior); //pantalla anterior en el menu
        ContinuarCargarPantalla(); //iniciar bucle pantalla
        //IniciarMenuPrincipal();
    }
    else {
        //if (Pantalla != PantallaHistoriaAvatar) //si estas creando un avatar y cancelas no lo guarda
        //    GuardarPartidas();
        //guardo siempre porque las partidas en creacion en PantallaHistoriaAvatar no se guardan hasta que estan creadas
        GuardarPartidas(); 
        CargarPantalla(PantallaAnterior); //pantalla anterior en el menu
        //donde se cambia Juego = false ???
    }
    //navigator.app.backHistory();
}



//-------------------------------------------------------------------------------------
//funciones modo historia

function GetFaseNovedad(fase, novedad) {
    var n = FaseNovedad[fase];
    if (n | novedad)
        return true;
    else
        return false;
}

function GetFaseAtaqueRecibido(fase, ataque) {
    var n = FaseAtaqueRecibido[fase];
    if (n | ataque)
        return true;
    else
        return false;
}

function GetMundoFase(fase) {
    var mundo = Math.floor(fase / FasesMundo);
    return mundo;
}

function SetFase() {
    if (FaseNovedad.length == 0) {

        //en que fase comienza cada novedad
        var novedadComienza = new Array(NovedadSize);
        var novedad = 0;
        novedadComienza[novedad++] = 0; //NovedadAtaques, fase 1
        novedadComienza[novedad++] = 2; //NovedadPiezaP, fase 3
        novedadComienza[novedad++] = 3; //NovedadPiezaPAtacar, fase 4
        novedadComienza[novedad++] = 4; //NovedadPiezaPBlancas, fase 5
        novedadComienza[novedad++] = 6; //NovedadPieza6, fase 7
        novedadComienza[novedad++] = 8; //NovedadPieza8, fase 9
        novedadComienza[novedad++] = 11; //NovedadPieza10, fase 12
        novedadComienza[novedad++] = 13; //NovedadGemaMuchas, fase 14
        novedadComienza[novedad++] = 15; //NovedadGemaBonus, fase 16
        novedadComienza[novedad++] = 17; //NovedadGema2Muchas, fase 18
        novedadComienza[novedad++] = 20; //NovedadGemaN2Juntar, fase 21
        novedadComienza[novedad++] = 22; //NovedadGemaDeshacer, fase 23
        novedadComienza[novedad++] = 23; //NovedadGema2Deshacer, fase 24
        novedadComienza[novedad++] = 25; //NovedadGemaN3Juntar, fase 26
        novedadComienza[novedad++] = 27; //NovedadGemaRapido, fase 28
        novedadComienza[novedad++] = 28; //NovedadGema2Rapido, fase 29
        novedadComienza[novedad++] = 31; //NovedadGemaCuadrado, fase 32
        novedadComienza[novedad++] = 32; //NovedadGema2Cuadrado, fase 33
        novedadComienza[novedad++] = 34; //NovedadGemaN2Cuadrado, fase 35
        novedadComienza[novedad++] = 37; //NovedadGemaN3Color, fase 38
        novedadComienza[novedad++] = 40; //NovedadGemaPerfectLineas, fase 41
        novedadComienza[novedad++] = 41; //NovedadGema2PerfectLineas, fase 42
        novedadComienza[novedad++] = 43; //NovedadGemaPerfectDeshacer, fase 44
        novedadComienza[novedad++] = 44; //NovedadGema2PerfectDeshacer, fase 45
        novedadComienza[novedad++] = 46; //NovedadGemaN2Perfect, fase 47
        novedadComienza[novedad++] = 48; //NovedadGemaN3Perfect, fase 49

        //en que fase comienza cada ataque recibido
        var ataqueRecibidoComienza = new Array(AtaqueRecibidoSize);
        var ataque = 0;
        ataqueRecibidoComienza[ataque++] = 9; //AtaqueRecibidoPiezaMolesta1, fase 10
        ataqueRecibidoComienza[ataque++] = 19; //AtaqueRecibidoPiezaMolesta2, fase 20
        ataqueRecibidoComienza[ataque++] = 29; //AtaqueRecibidoPiezaMolesta3, fase 30
        ataqueRecibidoComienza[ataque++] = 39; //AtaqueRecibidoPiezaMolesta4, fase 40
        ataqueRecibidoComienza[ataque++] = 49; //AtaqueRecibidoPiezaMolesta5, fase 50
        ataqueRecibidoComienza[ataque++] = 19; //AtaqueRecibidoLluvia1, fase 20
        ataqueRecibidoComienza[ataque++] = 29; //AtaqueRecibidoLluvia2, fase 30
        ataqueRecibidoComienza[ataque++] = 39; //AtaqueRecibidoLluvia3, fase 40
        ataqueRecibidoComienza[ataque++] = 49; //AtaqueRecibidoGorila, fase 50

        //llena los mapas de bits de cada fase, segun los arrays locales anteriores
        FaseNovedad = new Array(FaseSize);
        FaseAtaqueRecibido = new Array(FaseSize);
        var fase, n;
        for (fase = 0; fase < FaseSize; fase++) {
            n = 0;
            for (novedad = 0; novedad < novedadComienza.length; novedad++) {
                if (novedadComienza[novedad] <= fase)
                    n += 1 << novedad;
            }
            FaseNovedad[fase] = n;

            n = 0;
            for (ataque = 0; ataque < ataqueRecibidoComienza.length; ataque++) {
                if (ataqueRecibidoComienza[ataque] <= fase)
                    n += 1 << ataque;
            }
            FaseAtaqueRecibido[fase] = n;
        }
    }
}

function SiguienteFase(fase) {
    var siguiente = fase + 1;
    if (siguiente >= FaseSize)
        siguiente = FaseSize;
    return siguiente;
}



//-------------------------------------------------------------------------------------
//funciones de partida

//para compartir la partida entre los diferentes dispositivos necesitariamos integrarlo con FB o con Google Play

function GetMaxResultadosFase(fase) {
	var max = 1;
	if (fase < 10)
	    max = 1;
	else if (fase < 20)
	    max = 3;
	else if (fase < 30)
	    max = 3;
	else if (fase < 40)
	    max = 5;
	else if (fase < 50)
	    max = 5;
	else
	    max = 7;
	return max;
}

function IniciarModoHistoriaEncuentro() {
    //crear un nuevo encuentro/resultado y marcarlo como encuentro/resultado actual
    var resultado = new Resultado();
    var encuentro = new Encuentro();
    encuentro.Resultados.push(resultado);

    //crea un encuentro y un resultado en blanco
    var fase = Partidas[PartidaActual].FaseActual;
    encuentro.MaxResultados = GetMaxResultadosFase(fase); //obtiene el numero maximo de resultados por encuentro
    encuentro.ResultadoActual = encuentro.Resultados.length - 1;
    encuentro.Terminado = false;
    encuentro.ResultadoAvatar = 0;
    encuentro.ResultadoOponente = 0;
	//los pone en la partida
	Partidas[PartidaActual].ResultadosFases[fase].Encuentros.push(encuentro);
	Partidas[PartidaActual].ResultadosFases[fase].EncuentroActual = Partidas[PartidaActual].ResultadosFases[fase].Encuentros.length - 1;
}

function ValidarPartida() {
    var msg = "";
    var nombre;
    if (document.getElementById(PantallaDefinirTextos[0].texto) != null)
    {
        nombre = document.getElementById(PantallaDefinirTextos[0].texto).value;
        if (nombre == "")
            msg = Mensaje.FaltaNombre;
        var partida;
        for (partida = 0; partida < Partidas.length; partida++)
            if (Partidas[partida].Nombre == nombre)
                msg = Mensaje.NombreRepetido;
    }
    return msg;
}

function CargarPartidas() {
    //entra en pantalla de historia partidas
    if (Partidas == null) {
        if (typeof Storage != "undefined")
            if (typeof localStorage != "undefined") {
                //obtiene objeto de local storage, persistente
                Partidas = JSON.parse(localStorage.getItem('Partidas'));
            }
		
		if (Partidas == null)
			Partidas = new Array();
	}
}

function GuardarPartidas() {
    //guardar objeto en local storage, persistente
    var guardado = false;
    if (typeof Storage != "undefined")
        if (typeof localStorage != "undefined") {
            localStorage.setItem('Partidas', JSON.stringify(Partidas));
            guardado = true;
        }

    //var msg = "No Guardado";
    //if (guardado)
    //    msg = "Guardado";
    //alert(msg);
}

function CargarPartida(partida) {
    //abre una partida existente
    PartidaActual = partida;
    //carga nombre y avatar
}

function NuevaPartida()
{
    //var partida = new Partida();
    PartidaNueva = new Partida();
    PartidaNueva.MundoActual = 0; //granja
    PartidaNueva.FaseActual = 0; //inicio
    PartidaNueva.MundoUltimo = 0;
    PartidaNueva.FaseUltima = 0;
    PartidaNueva.Avatar = AvatarInicial;
    PartidaNueva.Nombre = Mensaje.NombreAvatarInicial;
	var i; //inicializa los resultados de cada fase
	for (i = 0; i < FaseSize; i++)
	    PartidaNueva.ResultadosFases[i] = new ResultadosFase();
	PartidaNueva.GanarFase = false;

	//Partidas.push(partida);
	//PartidaActual = Partidas.length - 1;
}

function CrearNuevaPartida() {
    //al guardar la partida

    Partidas.push(PartidaNueva);
    PartidaActual = Partidas.length - 1;

}



//-------------------------------------------------------------------------------------
//funciones capturar entrada

function CoordenadasEvento(e) {
    var x, y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else { //iOS
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= RealCanvas.offsetLeft;
    y -= RealCanvas.offsetTop;

    x = Math.round(x /= Escala);
    y = Math.round(y /= Escala);

    var coord = new Coordenadas();
    coord.Set(x, y);
    return coord;
}

function PantallaCoordenadasPulsadas(evt) {

    if (TouchActivo) {
        var e = evt.touches[0];
    }
    if (RatonActivo) { //mouse
        var e = evt;
    }
    //alert(e.pageX + ", " + e.screenX + ", " + e.clientX);

    return CoordenadasEvento(e);
}

function PantallaReiniciarCapturarTeclado() {
    //limpia los eventos de las teclas globales
    var tecla;
    for (tecla = 0; tecla < PantallaTeclasGlobalSize; tecla++)
        PantallaTecladoGlobal[tecla] = 0;

    //teclas juego
    if (Pantalla == PantallaJuegoCargando) {
        var jugador;
        for (jugador = 0; jugador < GetNumeroJugadoresTeclas() ; jugador++)
            for (tecla = 0; tecla < TeclasSize; tecla++)
                Jugadores[jugador].Teclado[tecla] = 0; //no pulsado

        //teclas globales
        for (tecla = 0; tecla < TeclasGlobalSize; tecla++)
            TecladoGlobal[tecla] = 0;
    }
}

function PantallaCapturarKeyDown(e) {
    //teclas globales
    var tecla;
    for (tecla = 0; tecla < PantallaTeclasGlobalSize; tecla++)
        if ((e.keyCode == PantallaDefinirTeclasGlobales[tecla]) && (PantallaTecladoGlobal[tecla] != 2))
            PantallaTecladoGlobal[tecla] = 1; //keyDown (si no estan en estado keypress, debe soltar)

    //teclas juego
    if (Pantalla == PantallaJuegoPartida) {
        var jugador;
        for (jugador = 0; jugador < GetNumeroJugadoresTeclas() ; jugador++)
            for (tecla = 0; tecla < TeclasSize; tecla++)
                if (e.keyCode == Jugadores[jugador].DefinirTeclas[tecla]) {
                    if (Jugadores[jugador].Teclado[tecla] == 0) {
                        Jugadores[jugador].TiempoKeyDown[tecla] = new Date(); //primera vez que pulsa la tecla, comienza el tiempo de keyDown
                    }
                    if ((Jugadores[jugador].Teclado[tecla] != 2) && (Jugadores[jugador].Teclado[tecla] != 3)) {
                        Jugadores[jugador].Teclado[tecla] = 1; //keyDown (si no estan en estado keypress, debe soltar)
                    }
                }

        //teclas globales
        for (tecla = 0; tecla < TeclasGlobalSize; tecla++)
            if ((e.keyCode == DefinirTeclasGlobales[tecla]) && (TecladoGlobal[tecla] != 2))
                TecladoGlobal[tecla] = 1; //keyDown (si no estan en estado keypress, debe soltar)
    }
}

function PantallaCapturarKeyUp(e) {
    //teclas globales
    var tecla;
    for (tecla = 0; tecla < PantallaTeclasGlobalSize; tecla++)
        if (e.keyCode == PantallaDefinirTeclasGlobales[tecla])
            PantallaTecladoGlobal[tecla] = 0; //keyDown (si no estan en estado keypress, debe soltar)

    //teclas juego
    if (Pantalla == PantallaJuegoPartida) {
        var jugador;
        for (jugador = 0; jugador < GetNumeroJugadoresTeclas() ; jugador++)
            for (tecla = 0; tecla < TeclasSize; tecla++)
                if (e.keyCode == Jugadores[jugador].DefinirTeclas[tecla])
                    //if (Jugadores[jugador].Teclado[tecla] == 2)
                    Jugadores[jugador].Teclado[tecla] = 0; //keyUp

        //teclas globales
        for (tecla = 0; tecla < TeclasGlobalSize; tecla++)
            if (e.keyCode == DefinirTeclasGlobales[tecla])
                TecladoGlobal[tecla] = 0; //keyDown (si no estan en estado keypress, debe soltar)
    }
}

function EjecutarFuncion(funcion, arg1) {
    if (typeof funcion == "undefined")
        funcion = "";
    if (typeof arg1 == "undefined")
        arg1 = "";

    //alert("funcion " + funcion + ", arg1 " + arg1);

    if (funcion != "") {
        //call funcion
        if ((arg1 == "") && (arg1 != 0))
            window[funcion]();
        else
            window[funcion](arg1);
    }
}

function PantallaReiniciarCapturarBotones() {
    //limpia los eventos de los botones
    PantallaBotonera = 0; //no pulsado

    //botonera juego
    var boton;
    if (Pantalla == PantallaJuegoPartida) {
        if (BotoneraActivo)
            for (boton = 0; boton < BotonesSize; boton++)
                Botonera[boton] = 0; //no pulsado
    }
}

function CoordenadasPulsadas(evt) {

    if (TouchActivo) {
        var e = evt.touches[0];
    }
    if (RatonActivo) { //mouse
        var e = evt;
    }
    //alert(e.pageX + ", " + e.screenX + ", " + e.clientX);

    return CoordenadasEvento(e);
}

function PantallaCapturarPulsar(x, y) {
    var boton;
    for (boton = 0; boton < PantallaDefinirBotones.length; boton++)
        if (typeof PantallaDefinirBotones[boton] != "undefined")
            if ((x >= PantallaDefinirBotones[boton].x) && (x < PantallaDefinirBotones[boton].x + PantallaDefinirBotones[boton].h) &&
                (y >= PantallaDefinirBotones[boton].y) && (y < PantallaDefinirBotones[boton].y + PantallaDefinirBotones[boton].v)) {
                EjecutarFuncion(PantallaDefinirBotones[boton].funcion, PantallaDefinirBotones[boton].arg1);
                return;
            }

    var distancia; //distancia entre pulsacion y centro boton
    var xraton = x + PantallaMapaScrollX;
    for (boton = 0; boton < PantallaDefinirBotonesCircular.length; boton++)
        if (typeof PantallaDefinirBotonesCircular[boton] != "undefined") {
            distancia = Math.sqrt(Math.pow(xraton - PantallaDefinirBotonesCircular[boton].x, 2) + Math.pow(y - PantallaDefinirBotonesCircular[boton].y, 2));
            if (distancia <= PantallaDefinirBotonesCircular[boton].r) {
                EjecutarFuncion(PantallaDefinirBotonesCircular[boton].funcion, PantallaDefinirBotonesCircular[boton].arg1);
                return
            }
        }

    for (boton = 0; boton < PantallaDefinirBotonesImagen.length; boton++)
        if (typeof PantallaDefinirBotonesImagen[boton] != "undefined")
            if ((x >= PantallaDefinirBotonesImagen[boton].x) && (x < PantallaDefinirBotonesImagen[boton].x + PantallaDefinirBotonesImagen[boton].h) &&
                (y >= PantallaDefinirBotonesImagen[boton].y) && (y < PantallaDefinirBotonesImagen[boton].y + PantallaDefinirBotonesImagen[boton].v)) {
                EjecutarFuncion(PantallaDefinirBotonesImagen[boton].funcion, PantallaDefinirBotonesImagen[boton].arg1);
                return;
            }

    //botonera juego
    if (Pantalla == PantallaJuegoPartida) {
        if (BotoneraActivo)
            for (boton = 0; boton < BotonesSize; boton++) {
                if (typeof DefinirBotones[boton] != "undefined")
                    if ((x >= DefinirBotones[boton].x) && (x < DefinirBotones[boton].x + DefinirBotones[boton].h) &&
                        (y >= DefinirBotones[boton].y) && (y < DefinirBotones[boton].y + y < DefinirBotones[boton].v)) {
                        if (Botonera[boton] == 0) {
                            TiempoTouchStart[boton] = new Date(); //primera vez que pulsa el boton, comienza el tiempo de touchStart
                        }
                        if ((Botonera[boton] != 2) && (Botonera[boton] != 3)) {
                            Botonera[boton] = 1; //touchDown (si no estan en estado touch press, debe soltar)
                        }
                    }
            }
    }

}

function PantallaCapturarMouseDown(e) {
    var x, y, coord;
    coord = CoordenadasPulsadas(e); //obtiene coordenadas x, y
    x = coord.x;
    y = coord.y;

    PantallaCapturarPulsar(x, y);
}

function PantallaCapturarMouseUp(e) {
    PantallaReiniciarCapturarBotones();
}

function PantallaCapturarMouseMove(e) {
    var x, y, coord;
    coord = CoordenadasPulsadas(e); //obtiene coordenadas x, y
    x = coord.x;
    y = coord.y;

    var s = 100; //borde donde poner el raton y que permite moverse
    var v = 5; //veolocidad
    //pone limites al scroll
    if (x > Width - s) {
        PantallaMapaScrollXMover = v;
    }
    else if (x < s) {
        PantallaMapaScrollXMover = -v;
    }
    else {
        PantallaMapaScrollXMover = 0;
    }
}

function PantallaCapturarTouchDown(e) {
    e.preventDefault(); //por bug de phonegap y el touchmove (para recibir varios eventos mientras dura el touchmove)

    var x, y, coord;
    coord = CoordenadasPulsadas(e); //obtiene coordenadas x, y
    x = coord.x;
    y = coord.y;

    PantallaMapaScrollXTouchInicio = x;
    PantallaMapaScrollXInicio = PantallaMapaScrollX;

    PantallaCapturarPulsar(x, y);
}

function PantallaCapturarTouchUp(e) {
    PantallaReiniciarCapturarBotones();
}

function PantallaCapturarTouchMove(e) {
    e.preventDefault(); //por bug de phonegap y el touchmove (para recibir varios eventos mientras dura el touchmove)

    //este evento lo registra CargarPantalla (no PantallaIniciarCapturarEntrada), solo cuando es necesario y luego lo borra
    if(e.changedTouches.length > 0) {
        var evt = e.changedTouches[e.changedTouches.length - 1]; //buscar el ultimo touch
        //var evt = e.changedTouches[0]; //primer touch
        var x, y, coord;
        coord = CoordenadasEvento(evt);
        x = coord.x;
        y = coord.y;

        var dist = x - PantallaMapaScrollXTouchInicio;
        PantallaMapaScrollX = PantallaMapaScrollXInicio - dist;
		
        PonerMapaScrollLimites();
    }
    //alert(x + ", " + y + ', XInicio ' + PantallaMapaScrollXTouchInicio + ', HInicio ' + PantallaMapaScrollXInicio);
}

function PantallaIniciarCapturarEntrada() {

    //boton atras (se registra solo la primera vez)
    if (Dispositivo == Movil) {
        AddEvent(document, "backbutton", PulsarBotonAtras);
    }

    if (TecladoActivo) {
        //inicializa el teclado (estado pulsaciones)
        PantallaReiniciarCapturarTeclado();

        //crea los eventos de teclado
        AddEvent(document, "keydown", PantallaCapturarKeyDown);
        AddEvent(document, "keyup", PantallaCapturarKeyUp);
    }

    //inicializa los botones (estado pulsaciones)
    PantallaReiniciarCapturarBotones();

    if (TouchActivo) {
        //crea los eventos de touch
        AddEvent(RealCanvas, "touchstart", PantallaCapturarTouchDown)
        AddEvent(document, "touchend", PantallaCapturarTouchUp)
    }
    if (RatonActivo) {
        //crea los eventos de raton
        AddEvent(RealCanvas, "mousedown", PantallaCapturarMouseDown)
        AddEvent(document, "mouseup", PantallaCapturarMouseUp)
    }
}



//-------------------------------------------------------------------------------------
//funciones Oponente IA

function OponenteIASetNivel(fase) {
    //recibes fase de 0 a 49 

    var f = (fase + 1) / (FaseSize + 1);
    var i = f * (NivelSize / FaseSize);
    OponenteIA.Nivel = i;

    //poner habilidades segun el nivel
    if (f < 10) { //10 primeras fases de 50
        OponenteIA.VelocidadJuego = 20 - i; //primero rapido y luego lento (si va mas rapido muere antes)
        OponenteIA.CapacidadLineas = Math.round(i / 2); //poca
        OponenteIA.CapacidadDefensa = Math.round(i / 2); //poca
        OponenteIA.CapacidadAtaque = 0; //no
    }

    //poner intervalo tiempo segun velocidad de juego
    OponenteIA.ActualizarIntervalo = 5000; //cada 5 segundos (prueba!!!)

    //poner probabilidad hacer lineas segun capacidad lineas
    OponenteIA.ProbabilidadLineas = 0.02; //un 0.10% es una linea por cada 10 piezas (prueba!!!)
}



//-------------------------------------------------------------------------------------
//funciones actualizar la pantalla

function PantallaActualizarOpciones() {
    var img;
	if (MusicaActivo)
		img = "iMusicaOn";
	else
		img = "iMusicaOff";
	PantallaDefinirImagenes[PosicionMusica].imagen = img;
	
	if (SonidoActivo)
		img = "iSonidoOn";
	else
		img = "iSonidoOff";
	PantallaDefinirImagenes[PosicionSonido].imagen = img;
 }

function PantallaActualizarCargando() {
	var msg, x, h, sh = 50;
	msg = RecursosCargados + "/" + RecursosTotal;
	h = Ctx.measureText(msg).width + 100;
	if (h > Width - sh * 2)
		h = Width - sh * 2;
	x = Math.round(Width / 2 - h / 2); //centrado

	if (PantallaDefinirEtiquetas.length > DefinirEtiquetaCargando) {
	    PantallaDefinirEtiquetas[DefinirEtiquetaCargando].x = x;
	    PantallaDefinirEtiquetas[DefinirEtiquetaCargando].h = h;
	    PantallaDefinirEtiquetas[DefinirEtiquetaCargando].texto = msg;
	}
}

function MoverAvatar() {
    //avanzar un paso hacia destino, siguiendo ruta
    var destino = AvatarMoverDestino;
    var origen = AvatarMoverOrigen;

    //calcula siguiente paso
    var angulo = Math.atan2(destino.y - AvatarPosicion.y, destino.x - AvatarPosicion.x);
    var paso = new Coordenadas(); 
    paso.x = AvatarPosicion.x + Math.cos(angulo) * AvatarVelocidad;
    paso.y = AvatarPosicion.y + Math.sin(angulo) * AvatarVelocidad;

    //ver si ha llegado a su destino
    var haPasado = false; //si ha pasado del destino
    var haPasadoY = false;
    var haPasadoX = false;
    if (destino.y > origen.y)
        if (paso.y > destino.y)
            haPasadoY = true;
    if (destino.y < origen.y)
        if (paso.y < destino.y)
            haPasadoY = true;
    if (destino.x > origen.x)
        if (paso.x > destino.x)
            haPasadoX = true;
    if (destino.x < origen.x)
        if (paso.x < destino.x)
            haPasadoX = true;
    if (haPasadoX && haPasadoY)
        haPasado = true;

    var distancia = Math.sqrt(Math.pow(destino.x - paso.x, 2) + Math.pow(destino.y - paso.y, 2));
    if ((distancia < AvatarMoverDistancia) || (haPasado)) {
        //si esta cera o ha llegado al destino
        AvatarPosicion.x = destino.x;
        AvatarPosicion.y = destino.y;
        AnimacionAvatarMover = false;
    }
    else {
        AvatarPosicion.x = paso.x;
        AvatarPosicion.y = paso.y;
    }
}

function PantallaActualizarAnimacion() {
    //si hay movimiento de scroll
    if (PantallaMapaScrollXMover > 0) {
        PantallaMapaScrollX += PantallaMapaScrollXMover;
    }
    else if (PantallaMapaScrollXMover < 0) {
        PantallaMapaScrollX += PantallaMapaScrollXMover;
    }
    PonerMapaScrollLimites();

    //mover avatar
    if (AnimacionAvatarMover) {
        MoverAvatar();

        //mover scroll
        PonerMapaScrollAvatar();
    }
	
	//animar fase ultima
	if (AnimacionAnimalUltimo) {
		if (AnimalUltimoCrece) {
			AnimalUltimoEscala += AnimalUltimoVelocidad;
			if (AnimalUltimoEscala >= AnimalUltimoEscalaHasta) {
				AnimalUltimoEscala = AnimalUltimoEscalaHasta;
				AnimalUltimoCrece = !AnimalUltimoCrece;
			}
		}
		else {
			AnimalUltimoEscala -= AnimalUltimoVelocidad;
			if (AnimalUltimoEscala <= AnimalUltimoEscalaDesde) {
				AnimalUltimoEscala = AnimalUltimoEscalaDesde;
				AnimalUltimoCrece = !AnimalUltimoCrece;
			}
		}
	}
}

function PantallaActualizarControles() {
    //teclas globales
    if (TecladoActivo) {
        if (PantallaTecladoGlobal[TeclaSalir] == 1) {
            //pedir confirmacion

            //Salir = true; //al final del bucle de juego sale y vuelve a menu (provisional!!!)
            PulsarBotonAtras();

            PantallaTecladoGlobal[TeclaSalir] = 2; //keypress (debe soltarla)
        }

        if (PantallaTecladoGlobal[TeclaDebug] == 1) {
            Debug = !Debug;
            //alert("Debug: " + Debug);
            PantallaTecladoGlobal[TeclaDebug] = 2; //keypress (debe soltarla)
        }
    }
}

function PantallaActualizarFPS() {
    PantallaNumeroFrames++; //numero de frames que han pasado

    //calcular si ha pasado un segundo para actualizar el marcador
    var ahora = new Date();
    if (typeof PantallaTiempoFPS != "undefined") {
        if (ahora.getTime() - PantallaTiempoFPS.getTime() > 1000) {
            //calcular cuantos frames han pasado
            PantallaContadorFPS = PantallaNumeroFrames - 1;
            PantallaNumeroFrames = 0;
            PantallaTiempoFPS = ahora;
        }
    }
    else {
        PantallaTiempoFPS = ahora;
        PantallaNumeroFrames = 0;
    }
}

function PantallaVerSalir() {
    if (PantallaSalir) {
        //RequestAnimationFrame.cancel(IntervaloBucleJuego);

        //document.getElementById("divCanvas").style["display"] = "none"; //!!!

        //IniciarMenuPrincipal();

        //quitar musica...
    }
}

function PantallaForzarSalir() {
    GuardarPartidas();

    RequestAnimationFrame = new AnimationFrame();
    RequestAnimationFrame.cancel(IntervaloBucleJuego); //probar!!!

    PantallaSalir = true;
}



//-------------------------------------------------------------------------------------
//funciones dibujar la pantalla

function BorrarCanvas() {
    //Ctx.clearRect(0, 0, Canvas.width, Canvas.height); //lo he quitado pq no parece ser necesario con fondos
}

function Flip() {
    //pinta en el canvas real el contenido del canvas oculto
    //RealCtx.clearRect(0, 0, RealCanvas.width, RealCanvas.height); //lo he quitado pq no parece ser necesario al recibir el contenido del canvas sin escalar

    //RealCtx.drawImage(Canvas, 0, 0, RealCanvas.width, RealCanvas.height);
    RealCtx.drawImage(Canvas, 0, 0, Canvas.width, Canvas.height, 0, 0, RealCanvas.width, RealCanvas.height); 
}

function PantallaDibujarFondo(img, sx, sy, sh, sv, x, y, h, v) {
    //cuando se abre en tablet o pc y es demasiado grande se deformar el aspecto del fondo, no coincide la parte del contenido!!!
    var spriteH = sh;
    if (spriteH > img.width)
        spriteH = img.width;
    var spriteV = sv;
    if (spriteV > img.height)
        spriteV = img.height;
    Ctx.drawImage(img, sx + CanvasFondoPosicionX, sy + CanvasFondoPosicionY, spriteH, spriteV, x, y, h, v);
}

function PantallaDibujarFondoMapa(img, sx, sy, sh, sv, x, y, h, v) {
    //para el mapa no hay canvasPosicionX horizontal
    var spriteH = sh;
    if (spriteH > img.width)
        spriteH = img.width;
    var spriteV = sv;
    if (spriteV > img.height)
        spriteV = img.height;
    Ctx.drawImage(img, sx, sy + CanvasFondoPosicionY, spriteH, spriteV, x, y, h, v);
}

function PantallaDibujar(img, sx, sy, sh, sv, x, y, h, v) {
    Ctx.drawImage(img, sx, sy, sh, sv, x, y, h, v);
}

function PantallaDibujarTexto(txt, x, y) {
    Ctx.fillText(txt, x, y);
}

function PantallaDibujarTextoCentrado(txt, x, y, anchoContenedor, anchoTexto, altoContenedor, altoTexto) {
	Ctx.fillText(txt, x + anchoContenedor/2 - anchoTexto/2, y + altoContenedor/2 + altoTexto/3);
	//x + h / 2 - ancho / 2, y + v / 2 + 20 / 3
}

function PantallaDibujarCuadrado(x, y, h, v) {
    Ctx.strokeRect(x, y, h, v);
}

function PantallaDibujarCuadradoRelleno(x, y, h, v) {
    Ctx.fillRect(x, y, h, v);
}

function PantallaDibujarElementos() {

    switch (Pantalla) {
        case PantallaMenuCargando:
            //dibujar fondo pantalla
            PantallaDibujarFondo(iFondoPpal, 0, 0, Canvas.width, Canvas.height,
                0, 0, Canvas.width, Canvas.height);

            //dibujar logo pantalla
            PantallaDibujar(iLogoPpal, 0, 0, SpriteLogoPpalH, SpriteLogoPpalV,
                PosicionLogoPpalCargandoX, PosicionLogoPpalCargandoY, SpriteLogoPpalH, SpriteLogoPpalV);
            break;

		case PantallaMenuPrincipal:
            //dibujar fondo pantalla
            PantallaDibujarFondo(iFondoPpal, 0, 0, Canvas.width, Canvas.height, 
                0, 0, Canvas.width, Canvas.height);

            //dibujar logo pantalla
            PantallaDibujar(iLogoPpal, 0, 0, SpriteLogoPpalH, SpriteLogoPpalV,
                PosicionLogoPpalX, PosicionLogoPpalY, SpriteLogoPpalH, SpriteLogoPpalV);
            break;

        case PantallaHistoriaPartidas:
            //dibujar fondo pantalla
            PantallaDibujarFondo(iFondoPpal, 0, 0, Canvas.width, Canvas.height, 
                0, 0, Canvas.width, Canvas.height);
            break;

        case PantallaHistoriaAvatar:
            //dibujar fondo pantalla
            PantallaDibujarFondo(iFondoPpal, 0, 0, Canvas.width, Canvas.height, 
                0, 0, Canvas.width, Canvas.height);
            break;

        case PantallaHistoriaMapa:
            //dibujar fondo mapa (deberia coger el mundo de la imagen de mapas!!!)

            //var bannerY = 0;
            //if (Banner)
            //    bannerY = Math.round(BannerH / Escala); //recorta el banner superior
            //PantallaDibujarFondoMapa(iFondoMapa, PantallaMapaScrollX, bannerY, Canvas.width, Canvas.height - bannerY,
            //    0, 0, Canvas.width, Canvas.height - bannerY); //desde posicion del scroll horizontal

            PantallaDibujarFondoMapa(iFondoMapa, PantallaMapaScrollX, 0, Canvas.width, Canvas.height,
                0, 0, Canvas.width, Canvas.height); //desde posicion del scroll horizontal
            break;
			
        case PantallaOpciones:
            //dibujar fondo pantalla
            PantallaDibujarFondo(iFondoPpal, 0, 0, Canvas.width, Canvas.height, 
                0, 0, Canvas.width, Canvas.height);
            break;

        case PantallaJuegoCargando:
            //dibujar fondo pantalla
            PantallaDibujarFondo(iFondoPpal, 0, 0, Canvas.width, Canvas.height, 
                0, 0, Canvas.width, Canvas.height);

            //dibujar oponentes enfrentado al avatar (y estadisticas anteriores encuentros y records)
            break;

        case PantallaJuegoPartida:
            //dibujar fondo pantalla
            PantallaDibujarFondo(iFondoJuego, 0, 0, Canvas.width, Canvas.height,
                0, 0, Canvas.width, Canvas.height);

            //Dibujar Botones Juego
            if (BotoneraActivo) {
                for (boton = 0; boton < BotonesVisiblesSize; boton++)
                    PantallaDibujar(iBotones, boton * SpriteBoton, 0, SpriteBoton, SpriteBoton,
                        DefinirBotones[boton].x, DefinirBotones[boton].y, SpriteBoton, SpriteBoton);
            }
            break;

        case PantallaJuegoResultadoPartida:
            //dibujar fondo pantalla
            PantallaDibujarFondo(iFondoJuego, 0, 0, Canvas.width, Canvas.height,
                0, 0, Canvas.width, Canvas.height);
            break;

    }

	//dibujar imagenes
    var x, y, h, v, r, i, img, imagen, arg1, spriteH, spriteV, ancho, estilo, color, fondo, boton, texto;
    for (i = 0; i < PantallaDefinirImagenes.length; i++) {
        x = PantallaDefinirImagenes[i].x;
        y = PantallaDefinirImagenes[i].y;
        h = PantallaDefinirImagenes[i].h;
        v = PantallaDefinirImagenes[i].v;
        spriteH = PantallaDefinirImagenes[i].spriteH;
        spriteV = PantallaDefinirImagenes[i].spriteV;
        img = PantallaDefinirImagenes[i].imagen;

        imagen = window[img]; //obtener variable a partir del texto "iAvatares"
        PantallaDibujar(imagen, 0, 0, spriteH, spriteV,
            x, y, h, v);
    }

    //dibujar etiquetas
    for (i = 0; i < PantallaDefinirEtiquetas.length; i++) {
        x = PantallaDefinirEtiquetas[i].x;
        y = PantallaDefinirEtiquetas[i].y;
        h = PantallaDefinirEtiquetas[i].h;
        v = PantallaDefinirEtiquetas[i].v;
        texto = PantallaDefinirEtiquetas[i].texto;
        estilo = PantallaDefinirEtiquetas[i].estilo;
        color = PantallaDefinirEtiquetas[i].color;
        fondo = PantallaDefinirEtiquetas[i].fondo;

        if (Pantalla == PantallaHistoriaMapa) {
            x -= PantallaMapaScrollX; //scroll horizontal
        }

        //recuadro etiqueta
        if (fondo != "") {
            Ctx.beginPath();
            Ctx.fillStyle = fondo;
            PantallaDibujarCuadradoRelleno(x, y, h, v);
        }
        //texto etiqueta
        Ctx.beginPath();
        Ctx.font = estilo;
        Ctx.fillStyle = color;
        ancho = Ctx.measureText(texto).width;
        //PantallaDibujarTexto(texto, x + h / 2 - ancho / 2, y + v / 2 + 20 / 3);
		PantallaDibujarTextoCentrado(texto, x, y, h, ancho, v, 20);		
    }

    //dibujar botones de texto
    for (boton = 0; boton < PantallaDefinirBotones.length; boton++) {
        x = PantallaDefinirBotones[boton].x;
        y = PantallaDefinirBotones[boton].y;
        h = PantallaDefinirBotones[boton].h;
        v = PantallaDefinirBotones[boton].v;
        texto = PantallaDefinirBotones[boton].texto;

        //recuadro boton
        Ctx.beginPath();
        Ctx.fillStyle = "white";
        PantallaDibujarCuadradoRelleno(x, y, h, v);
        Ctx.beginPath();
        //texto boton
        Ctx.font = "bold 20px Arial";
        Ctx.fillStyle = "black";
        ancho = Ctx.measureText(texto).width;
        //PantallaDibujarTexto(texto, x + h / 2 - ancho / 2, y + v / 2 + 20 / 3);
		PantallaDibujarTextoCentrado(texto, x, y, h, ancho, v, 20);
    }

    //dibujar botones imagenes cuadradas
    for (boton = 0; boton < PantallaDefinirBotonesImagen.length; boton++) {
        x = PantallaDefinirBotonesImagen[boton].x;
        y = PantallaDefinirBotonesImagen[boton].y;
        h = PantallaDefinirBotonesImagen[boton].h;
        v = PantallaDefinirBotonesImagen[boton].v;
        spriteH = PantallaDefinirBotonesImagen[boton].spriteH;
        spriteV = PantallaDefinirBotonesImagen[boton].spriteV;
        img = PantallaDefinirBotonesImagen[boton].imagen;
        arg1 = PantallaDefinirBotonesImagen[boton].arg1;

        imagen = window[img]; //obtener variable a partir del texto "iAvatares"
        PantallaDibujar(imagen, arg1 * spriteH, 0, spriteH, spriteV,
            x, y, h, v);
    }

    //dibujar botones imagenes circulares
    for (boton = 0; boton < PantallaDefinirBotonesCircular.length; boton++) {
        x = PantallaDefinirBotonesCircular[boton].x;
        y = PantallaDefinirBotonesCircular[boton].y;
        r = PantallaDefinirBotonesCircular[boton].r;
        spriteH = PantallaDefinirBotonesCircular[boton].spriteH;
        spriteV = PantallaDefinirBotonesCircular[boton].spriteV;
        img = PantallaDefinirBotonesCircular[boton].imagen;
        arg1 = PantallaDefinirBotonesCircular[boton].arg1;

        if (Pantalla == PantallaHistoriaMapa) {
            x -= PantallaMapaScrollX; //scroll horizontal
            if ((x + r > 0) && (x - r < Canvas.width)) { //si el boton circular es visible
                imagen = window[img]; //obtener variable a partir del texto "iAnimales"
                if (Partidas[PartidaActual].FaseUltima < arg1) {
                    //sombrear oponente bloqueado
                    PantallaDibujar(iAnimalesSombra, arg1 * spriteH, 0, spriteH, spriteV,
                        x - r, y - r, r * 2, r * 2);
                }
                else if ((Partidas[PartidaActual].FaseUltima == arg1) && AnimacionAnimalUltimo) {
                    //animar fase ultima, crece y decrece
                    r = r * AnimalUltimoEscala;
                    PantallaDibujar(imagen, arg1 * spriteH, 0, spriteH, spriteV,
                        x - r, y - r, r * 2, r * 2);
                }
                else {
                    PantallaDibujar(imagen, arg1 * spriteH, 0, spriteH, spriteV,
                        x - r, y - r, r * 2, r * 2);
                }
            }
        }
        else { //dibuja normal, sin scroll
            PantallaDibujar(imagen, arg1 * spriteH, 0, spriteH, spriteV,
                        x - r, y - r, r * 2, r * 2);
        }
    }

    //dibujar botones resaltados
    for (boton = 0; boton < PantallaDefinirBotonesResaltado.length; boton++) {
        x = PantallaDefinirBotonesResaltado[boton].x;
        y = PantallaDefinirBotonesResaltado[boton].y;
        h = PantallaDefinirBotonesResaltado[boton].h;
        v = PantallaDefinirBotonesResaltado[boton].v;
        estilo = PantallaDefinirBotonesResaltado[boton].estilo;

        Ctx.beginPath();
        Ctx.strokeStyle = estilo; //"rgb(0,0,0)";
        Ctx.lineWidth = 3;
        PantallaDibujarCuadrado(x, y, h, v);
    }

    //dibujar avatar
    if (Pantalla == PantallaHistoriaMapa) {
        x = AvatarPosicion.x;
        y = AvatarPosicion.y;
        h = SpriteAvatar * AvatarEscala;
        v = SpriteAvatar * AvatarEscala;
        spriteH = SpriteAvatar;
        spriteV = SpriteAvatar;

        x -= PantallaMapaScrollX; //scroll horizontal
        if ((x + h > 0) && (x < Canvas.width)) { //si el avatar es visible
            PantallaDibujar(iAvatares, Partidas[PartidaActual].Avatar * spriteH, 0, spriteH, spriteV,
                x, y, h, v);
        }
    }
}

function PantallaDibujarFPS() {
    Ctx.beginPath();
    Ctx.fillStyle = "red";
    Ctx.font = "bold 28px Arial";
    Ctx.fillText("FPS " + PantallaContadorFPS, 10, 30);
}



//-------------------------------------------------------------------------------------
//Bucle principal de pantalla

function PantallaBucleJuego() {
    var DebugCompleto = false;
    var DebugBucle = false;

    if (DebugActivo && DebugBucle) VerTiempoDebug("PantallaBucleJuego"); //un mensaje por iteracion

    //logica del juego
    if (DebugActivo && DebugCompleto) VerDebug("PantallaActualizarAnimacion"); //multiples mensajes por iteracion
    PantallaActualizarAnimacion();

    if (DebugActivo && DebugCompleto) VerDebug("PantallaActualizarControles");
    PantallaActualizarControles(); //teclas globales y scroll menu

    if (DebugActivo)
        PantallaActualizarFPS();

    //para optimizarlo podria ver si ha habido algun cambio en la logica y sino no dibujar. Ahorro de bateria!!!
    //ojo con las animaciones, que siempre hay que dibujar si hay cambio en algún sprite. 

    //dibuja en canvas oculto
    if (DebugActivo && DebugCompleto) VerDebug("BorrarCanvas");
    BorrarCanvas();

    if (DebugActivo && DebugCompleto) VerDebug("PantallaDibujar");
    PantallaDibujarElementos();

    if (DebugActivo)
        PantallaDibujarFPS();

    //dibuja en canvas real
    if (DebugActivo && DebugCompleto) VerDebug("Flip");
    Flip();

    //ver si salir
    if (DebugActivo && DebugCompleto) VerDebug("PantallaVerSalir");
    PantallaVerSalir();
    if (!PantallaSalir) {
        IntervaloBucleJuego = RequestAnimationFrame.request(PantallaBucleJuego);
    }
}

