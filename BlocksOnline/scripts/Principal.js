//objetos importantes
var Canvas; //lienzo oculto sin escalar
var Ctx; //contexto oculto
var RealCanvas; //lienzo visible escalado
var RealCtx; //contexto visible
var IntervaloBucleJuego; //interval del bucle de juego
var RequestAnimationFrame; //objeto request animation frame Polyfill

//resolucion
var Width = 560; //sin escalar 560x840 (proporcion Baseline 320x480) -> FALTAN BOTONES DE DEBAJO!!!
var Height = 840;
var SpriteSize = 32;
var Escala; //proporcion

//tablero
var TableroSizeH = 10 + 2; //incluye los bordes
var TableroSizeV = 25 + 1;
var iContador;
var Tablero = new Array(TableroSizeH);
for (iContador = 0; iContador < TableroSizeH; iContador++)
    Tablero[iContador] = new Array(TableroSizeV); //crea Tablero[x][y]

//juego
var NumeroJugadores; //1 o 2
var Velocidad; //de 1 a 20
var TiempoVelocidad; //gravedad, guarda el momento de reinicio del contador de velocidad
var Lineas; //lineas completadas
var Deshacer; //puntos deshechos
var Pausa;
var Salir;
var Debug = false;

//marcadores
SiguienteMensaje = "Next"; //mensaje siguiente
SiguienteMensajeX = (TableroSizeH + 1) * SpriteSize;
SiguienteMensajeY = SpriteSize; //el texto se pone encima de la coord y
//ficha siguiente
SiguienteX = SiguienteMensajeX;
SiguienteY = 2 * SpriteSize;
SiguientePosX = 3; //cojo el centro de MapaPieza, desde 3,3 con 4x4 de tamaño
SiguientePosY = 3;
SiguienteSizeH = 4;
SiguienteSizeV = 4;
//marcador lineas
MarcadorMensaje = "Lines"
MarcadorX = (TableroSizeH + 1) * SpriteSize;
MarcadorY = SiguienteY + (SiguienteSizeV + 2) * SpriteSize; //el texto se pone encima de la coord y

//animacion borrar lineas
var LineasCompletas; //array que guarda la coordenada "y" de las lineas completas
var AnimacionBorrarLineas; //animacion de borrar lineas completas, 0 no animacion, 1 pinta, 2 borra, 3 pinta, 4 borra,... hasta Size
var AnimacionBorrarLineasSize = 11; //numero de tramos de la animacion (9 pinta, 10 borra, 11 termina)
var TiempoBorrarLineas; //guarda el momento de inicial de cada tramo de animacion
var IntervaloBorrarLineas = 100; //duracion de cada tramo de animación en milisegs (total animacion 1 seg)
//animacion borrar puntos
var ColorBorrarPuntos; //guarda el color a borrar
var AnimacionBorrarPuntos; //animacion de borrar puntos, 0 no animacion, 1 borra borde exterior, 2 borra borde siguiente,... hasta Size
var AnimacionBorrarPuntosSize = 17; //numero de tramos de la animacion, hay 16 bordes (15 borde penultimo, 16 borde interior, 17 termina)
var TiempoBorrarPuntos; //guarda el momento de inicial de cada tramo de animacion
var IntervaloBorrarPuntos = 62; //duracion de cada tramo de animación en milisegs (total animacion 1 seg)

//crear objeto jugador que contenga lo relacionado con cada jugador (tablero, piezas, animacion, etc) para partida dos jugadores en un pc!!!

//piezas
var PiezaI = 0;
var PiezaJ = 1;
var PiezaL = 2;
var PiezaO = 3;
var PiezaS = 4;
var PiezaZ = 5;
var PiezaT = 6;
var Pieza6 = 7; //larga de 6
var Pieza8 = 8; //larga de 8
var Pieza10 = 9; //larga de 10
var PiezaP = 10; //punto multicolor
//var PiezaLL = 11; //L grande
//var PiezaE = 12; //estrella
//var PiezaC = 13; //cuadrado gigante
//posibles piezas
var PiezasSize = PiezaP + 1; //hasta punto
//variables sobre la pieza
var PiezaX, PiezaY;
var PiezaRotacion;
var ActualPieza; //en vez de act y sig, guardar lista de 1000 piezas, al acabarse pedir 1000 mas
var SiguientePieza;
//mapa de cada pieza
var MapaPiezaSizeH = 10;
var MapaPiezaSizeV = 10;
var MapaPieza; // [piezas][rotation(4)][vertical blocks(10)][horizontal blocks(10)]
var ColorPieza; // [piezas] -> los colores se corresponden a los sprites del bloques.png
var ColorPiezaSize = Pieza10 + 1; //lo usa el punto para rotar colores, hasta el color del Pieza10
var ColorMandar = 15;
var RotarPieza; // [piezas] -> maxima rotacion de cada pieza
//posicion de salida de las piezas (y posicion en el MapaPieza)
var PosicionPiezaX = 4;
var PosicionPiezaY = 4;

//codigo de cada tecla
var TeclaIzq = 0;
var TeclaDer = 1;
var TeclaAba = 2;
var TeclaAbaAll = 3; //baja hasta abajo del todo
var TeclaRotIzq = 4; //rotar alternativo
var TeclaRotDer = 5; //rotar normal
var TeclaEsp = 6; //especial
//tamaño teclas y jugadorTeclado
var TeclasSize = TeclaEsp + 1; //numero de teclas
var JugadoresTecladoSize = 2; //numero de jugadores con teclado
//definir teclado de cada jugador
var TeclasJugador = new Array(TeclasSize);
for (iContador = 0; iContador < TeclasSize; iContador++)
    TeclasJugador[iContador] = new Array(JugadoresTecladoSize); //teclas de cada jugador
//captura eventos teclado
var Teclado = new Array(TeclasSize); //0 sin pulsar, 1 pulsada, 2 keypress (debe soltarla)
for (iContador = 0; iContador < TeclasSize; iContador++)
    Teclado[iContador] = new Array(JugadoresTecladoSize); //teclas de cada jugador
var TiempoKeyDown = new Array(TeclasSize); //guarda el momento de iniciar el keyDown por cada tecla
for (iContador = 0; iContador < TeclasSize; iContador++)
    TiempoKeyDown[iContador] = new Array(JugadoresTecladoSize); //tiempo de keyDown de cada jugador
var IntervaloKeyDown = 1000; //tiempo que debe pasar con la tecla pulsada hasta superar el keyDown y ejecutar la accion repetidamente, en miliseg
//teclas globales para todos jugadores
var TeclaPausa = 0;
var TeclaSalir = 1;
var TeclaDebug = 2;
var TeclasGlobalSize = TeclaDebug + 1;
var TeclasGlobal = new Array(TeclasGlobalSize); //define teclas globales
var TecladoGlobal = new Array(TeclasGlobalSize); //0 sin pulsar, 1 pulsada, 2 keypress (debe soltarla)

//recursos
var RecursosTotal = 0
var RecursosCargados = 0;
var TiempoRecursos; //guarda el momento de iniciar la carga de recursos
var IntervaloRecursos = 5000; //tiempo maximo que espera por la carga de recursos, en miliseg
var intervaloBucleRecursos; //interval del bucle de carga de recursos
//imagenes
var iBlocks; //bloques de colores y bordes del tablero
//sonidos
var AudioActivo; //indica si se deben ejecutar los sonidos
var sSonido1; //prueba

//FPS
var NumeroFrames = 0;
var ContadorFPS = 0; //guarda la media de FPS
var TiempoFPS; //calcula cuando pasa un segundo para actualizar el contador de FPS
//debug
var TiempoDebug;
var DebugDibujaTexto = true;



//-------------------------------------------------------------------------------------
//funciones globales
function AddEvent(html_element, event_name, event_function) {
    if (html_element.attachEvent) //Internet Explorer
        html_element.attachEvent("on" + event_name, function () { event_function.call(html_element); });
    else if (html_element.addEventListener) //resto navegadores
        html_element.addEventListener(event_name, event_function, false);
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
    // http://www.quirksmode.org/blog/archives/2012/07/more_about_devi.html
    if (navigator.userAgent.indexOf('Android') >= 0 && window.devicePixelRatio) {
        deviceWidth = deviceWidth / window.devicePixelRatio;
    }
    return deviceWidth;
}

function effectiveDeviceHeight() {
    var deviceHeight = window.orientation == 0 ? window.screen.height : window.screen.width;
    // iOS returns available pixels, Android returns pixels / pixel ratio
    if (navigator.userAgent.indexOf('Android') >= 0 && window.devicePixelRatio) {
        deviceHeight = deviceHeight / window.devicePixelRatio;
    }
    return deviceHeight;
}

function ObtenerEscala() {
    var RealWidth = getWidth(); //ancho real
    var RealHeight = getHeight();

    var escala = Math.min(RealWidth / Width, RealHeight / Height);
    //alert(Escala);
    escala = escala * 0.95; //reduce un poco
    //alert(Escala);
    escala = Math.round(escala * 100) / 100; //redondea
    console.log(escala + ", " + RealWidth + ", " + RealHeight);

    return escala;
}



//-------------------------------------------------------------------------------------
//funciones pantallas pruebas, titulo, menu, opciones, cargando, final
function IniciarPrincipal() {
    //por aqui se inicia el script principal
    IniciarPruebas(); //Inicia el modo de pruebas

    //IniciasCanvas(); //Inicia la carga del juego
    //IniciarTitulo(); //Inicia el titulo del juego
    //IniciarPruebas(); //Inicia el modo de pruebas
}

function IniciarPruebas() {
    var msg = "";
    if (self.innerWidth)
        msg += "self.innerWidth: " + self.innerWidth + "<br/>";
    if (document.documentElement && document.documentElement.clientWidth)
        msg += "document.documentElement.clientWidth: " + document.documentElement.clientWidth + "<br/>";
    if (document.body)
        msg += "document.body.clientWidth: " + document.body.clientWidth + "<br/>";
    msg += "screen.availWidth: " + screen.availWidth + "<br/>";
    msg += "[MOVIL] screen.width: " + screen.width + "<br/>";
    msg += "window.innerWidth: " + window.innerWidth + "<br/>";
    if (window.jQuery)
        msg += "$(window).width(): " + $(window).width() + "<br/>";
    msg += "effectiveDeviceWidth: " + effectiveDeviceWidth() + "<br/>";
    msg += "<br/>";

    if (self.innerHeight)
        msg += "self.innerHeight: " + self.innerHeight + "<br/>";
    if (document.documentElement && document.documentElement.clientHeight)
        msg += "document.documentElement.clientHeight: " + document.documentElement.clientHeight + "<br/>";
    if (document.body)
        msg += "document.body.clientHeight: " + document.body.clientHeight + "<br/>";
    msg += "screen.availHeight: " + screen.availHeight + "<br/>";
    msg += "[MOVIL] screen.height: " + screen.height + "<br/>";
    msg += "window.innerHeight: " + window.innerHeight + "<br/>";
    if (window.jQuery)
        msg += "$(window).height(): " + $(window).height() + "<br/>";
    msg += "effectiveDeviceHeight: " + effectiveDeviceHeight() + "<br/>";
    msg += "<br/>";

    var RealWidth = getWidth(); //ancho real
    var RealHeight = getHeight();
    var escala = ObtenerEscala(); //escala
    msg += "Escala: " + escala + " (" + RealWidth + ", " + RealHeight + ")<br/>";

    document.getElementById("divMensaje").innerHTML = msg;

    AddEvent(document.getElementById("btnEmpezar"), 'click', EmpezarPruebas);

    document.getElementById("divPruebas").style["display"] = "block";

    //setTimeout(IniciarTitulo, 5000);
}

function EmpezarPruebas() {
    var cmbDebug = document.getElementById("cmbDebug");
    if (cmbDebug.options[cmbDebug.selectedIndex].text == "Si")
        Debug = true;
    else
        Debug = false;

    var cmbDibujaTexto = document.getElementById("cmbDibujaTexto");
    if (cmbDibujaTexto.options[cmbDibujaTexto.selectedIndex].text == "Si")
        DebugDibujaTexto = true;
    else
        DebugDibujaTexto = false;

    IniciarTitulo();
}

function IniciarTitulo() {

    document.getElementById("divPruebas").style["display"] = "none";
    document.getElementById("divTitulo").style["display"] = "block";

    setTimeout(IniciarMenu, 3000);
}

function IniciarMenu() {

    document.getElementById("divTitulo").style["display"] = "none";
    document.getElementById("divMenu").style["display"] = "block";

    setTimeout(IniciarCanvas, 1000);
}



//-------------------------------------------------------------------------------------
//funciones inicializacion Juego
function IniciarResolucion() {
    //pantalla real escalada, donde se dibuja lo que haya en la pantalla oculta
    RealCanvas = document.getElementById("IdCanvas");
    RealCtx = RealCanvas.getContext("2d");

    //pantalla oculta sin escalar, donde se dibuja todo al principio
    Canvas = document.createElement("canvas");
    Ctx = Canvas.getContext("2d");

    //calcula la escala
    Escala = ObtenerEscala();

    //dimensiona los canvas
    Canvas.width = Width;
    Canvas.height = Height;
    RealCanvas.width = Width * Escala;
    RealCanvas.height = Height * Escala;

    //hacer el escalado sin suavizado
    /*RealCtx["imageSmoothingEnabled"] = false;
    ["o", "ms", "moz", "webkit"].forEach(function (v) {
        RealCtx[v + "ImageSmoothingEnabled"] = false;
    });*/
}

function CargarImagenes() {
    iBlocks = new Image();
    iBlocks.src = "images/bloques.png";

    RecursosTotal++;

    iBlocks.onload = function () {
        RecursosCargados++;
        //alert("bloques, RecursosCargados: " + RecursosCargados);
    }
}

function CargarSonidos() {

    var audio = document.createElement("audio");
    var SoportaMp3, SoportaOgg;
    if (audio.canPlayType) {
        //canPlayType devuelve "", "maybe" o "probably"
        SoportaMp3 = "" != audio.canPlayType("audio/mpeg");
        SoportaOgg = "" != audio.canPlayType("audio/ogg; codecs = 'vorbis'");
    }
    else {
        SoportaMp3 = false;
        SoportaOgg = false;
    }

    //obtener extension del archivo soportado, por defecto ogg
    var Extension = SoportaOgg ? ".ogg" : SoportaMp3 ? ".mp3" : undefined;
    //alert(Extension);
    if (typeof Extension != 'undefined') {
        AudioActivo = true;

        sSonido1 = new Audio();
        RecursosTotal++;

        AddEvent(sSonido1, "canplaythrough", function () {
            RecursosCargados++;
            //alert("sonido1, RecursosCargados: " + RecursosCargados);
        });

        //carga el archivo con la extension elegida
        sSonido1.src = "sound/sonido1" + Extension;
        //sSonido1.play();
    }
    else {
        AudioActivo = false;
    }
}

function IniciarTeclado() {
    var jugador = 0; //definir teclas del jugador 1
    TeclasJugador[TeclaIzq][jugador] = 37; //left
    TeclasJugador[TeclaDer][jugador] = 39; //right
    TeclasJugador[TeclaAba][jugador] = 40; //down
    TeclasJugador[TeclaAbaAll][jugador] = 16; //shift
    TeclasJugador[TeclaRotIzq][jugador] = 17; //control
    TeclasJugador[TeclaRotDer][jugador] = 38; //up
    TeclasJugador[TeclaEsp][jugador] = 13; //enter (tecla especial, para ataques especiales)

    var jugador = 1; //definir teclas del jugador 2
    TeclasJugador[TeclaIzq][jugador] = 70; //f
    TeclasJugador[TeclaDer][jugador] = 72; //h
    TeclasJugador[TeclaAba][jugador] = 71; //g
    TeclasJugador[TeclaAbaAll][jugador] = 83; //s
    TeclasJugador[TeclaRotIzq][jugador] = 65; //a
    TeclasJugador[TeclaRotDer][jugador] = 84; //t
    TeclasJugador[TeclaEsp][jugador] = 68; //d

    //definir teclas globales
    TeclasGlobal[TeclaPausa] = 80; //p
    TeclasGlobal[TeclaSalir] = 27; //escape
    TeclasGlobal[TeclaDebug] = 54; //6
}

function IniciarPiezas() {
    ActualPieza = GenerarPieza();
    SiguientePieza = GenerarPieza();

    sSonido1.play();

    PiezaRotacion = 0;
    PiezaX = PosicionPiezaX; //4
    PiezaY = 0;
}

function IniciarTablero() {
    var x, y, color;

    //limpia tablero
    for (y = 0; y < TableroSizeV; y++) 
        for (x = 0; x < TableroSizeH; x++) 
            Tablero[x][y] = 0; //vacio

    color = 1; //el 1 es un bloque blanco sin sombra, para los bordes
    x = 0; //borde izquierdo
    for (y = 0; y < TableroSizeV; y++) {
        Tablero[x][y] = color;
    }

    y = TableroSizeV - 1; //borde inferior
    for (x = 0; x < TableroSizeH; x++) {
        Tablero[x][y] = color;
    }

    x = TableroSizeH - 1; //borde derecho
    for (y = 0; y < TableroSizeV; y++) {
        Tablero[x][y] = color;
    }
}

function IniciarPartida() {
    AnimacionBorrarLineas = 0; //sin animacion
    AnimacionBorrarPuntos = 0; //sin animacion
    Lineas = 0;
    Deshacer = 0;
    Pausa = false;
    Salir = false;
    //Debug = true; //se define en la pantalla de prueba

    IniciarPiezas();
    IniciarTablero();
}

function IniciarCanvas() {
    document.getElementById("divMenu").style["display"] = "none";

    //poner divLoading

    IniciarResolucion(); //establece los dos canvas, uno invisible para pintar y otro escalado para mostrar

    NumJugadores = 1; //ejemplo, a elegir
    Velocidad = 10; //ejemplo, a elegir

    TiempoRecursos = new Date(); //tiempo en que empieza la carga de recursos
    CargarImagenes(); //se cargan asincronamente, termina cuando RecursosCargados sea RecursosTotal
    CargarSonidos(); //se podria hacer barra de progreso con 100 * RecursosCargados / RecursosTotal

    IniciarTeclado();
    IniciarMapaPiezas(); //en MapaPiezas.js

    //codigo asincrono para bucle de espera de carga recursos
    IntervaloBucleRecursos = setInterval(BucleCargaRecursos, 50); //lanza funcion carga de recursos cada 50 milisegs
}

function BucleCargaRecursos() {
    //espera hasta que se haya cargado la ultima imagen/sonido, o hasta que pase el tiempo limite de carga de recursos
    var ahora = new Date();
    if ((RecursosCargados == RecursosTotal) || (ahora.getTime() - TiempoRecursos.getTime() > IntervaloRecursos)) {
        //termina bucle de espera carga recursos
        clearInterval(IntervaloBucleRecursos);

        //alert("RecursosCargados: " + RecursosCargados + ", RecursosTotal: " + RecursosTotal + ", AudioActivo: " + AudioActivo);
        //alert("tiempo pasado: " + (ahora.getTime() - TiempoRecursos.getTime()) + ", IntervaloRecursos: " + IntervaloRecursos);

        //iniciar juego ---------------------------
        IniciarCapturarTeclado(); //crea e inicializa los eventos de teclado, debe hacerse al comenzar la partida
        IniciarPartida();

        document.getElementById("divCanvas").style["display"] = "block";

        RequestAnimationFrame = new AnimationFrame();
        IntervaloBucleJuego = RequestAnimationFrame.request(BucleJuego);
    }
}



//-------------------------------------------------------------------------------------
//funciones controles
function LimpiarCapturaTeclado() {
    //limpia los eventos de las teclas
    var tecla, jugador;
    var Num = Math.min(JugadoresTecladoSize, NumJugadores);
    for (jugador = 0; jugador < Num; jugador++)
        for (tecla = 0; tecla < TeclasSize; tecla++) 
            Teclado[tecla][jugador] = 0;

    //teclas globales
    for (tecla = 0; tecla < TeclasGlobalSize; tecla++)
        TecladoGlobal[tecla] = 0;
}

function CapturarKeyDown(e) {
    var tecla, jugador;
    var Num = Math.min(JugadoresTecladoSize, NumJugadores);
    for (jugador = 0; jugador < Num; jugador++)
        for (tecla = 0; tecla < TeclasSize; tecla++)
            if (e.keyCode == TeclasJugador[tecla][jugador]) {
                if (Teclado[tecla][jugador] == 0) 
                    TiempoKeyDown[tecla][jugador] = new Date(); //primera vez que pulsa la tecla, comienza el tiempo de keyDown
                if (Teclado[tecla][jugador] != 2)
                    Teclado[tecla][jugador] = 1; //keyDown (si no estan en estado keypress, debe soltar)
            }

    //teclas globales
    for (tecla = 0; tecla < TeclasGlobalSize; tecla++)
        if ((e.keyCode == TeclasGlobal[tecla]) && (TecladoGlobal[tecla] != 2))
            TecladoGlobal[tecla] = 1; //keyDown (si no estan en estado keypress, debe soltar)
}

function CapturarKeyUp(e) {
    var tecla, jugador;
    var Num = Math.min(JugadoresTecladoSize, NumJugadores);
    for (jugador = 0; jugador < Num; jugador++)
        for (tecla = 0; tecla < TeclasSize; tecla++)
            if (e.keyCode == TeclasJugador[tecla][jugador])
                Teclado[tecla][jugador] = 0; //keyUp

    //teclas globales
    for (tecla = 0; tecla < TeclasGlobalSize; tecla++)
        if (e.keyCode == TeclasGlobal[tecla])
            TecladoGlobal[tecla] = 0; //keyDown (si no estan en estado keypress, debe soltar)
}

function IniciarCapturarTeclado() {
    //incializa el teclado
    LimpiarCapturaTeclado();

    //crea los eventos de teclado
    AddEvent(document, "keydown", CapturarKeyDown);
    AddEvent(document, "keyup", CapturarKeyUp);
}



//-------------------------------------------------------------------------------------
//funciones logica del juego

function ObtenerColorPieza(pieza, rotacion) {
	var color = ColorPieza[pieza];
	if (pieza == PiezaP)
		color = rotacion + 2;
	return color;
}

function ObtenerRotacionPieza(pieza, rotacion) {
	var rot = rotacion;
	if (pieza == PiezaP)
		rot = 0;
	return rot;
}

function ComprobarLineas() {
    var x, y, bLinea;
    LineasCompletas = new Array(); //guarda la coordenada y de las lineas completas
    for (y = 0; y < TableroSizeV - 1; y++) { // - 1 porque ignoro los bordes
        bLinea = true;
        for (x = 1; (x < TableroSizeH - 1) && bLinea; x++) // de 1 a -1 porque ignoro los bordes
            if (Tablero[x][y] == 0)
                bLinea = false;
        if (bLinea)
            LineasCompletas.push(y);
    }

    if (LineasCompletas.length > 0) { //si hay alguna linea completa
        //inicia animacion en las lineas
        AnimacionBorrarLineas = 1;
        TiempoBorrarLineas = new Date();
    }
}

function BorrarLineas() {
    var iLinea, yL;
    //las lineas completas estan guardadas de arriba a abajo
    for (iLinea = 0; iLinea < LineasCompletas.length; iLinea++) {
        yL = LineasCompletas[iLinea];
        //el borrado se hace desde la linea completa hacia arriba
        for (y = yL; y > 0; y--)
            for (x = 1; x < TableroSizeH - 1; x++) // de 1 a -1 porque ignoro los bordes
                Tablero[x][y] = Tablero[x][y - 1]; //cada linea igual a la de encima
        //vacia la linea de arriba (no hay nada encima)
        y = 0;
        for (x = 1; x < TableroSizeH - 1; x++) // de 1 a -1 porque ignoro los bordes
            Tablero[x][y] = 0;
    }

    //aumenta contador lineas
    Lineas += LineasCompletas.length;
}

function ComprobarPunto() {
    //si debajo del punto hay otro color igual desaparecen todos los colores coincidentes del tablero
	var color;
	color = ObtenerColorPieza(ActualPieza, PiezaRotacion);
	if (Tablero[PiezaX + 1][PiezaY + 1] == color) {
		//inicia animacion en los puntos
		AnimacionBorrarPuntos = 1;
		TiempoBorrarPuntos = new Date();
		ColorBorrarPuntos = color;
	}
}

function BorrarPuntos() {
    var x, y, num;
    /*
    for (iLinea = 0; iLinea < LineasCompletas.length; iLinea++) {
        yL = LineasCompletas[iLinea];
        //el borrado se hace desde la linea completa hacia arriba
        for (y = yL; y > 0; y--)
            for (x = 1; x < TableroSizeH - 1; x++) // de 1 a -1 porque ignoro los bordes
                Tablero[x][y] = Tablero[x][y - 1]; //cada linea igual a la de encima
        //vacia la linea de arriba (no hay nada encima)
        y = 0;
        for (x = 1; x < TableroSizeH - 1; x++) // de 1 a -1 porque ignoro los bordes
            Tablero[x][y] = 0;
    }
	*/
    
	//aumenta contador borrar puntos
    Deshacer += num;
	
	//despues de deshacer comprueba lineas
	ComprobarLineas();
}

function CabePieza(pX, pY, rotacion) {
    var x, y;
	rotacion = ObtenerRotacionPieza(ActualPieza, rotacion);
    for (y = 0; y < MapaPiezaSizeV; y++)
        for (x = 0; x < MapaPiezaSizeH; x++) {
            //MapaPieza[piezas][rotation(4)][vertical blocks(10)][horizontal blocks(10)]
            if (MapaPieza[ActualPieza][rotacion][y][x] != 0)
                if ((pY - PosicionPiezaY + y >= 0) && (pY - PosicionPiezaY + y < TableroSizeV) && 
                    (pX - PosicionPiezaX + x + 1 >= 0) && (pX - PosicionPiezaX + x + 1 < TableroSizeH)) {
                    //en caso contrario estaria mirando fuera del tablero y ahi siempre cabe
                    if (Tablero[pX - PosicionPiezaX + x + 1][pY - PosicionPiezaY + y] != 0)
                        return false;
                }
        }
    return true;
}

function GenerarPieza() {
    //getRandomInt(0, PiezasSize - 1);

    if (getRandomInt(0, 12) == 0)
        return PiezaP; //punto multicolor
    else 
        if (getRandomInt(0, 6) == 0)
            if (getRandomInt(0, 1) == 0) 
                if (getRandomInt(0, 2) == 0) 
                    return Pieza10; //larga 10
                else
                    return Pieza8; //larga 8
            else
                return Pieza6; //larga 6
        else
            if (getRandomInt(0, 4) == 0)
                return PiezaI; //larga 4
            else
                return getRandomInt(1, 6); //resto (PiezaJ ... PiezaT)
}

function ObtenerSiguientePieza() {
    ActualPieza = SiguientePieza;
    SiguientePieza = GenerarPieza();

    sSonido1.play();

    PiezaRotacion = 0;
    PiezaX = PosicionPiezaX; //4
    PiezaY = 0;
}

function PonerPiezaTablero() {
    var x, y, color, rotacion;
	color = ObtenerColorPieza(ActualPieza, PiezaRotacion);
	rotacion = ObtenerRotacionPieza(ActualPieza, PiezaRotacion);
    for (y = 0; y < MapaPiezaSizeV; y++)
        for (x = 0; x < MapaPiezaSizeH; x++) {
            //MapaPieza[piezas][rotation(4)][vertical blocks(10)][horizontal blocks(10)]
            if (MapaPieza[ActualPieza][rotacion][y][x] != 0)
                Tablero[PiezaX - PosicionPiezaX + x + 1][PiezaY - PosicionPiezaY + y] = color;
        }

    if (ActualPieza == PiezaP)
        ComprobarPunto();

	//primero deshacer puntos y al acabar se comprueban lineas
	if (AnimacionBorrarPuntos == 0)
		ComprobarLineas();

}

function IntervaloVelocidad(Velocidad) {
    //devuelve el intervalo según la velocidad (1-20), cada cuanto caen las piezas
    var intervalo; //en milisegundos
    if (Velocidad == 10) //provisional!!!, hay que hacer mas velocidades
        intervalo = 1000; //1 sg
    return intervalo;
}

function ExisteAnimacion() {
	if ((AnimacionBorrarLineas == 0) && (AnimacionBorrarPuntos == 0))
		return false;
	else
		return true;
}


		
//-------------------------------------------------------------------------------------
//funciones actualizar el juego
function ActualizarMoverPieza() {
    if (!ExisteAnimacion() && !Pausa) {
        var jugador = 0;
        var ahora = new Date();

        //horizontal
        if ((Teclado[TeclaIzq][jugador] == 1) || ((Teclado[TeclaIzq][jugador] == 2) && (typeof TiempoKeyDown[TeclaIzq][jugador] != 'undefined') && (ahora.getTime() - TiempoKeyDown[TeclaIzq][jugador].getTime() > IntervaloKeyDown))) {
            if (CabePieza(PiezaX - 1, PiezaY, PiezaRotacion)) {
                PiezaX -= 1;
                Teclado[TeclaIzq][jugador] = 2; //keypress (debe soltarla)
            }
        }
        if ((Teclado[TeclaDer][jugador] == 1) || ((Teclado[TeclaDer][jugador] == 2) && (typeof TiempoKeyDown[TeclaDer][jugador] != 'undefined') && (ahora.getTime() - TiempoKeyDown[TeclaDer][jugador].getTime() > IntervaloKeyDown))) {
            if (CabePieza(PiezaX + 1, PiezaY, PiezaRotacion)) {
                PiezaX += 1;
                Teclado[TeclaDer][jugador] = 2; //keypress (debe soltarla)
            }
        }

        //abajo
        var pY;
        if (Teclado[TeclaAba][jugador] == 1) {
            pY = PiezaY + 1;
            //si no puede bajar enconces poner en tablero la pieza, crear nueva pieza y pasa a estado keypress
            if (!CabePieza(PiezaX, pY, PiezaRotacion)) {
                PonerPiezaTablero();
                if (!ExisteAnimacion())
                    ObtenerSiguientePieza();
                Teclado[TeclaAba][jugador] = 2; //keypress (debe soltarla)
            }
            else
                PiezaY = pY;
        }
        if (Teclado[TeclaAbaAll][jugador] == 1) {
            //bajar hasta el final y crear nueva pieza
            pY = PiezaY + 1; 
            while (CabePieza(PiezaX, pY, PiezaRotacion) && (pY < TableroSizeV)) {
                pY++;
            }
            PiezaY = pY - 1;
            PonerPiezaTablero();
            if (!ExisteAnimacion())
                ObtenerSiguientePieza();
            Teclado[TeclaAbaAll][jugador] = 2; //keypress (debe soltarla)
        }

        //rotar
        var rotacion;
        if ((Teclado[TeclaRotIzq][jugador] == 1) || ((Teclado[TeclaRotIzq][jugador] == 2) && (typeof TiempoKeyDown[TeclaRotIzq][jugador] != 'undefined') && (ahora.getTime() - TiempoKeyDown[TeclaRotIzq][jugador].getTime() > IntervaloKeyDown))) {
            rotacion = PiezaRotacion - 1;
            if (rotacion < 0)
                rotacion = RotarPieza[ActualPieza] - 1;
            if (CabePieza(PiezaX, PiezaY, rotacion)) {
                PiezaRotacion = rotacion;
                Teclado[TeclaRotIzq][jugador] = 2; //keypress (debe soltarla)
            }
        }
        if ((Teclado[TeclaRotDer][jugador] == 1) || ((Teclado[TeclaRotDer][jugador] == 2) && (typeof TiempoKeyDown[TeclaRotDer][jugador] != 'undefined') && (ahora.getTime() - TiempoKeyDown[TeclaRotDer][jugador].getTime() > IntervaloKeyDown))) {
            rotacion = PiezaRotacion + 1;
            if (rotacion >= RotarPieza[ActualPieza])
                rotacion = 0;
            if (CabePieza(PiezaX, PiezaY, rotacion)) {
                PiezaRotacion = rotacion;
                Teclado[TeclaRotDer][jugador] = 2; //keypress (debe soltarla)
            }
        }
    }
}

function ActualizarTeclasGlobales() {
    if (TecladoGlobal[TeclaPausa] == 1) {
        Pausa = !Pausa;
        /*
        --no puedo parar el bucle porque sino no se actualizan las teclas (habria que crear un bucle para esto o optimizar el dibujado para que no dibuje si no hay cambios)
        if (Pausa)
            RequestAnimationFrame.cancel(IntervaloBucleJuego);
        else
            IntervaloBucleJuego = RequestAnimationFrame.request(BucleJuego);
        */
        TecladoGlobal[TeclaPausa] = 2; //keypress (debe soltarla)
    }

    if (TecladoGlobal[TeclaSalir] == 1) {
        //pedir confirmacion
        Salir = true; //al final del bucle de juego sale y vuelve a menu (provisional!!!)
        TecladoGlobal[TeclaSalir] = 2; //keypress (debe soltarla)
    }

    if (TecladoGlobal[TeclaDebug] == 1) {
        Debug = !Debug;
        //alert("Debug: " + Debug);
        TecladoGlobal[TeclaDebug] = 2; //keypress (debe soltarla)
    }
}

function ActualizarGravedadPieza() {
    if (!ExisteAnimacion() && !Pausa) {
        var ahora = new Date();
        if (typeof TiempoVelocidad == 'undefined')
            TiempoVelocidad = ahora;
        else {
            if (ahora.getTime() - TiempoVelocidad.getTime() > IntervaloVelocidad(Velocidad)) { 
                //si ha pasado el tiempo (segun velocidad) baja la pieza
                TiempoVelocidad = ahora;

                var pY = PiezaY + 1;
                //si no puede bajar enconces poner en tablero la pieza y crear nueva pieza
                if (!CabePieza(PiezaX, pY, PiezaRotacion)) {
                    PonerPiezaTablero();
                    if ((AnimacionBorrarLineas == 0) && (AnimacionBorrarPuntos == 0))
                        ObtenerSiguientePieza();
                }
                else
                    PiezaY = pY;
            }
        }
    }
}

function ActualizarAnimacion() {
    if (!Pausa) {
        if (AnimacionBorrarLineas > 0) {
            var ahora = new Date();
            if (ahora.getTime() - TiempoBorrarLineas.getTime() > IntervaloBorrarLineas) {
                //si ha pasado el tiempo del tramo de la animación
                TiempoBorrarLineas = ahora;

                AnimacionBorrarLineas++;
                if (AnimacionBorrarLineas > AnimacionBorrarLineasSize - 1) {
                    AnimacionBorrarLineas = 0;
                    BorrarLineas(); //borra lineas del tablero y aumenta marcador de lineas
                    ObtenerSiguientePieza();
                }
            }
        }

        if (AnimacionBorrarPuntos > 0) {
            var ahora = new Date();
            if (ahora.getTime() - TiempoBorrarPuntos.getTime() > IntervaloBorrarPuntos) {
                //si ha pasado el tiempo del tramo de la animación
                TiempoBorrarPuntos = ahora;

                AnimacionBorrarPuntos++;
                if (AnimacionBorrarPuntos > AnimacionBorrarPuntosSize - 1) {
                    AnimacionBorrarPuntos = 0;
                    BorrarPuntos(); //borra puntos del tablero y aumenta marcador de borrar puntos, comprueba lineas
                    if (AnimacionBorrarLineas == 0)
                        ObtenerSiguientePieza();
                }
            }
        }
    }
}

function ActualizarFPS() {
    NumeroFrames++; //numero de frames que han pasado

    //calcular si ha pasado un segundo para actualizar el marcador
    var ahora = new Date();
    if (typeof TiempoFPS != 'undefined') {
        if (ahora.getTime() - TiempoFPS.getTime() > 1000) {
            //calcular cuantos frames han pasado
            ContadorFPS = NumeroFrames - 1;
            NumeroFrames = 0;
            TiempoFPS = ahora;
        }
    }
    else {
        TiempoFPS = ahora;
        NumeroFrames = 0;
    }
}

function VerSalir() {
    if (Salir) {
        RequestAnimationFrame.cancel(IntervaloBucleJuego);

        document.getElementById("divCanvas").style["display"] = "none";
        IniciarMenu();
    }
}

function VerTiempoDebug(msg) {
    if (typeof TiempoDebug == 'undefined')
        TiempoDebug = new Date();
    var ahora = new Date();
    var dif = ahora.getTime() - TiempoDebug.getTime();
    TiempoDebug = ahora;
    console.log(msg + " " + dif + " milisegs");
}

function VerDebug(msg) {
    var ahora = new Date();
    var hora = ahora.getHours();
    if (hora < 10)
        hora = "0" + hora;
    var min = ahora.getMinutes();
    if (min < 10)
        min = "0" + min;
    var seg = ahora.getSeconds();     
    if (seg < 10)
        seg = "0" + seg;
    var ms = ahora.getMilliseconds();     
    if (ms < 10)
        ms = "0" + ms;
    if (ms < 100)
        ms = "0" + ms;
    var tiempo = hora + ":" + min + ":" + seg + "." + ms;
    console.log(tiempo + " " + msg);
}



//-------------------------------------------------------------------------------------
//funciones dibujar el juego
function BorrarCanvas() {
    Ctx.clearRect(0, 0, Canvas.width, Canvas.height);
}

function DibujarTablero() {
    var x, y, color;
    for (y = 0; y < TableroSizeV; y++)
        for (x = 0; x < TableroSizeH; x++) {
            var color = Tablero[x][y];
            if (color != 0)
                Ctx.drawImage(iBlocks, (color - 1) * SpriteSize, 0, SpriteSize, SpriteSize,
                    x * SpriteSize, y * SpriteSize, SpriteSize, SpriteSize);
        }
}

function DibujarAnimacion() {
    if (AnimacionBorrarLineas > 0) {
        //impar pinta, par borra
        if (AnimacionBorrarLineas % 2 == 0) { //si es impar borra
            var iLinea, yL;
            for (iLinea = 0; iLinea < LineasCompletas.length; iLinea++) {
                yL = LineasCompletas[iLinea];
                //borra la linea entera (las 10 casillas)
                Ctx.clearRect(SpriteSize, yL * SpriteSize, (TableroSizeH - 2) * SpriteSize, SpriteSize);
            }
        }
    }

	if (AnimacionBorrarPuntos > 0) {
		/*
        if (AnimacionBorrarLineas % 2 == 0) { //si es impar borra
            var iLinea, yL;
            for (iLinea = 0; iLinea < LineasCompletas.length; iLinea++) {
                yL = LineasCompletas[iLinea];
                //borra la linea entera (las 10 casillas)
                Ctx.clearRect(SpriteSize, yL * SpriteSize, (TableroSizeH - 2) * SpriteSize, SpriteSize);
            }
        }
		*/
    }
}

function DibujarPieza() {
    if (AnimacionBorrarLineas == 0) {
        var x, y, color, rotacion;
        color = ObtenerColorPieza(ActualPieza, PiezaRotacion);
        rotacion = ObtenerRotacionPieza(ActualPieza, PiezaRotacion);
        for (y = 0; y < MapaPiezaSizeV; y++)
            for (x = 0; x < MapaPiezaSizeH; x++) {
                // MapaPieza[piezas][rotation(4)][vertical blocks(10)][horizontal blocks(10)]
                if (MapaPieza[ActualPieza][rotacion][y][x] > 0)
                    Ctx.drawImage(iBlocks, (color - 1) * SpriteSize, 0, SpriteSize, SpriteSize,
                        (PiezaX - PosicionPiezaX + x + 1) * SpriteSize, (PiezaY - PosicionPiezaY + y) * SpriteSize, SpriteSize, SpriteSize);
            }
    }
}

function DibujarMarcador() {
    //cojo el centro de MapaPieza, desde SiguientePosX/Y 3,3 con SiguienteSizeH/V 4x4 de tamaño
    var x, y, color, rotacion;
    color = ColorPieza[SiguientePieza];
    rotacion = 0;
    for (y = SiguientePosY; y < SiguientePosY + SiguienteSizeV; y++)
        for (x = SiguientePosX; x < SiguientePosX + SiguienteSizeH; x++) {
            // MapaPieza[piezas][rotation(4)][vertical blocks(10)][horizontal blocks(10)]
            if (MapaPieza[SiguientePieza][rotacion][y][x] > 0)
                Ctx.drawImage(iBlocks, (color - 1) * SpriteSize, 0, SpriteSize, SpriteSize,
                    SiguienteX + (x - SiguientePosX) * SpriteSize, SiguienteY + (y - SiguientePosY) * SpriteSize, SpriteSize, SpriteSize);
        }

    //Dibuja textos y recuadro
    if (DebugDibujaTexto) {
        Ctx.beginPath();
        Ctx.fillStyle = "black";
        Ctx.font = "bold 28px Arial";
        Ctx.fillText(SiguienteMensaje, SiguienteMensajeX, SiguienteMensajeY); //mensaje siguiente
        Ctx.fillText(MarcadorMensaje + " " + Lineas, MarcadorX, MarcadorY); //numero lineas
        Ctx.strokeRect(SiguienteX, SiguienteY, SiguienteSizeH * SpriteSize, SiguienteSizeV * SpriteSize); //recuadro pieza siguiente
    }
}

function DibujarFPS() {
    Ctx.beginPath();
    Ctx.fillStyle = "black";
    Ctx.font = "bold 28px Arial";
    Ctx.fillText("FPS " + ContadorFPS, 5, SpriteSize);
}

function Flip() {
    //pinta en el canvas real el contenido del canvas oculto
    RealCtx.clearRect(0, 0, RealCanvas.width, RealCanvas.height);
    //RealCtx.drawImage(Canvas, 0, 0, RealCanvas.width, RealCanvas.height);
    RealCtx.drawImage(Canvas, 0, 0, Canvas.width, Canvas.height, 0, 0, RealCanvas.width, RealCanvas.height);
}



//-------------------------------------------------------------------------------------
//Bucle principal del juego
function BucleJuego() {
    var DebugCompleto = false;

    if (Debug) VerTiempoDebug("BucleJuego");

    //logica del juego
    if (Debug && DebugCompleto) VerDebug("ActualizarAnimacion");
    ActualizarAnimacion();
    if (Debug && DebugCompleto) VerDebug("ActualizarGravedadPieza");
    ActualizarGravedadPieza(); 
    if (Debug && DebugCompleto) VerDebug("ActualizarMoverPieza");
    ActualizarMoverPieza();
    if (Debug && DebugCompleto) VerDebug("ActualizarTeclasGlobales");
    ActualizarTeclasGlobales()
    if (Debug)
        ActualizarFPS();

    //para optimizarlo podria ver si ha habido algun cambio en la logica y sino no dibujar. Ahorro de bateria!!!

    //dibuja en canvas oculto
    if (Debug && DebugCompleto) VerDebug("BorrarCanvas");
    BorrarCanvas(); 
    if (Debug && DebugCompleto) VerDebug("DibujarTablero");
    DibujarTablero();
    if (Debug && DebugCompleto) VerDebug("DibujarAnimacion");
    DibujarAnimacion();
    if (Debug && DebugCompleto) VerDebug("DibujarPieza");
    DibujarPieza();
    if (Debug && DebugCompleto) VerDebug("DibujarMarcador");
    DibujarMarcador();
    if (Debug)
        DibujarFPS();

    //dibuja en canvas real
    if (Debug && DebugCompleto) VerDebug("Flip");
    Flip(); 

    //ver si salir
    if (Debug && DebugCompleto) VerDebug("VerSalir");
    VerSalir();   
    if (!Salir) {
        IntervaloBucleJuego = RequestAnimationFrame.request(BucleJuego);
    }
}
