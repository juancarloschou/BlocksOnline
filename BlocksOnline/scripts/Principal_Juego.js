/////////////////////////////////////////////////////
// Blocks Online
// Desarrollo Juan Carlos Perez Casal
// Compañia AJU Software
// Realizado en 2015
// Todos los derechos reservados
/////////////////////////////////////////////////////





"use strict";

//-------------------------------------------------------------------------------------
//funciones inicializacion Juego

function SetJugador(numero, IA) {
    //rellena las variables del array Jugadores
    var jugador = new Jugador();

    jugador.JugadorIA = IA;

    //ejemplo velocidad e intervalo, a elegir
    jugador.Velocidad = 6;
    jugador.IntervaloVelocidad = GetIntervaloVelocidad(jugador.Velocidad);

    //ataques (mandar por linea), a elegir
    for (var linea = 1; linea <= 10; linea++)
        jugador.MandarLineas[linea] = linea - 1;

    //array de objetos jugadores
    Jugadores[numero] = jugador;
}

function GetNumeroJugadores() {
    var Num;
    Num = NumeroJugadores;
    if (TipoPartida == TipoPartidaOponenteIA)
        Num = 2;
    return Num;
}

function GetNumeroJugadoresTeclas() {
    if (TipoPartida == TipoPartidaPCDobles)
        return 2;
    else
        return 1;
}

function IniciarDefinirTeclas() {
    if (TecladoActivo) {
        if (GetNumeroJugadoresTeclas() == 1) {
            //definir teclas del jugador 1 (teclado estandar)
            var jugador = 0;
            Jugadores[jugador].DefinirTeclas[MoverIzq] = 37; //left
            Jugadores[jugador].DefinirTeclas[MoverDer] = 39; //right
            Jugadores[jugador].DefinirTeclas[MoverAba] = 40; //down
            Jugadores[jugador].DefinirTeclas[MoverAbaAll] = 16; //shift
            Jugadores[jugador].DefinirTeclas[MoverRotIzq] = 17; //control
            Jugadores[jugador].DefinirTeclas[MoverRotDer] = 38; //up
            //Jugadores[jugador].DefinirTeclas[MoverEsp] = 13; //enter (tecla especial, para ataques especiales)
        }

        if (GetNumeroJugadoresTeclas() == 2) {
            //definir teclas del jugador 1 (juega a la izquierda del teclado)
            var jugador = 0;
            Jugadores[jugador].DefinirTeclas[MoverIzq] = 70; //f
            Jugadores[jugador].DefinirTeclas[MoverDer] = 72; //h
            Jugadores[jugador].DefinirTeclas[MoverAba] = 71; //g
            Jugadores[jugador].DefinirTeclas[MoverAbaAll] = 83; //s
            Jugadores[jugador].DefinirTeclas[MoverRotIzq] = 65; //a
            Jugadores[jugador].DefinirTeclas[MoverRotDer] = 84; //t
            //Jugadores[jugador].DefinirTeclas[MoverEsp] = 68; //d

            //definir teclas del jugador 2 (juega a la derecha del teclado)
            var jugador = 1;
            Jugadores[jugador].DefinirTeclas[MoverIzq] = 37; //left
            Jugadores[jugador].DefinirTeclas[MoverDer] = 39; //right
            Jugadores[jugador].DefinirTeclas[MoverAba] = 40; //down
            Jugadores[jugador].DefinirTeclas[MoverAbaAll] = 16; //shift
            Jugadores[jugador].DefinirTeclas[MoverRotIzq] = 17; //control
            Jugadores[jugador].DefinirTeclas[MoverRotDer] = 38; //up
            //Jugadores[jugador].DefinirTeclas[MoverEsp] = 13; //enter (tecla especial, para ataques especiales)
        }

        //definir teclas globales
        DefinirTeclasGlobales[TeclaPausa] = 80; //p
        DefinirTeclasGlobales[TeclaSalir] = 27; //escape
        DefinirTeclasGlobales[TeclaDebug] = 54; //6
    }
}

function IniciarDefinirBotones() {
    if (BotoneraActivo) {
        var sh = 20; //separador horizontal
        var x = BotoneraX + CanvasPosicionX;
        var y = BotoneraY + CanvasPosicionY;
        var v = SpriteBoton - 1;

        DefinirBotones[MoverIzq].Set(x, y, SpriteBoton - 1, v, "", "");
        DefinirBotones[MoverDer].Set(x + SpriteBoton + sh, y, SpriteBoton * 2 - 1 + sh, v, "", "");

        //alinear estos botones a la parte derecha, por ergonomia
        var x2 = Canvas.width - SpriteBoton * 2 - sh - x;

        DefinirBotones[MoverRotDer].Set(x2, y, SpriteBoton - 1, v, "", "");
        DefinirBotones[MoverAba].Set(x2 + SpriteBoton + sh, y, SpriteBoton * 2 - 1 + sh, v, "", "");

        DefinirBotones[MoverRotIzq] = undefined;
        DefinirBotones[MoverAbaAll] = undefined;
    }
}

function IniciarJugador(jugador) {
    //inicializa variables del jugador, se reinicia en cada partida
    Jugadores[jugador].NumeroSiguientePieza = 0;
    Jugadores[jugador].ActualPieza = GenerarPieza(jugador);
    Jugadores[jugador].SiguientePieza = GenerarPieza(jugador);

    Jugadores[jugador].PiezaRotacion = 0;
    Jugadores[jugador].PiezaX = PosicionPiezaX; //4
    Jugadores[jugador].PiezaY = 0;
    Jugadores[jugador].TiempoVelocidad = new Date(); //gravedad pieza

    Jugadores[jugador].AnimacionBorrarLineas = 0; //sin animacion
    Jugadores[jugador].AnimacionBorrarPuntos = 0; //sin animacion
    Jugadores[jugador].AnimacionRecuadro = 0; //sin animacion

	//datos del marcador
    Jugadores[jugador].Lineas = 0;
    Jugadores[jugador].MayorLineas = 0;
    Jugadores[jugador].Deshacer = 0;
    Jugadores[jugador].MayorDeshacer = 0;
    Jugadores[jugador].Rapido = 0;
    Jugadores[jugador].MayorRapido = 0;
    Jugadores[jugador].Recuadro = 0;
    Jugadores[jugador].MayorRecuadro = 0;
    Jugadores[jugador].Perfect = 0;
    Jugadores[jugador].MayorPerfect = 0;

	//otras estadisticas partida
    Jugadores[jugador].MandarActual = 0; //ataque actual
    Jugadores[jugador].Mandar = 0; //total lineas mandadas (por lineas o deshacer)
	Jugadores[jugador].MayorMandar = 0; //mejor ataque hecho
	Jugadores[jugador].GemasActual = 0; //gemas actuales (en la pantalla)
	Jugadores[jugador].Gemas = 0; //numero de gemas obtenidas total
    Jugadores[jugador].MayorGemas = 0; //mejor gema obtenida
    Jugadores[jugador].BonusActual = 0; //bonus actual
	Jugadores[jugador].Bonus = 0; //numero de bonus totales
    Jugadores[jugador].MayorBonus = 0; //mejor bonus
    Jugadores[jugador].RecibidoActual = 0; //ataques recibidos (lineas suben) actual
	Jugadores[jugador].Recibido = 0; //numero de lineas recibidas total
    Jugadores[jugador].MayorRecibido = 0; //mejor ataque recibido
    Jugadores[jugador].LluviaRecibida = 0; //numero de lluvias recibidas
    Jugadores[jugador].PiezaMolestaRecibida = 0; //numero de piezas molestas recibidas
    Jugadores[jugador].MayorPiezaMolesta = 0; //mejor pieza molesta recibida		
	
    //juego
	Jugadores[jugador].BarraOponenteAltura = 0; //altura oponente
	Jugadores[jugador].BarraOponenteAlturaBlanco = 0; //altura blanco oponente
	Jugadores[jugador].Altura = 0; //altura propia
	Jugadores[jugador].AlturaBlanco = 0; //altura blanco propia
	
    Jugadores[jugador].PiezaGema = 0; //pieza actual sin gema
    Jugadores[jugador].PiezaSiguienteGema = new Array(); //cola de gemas siguientes que vendran en las piezas

    Jugadores[jugador].GemaLineasRapidoTiempo = new Array(); //array de tiempo en que se hace cada linea
	Jugadores[jugador].GemaLineasRapidoInicio = 0; //desde que elemento del array comprueba si se hacen lineas

    //velocidad movimiento teclado
    var mover;
    for (mover = 0; mover < MoverSize; mover++) {
        Jugadores[jugador].TiempoMoverVelocidad[mover] = null;
        Botonera_TiempoMoverVelocidad[mover] = null;
    }

    //gemas destruidas en lineas 
    VaciarLineasGemas(jugador); //inicia BonusGemas

    Jugadores[jugador].BonusActivo = false;
    Jugadores[jugador].BonusTiempo = null;
    //this.BonusNivel; //x1.5, x2, x5, x10 (lo tienes en BonusActual)
    Jugadores[jugador].BonusAtaque = 0; //nivel de ataque (% de lineas extra que mandas)
    Jugadores[jugador].BonusDefensa = 0; //nivel de defensa (% de lineas recibidas que se bloquean)
    Jugadores[jugador].BonusIntervalo = 0; //milisegundos duracion
    //animacion gemas
    Jugadores[jugador].BonusAnimacionGemas = false; //si esta la primera parte de la animacion activa, mueve gemas y muestra la cuenta
    Jugadores[jugador].BonusGemasMover = null; //array de posicion, destino y velocidad de cada gema
    var nivel;
    for (nivel = 0; nivel < GemaNivelSize; nivel++)
        Jugadores[jugador].BonusGemasContar[nivel] = 0; //array de niveles de gema con la cuenta de cada tipo
    //animacion bonus
    Jugadores[jugador].BonusAnimacionBonus = false; //desde este momento entra en bonus, pone la resta de gemas y muestra el intervalo de bonus
    Jugadores[jugador].BonusGemasAntes = 0; //gemas que habia en la pantalla
    Jugadores[jugador].BonusGemasResta = 0; //gemas destruidas, se restan de las de antes


    IniciarTablero(jugador);
}

function IniciarTablero(jugador) {
    //se reinicia en cada partida
    var x, y, color;

    //limpia tablero
    for (y = 0; y < TableroSizeV; y++) 
        for (x = 0; x < TableroSizeH; x++) 
            Jugadores[jugador].Tablero[x][y] = 0; //vacio

    color = 1; //el 1 es un bloque blanco, sin sombra, para los bordes
    x = 0; //borde izquierdo
    for (y = 0; y < TableroSizeV; y++) {
        Jugadores[jugador].Tablero[x][y] = color;
    }

    y = TableroSizeV - 1; //borde inferior
    for (x = 0; x < TableroSizeH; x++) {
        Jugadores[jugador].Tablero[x][y] = color;
    }

    x = TableroSizeH - 1; //borde derecho
    for (y = 0; y < TableroSizeV; y++) {
        Jugadores[jugador].Tablero[x][y] = color;
    }
}

function IniciarGlobales() {
    //inicializa variables globales
    Pausa = false;
    Salir = false;
    FinPartida = false;
    //Debug = true; //se define en la pantalla de prueba

    TiempoPartida = new Date(); //hora inicial partida
    IntervaloPausa = 0; //duracion total de las pausas/fin partidas
	OponenteIntervaloUltimaPausa = 0;
    SiguientePieza = new Array(); //inicializa piezas partida
	
	if (TipoPartida == TipoPartidaOponenteIA) {
		OponenteIA.ActualizarTiempo = new Date(); //hora inicial partida
	}
}

function CargarObjetosJuego() {
    //SetJugador: pone ejemplo de velocidad, intervalo, mandar por linea !!!

    if (TipoPartida == TipoPartidaOponenteIA) {
        if (Jugadores.length < 1) {
            //crear jugador 1
            SetJugador(0, false);
        }

        if (Jugadores.length < 2) {
            //crear Oponente IA
            SetJugador(1, true);
        }
    }
    else {
        if (Jugadores.length < 1) {
            //crear jugador 1
            SetJugador(0, false);
        }

        if (TipoPartida == TipoPartidaPCDobles) {
            if (Jugadores.length < 2) {
                //crear jugador 2
                SetJugador(1, false);
            }
        }
    }
}

function IniciarJuego() {

    var bDebug = false;

    Juego = true;

    //inicia la carga del juego

    //establece pantalla y define los elementos de la pantalla actual
    CargarPantalla(PantallaJuegoCargando);
	
	if (!JuegoRecursos) { //si no estan cargados los recursos, sino no da tiempo a escuchar la musica de cargando
		//PonerSonido(sCargandoPartida); //no va bien en pc, no da tiempo en movil!!!
	}

	if (DebugActivo && bDebug)
	    alert("IniciarJuego despues sonido cargando");

    //IniciarDispositivo(); //establece tamaño y configuracion dispositivo (ahora mismo la coge de combos de pantallla prueba!!!)
    //IniciarResolucion(); //establece los dos canvas, uno invisible para pintar y otro escalado para mostrar (ahora es menu principal el que la coge)

    CargarObjetosJuego(); //crea array y clases Jugadores, establece numero jugadores y velocidades (ahora es menu principal el que la coge)

    IniciarDefinirTeclas(); //definir teclas de ambos jugadores (deberian cargarse las definidas en las opciones)

    IniciarDefinirBotones(); //definir coordenadas botones

    if (DebugActivo && bDebug)
        alert("IniciarJuego despues definir botones");

    PantallaReiniciarCapturarTeclado(); //inicia teclas y botones
	
    IniciarMapaPiezas(); //declarada en MapaPiezas.js

    //IniciarTipoPartida(); //inicia modo historia

    if (!JuegoRecursos) { //si no estan cargados los recursos
        CargarRecursos();

        //codigo asincrono para bucle de espera de carga recursos
        IntervaloBucleRecursos = setInterval(BucleCargaRecursos, FrecuenciaCargaRecursos); //lanza funcion carga de recursos cada 50 milisegs
    }
    else {
        ContinuarCargarJuego();
    }
}

function IniciarCargarJuego() {
    var bDebug = false;

    if (Dispositivo == PC)
        if (TipoPartida == TipoPartidaPCDobles) //cuando cambiase la resolucion
            IniciarResolucion(false); //false pone resolucion dobles

    //IniciarCapturarEntrada(); //crea e inicializa los eventos de teclado, debe hacerse al comenzar la partida (depende do como organize la respuesta a los eventos en las diferentes pantallas)

    IniciarGlobales();

    for (var jugador = 0; jugador < GetNumeroJugadores() ; jugador++)
        IniciarJugador(jugador);

    if (DebugActivo && bDebug)
        alert("IniciarCargarJuego despues iniciar jugadores");

    PonerSonido(sComenzarPartida);

    //establece pantalla y define los elementos de la pantalla actual
    CargarPantalla(PantallaJuegoPartida);

}

function ContinuarCargarJuego() {
    var bDebug = false;

    if (DebugActivo && bDebug)
        alert("ContinuarCargarJuego inicio");

    //continua la carga del juego, despues de los recursos
    IniciarCargarJuego();

    if (typeof RequestAnimationFrame == "undefined")
        RequestAnimationFrame = new AnimationFrame();
    IntervaloBucleJuego = RequestAnimationFrame.request(BucleJuego);

}



//-------------------------------------------------------------------------------------
// funciones cargar recursos

/*
function ModificarImagenGemas() {
    //ahora la transparencia viene de la propia imagen y no hace falta
    if (false) {
        //pone transparencia a las gemas
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = iGemas.width;
        canvas.height = iGemas.height;
        context.globalAlpha = GemasTransparencia / 100; //50->0.5
        context.drawImage(iGemas, 0, 0);

        var datosImg = canvas.toDataURL();
        iGemas = new Image();
        iGemas.src = datosImg;
        canvas = null; context = null;
    }
}
*/

function CargarImagenes() {
    iBloques = new Image();
	if (PiezasNuevasActivo)
		iBloques.src = "images/bloques_nuevos.jpg";
	else
		iBloques.src = "images/bloques.png";
    RecursosTotal++;
    iBloques.onload = function () {
        RecursosCargados++;
    }

    iGemas = new Image();
	if (GemasNuevasActivo)
		iGemas.src = "images/gemas_nuevas.png"; //png24
	else
		iGemas.src = "images/gemas.png"; //png24
    RecursosTotal++;
    //RecursosTotal++; //otro por la imagen modificada
    iGemas.onload = function () {
        RecursosCargados++;
		//ModificarImagenGemas();
        //RecursosCargados++;
    }

    iBotones = new Image();
    iBotones.src = "images/botones.png";
    RecursosTotal++;
    iBotones.onload = function () {
        RecursosCargados++;
    }

    iFondoJuego = new Image();
    iFondoJuego.src = "images/juego_fondo.png";
    RecursosTotal++;
    iFondoJuego.onload = function () {
        RecursosCargados++;
    }

}

function CargarSonidos() {
    var bDebug = false;

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
                sPosarPieza = ImportarSonido("posar_pieza");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sCargandoPartida = ImportarSonido("cargando_partida");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sComenzarPartida = ImportarSonido("comenzar_partida");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sDeshacerPuntos = ImportarSonido("deshacer_puntos");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sHacerLinea = ImportarSonido("hacer_linea");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sGanar = ImportarSonido("ganar");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sPerder = ImportarSonido("perder");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sConseguirGema = ImportarSonido("conseguir_gema");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sUnirGema = ImportarSonido("unir_gema");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sDestruirGema = ImportarSonido("destruir_gema");
            }, 0);
            RecursosTotal++;
            setTimeout(function () {
                sRelojTermina = ImportarSonido("reloj_termina");
            }, 0);
        }
        else {
            AudioActivo = false;
        }
    }

    else if (Dispositivo == Movil) { //solo android !!!
        //if (DebugActivo && bDebug)
        //    alert("CargarSonidos inicio");

        sPosarPieza = ImportarSonido("posar_pieza");
        if (DebugActivo && bDebug)
            alert("CargarSonidos despues posar_pieza");

        sCargandoPartida = ImportarSonido("cargando_partida");
        if (DebugActivo && bDebug)
            alert("CargarSonidos despues cargando_partida");

        sComenzarPartida = ImportarSonido("comenzar_partida");
        if (DebugActivo && bDebug)
            alert("CargarSonidos despues comenzar_partida");

        sDeshacerPuntos = ImportarSonido("deshacer_puntos");
        if (DebugActivo && bDebug)
            alert("CargarSonidos despues deshacer_puntos");

        sHacerLinea = ImportarSonido("hacer_linea");
        sGanar = ImportarSonido("ganar");
        sPerder = ImportarSonido("perder");
        sConseguirGema = ImportarSonido("conseguir_gema");
        sUnirGema = ImportarSonido("unir_gema");
        sDestruirGema = ImportarSonido("destruir_gema");
        sRelojTermina = ImportarSonido("reloj_termina");
    }
}

function CargarRecursos() {
    var bDebug = false;

    TiempoRecursos = new Date(); //tiempo en que empieza la carga de recursos
    RecursosTotal = 0;
    RecursosCargados = 0;

    if (DebugActivo && bDebug)
        alert("CargarRecursos antes cargar imagenes");

    CargarImagenes(); //se cargan asincronamente, termina cuando RecursosCargados sea RecursosTotal

    if (DebugActivo && bDebug)
        alert("CargarRecursos despues cargar imagenes");

    CargarSonidos(); //se podria hacer barra de progreso con 100 * RecursosCargados / RecursosTotal

    if (DebugActivo && bDebug)
        alert("CargarRecursos despues cargar sonidos");
}

function BucleCargaRecursos() {
    var bDebug = false;

	//actualizar y dibujar el estado de la carga
	PantallaActualizarCargando();

	PantallaDibujarElementos();
	
    //dibuja en canvas real
	Flip();

    //espera hasta que se haya cargado la ultima imagen/sonido, o hasta que pase el tiempo limite de carga de recursos
    var ahora = new Date();
    if ((RecursosCargados >= RecursosTotal) || (ahora.getTime() - TiempoRecursos.getTime() > IntervaloRecursos)) {
        //termina bucle de espera carga recursos
        clearInterval(IntervaloBucleRecursos);

        if (DebugActivo && bDebug)
            alert("BucleCargaRecursos salir bucle");

        //error de carga
        if (DebugActivo)
            if (RecursosCargados < RecursosTotal)
                alert("Error de carga juego, sobrepasado limite " + Math.floor(IntervaloRecursos / 1000) + " segs");

        JuegoRecursos = true;

        //alert("RecursosCargados: " + RecursosCargados + ", RecursosTotal: " + RecursosTotal + ", AudioActivo: " + AudioActivo + ", tiempo pasado: " + (ahora.getTime() - TiempoRecursos.getTime()) + ", IntervaloRecursos: " + IntervaloRecursos);

        ContinuarCargarJuego();
    }
}



//-------------------------------------------------------------------------------------
//funciones definir pantallas juego

function PulsarResultadoContinuar() {
    if (TipoPartida == TipoPartidaOponenteIA) {
        var encuentro = Partidas[PartidaActual].ResultadosFases[Partidas[PartidaActual].FaseActual].EncuentroActual;
        if (Partidas[PartidaActual].ResultadosFases[Partidas[PartidaActual].FaseActual].Encuentros[encuentro].Terminado) {
            //si se ha terminado el encuentro volver a la pantalla anterior
            GuardarPartidas();
            Salir = true; //volver al menu
            VerSalir(); //salir de bucle juego
            CargarPantalla(PantallaAnterior); //pantalla anterior en el menu
            ContinuarCargarPantalla(); //iniciar bucle pantalla

        }
        else { //otra ronda
            GuardarPartidas();
            CargarPantalla(PantallaJuegoPartida);
            IniciarCargarJuego(); //reiniciar partida
        }
    }
    else {
        GuardarPartidas();
        CargarPantalla(PantallaAnterior); //pantalla anterior en el menu
        //donde se cambia Jugar = false ???
    }
}

function PonerPausa() {
    //falta cambiar a pantallajuegopausa!!!

    Pausa = !Pausa;
    if (Pausa)
        TiempoPausa = new Date();
    else {
        OponenteIntervaloUltimaPausa = (new Date()).getTime() - TiempoPausa.getTime();
        IntervaloPausa += OponenteIntervaloUltimaPausa;
    }
}

function PulsarPausa() {
    PonerPausa();
}



//-------------------------------------------------------------------------------------
//funciones logica del juego

function GetColorPieza(pieza, rotacion) {
	var color = ColorPieza[pieza];
	if (pieza == PiezaP)
		color = rotacion + 2;
	return color;
}

function GetRotacionPieza(pieza, rotacion) {
	var rot = rotacion;
	if (pieza == PiezaP)
		rot = 0;
	return rot;
}

function GetColorTablero(jugador, x, y) {
    var color = 1;
    if ((x >= 0) && (x < TableroSizeH) && (y >= 0) && (y < TableroSizeV)) {
        color = Jugadores[jugador].Tablero[x][y];
        //dejo 5 bits (32 numeros) para los colores, bits 6-10 son para las gemas
        if (color >= BitsNumeroColor)
            color = color % BitsNumeroColor;
    }
    return color;
}

function MascaraGema(nivel) {
    //var MascaraGema1 = 1 << 6; //bit 6 gema nivel 1
    //var MascaraGema5 = 1 << 10; //bit 10 gema nivel 5
    return 1 << (BitsGema - 1 + nivel);
}

function GetGemaTablero(jugador, x, y) {
    //devuelve el nivel de la gema (1-5) o 0 si no hay gema
    var gema = 0;
    if ((x >= 0) && (x < TableroSizeH) && (y >= 0) && (y < TableroSizeV)) {
        var color = Jugadores[jugador].Tablero[x][y];
        //dejo 5 bits (32 numeros) para los colores, bits 6-10 son para las gemas
        if (color >= BitsNumeroColor) {
            var nivel;
            for (nivel = 1; nivel <= GemaNivelSize; nivel++) {
                if (color & MascaraGema(nivel))
                    gema = nivel;
            }
        }
    }
    return gema;
}

function SetGemaTablero(jugador, x, y, gema) {
	var color = GetColorTablero(jugador, x, y);
	Jugadores[jugador].Tablero[x][y] = color | MascaraGema(gema);
}

function VaciarBorrarLineas(jugador)
{
    var y;
    for (y = 0; y < TableroSizeV - 1; y++) //hasta -1 porque ignoro el borde inferior
        Jugadores[jugador].BorrarLineasPosicion[y] = 0;
}

function VaciarBorrarPuntos(jugador) {
    var x, y;
    for (y = 0; y < TableroSizeV - 1; y++) //hasta -1 porque ignoro el borde inferior
        for (x = 1; x < TableroSizeH - 1; x++) //de 1 a -1 porque ignoro los bordes
            Jugadores[jugador].BorrarPuntosPosicion[x][y] = 0;
}

function VaciarGemaRecuadro(jugador) {
    var x, y;
    for (y = 0; y < TableroSizeV - 1; y++) //hasta -1 porque ignoro el borde inferior
        for (x = 1; x < TableroSizeH - 1; x++) //de 1 a -1 porque ignoro los bordes
            Jugadores[jugador].GemaRecuadroPosicion[x][y] = 0;
}

function VaciarLineasGemas(jugador) {
    //gemas destruidas en lineas 
    Jugadores[jugador].BonusGemas = 0; //cuantas gemas destruidas
	Jugadores[jugador].BonusGemasNivel = 0; //suma de los niveles de las gemas
	Jugadores[jugador].BonusGemasNivelMaximo = 0; //gema de mayor nivel
}

function ComprobarPuntos(jugador) {
    //si debajo del punto multicolor hay otro color igual desaparecen todos los colores coincidentes del tablero
	var color, puntos = 0, bPerfect = true;
	color = GetColorPieza(Jugadores[jugador].ActualPieza, Jugadores[jugador].PiezaRotacion);
	if (GetColorTablero(jugador, Jugadores[jugador].PiezaX + 1, Jugadores[jugador].PiezaY + 1) == color) {
        //para acelerarlo se deberian guardar los puntos a deshacer en un array, de paso podría saber cuantos puntos se han deshecho
	    VaciarBorrarPuntos(jugador);
	    var x, y;
	    for (y = 0; y < TableroSizeV - 1; y++) //hasta -1 porque ignoro el borde inferior
            for (x = 1; x < TableroSizeH - 1; x++) { //de 1 a -1 porque ignoro los bordes
                if (GetColorTablero(jugador, x, y) == color) {
                    Jugadores[jugador].BorrarPuntosPosicion[x][y] = 1;
                    puntos++;
                }
                else {
                    //si hay algun punto que no se deshace no es perfect
                    if (color > 0)
                        bPerfect = false;
                }
            }

	    PonerSonido(sDeshacerPuntos);

		//comprobar si ha logrado gema por deshacer muchos
        ComprobarDeshacerMuchos(jugador, puntos);

	    //comprobar si ha logrado gema por deshacer perfect
        Jugadores[jugador].BorrarPuntosPerfect = bPerfect;
        ComprobarPerfectDeshacer(jugador);

		//inicia animacion en los puntos
	    Jugadores[jugador].AnimacionBorrarPuntos = 1;
	    Jugadores[jugador].TiempoBorrarPuntos = new Date();
	}
}

function BorrarPuntos(jugador) {
    //recorre array de puntos a borrar
    var x, y, j, puntos = 0;
    for (y = 0; y < TableroSizeV - 1; y++) //hasta -1 porque ignoro el borde inferior
        for (x = 1; x < TableroSizeH - 1; x++)  //de 1 a -1 porque ignoro los bordes
            if (Jugadores[jugador].BorrarPuntosPosicion[x][y] == 1) {
                //el borrado se hace desde el punto hacia arriba
                for (j = y; j > 0; j--)
                    Jugadores[jugador].Tablero[x][j] = Jugadores[jugador].Tablero[x][j - 1]; //cada linea igual a la de encima
                //vacia la linea de arriba (no hay nada encima)
                Jugadores[jugador].Tablero[x][0] = 0;
                puntos++;
            }

	//estadisticas y resultados
    Jugadores[jugador].Deshacer += puntos; //aumenta contador borrar puntos
	if (puntos > Jugadores[jugador].MayorDeshacer)
		Jugadores[jugador].MayorDeshacer = puntos;	

    //mandar lineas por deshacer
    if (ExisteOponente()) {
        //manda una linea por cada MandarDeshacer puntos deshechos
        var atacar = Math.floor(puntos / Jugadores[jugador].MandarDeshacer);

        //mandar extra por deshacer perfect
        if (Jugadores[jugador].BorrarPuntosPerfect)
            atacar += PerfectDeshacerMandar;

        if (atacar > 0)
            MandarAtaque(jugador, atacar);
    }
	
	//despues de deshacer comprueba lineas
	ComprobarLineas(jugador);
}

function ComprobarLineas(jugador) {
    var bDebug = false;

    if (DebugActivo && bDebug) console.log("ComprobarLineas INI, jugador = " + jugador);

    var x, y, bLinea, lineas = 0;
    for (y = 0; y < TableroSizeV - 1; y++) { // hasta -1 porque ignoro el borde inferior
        bLinea = true;
        for (x = 1; (x < TableroSizeH - 1) && bLinea; x++) // de 1 a -1 porque ignoro los bordes
            if (Jugadores[jugador].Tablero[x][y] == 0)
                bLinea = false;
        if (bLinea) {
            if (lineas == 0)
                VaciarBorrarLineas(jugador);
            Jugadores[jugador].BorrarLineasPosicion[y] = 1;
            lineas++;
        }
    }

    if (lineas > 0) { //si hay alguna linea completa

        if (DebugActivo && bDebug) console.log("ComprobarLineas lineas = " + lineas);
        PonerSonido(sHacerLinea);

        //guarda el tiempo en que se ha hecho cada linea
        Jugadores[jugador].GemaLineasRapidoTiempo.push(new Date());
		
		//comprobar si hay gemas en las lineas hechas
		ComprobarLineasGemas(jugador);
        if (DebugActivo && bDebug) console.log("ComprobarLineas ComprobarLineasGemas");

        //comprobar si ha logrado gema por lineas rapido
        ComprobarLineasRapido(jugador);
        if (DebugActivo && bDebug) console.log("ComprobarLineas ComprobarLineasRapido");

        //comprobar si ha logrado gema por muchas lineas
        ComprobarMuchasLineas(jugador, lineas);
        if (DebugActivo && bDebug) console.log("ComprobarLineas ComprobarMuchasLineas");

        //comprobar si ha logrado gema por lineas perfect
        ComprobarPerfectLineas(jugador, lineas); //guarda el estado de lineas perfect

        if (DebugActivo && bDebug) console.log("ComprobarLineas ComprobarPerfectLineas");

        //inicia animacion en las lineas
        Jugadores[jugador].AnimacionBorrarLineas = 1;
        Jugadores[jugador].TiempoBorrarLineas = new Date();
    }

    if (DebugActivo && bDebug) console.log("ComprobarLineas FIN");

}

function BorrarLineas(jugador) {
    var x, y, j, lineas = 0;
    for (y = 0; y < TableroSizeV - 1; y++) { //hasta -1 porque ignoro el borde inferior
        if (Jugadores[jugador].BorrarLineasPosicion[y] == 1) {
            //el borrado se hace desde la linea completa hacia arriba
            for (j = y; j > 0; j--)
                for (x = 1; x < TableroSizeH - 1; x++) // de 1 a -1 porque ignoro los bordes
                    Jugadores[jugador].Tablero[x][j] = Jugadores[jugador].Tablero[x][j - 1]; //cada linea igual a la de encima
            //vacia la linea de arriba (no hay nada encima)
            for (x = 1; x < TableroSizeH - 1; x++) // de 1 a -1 porque ignoro los bordes
                Jugadores[jugador].Tablero[x][0] = 0;
            lineas++;
        }
    }

	//estadisticas y resultados
    Jugadores[jugador].Lineas += lineas; //aumenta contador lineas
	if (lineas > Jugadores[jugador].MayorLineas)
		Jugadores[jugador].MayorLineas = lineas;	

    //mandar lineas por hacer lineas
    if (ExisteOponente()) {
        //mandar dependiendo de las lineas que hagas
        var atacar = Jugadores[jugador].MandarLineas[lineas];

        //mandar extra por deshacer perfect
        if (Jugadores[jugador].BorrarLineasPerfect)
            atacar += PerfectLineasMandar;

        if (atacar > 0)
            MandarAtaque(jugador, atacar);
    }

    //mas tarde comprueba recuadro mismo color
    ComprobarRecuadro(jugador);
	//al final comprueba si las gemas se unen ???
	ComprobarGemas(jugador);
}

function ComprobarLineasGemas(jugador) {
    //ver si hace bonus porque hay gemas en las lineas hechas
    var x, y, gema, i, mover, gemasMover;
	VaciarLineasGemas(jugador);
    for (y = 0; y < TableroSizeV - 1; y++) { // hasta -1 porque ignoro el borde inferior
        if (Jugadores[jugador].BorrarLineasPosicion[y] == 1) { //si hay linea hecha
            for (x = 1; x < TableroSizeH - 1; x++) { // de 1 a -1 porque ignoro los bordes
                gema = GetGemaTablero(jugador, x, y)
                if (gema > 0) {
                    mover = new GemasMover();
                    mover.x = x * SpriteSize;
                    mover.y = y * SpriteSize;
                    mover.Nivel = gema;
                    gemasMover.push(mover);

                    Jugadores[jugador].BonusGemas++; //cuantas gemas destruidas
                    Jugadores[jugador].BonusGemasNivel += gema; //suma de los niveles de las gemas
                    if (gema > Jugadores[jugador].BonusGemasNivelMaximo) //gema de mayor nivel
                        Jugadores[jugador].BonusGemasNivelMaximo = gema;
                }
            }
		}
	}
	
	if (Jugadores[jugador].BonusGemas > 0) {
	    //falta ver si ya hay otro bonus anterior todavia activo !!!

	    PonerSonido(sDestruirGema); //retrasarlo hasta que termine animacion hacer lineas?

		Jugadores[jugador].BonusActivo = true;
		Jugadores[jugador].BonusTiempo = new Date();
        //duracion bonus
		Jugadores[jugador].BonusIntervalo = Jugadores[jugador].BonusGemasNivelMaximo * DuracionBonus;
        //estadisticas bonus
		Jugadores[jugador].BonusActual = Jugadores[jugador].BonusGemasNivel; //bonus actual (nivel)
		Jugadores[jugador].Bonus++; //numero de bonus totales
		if (Jugadores[jugador].BonusActual > Jugadores[jugador].MayorBonus) //mejor bonus
		    Jugadores[jugador].MayorBonus = Jugadores[jugador].BonusActual;
	    //estadisticas gemas
	    //Jugadores[jugador].GemasActual -= Jugadores[jugador].BonusGemas; //gemas actuales (en la pantalla)

	    //animacion
		for (i = 0; i < gemasMover.length; i++) {
		    gemasMover[i].DestinoX = BonusGemasDestino[gemasMover[i].Nivel].x;
		    gemasMover[i].DestinoY = BonusGemasDestino[gemasMover[i].Nivel].y;
            //ver distancia y calcular velocidad
        }
		Jugadores[jugador].BonusGemasMover = gemasMover;

	}
}

//function ComprobarDeshacerGemas

//function ComrpobarDeshacerCuadradoGemas

function ComprobarLineasRapido(jugador) {
	//comprobar si ha logrado gema por lineas rapido
	var i, ini, fin, inicio;
	inicio = Jugadores[jugador].GemaLineasRapidoInicio; //que empiece a mirar desde inicio y se salte las lineas anteriores
	fin = Jugadores[jugador].GemaLineasRapidoTiempo.length - 1;
	ini = fin - (GemaLineasRapidoLineas - 1); //desde ini a fin (3 ultimas lineas)
	if ((fin + 1 - inicio >= GemaLineasRapidoLineas) && (Jugadores[jugador].GemaLineasRapidoTiempo[fin].getTime() - Jugadores[jugador].GemaLineasRapidoTiempo[ini].getTime() <= GemaLineasRapidoIntervalo)) {
		//comprobar si es el segundo grupo de lineas, realizados los dos seguidos
		var fin2 = ini - 1;
		var ini2 = fin2 - (GemaLineasRapidoLineas - 1); //3 anteriores lineas a estas que estamos haciendo
		if ((ini2 >= 0) && (Jugadores[jugador].GemaLineasRapidoTiempo[fin2].getTime() - Jugadores[jugador].GemaLineasRapidoTiempo[ini2].getTime() <= GemaLineasRapidoIntervalo)) {
			//dos grupos de lineas consecutivos
		    //Jugadores[jugador].GemaLineasRapidoTiempo.splice(ini2, GemaLineasRapidoLineas * 2); //borra 6 ultimos elementos del array para no utilizar estas lineas en sucesivas comprobaciones
		    Jugadores[jugador].GemaLineasRapidoInicio = fin; //marca estas lineas para que la siguiente comprobacion se las salte y empiece en esa posicion
			SetPiezaGema(jugador, 1); //dos gemas
			SetPiezaGema(jugador, 1); 
		    //alert("lineas rapido 2");
			
			//estadisticas y resultados
			Jugadores[jugador].Rapido++;
			var mayorRapido = 2;
			if (mayorRapido > Jugadores[jugador].MayorRapido)
				Jugadores[jugador].MayorRapido = mayorRapido;
		}
		else {
			//un solo grupo de lineas
			Jugadores[jugador].GemaLineasRapidoInicio = fin; //marca estas lineas para que la siguiente comprobacion se las salte y empiece en esa posicion
			SetPiezaGema(jugador, 1); //una gema
			//alert("lineas rapido");
			
			//estadisticas y resultados
			Jugadores[jugador].Rapido++;
			var mayorRapido = 1;
			if (mayorRapido > Jugadores[jugador].MayorRapido)
				Jugadores[jugador].MayorRapido = mayorRapido;			
		}
	}
}

function ComprobarMuchasLineas(jugador, lineas) {
    //comprobar si ha logrado gema por muchas lineas
    if (lineas >= Gema2MuchasLineas) {
        SetPiezaGema(jugador, 1);
        SetPiezaGema(jugador, 1);
    }
    else if (lineas >= GemaMuchasLineas) {
        SetPiezaGema(jugador, 1);
    }
}

function ComprobarDeshacerMuchos(jugador, puntos) {
    //comprobar si ha logrado gema por deshacer muchos
    if (puntos >= Gema2DeshacerMuchos) {
        SetPiezaGema(jugador, 1);
        SetPiezaGema(jugador, 1);
    }
    else if (puntos >= GemaDeshacerMuchos) {
        SetPiezaGema(jugador, 1);
    }
}

function GetPiezaColor(color) {
    var p, pieza = PiezaI;
    for (p = 0; p < ColorPiezaSize; p++)
        if (ColorPieza[p] == color)
            pieza = p;
    return pieza;
}

function RecuadroPiezaExcluida(pieza) {
    var p, bExcluida = false;
    for (p = 0; p < GemaRecuadroExcepto.length; p++)
        if (GemaRecuadroExcepto[p] == pieza)
            bExcluida = true;
    return bExcluida;
}

function ComprobarRecuadroColor(jugador, x, y, color, bExcluida, gema, bDebug, pieza) {
    var i, j, lado, bRecuadro;

    if (bExcluida) {
        if (gema == 2)
            lado = Gema2RecuadroLadoExcepto;
        else
            lado = GemaRecuadroLadoExcepto;
    }
    else {
        if (gema == 2)
            lado = Gema2RecuadroLado;
        else
            lado = GemaRecuadroLado;
    }

    bRecuadro = true;
    i = 0; j = 0;
    do {
        if (GetColorTablero(jugador, x + i, y + j) != color)
            bRecuadro = false;
        i++;
        if (i >= lado) {
            i = 0;
            j++;
        }
    }
    while ((bRecuadro) && (j < lado))

    if (bRecuadro) {

        if (DebugActivo && bDebug) VerDebug("ComprobarRecuadro gema " + gema + ", color = " + color + ", pieza = " + pieza + ", bExcluida = " + bExcluida + ", lado = " + lado + ", x = " + x + ", y = " + y);

        Jugadores[jugador].AnimacionRecuadro = 1; //inicia animacion
        //array coordenadas del recuadro que se ha hecho
        VaciarGemaRecuadro(jugador);
        for (j = 0; j < lado; j++)
            for (i = 0; i < lado; i++)
                Jugadores[jugador].GemaRecuadroPosicion[x + i][y + j] = 1;
        Jugadores[jugador].GemaRecuadroLado = lado; //lado del recuadro
        Jugadores[jugador].GemaRecuadroGemas = gema; //numero de gemas a obtener
        Jugadores[jugador].TiempoRecuadro = new Date();
		
		//estadisticas y resultados
		Jugadores[jugador].Recuadro++;
		if (gema > Jugadores[jugador].MayorRecuadro)
			Jugadores[jugador].MayorRecuadro = gema;
    }

    return bRecuadro;
}

function ComprobarRecuadro(jugador) {
    //comprobar si se ha hecho un recuadro del mismo color
    var bDebug = false;

    if (DebugActivo && bDebug) VerDebug("ComprobarRecuadro INI");

    var x, y, color, pieza, bExcluida, gema, bRecuadro = false;
    for (y = 0; (y < TableroSizeV - 1) && !bRecuadro; y++) //hasta -1 porque ignoro el borde inferior
        for (x = 1; (x < TableroSizeH - 1) && !bRecuadro; x++) { // de 1 a -1 porque ignoro los bordes
            color = GetColorTablero(jugador, x, y);
            if ((color > 1) && (color != ColorMandar)) { //ni vacio 0, ni bordes 1, ni mandar

                pieza = GetPiezaColor(color);
                bExcluida = RecuadroPiezaExcluida(pieza);

                //ver si hay cuadrado grande de 2 gemas
                gema = 2;
                bRecuadro = ComprobarRecuadroColor(jugador, x, y, color, bExcluida, gema, bDebug, pieza);

                if (!bRecuadro) {
                    //ver si hay cuadrado pequeño de 1 gema
                    gema = 1;
                    bRecuadro = ComprobarRecuadroColor(jugador, x, y, color, bExcluida, gema, bDebug, pieza);
                }
            }
        }

    if (DebugActivo && bDebug) VerDebug("ComprobarRecuadro FIN");
}

function BorrarRecuadro(jugador) {
    //borra puntos del tablero, y pone gema en su lugar
    var x, y, j;
    var lado = Jugadores[jugador].GemaRecuadroLado;
    for (y = 0; y < TableroSizeV - 1; y++) //hasta -1 porque ignoro el borde inferior
        for (x = 1; x < TableroSizeH - 1; x++) //de 1 a -1 porque ignoro los bordes
            if (Jugadores[jugador].GemaRecuadroPosicion[x][y] == 1) {
                //el borrado se hace desde el punto hacia arriba
                for (j = y; j > 0; j--)
                    Jugadores[jugador].Tablero[x][j] = Jugadores[jugador].Tablero[x][j - 1]; //cada linea igual a la de encima
                //vacia la linea de arriba (no hay nada encima)
                Jugadores[jugador].Tablero[x][0] = 0;
            }
    //falta poner la gema en el lugar del recuadro!!! por ahora que sea una nueva pieza con gema
    SetPiezaGema(jugador, 1);
    if (Jugadores[jugador].GemaRecuadroGemas == 2)
        SetPiezaGema(jugador, 1); //dos gemas
}

function ComprobarPerfectDeshacer(jugador, puntos) {
    //gema por perfect de deshacer
    if (Jugadores[jugador].BorrarPuntosPerfect) {
		
        if (puntos >= Gema2PerfectDeshacer) {			
            SetPiezaGema(jugador, 1);
            SetPiezaGema(jugador, 1);
			
			//estadisticas y resultados
			Jugadores[jugador].Perfect++;
			var mayorPerfect = 2;
			if (mayorPerfect > Jugadores[jugador].MayorPerfect)
				Jugadores[jugador].MayorPerfect = mayorPerfect;
        }
        else if (puntos >= GemaPerfectDeshacer) {
			SetPiezaGema(jugador, 1);
			
			//estadisticas y resultados
			Jugadores[jugador].Perfect++;
			var mayorPerfect = 1;
			if (mayorPerfect > Jugadores[jugador].MayorPerfect)
				Jugadores[jugador].MayorPerfect = mayorPerfect;
		}
    }
}

function ComprobarPerfectLineas(jugador, lineas) {
    //calcula y establece si hay perfect de lineas
    var x, y, bLinea, bContenido, bPerfect = true;
    for (y = 0; (y < TableroSizeV - 1) && bPerfect; y++) { // hasta -1 porque ignoro el borde inferior
        bLinea = true; bContenido = false;
        for (x = 1; x < TableroSizeH - 1; x++) // de 1 a -1 porque ignoro los bordes
            if (Jugadores[jugador].Tablero[x][y] == 0)
                bLinea = false;
            else
                bContenido = true;
        if (!bLinea && bContenido)
            bPerfect = false;
    }
    Jugadores[jugador].BorrarLineasPerfect = bPerfect;

    //gema por perfect de lineas
    if (Jugadores[jugador].BorrarLineasPerfect) {
        if (lineas >= Gema2PerfectLineas) {
            SetPiezaGema(jugador, 1);
            SetPiezaGema(jugador, 1);
			
			//estadisticas y resultados
			Jugadores[jugador].Perfect++;
			var mayorPerfect = 2;
			if (mayorPerfect > Jugadores[jugador].MayorPerfect)
				Jugadores[jugador].MayorPerfect = mayorPerfect;			
        }
        else if (lineas >= GemaPerfectLineas) {
            SetPiezaGema(jugador, 1);
			
			//estadisticas y resultados
			Jugadores[jugador].Perfect++;
			var mayorPerfect = 1;
			if (mayorPerfect > Jugadores[jugador].MayorPerfect)
				Jugadores[jugador].MayorPerfect = mayorPerfect;
		}				
    }
}

function GemaProcesada(gemasProcesadas, x, y) {
	//mira si la gema ya esta procesada
	var bProcesada = false;
	var i;
	for (i = 0; i < gemasProcesadas.length; i++)
		if ((gemasProcesadas[i].x == x) && (gemasProcesadas[i].y == y))
			bProcesada = true;						
	
	return bProcesada;
}

function UnirGemas(jugador, gemasProcesadas, gemasOrigen) {
	//primero deberia buscar 3 gemas juntas para unirlas (las 3 de nivel 1 -> 1 gema 3, al menos 1 de nivel 2 -> 3 gemas 2, al menos 2 de nivel 2 -> 2 gemas 3, al menos 1 de nivel 3 -> 2 gemas 3, al menos 2 de nivel 3 -> 3 gemas 3)
	//luego buscar 2 gemas juntas para unirlas (las 2 de nivel 1 -> 1 gema 2, al menos 1 de nivel 2 -> 2 gemas 2, al menos 2 de nivel 2 -> 1 gema 3, al menos 1 de nivel 3 -> 2 gemas 3)
	
	//no se puede tener un destino de dos gemas porque esas se uniran la siguiente vez que se compruebe esto, y hare que las de nivel 3 no se utilicen nunca, por tanto corrijo las uniones:
	//3 gemas: al menos 2 de nivel 3 -> nada, sino 1 de nivel 3 -> (las otras dos se unen) 2 gema 3, sino 3 de nivel 2 -> (1 se convierte y 2 se unen) 2 gema 3, sino al menos 1 de nivel 2 -> (esa se convierte) 1 gema 3 y (las otras se unen) 1 gema 2, sino -> (las 3 se unen) 1 gema 3
	//2 gemas: al menos 1 de nivel 3 -> nada, sino al menos 1 de nivel 2 -> (se unen) 1 gema 3, sino -> (se unen) 1 gema 2

	//calcula los niveles de las gemas origen
	var num = gemasOrigen.length;
	var gemasNiveles = new Array(num); //array de nivel de las gemas (1-3), las posiciones del array se corresponden a gemasOrigen
	var i, x, y;
	for (i = 0; i < num; i++) {
		x = gemasOrigen[i].x;
		y = gemasOrigen[i].y;
		gemasNiveles[i] = GetGemaTablero(jugador, x, y);
	}
	
	//calcula niveles de las gemas destino
	var bDestino = true; //decide si se hace conversion de gemas o se quedan como estan
	var gemasDestino = new Array(num); //array de posicion de las gemas destino, las posiciones del array se corresponden a gemasOrigen, si las gemas se unen apuntaran a la misma posicion
	var gemasDestinoNivel = new Array(num); //array de nivel de las gemas destino (1-3), las posiciones del array se corresponden a gemasOrigen
	var gemasDestinoEfecto = new Array(num); //array de efecto (0 no, 1 unir, 2 convertir), las posiciones del array se corresponden a gemasOrigen
	var numGemasDestino = 0; //cuenta las gemas destino
	
	var cuenta, g1, g2, g3, r;
	if (num == 3) { //3 gemas unidas
		//al menos 2 de nivel 3 -> nada
		cuenta = 0; //cuantas de nivel 3
		for (i = 0; i < num; i++)
			if (gemasNiveles[i] == 3)
				cuenta++;
		if (cuenta >= 2) {
			bDestino = false; //nada
		}
		else {
			//1 de nivel 3 -> (las otras dos se unen) 2 gema 3
			if (cuenta == 1) {
				//encuentra la gema nivel 3
				for (i = 0; i < num; i++)
					if (gemasNiveles[i] == 3)
						g3 = i; 
				gemasDestino[g3] = gemasOrigen[g3];
				gemasDestinoNivel[g3] = 3;
				gemasDestinoEfecto[g3] = 0; //no
				
				//une las otras gemas
				var bIni = true
				for (i = 0; i < num; i++)
				    if (i != g3) {
				        if (bIni) {
				            g1 = i; //resultante
				            bIni = false;
				        }
				        else {
				            g2 = i;
				            bIni = false;
				        }
				    }
				r = getRandomInt(0, 1); //una posibilidad entre 2 
				if (r == 0) { //los invierto, sino se quedan asi
					i = g1;
					g1 = g2;
					g2 = i;
				}
				gemasDestino[g1] = gemasOrigen[g1];
				gemasDestinoNivel[g1] = 3;
				gemasDestinoEfecto[g1] = 1; //unir (aqui va la gema resultante)
				gemasDestino[g2] = gemasOrigen[g1];
				gemasDestinoNivel[g2] = 3;
				gemasDestinoEfecto[g2] = 1; //unir
				
				numGemasDestino = 2;
			}
			else {
				//sino 3 de nivel 2 -> (1 se convierte y 2 se unen) 2 gema 3
				cuenta = 0; //cuantas de nivel 2
				for (i = 0; i < num; i++)
					if (gemasNiveles[i] == 2)
						cuenta++;
				if (cuenta == 3) {
					g1 = 0; //convertir
					g2 = 1; //unir (resultante)
					g3 = 2; //unir
					
					r = getRandomInt(0, 5); //una posibilidad entre 6 
					if (r == 0) { //los invierto
						g1 = 1;
						g2 = 0;
						g3 = 2;
					}
					else if (r == 1) { //los invierto
						g1 = 2;
						g2 = 0;
						g3 = 1;
					}
					else if (r == 2) { //los invierto
						g1 = 1;
						g2 = 2;
						g3 = 0;
					}
					else if (r == 3) { //los invierto
						g1 = 2;
						g2 = 1;
						g3 = 0;
					}
					else if (r == 4) { //los invierto
						g1 = 0;
						g2 = 2;
						g3 = 1;
					}
					//sino se quedan asi

					gemasDestino[g1] = gemasOrigen[g1];
					gemasDestinoNivel[g1] = 3;
					gemasDestinoEfecto[g1] = 2; //convertir
					gemasDestino[g2] = gemasOrigen[g2];
					gemasDestinoNivel[g2] = 3;
					gemasDestinoEfecto[g2] = 1; //unir (aqui va la gema resultante)
					gemasDestino[g3] = gemasOrigen[g2];
					gemasDestinoNivel[g3] = 3;
					gemasDestinoEfecto[g3] = 1; //unir
					
					numGemasDestino = 2;
				}
				else { 
					//al menos 1 de nivel 2 -> (esa se convierte) 1 gema 3 y (las otras se unen) 1 gema 2
					if (cuenta >= 1) {	
						//encuentra la gema nivel 2
						for (i = 0; i < num; i++)
							if (gemasNiveles[i] == 2)
								g3 = i; 
						gemasDestino[g3] = gemasOrigen[g3];
						gemasDestinoNivel[g3] = 3;
						gemasDestinoEfecto[g3] = 2; //convertir
						
						//une las otras gemas
						var bIni = true
						for (i = 0; i < num; i++)
						    if (i != g3) {
						        if (bIni) {
						            g1 = i;
						            bIni = false;
						        }
						        else {
						            g2 = i;
						            bIni = false;
						        }
						    }
						r = getRandomInt(0, 1); //una posibilidad entre 2 
						if (r == 0) { //los invierto, sino se quedan asi
							i = g1;
							g1 = g2;
							g2 = i;
						}
						gemasDestino[g1] = gemasOrigen[g1];
						gemasDestinoNivel[g1] = 2;
						gemasDestinoEfecto[g1] = 1; //unir (aqui va la gema resultante)
						gemasDestino[g2] = gemasOrigen[g1];
						gemasDestinoNivel[g2] = 2;
						gemasDestinoEfecto[g2] = 1; //unir
						
						numGemasDestino = 2;
					}
					else { 
						//sino -> (las 3 se unen) 1 gema 3
						g1 = 0; //unir (resultante)
						g2 = 1; //unir
						g3 = 2; //unir
						
						r = getRandomInt(0, 2); //una posibilidad entre 3 
						if (r == 0) { //los invierto
							g1 = 1;
							g2 = 0;
							g3 = 2;
						}
						else if (r == 1) { //los invierto
							g1 = 1;
							g2 = 2;
							g3 = 0;
						}
						//sino se quedan asi
						
						gemasDestino[g1] = gemasOrigen[g1];
						gemasDestinoNivel[g1] = 3;
						gemasDestinoEfecto[g1] = 1; //unir (aqui va la gema resultante)
						gemasDestino[g2] = gemasOrigen[g1];
						gemasDestinoNivel[g2] = 3;
						gemasDestinoEfecto[g2] = 1; //unir
						gemasDestino[g3] = gemasOrigen[g1];
						gemasDestinoNivel[g3] = 3;
						gemasDestinoEfecto[g3] = 1; //unir

						numGemasDestino = 1;
					}
				}
			}
		}
	}
	
	else if (num == 2) { //2 gemas unidas
		//al menos 1 de nivel 3 -> nada
		cuenta = 0; //cuantas de nivel 3
		for (i = 0; i < num; i++)
			if (gemasNiveles[i] == 3)
				cuenta++;
		if (cuenta >= 1) {
			bDestino = false; //nada
		}
		else {
			//al menos 2 de nivel 2 -> (se unen) 1 gema 3
			cuenta = 0; //cuantas de nivel 2
			for (i = 0; i < num; i++)
				if (gemasNiveles[i] == 2)
					cuenta++;
			if (cuenta >= 2) {
			    g1 = 0; //unir (resultante)
			    g2 = 1; //unir

			    r = getRandomInt(0, 1); //una posibilidad entre 2 
			    if (r == 0) { //los invierto
			        g1 = 1;
			        g2 = 0;
			    }
			    //sino se quedan asi

				gemasDestino[g1] = gemasOrigen[g1];
				gemasDestinoNivel[g1] = 3;
				gemasDestinoEfecto[g1] = 1; //unir (aqui va la gema resultante)
				gemasDestino[g2] = gemasOrigen[g1];
				gemasDestinoNivel[g2] = 3;
				gemasDestinoEfecto[g2] = 1; //unir
						
				numGemasDestino = 1;
			}
			else if (cuenta >= 1) {
				//al menos 1 de nivel 2 -> (se unen) 1 gema 3
			    //encuentra la gema nivel 2
			    for (i = 0; i < num; i++)
			        if (gemasNiveles[i] == 2)
			            g1 = i; //unir (resultante)
			        else
			            g2 = i; //unir

				gemasDestino[g1] = gemasOrigen[g1];
				gemasDestinoNivel[g1] = 3;
				gemasDestinoEfecto[g1] = 1; //unir (aqui va la gema resultante)
				gemasDestino[g2] = gemasOrigen[g1];
				gemasDestinoNivel[g2] = 3;
				gemasDestinoEfecto[g2] = 1; //unir
						
				numGemasDestino = 1;
			}
			else {
				//sino -> (se unen) 1 gema 2
				g1 = 0; //unir (resultante)
				g2 = 1; //unir
				
				r = getRandomInt(0, 1); //una posibilidad entre 2 
				if (r == 0) { //los invierto
					g1 = 1;
					g2 = 0;
				}
				//sino se quedan asi
				gemasDestino[g1] = gemasOrigen[g1];
				gemasDestinoNivel[g1] = 2;
				gemasDestinoEfecto[g1] = 1; //unir (aqui va la gema resultante)
				gemasDestino[g2] = gemasOrigen[g1];
				gemasDestinoNivel[g2] = 2;
				gemasDestinoEfecto[g2] = 1; //unir
						
				numGemasDestino = 1;				
			}
		}
	}
	else
	    bDestino = false; //nada


	//inicia las animaciones de los efectos unir y convertir
	//que se agrande la gema a 64 (tener esos sprites aparte), se pondran un poco por encima (o en la misma fila), que se junten horizontalmente las que se van a unir
	//luego que se conviertan todas (las para unir y las para convertir), luego que se empequeñezcan las gemas a 32 y se pongan en su posicion destino
    //Falta!!!

	//quita las gemas origen y pone las gemas destino de la union
	if (bDestino) {
	    PonerSonido(sUnirGema);

	    for (i = 0; i < num; i++) {
			if (gemasDestinoEfecto[i] == 1) { //unir
				//quita gema origen
				SetGemaTablero(jugador, gemasOrigen[i].x, gemasOrigen[i].y, 0);
				//pone gema destino
				SetGemaTablero(jugador, gemasDestino[i].x, gemasDestino[i].y, gemasDestinoNivel[i]);
			}
			else if (gemasDestinoEfecto[i] == 2) { //convertir
				//quita gema origen
				SetGemaTablero(jugador, gemasOrigen[i].x, gemasOrigen[i].y, 0);
				//pone gema destino
				SetGemaTablero(jugador, gemasDestino[i].x, gemasDestino[i].y, gemasDestinoNivel[i]);
			}
		}

		//marca todas las gemasOrigen como gemasProcesadas, o solo las gemasDestino???
		var coord;
		for (i = 0; i < num; i++) {
			var coord = new Coordenadas();
			if (bDestino)
				coord.Set(gemasDestino[i].x, gemasDestino[i].y);
			else
				coord.Set(gemasOrigen[i].x, gemasOrigen[i].y);
			gemasProcesadas.push(coord);
		}
	}
	
	return bDestino; //indica si se encontraron gemas juntas 
}

function ComprobarGemas(jugador) {
	//busca gemas una junto a la otra para unirlas, cuando encuentres varias juntas, marcarlas para no utilizarlas al seguir buscando
		
    var x, y, gema, gemasProcesadas, gemasJuntas, x1, y1, numJuntas, coord, bHayJuntas, buscar;
	gemasJuntas = new Array(); //array de coordenadas, guarda las gemas que estan juntas (gemasOrigen)
	gemasProcesadas = new Array(); //array de coordenadas, guarda las gemas juntas ya procesadas
    for (y = 0; y < TableroSizeV - 1; y++) { // hasta -1 porque ignoro el borde inferior
        for (x = 1; x < TableroSizeH - 1; x++) { // de 1 a -1 porque ignoro los bordes
            gema = GetGemaTablero(jugador, x, y);
			if (gema > 0) {
				if (!GemaProcesada(gemasProcesadas, x, y)) {
					//buscar si hay 3 gemas juntas
					buscar = 3; //el objetivo de gemas juntas a encontrar
					bHayJuntas = false;
					if (!bHayJuntas) { //horizontal izquierda
						numJuntas = 1; 
						gemasJuntas = new Array(); //coordenadas de las gemas juntas
						coord = new Coordenadas();
						coord.Set(x, y);
						gemasJuntas.push(coord);
						x1 = x; y1 = y;
						for (x1 = x - (buscar - 1); x1 < x; x1++) {
						    gema = GetGemaTablero(jugador, x1, y1);
						    if (gema > 0) {
						        if (!GemaProcesada(gemasProcesadas, x1, y1)) {
						            numJuntas++;
						            coord = new Coordenadas();
						            coord.Set(x1, y1);
						            gemasJuntas.push(coord);
						        }
						    }
						}
						if (numJuntas == buscar)
							bHayJuntas = UnirGemas(jugador, gemasProcesadas, gemasJuntas);
					}
					if (!bHayJuntas) { //horizontal derecha
						numJuntas = 1; 
						gemasJuntas = new Array(); //coordenadas de las gemas juntas
						coord = new Coordenadas();
						coord.Set(x, y);
						gemasJuntas.push(coord);
						x1 = x; y1 = y;
						for (x1 = x + 1; x1 < x + buscar; x1++) {
						    gema = GetGemaTablero(jugador, x1, y1);
						    if (gema > 0) {
						        if (!GemaProcesada(gemasProcesadas, x1, y1)) {
						            numJuntas++;
						            coord = new Coordenadas();
						            coord.Set(x1, y1);
						            gemasJuntas.push(coord);
						        }
						    }
						}
						if (numJuntas == buscar)
							bHayJuntas = UnirGemas(jugador, gemasProcesadas, gemasJuntas);
					}
					if (!bHayJuntas) { //vertical arriba
						numJuntas = 1; 
						gemasJuntas = new Array(); //coordenadas de las gemas juntas
						coord = new Coordenadas();
						coord.Set(x, y);
						gemasJuntas.push(coord);
						x1 = x; y1 = y;
						for (y1 = y - (buscar - 1); y1 < y; y1++) {
						    gema = GetGemaTablero(jugador, x1, y1);
						    if (gema > 0) {
						        if (!GemaProcesada(gemasProcesadas, x1, y1)) {
						            numJuntas++;
						            coord = new Coordenadas();
						            coord.Set(x1, y1);
						            gemasJuntas.push(coord);
						        }
						    }
						}
						if (numJuntas == buscar)
							bHayJuntas = UnirGemas(jugador, gemasProcesadas, gemasJuntas);
					}
					if (!bHayJuntas) { //vertical abajo
						numJuntas = 1; 
						gemasJuntas = new Array(); //coordenadas de las gemas juntas
						coord = new Coordenadas();
						coord.Set(x, y);
						gemasJuntas.push(coord);
						x1 = x; y1 = y;
						for (y1 = y + 1; y1 < y + buscar; y1++) {
						    gema = GetGemaTablero(jugador, x1, y1);
						    if (gema > 0) {
						        if (!GemaProcesada(gemasProcesadas, x1, y1)) {
						            numJuntas++;
						            coord = new Coordenadas();
						            coord.Set(x1, y1);
						            gemasJuntas.push(coord);
						        }
						    }
						}
						if (numJuntas == buscar)
							bHayJuntas = UnirGemas(jugador, gemasProcesadas, gemasJuntas);								
					}
					
					//si no hay 3 juntas busca 2 juntas
					if (!bHayJuntas) {
						//buscar si hay 2 gemas juntas
						buscar = 2; //el objetivo de gemas juntas a encontrar
						bHayJuntas = false;
						if (!bHayJuntas) { //horizontal izquierda
							numJuntas = 1; 
							gemasJuntas = new Array(); //coordenadas de las gemas juntas
							coord = new Coordenadas();
							coord.Set(x, y);
							gemasJuntas.push(coord);
							x1 = x; y1 = y;
							for (x1 = x - (buscar - 1); x1 < x; x1++) {
							    gema = GetGemaTablero(jugador, x1, y1);
							    if (gema > 0) {
							        if (!GemaProcesada(gemasProcesadas, x1, y1)) {
							            numJuntas++;
							            coord = new Coordenadas();
							            coord.Set(x1, y1);
							            gemasJuntas.push(coord);
							        }
							    }
							}
							if (numJuntas == buscar)
								bHayJuntas = UnirGemas(jugador, gemasProcesadas, gemasJuntas);
						}
						if (!bHayJuntas) { //horizontal derecha
							numJuntas = 1; 
							gemasJuntas = new Array(); //coordenadas de las gemas juntas
							coord = new Coordenadas();
							coord.Set(x, y);
							gemasJuntas.push(coord);
							x1 = x; y1 = y;
							for (x1 = x + 1; x1 < x + buscar; x1++) {
							    gema = GetGemaTablero(jugador, x1, y1);
							    if (gema > 0) {
							        if (!GemaProcesada(gemasProcesadas, x1, y1)) {
							            numJuntas++;
							            coord = new Coordenadas();
							            coord.Set(x1, y1);
							            gemasJuntas.push(coord);
							        }
							    }
							}
							if (numJuntas == buscar)
								bHayJuntas = UnirGemas(jugador, gemasProcesadas, gemasJuntas);
						}
						if (!bHayJuntas) { //vertical arriba
							numJuntas = 1; 
							gemasJuntas = new Array(); //coordenadas de las gemas juntas
							coord = new Coordenadas();
							coord.Set(x, y);
							gemasJuntas.push(coord);
							x1 = x; y1 = y;
							for (y1 = y - (buscar - 1); y1 < y; y1++) {
							    gema = GetGemaTablero(jugador, x1, y1);
							    if (gema > 0) {
							        if (!GemaProcesada(gemasProcesadas, x1, y1)) {
							            numJuntas++;
							            coord = new Coordenadas();
							            coord.Set(x1, y1);
							            gemasJuntas.push(coord);
							        }
							    }
							}
							if (numJuntas == buscar)
								bHayJuntas = UnirGemas(jugador, gemasProcesadas, gemasJuntas);
						}
						if (!bHayJuntas) { //vertical abajo
							numJuntas = 1; 
							gemasJuntas = new Array(); //coordenadas de las gemas juntas
							coord = new Coordenadas();
							coord.Set(x, y);
							gemasJuntas.push(coord);
							x1 = x; y1 = y;
							for (y1 = y + 1; y1 < y + buscar; y1++) {
							    gema = GetGemaTablero(jugador, x1, y1);
							    if (gema > 0) {
							        if (!GemaProcesada(gemasProcesadas, x1, y1)) {
							            numJuntas++;
							            coord = new Coordenadas();
							            coord.Set(x1, y1);
							            gemasJuntas.push(coord);
							        }
							    }
							}
							if (numJuntas == buscar)
								bHayJuntas = UnirGemas(jugador, gemasProcesadas, gemasJuntas);								
						}
					}
				}
			}
        }
    }
	
}

function SetPiezaGema(jugador, nivel) {
    //añadir las gemas a la cola
    Jugadores[jugador].PiezaSiguienteGema.push(nivel);
}

function GetPiezaGema(jugador) {
    //obtener las gemas de la cola (las va borrando de la cola)
    var gema = Jugadores[jugador].PiezaSiguienteGema.shift();
    if (typeof gema == "undefined")
        gema = 0;
    return gema;
}

function CabePieza(jugador, pX, pY, rotacion) {
    var x, y;
    rotacion = GetRotacionPieza(Jugadores[jugador].ActualPieza, rotacion);
    for (y = 0; y < MapaPiezaSizeV; y++)
        for (x = 0; x < MapaPiezaSizeH; x++) {
            //MapaPieza[piezas][rotation(4)][vertical blocks(10)][horizontal blocks(10)]
            if (MapaPieza[Jugadores[jugador].ActualPieza][rotacion][y][x] != 0)
                if ((pY - PosicionPiezaY + y >= 0) && (pY - PosicionPiezaY + y < TableroSizeV) && 
                    (pX - PosicionPiezaX + x + 1 >= 0) && (pX - PosicionPiezaX + x + 1 < TableroSizeH)) {
                    //en caso contrario estaria mirando fuera del tablero y ahi siempre cabe
                    if (Jugadores[jugador].Tablero[pX - PosicionPiezaX + x + 1][pY - PosicionPiezaY + y] != 0)
                        return false;
                }
        }
    return true;
}

function GetNuevaPieza() {
    var pieza, r;

    //getRandomInt(0, PiezaSize - 1);

    //prueba!!!
    //if (getRandomInt(0, 12) != 0)
    //    pieza = PiezaI;
    //else

    if (getRandomInt(0, 6) == 0) { //una posibilidad entre 7 
        r = getRandomInt(0, 99);
        if (r < 28) //28
            pieza = Pieza2;
        else if (r < 56) //28
            pieza = Pieza3;
        else //44
            pieza = PiezaP; //punto multicolor
    }
    else {
        if (getRandomInt(0, 6) == 0) {
            r = getRandomInt(0, 99); 
            if (r < 23) //23
                pieza = Pieza10; //larga 10
            else if (r < 56) //33
                pieza = Pieza8; //larga 8
            else //44
                pieza = Pieza6; //larga 6
        }
        else
            if (getRandomInt(0, 4) == 0)
                pieza = PiezaI; //larga 4
            else
                pieza = getRandomInt(1, 6); //resto (PiezaJ ... PiezaT)
    }

    return pieza;
}

function GenerarPieza(jugador) {
    var pieza;
    var numero = Jugadores[jugador].NumeroSiguientePieza;
    
    if (numero >= SiguientePieza.length) {

        pieza = GetNuevaPieza();
		
        SiguientePieza.push(pieza)
    }
    else {
        pieza = SiguientePieza[numero];
    }

    Jugadores[jugador].NumeroSiguientePieza++;
    return pieza;
}

function GetSiguientePieza(jugador) {
    var altura = GetAltura(jugador); //calcula altura actual
    var alturaBlanco = GetAlturaBlanco(jugador); //calcula altura actual
    //informar al oponente de la altura actual propia (si ha cambiado)
    OponenteAltura(jugador, altura, alturaBlanco);

    //prueba para tener muchas gemas
	if (DebugGemasActivo) {
		if (getRandomInt(0, 1) == 0)
			SetPiezaGema(jugador, getRandomInt(0, 2) + 1);
	}

    //ver si hay gemas en la ficha siguiente
    var gema = GetPiezaGema(jugador); //borra la gema de la cola
    if (gema > 0) {
        Jugadores[jugador].PiezaGema = gema;
        PonerSonido(sConseguirGema);
    }
    else
        Jugadores[jugador].PiezaGema = 0;

    //las piezas deben ser las mismas para ambos jugadores
    Jugadores[jugador].ActualPieza = Jugadores[jugador].SiguientePieza;
    Jugadores[jugador].SiguientePieza = GenerarPieza(jugador);

    Jugadores[jugador].PiezaRotacion = 0;
    Jugadores[jugador].PiezaX = PosicionPiezaX; //4
    Jugadores[jugador].PiezaY = 0; //arriba
    Jugadores[jugador].TiempoVelocidad = new Date(); //reinicia gravedad

    //comprobar si fin partida
    if (!CabePieza(jugador, Jugadores[jugador].PiezaX, Jugadores[jugador].PiezaY, Jugadores[jugador].PiezaRotacion)) {
        PonerPiezaTablero(jugador);
        TerminarPartidaPierde(jugador);
    }
}

function PonerPiezaTablero(jugador) {
    var bDebug = false;

    if (DebugActivo && bDebug) VerDebug("PonerPiezaTablero INI");

    PonerSonido(sPosarPieza); //pieza choca con el suelo

    if (DebugActivo && bDebug) VerDebug("PonerPiezaTablero. PonerSonido");

    var x, y, color, rotacion, gema;
    color = GetColorPieza(Jugadores[jugador].ActualPieza, Jugadores[jugador].PiezaRotacion);
    rotacion = GetRotacionPieza(Jugadores[jugador].ActualPieza, Jugadores[jugador].PiezaRotacion);
    gema = Jugadores[jugador].PiezaGema;
    for (y = 0; y < MapaPiezaSizeV; y++)
        for (x = 0; x < MapaPiezaSizeH; x++) {
            //MapaPieza[piezas][rotation(4)][vertical blocks(10)][horizontal blocks(10)]
            if (MapaPieza[Jugadores[jugador].ActualPieza][rotacion][y][x] > 0)
                Jugadores[jugador].Tablero[Jugadores[jugador].PiezaX - PosicionPiezaX + x + 1][Jugadores[jugador].PiezaY - PosicionPiezaY + y] = color;

            if (gema > 0) 
                if (MapaPieza[Jugadores[jugador].ActualPieza][rotacion][y][x] == 2) { //la gema se coloca en el lugar marcado con un 2
                    SetGemaTablero(jugador, Jugadores[jugador].PiezaX - PosicionPiezaX + x + 1, Jugadores[jugador].PiezaY - PosicionPiezaY + y, gema);
                    //estadisticas
                    Jugadores[jugador].GemasActual++; //gemas actuales (en la pantalla)
                    Jugadores[jugador].Gemas++; //numero de gemas obtenidas total
                    if (gema > Jugadores[jugador].MayorGemas)
                        Jugadores[jugador].MayorGemas = gema; //mejor gema obtenida

                }
        }

    if (DebugActivo && bDebug) VerDebug("PonerPiezaTablero PonerPieza");

    //primero deshacer puntos
    if (Jugadores[jugador].ActualPieza == PiezaP)
        ComprobarPuntos(jugador);

    if (DebugActivo && bDebug) VerDebug("PonerPiezaTablero ComprobarPuntos");

    //despues de deshacer comprueba lineas
    if (Jugadores[jugador].AnimacionBorrarPuntos == 0)
        ComprobarLineas(jugador);

    if (DebugActivo && bDebug) VerDebug("PonerPiezaTablero ComprobarLineas");

    //despues de deshacer y de las lineas se comprueban ataques recibidos
    if ((Jugadores[jugador].AnimacionBorrarPuntos == 0) && (Jugadores[jugador].AnimacionBorrarLineas == 0))
        ComprobarRecibir(jugador);

    if (DebugActivo && bDebug) VerDebug("PonerPiezaTablero ComprobarRecibir");
    
    //mas tarde comprueba recuadro mismo color
    if ((Jugadores[jugador].AnimacionBorrarPuntos == 0) && (Jugadores[jugador].AnimacionBorrarLineas == 0))
        ComprobarRecuadro(jugador);

	if (DebugActivo && bDebug) VerDebug("PonerPiezaTablero ComprobarGemas");
    
    //al final comprueba si las gemas se unen
    if ((Jugadores[jugador].AnimacionBorrarPuntos == 0) && (Jugadores[jugador].AnimacionBorrarLineas == 0) && (Jugadores[jugador].AnimacionRecuadro == 0))
        ComprobarGemas(jugador);

    if (DebugActivo && bDebug) VerDebug("PonerPiezaTablero FIN");
}

function GetIntervaloVelocidad(velocidad) {
    //devuelve el intervalo según la velocidad (0-VelocidadSize), cada cuanto caen las piezas
    var intervalo; //en milisegundos
    intervalo = Math.pow((VelocidadSize - velocidad) / VelocidadSize, 2) * 2000;

    return intervalo;
}

function TerminarPartidaPierde(jugador) {
	//indica al oponente que ha ganado y termina partida
	FinPartida = true;
	Pausa = true;
	TiempoPausa = new Date();
	Jugadores[jugador].Ganar = false; //indica que pierde
	OponenteGanar(jugador);
	
	//hacemos pausa para ver mensajes de fin de partida (OK/KO) y escuchar sonido, se cuenta tiempo hasta intervalo, entonces se pasa a pantalla resultado partida
	FinPartidaTiempo = new Date();

	//poner resultados en partida, para que la pantalla de resultado pueda mostrarlos
	if (TipoPartida == TipoPartidaOponenteIA) {
		var fase = Partidas[PartidaActual].FaseActual;
		var encuentro = Partidas[PartidaActual].ResultadosFases[fase].EncuentroActual;
		var resultado = Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].ResultadoActual;

		var ganarAvatar; //para el resultado fase
		if (jugador == JugadorOponenteIA) { //si el que pierde es el animal
		    ganarAvatar = true;
		    Jugadores[JugadorHumanoContraIA].Ganar = true; //indica que gana
		    Partidas[PartidaActual].GanarFase = true; //para que el avatar se mueva y se actualice la fase (en el mapa)
        }
		else {
		    ganarAvatar = false;
		    Jugadores[JugadorOponenteIA].Ganar = true; //indica que gana el oponente
        }

		//pone datos resultado
		Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].Resultados[resultado].Set(new Date(), GetTiempo(), ganarAvatar, 
			Jugadores[JugadorHumanoContraIA].Lineas, Jugadores[JugadorHumanoContraIA].MayorLineas, Jugadores[JugadorHumanoContraIA].Deshacer, 
			Jugadores[JugadorHumanoContraIA].MayorDeshacer, Jugadores[JugadorHumanoContraIA].Rapido, Jugadores[JugadorHumanoContraIA].MayorRapido, 
			Jugadores[JugadorHumanoContraIA].Recuadro, Jugadores[JugadorHumanoContraIA].MayorRecuadro, Jugadores[JugadorHumanoContraIA].Perfect, 
			Jugadores[JugadorHumanoContraIA].Mandar, Jugadores[JugadorHumanoContraIA].MayorMandar, Jugadores[JugadorHumanoContraIA].Gemas, 
			Jugadores[JugadorHumanoContraIA].MayorGemas, Jugadores[JugadorHumanoContraIA].Bonus, Jugadores[JugadorHumanoContraIA].MayorBonus, 
			Jugadores[JugadorHumanoContraIA].Recibido, Jugadores[JugadorHumanoContraIA].MayorRecibido, Jugadores[JugadorHumanoContraIA].LluviaRecibida, 
			Jugadores[JugadorHumanoContraIA].PiezaMolestaRecibida, Jugadores[JugadorHumanoContraIA].MayorPiezaMolesta);
			
		//pone datos encuentro
		var ganarRondas = Math.floor(Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].MaxResultados / 2);
		if (Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].ResultadoAvatar >= ganarRondas) {
			Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].GanarAvatar = true;
			Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].Terminado = true;
		}
		else if (Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].ResultadoOponente >= ganarRondas) {
			Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].GanarAvatar = false;
			Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].Terminado = true;
		}

	}
	else {
		//pendiente ver como almacenar el resultado de las partidas en maraton o dos jugadores (juntos o online)
		//habra que crear una variable resultado suelta, salvo en el online, que tendra una BD para guardar los resultados
		// !!!
	}
}

function ExisteAnimacion(jugador) {
    if ((Jugadores[jugador].AnimacionBorrarLineas == 0) && (Jugadores[jugador].AnimacionBorrarPuntos == 0) && (Jugadores[jugador].AnimacionRecuadro == 0))
		return false;
	else
		return true;
}



//-------------------------------------------------------------------------------------
//funciones del juego para oponentes (PvP o PvC)

function ComprobarRecibir(jugador) {
	//comprueba si hay que recibir un ataque
    var recibir = Jugadores[jugador].RecibidoActual;
    if (recibir > 0) {
        var xRecibir = GetRecibirX(jugador); //coord x del hueco
        var r, x, y;
        for (r = 0; r < recibir; r++) {
            //cada linea es igual a la de debajo
            for (y = 0; y < TableroSizeV - 2; y++) // hasta -1 porque ignoro el borde inferior
                for (x = 1; x < TableroSizeH - 1; x++) // de 1 a -1 porque ignoro los bordes
                    Jugadores[jugador].Tablero[x][y] = Jugadores[jugador].Tablero[x][y + 1];
            //creo linea blanca abajo de todo
            y = TableroSizeV - 2;
            for (x = 1; x < TableroSizeH - 1; x++) // de 1 a -1 porque ignoro los bordes
                if (x == xRecibir)
                    Jugadores[jugador].Tablero[x][y] = 0; //hueco
                else
                    Jugadores[jugador].Tablero[x][y] = ColorMandar;
        }
        Jugadores[jugador].RecibidoActual = 0; //borra las lineas que ya ha recibido
		
		TerminarAtaque(jugador); //borra las lineas que mando el oponente
    }
}

function GetRecibirX(jugador) {
    //decide donde poner el hueco del ataque recibido
    var xRecibir = 5;
    var y = TableroSizeV - 2;
    var x = 5;
    if (Jugadores[jugador].Tablero[x][y] == 0)
        return x;
    var x = 6;
    if (Jugadores[jugador].Tablero[x][y] == 0)
        return x;
    var x = 4;
    if (Jugadores[jugador].Tablero[x][y] == 0)
        return x;
    var x = 7;
    if (Jugadores[jugador].Tablero[x][y] == 0)
        return x;
    var x = 3;
    if (Jugadores[jugador].Tablero[x][y] == 0)
        return x;
    var x = 8;
    if (Jugadores[jugador].Tablero[x][y] == 0)
        return x;
    var x = 2;
    if (Jugadores[jugador].Tablero[x][y] == 0)
        return x;
    var x = 9;
    if (Jugadores[jugador].Tablero[x][y] == 0)
        return x;
    var x = 1;
    if (Jugadores[jugador].Tablero[x][y] == 0)
        return x;
    var x = 10;
    if (Jugadores[jugador].Tablero[x][y] == 0)
        return x;
    return xRecibir;
}

function TerminarAtaque(jugador) {
    //borra las lineas que mando el oponente porque ya se recibieron
    if (TipoPartida == TipoPartidaPCDobles) {
        if (jugador == 0)
            Jugadores[1].MandarActual = 0;
        else if (jugador == 1)
            Jugadores[0].MandarActual = 0;
    }
    else if (TipoPartida == TipoPartidaOponenteIA) {
        if (jugador == 0)
            Jugadores[1].MandarActual = 0;
        else if (jugador == 1)
            Jugadores[0].MandarActual = 0;
	}
	//if (TipoPartida == TipoPartidaOponenteRed) //online
}

function MandarAtaque(jugador, lineas) {
    Jugadores[jugador].Mandar += lineas; //ataques totales mandados
	Jugadores[jugador].MandarActual += lineas; //ataque concreto (se borra al recibirlo)
	//comprobar si hay bonus? Jugadores[jugador].BonusActual = ...

    if (TipoPartida == TipoPartidaPCDobles) {
        if (jugador == 0)
            Jugadores[1].RecibidoActual += lineas;
        else if (jugador == 1)
            Jugadores[0].RecibidoActual += lineas;
    }
	else if (TipoPartida == TipoPartidaOponenteIA) {
	    if (jugador == 0)
	        Jugadores[1].RecibidoActual += lineas;
	    else if (jugador == 1)
	        Jugadores[0].RecibidoActual += lineas;
    }
	//if (TipoPartida == TipoPartidaOponenteRed) //online
}

function GetAltura(jugador) {
	var x, y, color;
	var bEncontradoPuntoColor = false;
	var altura = 0;
	for (y = 0; (y < TableroSizeV - 1) && !bEncontradoPuntoColor; y++) // hasta -1 porque ignoro el borde inferior
	    for (x = 1; (x < TableroSizeH - 1) && !bEncontradoPuntoColor; x++) { // de 1 a -1 porque ignoro los bordes
	        color = GetColorTablero(jugador, x, y);
			if ((color != 0) && (color != ColorMandar)) {
				bEncontradoPuntoColor = true;
				altura = TableroSizeV - 1 - y;
			}
		}
	return altura;
}

function GetAlturaBlanco(jugador) {
	var x, y, color;
	var bEncontradoPuntoBlanco = false;
	var alturaBlanco = 0;
	for (y = 0; (y < TableroSizeV - 1) && !bEncontradoPuntoBlanco; y++) // hasta -1 porque ignoro el borde inferior
         for (x = 1; (x < TableroSizeH - 1) && !bEncontradoPuntoBlanco; x++) { // de 1 a -1 porque ignoro los bordes
             color = GetColorTablero(jugador, x, y);
             if (color == ColorMandar) {
				bEncontradoPuntoBlanco = true;
				alturaBlanco = TableroSizeV - 1 - y;
			}
		}
	return alturaBlanco;
}

function OponenteAltura(jugador, nuevaAltura, nuevaAlturaBlanco) {
    //si no recibo lineas, calculo la altura, sino sumo lineas a la anterior
    if (ExisteOponente()) {
		var alturaAntes = Jugadores[jugador].Altura; //altura anterior
		var alturaBlancoAntes = Jugadores[jugador].AlturaBlanco;
		Jugadores[jugador].Altura = nuevaAltura; //guarda nueva altura
		Jugadores[jugador].AlturaBlanco = nuevaAlturaBlanco;
		
		//si ha cambiado la altura informa al oponente
		if ((alturaAntes != nuevaAltura) || (alturaBlancoAntes != nuevaAlturaBlanco)) {
		    if ((TipoPartida == TipoPartidaPCDobles) || (TipoPartida == TipoPartidaOponenteIA)) {
				if (jugador == 0) {
				    Jugadores[1].BarraOponenteAltura = nuevaAltura;
					Jugadores[1].BarraOponenteAlturaBlanco = nuevaAlturaBlanco;
				}
				else if (jugador == 1) {
				    Jugadores[0].BarraOponenteAltura = nuevaAltura;
					Jugadores[0].BarraOponenteAlturaBlanco = nuevaAlturaBlanco;
				}
			}
			//if (TipoPartida == TipoPartidaOponenteRed) //online
		}
    }
}

function OponenteGanar(jugador) {
	//indica al otro jugador que ha ganado
    if (TipoPartida == TipoPartidaPCDobles) {
        if (jugador == 0)
            Jugadores[1].Ganar = true;
        else if (jugador == 1)
            Jugadores[0].Ganar = true;
        
        PonerSonido(sGanar);
    }
	else if (TipoPartida == TipoPartidaOponenteIA) {
	    if (jugador == JugadorOponenteIA)
	        PonerSonido(sGanar);
	    else
	        PonerSonido(sPerder);
	}
    //else if (TipoPartida == TipoPartidaOponenteRed) //online
	else if(TipoPartida == TipoPartidaMaraton) {
	    PonerSonido(sPerder);
	}
}

function ExisteOponente() {
	if ((TipoPartida == TipoPartidaPCDobles) || (TipoPartida == TipoPartidaOponenteIA) || (TipoPartida == TipoPartidaOponenteRed))
		return true;
	else
		return false;
}



//-------------------------------------------------------------------------------------
//funciones Oponente IA

function ActualizarOponenteIA() {
    if ((TipoPartida == TipoPartidaOponenteIA) && !Pausa) {
        //velocidad juego
        var ahora = new Date();
        if (ahora.getTime() - OponenteIA.ActualizarTiempo.getTime() - OponenteIntervaloUltimaPausa > OponenteIA.ActualizarIntervalo) {
            //si ha pasado el tiempo (segun velocidad) coloca la pieza que estaba jugando y recibe otra
            OponenteIA.ActualizarTiempo = ahora;
			OponenteIntervaloUltimaPausa = 0;

            //aumentar la altura a medida que va poniendo fichas (segun velocidad)
            //con una capacidad de lineas muy baja, habra tantos huecos que subirá aún mas rápido (pondra las fichas en columnas)

            //comprueba si hay que recibir un ataque
			var altura = Jugadores[JugadorOponenteIA].Altura;
			var alturaBlanco = Jugadores[JugadorOponenteIA].AlturaBlanco;
			var recibir = Jugadores[JugadorOponenteIA].RecibidoActual;
			if (recibir > 0) {
			    alturaBlanco += recibir;
			    Jugadores[JugadorOponenteIA].RecibidoActual = 0; //borra las lineas que ya ha recibido
			    TerminarAtaque(JugadorOponenteIA); //borra las lineas que mando el oponente
			}

            //ver si hace lineas
            var lineas = 0;
            var p = OponenteIA.ProbabilidadLineas * NivelSize; //probabilidad (1-100)
            if (getRandomInt(1, NivelSize) <= p) {
                //ver cuantas lineas segun su nivel ataque y capacidad lineas
                lineas = 1;
                altura -= lineas;
                if (altura < 0)
                    altura = 0;
               OponenteAltura(JugadorOponenteIA, altura, alturaBlanco);

                //var atacar = 0; //lineas ataque, falta !!!
                //MandarAtaque(JugadorOponenteIA, atacar) ; 
            }
            else { //no hace linea, pone pieza y aumenta altura
                p = Math.round((NivelSize - OponenteIA.CapacidadLineas) / 2); //en el peor caso una de cada dos piezas aumenta altura
                if (getRandomInt(1, NivelSize) <= p) {
                    lineas = 4; //subirá una o varias lineas a la vez con un random, falta !!!
                    altura += lineas;
                }
                else {
                    //no hace nada, no aumenta altura
                }
                OponenteAltura(JugadorOponenteIA, altura, alturaBlanco);

                //comprobar si muere
				if (altura + alturaBlanco >= TableroSizeV - 4) {
				    //cuanto mas alto mas probable, y con peor capacidad defensiva mas probable
				    var altMax = altura;
				    if (altMax > TableroSizeV)
				        altMax = TableroSizeV;
				    p = Math.round((NivelSize - OponenteIA.CapacidadDefensa) / (TableroSizeV + 1 - altMax));
					if (getRandomInt(1, NivelSize) <= p) {
					    TerminarPartidaPierde(JugadorOponenteIA); //indica al oponente que ha ganado y termina la partida
					}
				}
            }
        }
    }
}

//function ComprobarRecibirIA(jugador) {
//    //comprueba si hay que recibir un ataque
//    var recibir = Jugadores[jugador].RecibidoActual;
//    if (recibir > 0) {
//        Jugadores[jugador].AlturaBlanco += Jugadores[jugador].RecibidoActual;

//        Jugadores[jugador].RecibidoActual = 0; //borra las lineas que ya ha recibido

//        TerminarAtaque(jugador); //borra las lineas que mando el oponente
//    }
//}



//-------------------------------------------------------------------------------------
//funciones mover piezas

function MoverIzquierda(jugador, teclado) {
    if (CabePieza(jugador, Jugadores[jugador].PiezaX - 1, Jugadores[jugador].PiezaY, Jugadores[jugador].PiezaRotacion)) {
        Jugadores[jugador].PiezaX -= 1;
        if (teclado)
            Jugadores[jugador].Teclado[MoverIzq] = 2; //keypress (debe soltarla)
        else
            Botonera[MoverIzq] = 2; //mouse press
    }
}

function MoverDerecha(jugador, teclado) {
    if (CabePieza(jugador, Jugadores[jugador].PiezaX + 1, Jugadores[jugador].PiezaY, Jugadores[jugador].PiezaRotacion)) {
        Jugadores[jugador].PiezaX += 1;
        if (teclado)
            Jugadores[jugador].Teclado[MoverDer] = 2; //keypress (debe soltarla)
        else
            Botonera[MoverDer] = 2; //mouse press
    }
}

function MoverAbajo(jugador, teclado) {
    var pY = Jugadores[jugador].PiezaY + 1;
    //si no puede bajar enconces poner en tablero la pieza, crear nueva pieza y pasa a estado keypress
    if (!CabePieza(jugador, Jugadores[jugador].PiezaX, pY, Jugadores[jugador].PiezaRotacion)) {

        //if (DebugActivo) VerDebug("MoverAbajo INI");

        PonerPiezaTablero(jugador);
        if (!ExisteAnimacion(jugador))
            GetSiguientePieza(jugador);
        if (teclado)
            Jugadores[jugador].Teclado[MoverAba] = 3; //keypress (debe soltarla)
        else
            Botonera[MoverAba] = 3; //mouse press

        //if (DebugActivo) VerDebug("MoverAbajo FIN");
    }
    else {
        Jugadores[jugador].PiezaY = pY;

        if (teclado)
            Jugadores[jugador].Teclado[MoverAba] = 2; //keypress (debe soltarla)
        else
            Botonera[MoverAba] = 2; //mouse press
    }
}

function MoverAbajoAll(jugador, teclado) {
    //bajar hasta el final y crear nueva pieza
    var pY = Jugadores[jugador].PiezaY + 1;
    while (CabePieza(jugador, Jugadores[jugador].PiezaX, pY, Jugadores[jugador].PiezaRotacion) && (pY < TableroSizeV)) {
        pY++;
    }
    Jugadores[jugador].PiezaY = pY - 1;
    PonerPiezaTablero(jugador);
    if (!ExisteAnimacion(jugador))
        GetSiguientePieza(jugador);
    if (teclado)
        Jugadores[jugador].Teclado[MoverAbaAll] = 2; //keypress (debe soltarla)
    else
        Botonera[MoverAbaAll] = 2; //mouse press
}

function MoverRotarIzquierda(jugador, teclado) {
    var rotacion = Jugadores[jugador].PiezaRotacion - 1;
    if (Jugadores[jugador].ActualPieza == PiezaP) {
        if (rotacion < 0)
            rotacion = ColorMandar - 2;
        else if (rotacion == ColorMandar - 2 - 1)
            rotacion = RotarPieza[Jugadores[jugador].ActualPieza] - 1;
    }
    else if (rotacion < 0) {
        rotacion = RotarPieza[Jugadores[jugador].ActualPieza] - 1;
    }

    if (CabePieza(jugador, Jugadores[jugador].PiezaX, Jugadores[jugador].PiezaY, rotacion)) {
        Jugadores[jugador].PiezaRotacion = rotacion;
        if (teclado)
            Jugadores[jugador].Teclado[MoverRotIzq] = 2; //keypress (debe soltarla)
        else
            Botonera[MoverRotIzq] = 2; //mouse press
    }
    else
        PonerSonido(sChoqueError);
}

function MoverRotarDerecha(jugador, teclado) {
    var rotacion = Jugadores[jugador].PiezaRotacion + 1;
    if (Jugadores[jugador].ActualPieza == PiezaP) {
        if (rotacion == ColorMandar - 2 + 1)
            rotacion = 0;
        else if (rotacion >= RotarPieza[Jugadores[jugador].ActualPieza])
            rotacion = ColorMandar - 2;
    }
    else if (rotacion >= RotarPieza[Jugadores[jugador].ActualPieza]) {
        rotacion = 0;
    }

    if (CabePieza(jugador, Jugadores[jugador].PiezaX, Jugadores[jugador].PiezaY, rotacion)) {
        Jugadores[jugador].PiezaRotacion = rotacion;
        if (teclado)
            Jugadores[jugador].Teclado[MoverRotDer] = 2; //keypress (debe soltarla)
        else
            Botonera[MoverRotDer] = 2; //mouse press
    }
    else
        PonerSonido(sChoqueError);
}


		
//-------------------------------------------------------------------------------------
//funciones actualizar el juego

function VelocidadMoverPieza(jugador, mover) {
    var bTouch = false;
    var ahora = new Date();
    if ((Botonera[mover] == 2) && (typeof TiempoTouchStart[mover] != "undefined") && (ahora.getTime() - TiempoTouchStart[mover].getTime() > IntervaloTouchStart[mover])) {
        if (Botonera_TiempoMoverVelocidad[mover] == null) 
            Botonera_TiempoMoverVelocidad[mover] = ahora; //inicia velocidad
        else if (ahora.getTime() - Botonera_TiempoMoverVelocidad[mover].getTime() > IntervaloVelocidad[mover]) {
            Botonera_TiempoMoverVelocidad[mover] = ahora;
            bTouch = true;
        }
	}
    else {
        Botonera_TiempoMoverVelocidad[mover] = null;
	}
	return bTouch;
}

function VelocidadMoverPiezaTeclado(jugador, mover) {
	var bTouch = false;
	var ahora = new Date();
	if ((Jugadores[jugador].Teclado[mover] == 2) && (typeof Jugadores[jugador].TiempoKeyDown[mover] != "undefined") && (ahora.getTime() - Jugadores[jugador].TiempoKeyDown[mover].getTime() > IntervaloKeyDown[mover])) {
	    if (Jugadores[jugador].TiempoMoverVelocidad[mover] == null)
	        Jugadores[jugador].TiempoMoverVelocidad[mover] = ahora; //inicia velocidad
	    else if (ahora.getTime() - Jugadores[jugador].TiempoMoverVelocidad[mover].getTime() > IntervaloVelocidad[mover]) {
	        Jugadores[jugador].TiempoMoverVelocidad[mover] = ahora;
	        bTouch = true;
	    }
	}
	else {
	    Jugadores[jugador].TiempoMoverVelocidad[mover] = null;
	}
	return bTouch;
}

function ActualizarMoverPieza(jugador) {
	if (Pantalla == PantallaJuegoPartida) {
		if (!ExisteAnimacion(jugador) && !Pausa && !Jugadores[jugador].JugadorIA) {
			var bTouch = false;

			//botones 
			if (BotoneraActivo) {
				//Touch +++++++++++++++++++++++++++
				//Mouse +++++++++++++++++++++++++++
				
				//horizontal
				bTouch = VelocidadMoverPieza(jugador, MoverIzq);
				if ((Botonera[MoverIzq] == 1) || bTouch) {
					MoverIzquierda(jugador, false);
				}
				bTouch = VelocidadMoverPieza(jugador, MoverDer);
				if ((Botonera[MoverDer] == 1) || bTouch) {
					MoverDerecha(jugador, false);
				}

				//abajo
				bTouch = VelocidadMoverPieza(jugador, MoverAba);
				if ((Botonera[MoverAba] == 1) || bTouch) {
					MoverAbajo(jugador, false);
				}
				if (Botonera[MoverAbaAll] == 1) {
					MoverAbajoAll(jugador, false);
				}

				//rotar
				bTouch = VelocidadMoverPieza(jugador, MoverRotIzq);
				if ((Botonera[MoverRotIzq] == 1) || bTouch) {
					MoverRotarIzquierda(jugador, false);
				}
				bTouch = VelocidadMoverPieza(jugador, MoverRotDer);
				if ((Botonera[MoverRotDer] == 1) || bTouch) {
					MoverRotarDerecha(jugador, false);
				}
			}

			if (TecladoActivo) {
				//Teclas +++++++++++++++++++++++++++

				//horizontal
				bTouch = VelocidadMoverPiezaTeclado(jugador, MoverIzq);
				if ((Jugadores[jugador].Teclado[MoverIzq] == 1) || bTouch) {
					MoverIzquierda(jugador, true);
				}
				bTouch = VelocidadMoverPiezaTeclado(jugador, MoverDer);
				if ((Jugadores[jugador].Teclado[MoverDer] == 1) || bTouch) {
					MoverDerecha(jugador, true);
				}

				//abajo
				bTouch = VelocidadMoverPiezaTeclado(jugador, MoverAba);
				if ((Jugadores[jugador].Teclado[MoverAba] == 1) || bTouch) {
					MoverAbajo(jugador, true);
				}
				if (Jugadores[jugador].Teclado[MoverAbaAll] == 1) {
					MoverAbajoAll(jugador, true);
				}

				//rotar
				bTouch = VelocidadMoverPiezaTeclado(jugador, MoverRotIzq);
				if ((Jugadores[jugador].Teclado[MoverRotIzq] == 1) || bTouch) {
					MoverRotarIzquierda(jugador, true);
				}
				bTouch = VelocidadMoverPiezaTeclado(jugador, MoverRotDer);
				if ((Jugadores[jugador].Teclado[MoverRotDer] == 1) || bTouch) {
					MoverRotarDerecha(jugador, true);
				}
			}
		}
	}
}

function ActualizarControles() {
    //teclas globales
    if (TecladoActivo) {
		if (Pantalla == PantallaJuegoPartida) {
		    if (TecladoGlobal[TeclaPausa] == 1) {
		        PonerPausa();

		        //no puedo parar el bucle porque sino no se actualizan las teclas !!!
				//(habria que crear un bucle para esto o optimizar el dibujado para que no dibuje si no hay cambios)

				TecladoGlobal[TeclaPausa] = 2; //keypress (debe soltarla)
			}
		}

        if (TecladoGlobal[TeclaSalir] == 1) {
            //pedir confirmacion

            //Salir = true; //al final del bucle de juego sale y vuelve a menu (provisional!!!)
            PulsarBotonAtras();

            TecladoGlobal[TeclaSalir] = 2; //keypress (debe soltarla)
        }

        if (TecladoGlobal[TeclaDebug] == 1) {
            Debug = !Debug;
            //alert("Debug: " + Debug);
            TecladoGlobal[TeclaDebug] = 2; //keypress (debe soltarla)
        }
    }
}

function ActualizarGravedadPieza(jugador) {
	if (Pantalla == PantallaJuegoPartida) {
		if (!ExisteAnimacion(jugador) && !Pausa && !Jugadores[jugador].JugadorIA) {
			var ahora = new Date();
			if (ahora.getTime() - Jugadores[jugador].TiempoVelocidad.getTime() > Jugadores[jugador].IntervaloVelocidad) {
				//si ha pasado el tiempo (segun velocidad) baja la pieza
				Jugadores[jugador].TiempoVelocidad = ahora;

				var pY = Jugadores[jugador].PiezaY + 1;
				//si no puede bajar enconces poner en tablero la pieza y crear nueva pieza
				if (!CabePieza(jugador, Jugadores[jugador].PiezaX, pY, Jugadores[jugador].PiezaRotacion)) {
					PonerPiezaTablero(jugador);
					if (!ExisteAnimacion(jugador))
						GetSiguientePieza(jugador);

					if (TecladoActivo) {
						if (Jugadores[jugador].Teclado[MoverAba] == 1)
							Jugadores[jugador].Teclado[MoverAba] = 2; //keypress (debe soltarla)
					}
					else if (TouchActivo) {
						if (Botonera[MoverAba] == 1)
							Botonera[MoverAba] = 2; //touch press
					}
					else {
						if (Botonera[MoverAba] == 1)
							Botonera[MoverAba] = 2; //mouse press
					}
				}
				else
					Jugadores[jugador].PiezaY = pY;
			}
		}
	}
}

function ActualizarAnimacion(jugador) {
	if (Pantalla == PantallaJuegoPartida) {
		if (!Pausa && !Jugadores[jugador].JugadorIA) {
			if (Jugadores[jugador].AnimacionBorrarPuntos > 0) {
				//animacion se deshacen puntos
				var ahora = new Date();
				if (ahora.getTime() - Jugadores[jugador].TiempoBorrarPuntos.getTime() > IntervaloBorrarPuntos) {
					//si ha pasado el tiempo del tramo de la animación
					Jugadores[jugador].TiempoBorrarPuntos = ahora;

					Jugadores[jugador].AnimacionBorrarPuntos++;
					if (Jugadores[jugador].AnimacionBorrarPuntos > AnimacionBorrarPuntosSize - 1) {
						Jugadores[jugador].AnimacionBorrarPuntos = 0;
						BorrarPuntos(jugador); //borra puntos del tablero y aumenta marcador de borrar puntos, comprueba lineas
						if (Jugadores[jugador].AnimacionBorrarLineas == 0) {
							//despues de deshacer y de las lineas se comprueban ataques recibidos
							ComprobarRecibir(jugador); 
							//mas tarde se comprueba recuadro mismo color
							ComprobarRecuadro(jugador);
							//al final comprueba si las gemas se unen
							ComprobarGemas(jugador);
							
							GetSiguientePieza(jugador);
						}
					}
				}
			}

			if (Jugadores[jugador].AnimacionBorrarLineas > 0) {
				//animacion se hacen lineas
				var ahora = new Date();
				if (ahora.getTime() - Jugadores[jugador].TiempoBorrarLineas.getTime() > IntervaloBorrarLineas) {
					//si ha pasado el tiempo del tramo de la animación
					Jugadores[jugador].TiempoBorrarLineas = ahora;

					Jugadores[jugador].AnimacionBorrarLineas++;
					if (Jugadores[jugador].AnimacionBorrarLineas > AnimacionBorrarLineasSize - 1) {
						Jugadores[jugador].AnimacionBorrarLineas = 0;
						//borra lineas del tablero y aumenta marcador de lineas
						BorrarLineas(jugador); 
						//despues de deshacer y de las lineas se comprueban ataques recibidos
						ComprobarRecibir(jugador); 
						//mas tarde comprueba recuadro mismo color
						ComprobarRecuadro(jugador); 
						//al final comprueba si las gemas se unen
						ComprobarGemas(jugador);
						
						GetSiguientePieza(jugador);
					}
				}
			}

			if (Jugadores[jugador].AnimacionRecuadro > 0) {
				//animacion se disuelve el recuadro
				var ahora = new Date();
				if (ahora.getTime() - Jugadores[jugador].TiempoRecuadro.getTime() > IntervaloRecuadro) {
					//si ha pasado el tiempo del tramo de la animación
					Jugadores[jugador].TiempoRecuadro = ahora;

					Jugadores[jugador].AnimacionRecuadro++;
					if (Jugadores[jugador].AnimacionRecuadro > AnimacionRecuadroSize - 1) {
						Jugadores[jugador].AnimacionRecuadro = 0;
						BorrarRecuadro(jugador); //borra puntos del tablero y pone gema en su lugar
						GetSiguientePieza(jugador);
					}
				}
			}
		}
		
		if (FinPartida) {
			//espera a que pase un tiempo desde fin partida hasta cambio pantalla resultado
			var ahora = new Date();
			if (ahora.getTime() - FinPartidaTiempo.getTime() > FinPartidaIntervalo) {
			    FinPartida = false; //termina animacion

			    if (Dispositivo == PC)
			        if (TipoPartida == TipoPartidaPCDobles)
			            IniciarResolucion(true); //si es de dobles vuelve a resolucion normal

				CargarPantalla(PantallaJuegoResultadoPartida); //pone resultado partida
			}
		}
	}
	
	else if (Pantalla == PantallaJuegoResultadoPartida) {
	    if (TipoPartida == TipoPartidaOponenteIA) {
	        //anima el marcador de los resultados, agranda el texto y actualiza el resultado
	        if (ResultadoMarcadorEscala == ResultadoMarcadorEscalaInicio) {
	            var ahora = new Date();
	            if (ahora.getTime() - ResultadoMarcadorTiempo.getTime() > ResultadoMarcadorIntervalo) {
	                ResultadoMarcadorEscala = ResultadoMarcadorEscalaFinal; //agranda

	                //aumentar a uno el marcador del que ha ganado
	                var ganarAvatar = false;
	                if (Jugadores[JugadorHumanoContraIA].Ganar)
	                    ganarAvatar = true;
	                var fase = Partidas[PartidaActual].FaseActual;
	                var encuentro = Partidas[PartidaActual].ResultadosFases[fase].EncuentroActual;
	                if (ganarAvatar)
	                    Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].ResultadoAvatar++;
	                else
	                    Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].ResultadoOponente++;
	            }
	        }
	    }
	}
}
    
function ActualizarFPS() {
    NumeroFrames++; //numero de frames que han pasado

    //calcular si ha pasado un segundo para actualizar el marcador
    var ahora = new Date();
    if (typeof TiempoFPS != "undefined") {
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
        //RequestAnimationFrame.cancel(IntervaloBucleJuego);

        //document.getElementById("divCanvas").style["display"] = "none"; //!!!

        //IniciarMenuPrincipal();

        //quitar musica...
    }
}

function ForzarSalir() {
    GuardarPartidas();

    RequestAnimationFrame = new AnimationFrame();
    RequestAnimationFrame.cancel(IntervaloBucleJuego); //probar!!!

    Salir = true;
}

function GetTiempo() { 
	//devuelve ms
    var intervalo = (new Date()).getTime() - TiempoPartida.getTime();
    //restarle el tiempo que esta en pausa
    var intervaloPausa = IntervaloPausa;
    if (Pausa)
        intervaloPausa += (new Date()).getTime() - TiempoPausa.getTime();
    intervalo -= intervaloPausa;
    return intervalo;
}

function GetTiempoTexto(intervalo) { 
	//recibe ms y devuelve texto
    var s = Math.floor(intervalo / 1000);
    var seg = Math.floor(s % 60)
    var min = Math.floor(s / 60);
    seg = TiempoDosCifras(seg);
    min = TiempoDosCifras(min);
    var tiempo = min + ":" + seg;
    return tiempo;
}

function VerTiempoDebug(msg) {
    if (typeof TiempoDebug == "undefined")
        TiempoDebug = new Date();
    var ahora = new Date();
    var dif = ahora.getTime() - TiempoDebug.getTime();
    TiempoDebug = ahora;
    console.log(msg + " " + dif + " milisegs");
}

function VerDebug(msg) {
    var ahora = new Date();
    var hora = ahora.getHours();
    hora = TiempoDosCifras(hora);
    var min = ahora.getMinutes();
    min = TiempoDosCifras(min);
    var seg = ahora.getSeconds();
    seg = TiempoDosCifras(seg);
    var ms = ahora.getMilliseconds();
    ms = TiempoTresCifras(ms);
    var tiempo = hora + ":" + min + ":" + seg + "." + ms;
    console.log(tiempo + " " + msg);
}
    


//-------------------------------------------------------------------------------------
//funciones dibujar el juego

function DibujarTablero(jugador) {
	if (Pantalla == PantallaJuegoPartida) {
		var xIni, yIni = 0;
		if (jugador == 0) {
			xIni = 0;
		}
		else if (jugador == 1) {
			if (TipoPartida != TipoPartidaPCDobles)
				return; //sale porque no hay que dibujar al oponente salvo en partida dobles

			xIni = PosicionXTablero2Jugador;
		}
		xIni += CanvasPosicionX;
		yIni += CanvasPosicionY;

		if (jugador == 1) {
		    //dibuja separador
		    Ctx.beginPath();
		    Ctx.fillStyle = "rgb(50,50,50)";
		    Ctx.fillRect(xIni + PosicionXTablero2Jugador - SeparadorTablero2Jugadores, yIni, SeparadorTablero2Jugadores, Height);
		}

		//dibuja malla para facilitar calculos
		var x, y;
		Ctx.beginPath();
		Ctx.strokeStyle = "rgb(215,215,215)";
		Ctx.lineWidth = 1;
		for (x = 2; x < TableroSizeH - 1; x++) {
			Ctx.beginPath();
			Ctx.moveTo(xIni + x * SpriteSize, yIni);
			Ctx.lineTo(xIni + x * SpriteSize, yIni + (TableroSizeV - 1) * SpriteSize);
			Ctx.stroke();
		}

		//aqui se mete la logica de las animaciones para no dibujar la parte que no sea necesaria (hacer lineas y deshacer puntos)
		//en vez de dibujarla y luego borrarla, así es mas rapido y se puede usar una imagen de fondo

		//dibuja piezas tablero jugador
		var k, color, gema, bPintarPunto, bPintarLinea;
		for (y = 0; y < TableroSizeV; y++) {
			bPintarLinea = true;
			//borrar lineas
			if (Jugadores[jugador].AnimacionBorrarLineas > 0) 
				if (Jugadores[jugador].AnimacionBorrarLineas % 2 == 0) {
					//si es impar borra (impar pinta, par borra)
					if (Jugadores[jugador].BorrarLineasPosicion[y] == 1)
						bPintarLinea = false;
				}

			if (bPintarLinea) {
				for (x = 0; x < TableroSizeH; x++) {
					//dibujar tablero (si no hay que borrar una parte por animacion)
					var color = GetColorTablero(jugador, x, y);
					if (color != 0) {
						bPintarPunto = true;

						//borrar puntos deshacer
						if (Jugadores[jugador].AnimacionBorrarPuntos > 0) 
							if (Jugadores[jugador].BorrarPuntosPosicion[x][y] == 1) {
								k = Jugadores[jugador].AnimacionBorrarPuntos - 1;
								bPintarPunto = false;
							}

						//borrar recuadro mismo color
						if (bPintarPunto)
							if (Jugadores[jugador].AnimacionRecuadro > 0)
								if (Jugadores[jugador].GemaRecuadroPosicion[x][y] == 1) {
									k = Jugadores[jugador].AnimacionRecuadro - 1;
									bPintarPunto = false;
								}
						
						if (bPintarPunto) { //dibujar puntos tablero
							Ctx.drawImage(iBloques, (color - 1) * SpriteSize, 0, SpriteSize, SpriteSize,
								xIni + x * SpriteSize, yIni + y * SpriteSize, SpriteSize, SpriteSize);
						}
						else { //pintar trozo del punto (borrar punto)
							Ctx.drawImage(iBloques, (color - 1) * SpriteSize + k, k, SpriteSize - k * 2, SpriteSize - k * 2,
								xIni + x * SpriteSize + k, yIni + y * SpriteSize + k, SpriteSize - k * 2, SpriteSize - k * 2);
						}
					}

					//dibuja gemas tablero 
					gema = GetGemaTablero(jugador, x, y);
					if (gema > 0)
						Ctx.drawImage(iGemas, (gema - 1) * SpriteSize, 0, SpriteSize, SpriteSize,
							xIni + x * SpriteSize, yIni + y * SpriteSize, SpriteSize, SpriteSize);
				}
			}
			else { //dibuja bordes tablero
				x = 0; 
				Ctx.drawImage(iBloques, (color - 1) * SpriteSize, 0, SpriteSize, SpriteSize,
					xIni + x * SpriteSize, yIni + y * SpriteSize, SpriteSize, SpriteSize);
				x = TableroSizeH - 1;
				Ctx.drawImage(iBloques, (color - 1) * SpriteSize, 0, SpriteSize, SpriteSize,
					xIni + x * SpriteSize, yIni + y * SpriteSize, SpriteSize, SpriteSize);
			}
		}
	}
}

function DibujarPieza(jugador) {
	if (Pantalla == PantallaJuegoPartida) {
		if (!ExisteAnimacion(jugador)) {
			var xIni, yIni = 0;
			if (jugador == 0) {
				xIni = 0;
			}
			else if (jugador == 1) {
				if (TipoPartida != TipoPartidaPCDobles)
					return; //sale porque no hay que dibujar al oponente salvo en partida dobles

				xIni = PosicionXTablero2Jugador;
			}
			xIni += CanvasPosicionX;
			yIni += CanvasPosicionY;

			//dibuja pieza jugador
			var x, y, color, rotacion, gema;
			color = GetColorPieza(Jugadores[jugador].ActualPieza, Jugadores[jugador].PiezaRotacion);
			rotacion = GetRotacionPieza(Jugadores[jugador].ActualPieza, Jugadores[jugador].PiezaRotacion);
			gema = Jugadores[jugador].PiezaGema;
			for (y = 0; y < MapaPiezaSizeV; y++)
				for (x = 0; x < MapaPiezaSizeH; x++) {
					// MapaPieza[piezas][rotation(4)][vertical blocks(10)][horizontal blocks(10)]
					if (MapaPieza[Jugadores[jugador].ActualPieza][rotacion][y][x] > 0)
						Ctx.drawImage(iBloques, (color - 1) * SpriteSize, 0, SpriteSize, SpriteSize,
							xIni + (Jugadores[jugador].PiezaX - PosicionPiezaX + x + 1) * SpriteSize,
                            yIni + (Jugadores[jugador].PiezaY - PosicionPiezaY + y) * SpriteSize, SpriteSize, SpriteSize);

					//dibuja gema pieza jugador
					if (gema > 0)
						if (MapaPieza[Jugadores[jugador].ActualPieza][rotacion][y][x] == 2) //la gema se coloca en el lugar marcado con un 2
						    Ctx.drawImage(iGemas, (gema - 1) * SpriteGemas, 0, SpriteGemas, SpriteSize,
								xIni + (Jugadores[jugador].PiezaX - PosicionPiezaX + x + 1) * SpriteSize,
                                yIni + (Jugadores[jugador].PiezaY - PosicionPiezaY + y) * SpriteSize, SpriteSize, SpriteSize);
				}
		}
	}
}

function DibujarMarcador(jugador) {
    if (Pantalla == PantallaJuegoPartida) {
		var xIni, yIni = 0;
		if (jugador == 0) {
		    xIni = 0;
		}
		else if (jugador == 1) {
			if (TipoPartida != TipoPartidaPCDobles)
				return; //sale porque no hay que dibujar al oponente salvo en partida dobles

			xIni = PosicionXTablero2Jugador;
		}
		xIni += CanvasPosicionX;
		yIni += CanvasPosicionY;

		//Dibuja barra del oponente
		if (ExisteOponente()) {
			//rectangulo
			Ctx.beginPath();
			Ctx.strokeStyle = "rgb(0,0,0)";
			Ctx.lineWidth = 1;
			Ctx.strokeRect(xIni + BarraOponenteX, yIni + BarraOponenteY, BarraOponenteH, BarraOponenteV);
			//altura
			var altura = Jugadores[jugador].BarraOponenteAltura;
			var alturaBlanco = Jugadores[jugador].BarraOponenteAlturaBlanco;
			Ctx.beginPath();
			Ctx.fillStyle = "rgb(200,150,50)";
			Ctx.fillRect(xIni + BarraOponenteX + 1, yIni + BarraOponenteY + BarraOponenteV - altura * SpriteSize, BarraOponenteH - 2, altura * SpriteSize);
			//altura blanco
			Ctx.beginPath();
			Ctx.fillStyle = "rgb(230,220,180)"; //180, 160, 120
			Ctx.fillRect(xIni + BarraOponenteX + 1, yIni + BarraOponenteY + BarraOponenteV - alturaBlanco * SpriteSize, BarraOponenteH - 2, alturaBlanco * SpriteSize);
			//circulo
			Ctx.beginPath();
			Ctx.arc(xIni + BarraOponenteCirculoX, yIni + BarraOponenteCirculoY, BarraOponenteCirculoRadio, 0, Math.PI * 2, true);
			Ctx.stroke();
		}

		//Dibuja marcador (textos y recuadro siguiente pieza)
		var marcadorX = xIni + MarcadorPosicionX;
		var marcadorY = yIni + MarcadorPosicionY; //posicion inicial

		//mensaje tiempo
		Ctx.beginPath();
		Ctx.fillStyle = "rgb(0,0,0)";
		Ctx.font = "bold 28px Arial";
		var intervalo = GetTiempo();
		var tiempo = GetTiempoTexto(intervalo);
		Ctx.fillText(tiempo, marcadorX, marcadorY);
		marcadorY += MarcadorSeparadorNormal;
		//mesaje oponente
		if (TipoPartida == TipoPartidaOponenteIA) {
			Ctx.beginPath();
			Ctx.fillText(Mensaje.Fase[Partidas[PartidaActual].FaseActual], marcadorX, marcadorY);
			marcadorY += MarcadorSeparadorNormal;
		}
		//mensaje siguiente
		Ctx.beginPath();
		Ctx.fillText(Mensaje.MarcadorSiguiente, marcadorX, marcadorY);
		marcadorY += (MarcadorSeparadorNormal - SpriteSize / 2);
		//dibuja siguiente pieza
		var x, y, color, rotacion;
		color = ColorPieza[Jugadores[jugador].SiguientePieza];
		rotacion = 0;
		//cojo el centro de MapaPieza, desde SiguientePosX/Y 3,3 con SiguienteSizeH/V 4x4 de tamaño
		for (y = SiguientePosY; y < SiguientePosY + SiguienteSizeV; y++)
			for (x = SiguientePosX; x < SiguientePosX + SiguienteSizeH; x++) {
				// MapaPieza[piezas][rotation(4)][vertical blocks(10)][horizontal blocks(10)]
				if (MapaPieza[Jugadores[jugador].SiguientePieza][rotacion][y][x] > 0)
					Ctx.drawImage(iBloques, (color - 1) * SpriteSize, 0, SpriteSize, SpriteSize,
						marcadorX + (x - SiguientePosX) * SpriteSize, marcadorY + (y - SiguientePosY) * SpriteSize, SpriteSize, SpriteSize);
			}
		//recuadro pieza siguiente
		Ctx.beginPath();
		Ctx.strokeStyle = "rgb(0,0,0)";
		Ctx.lineWidth = 2;
		Ctx.strokeRect(marcadorX, marcadorY, SiguienteSizeH * SpriteSize, SiguienteSizeV * SpriteSize);
		marcadorY += MarcadorSeparadorSiguiente;
		//mensaje lineas
		Ctx.beginPath();
		Ctx.fillText(Mensaje.MarcadorLineas + " " + Jugadores[jugador].Lineas, marcadorX, marcadorY);
		marcadorY += MarcadorSeparadorNormal;
		//mensaje deshacer (puntos)
		Ctx.beginPath();
		Ctx.fillText(Mensaje.MarcadorDeshacer + " " + Jugadores[jugador].Deshacer, marcadorX, marcadorY);
		marcadorY += MarcadorSeparadorNormal;
		//mensaje ataques (total mandado)
		Ctx.beginPath();
		Ctx.fillText(Mensaje.MarcadorAtaques + " " + Jugadores[jugador].Mandar, marcadorX, marcadorY);
		marcadorY += MarcadorSeparadorNormal + SpriteSize;
		//mensaje mandar (ataque concreto)
		Ctx.beginPath();
		Ctx.fillText(Mensaje.MarcadorMandar + " " + Jugadores[jugador].MandarActual, marcadorX, marcadorY);
		marcadorY += MarcadorSeparadorNormal;
		//mensaje gemas 
		Ctx.beginPath();
		Ctx.fillText(Mensaje.MarcadorGemas + " " + Jugadores[jugador].GemasActual, marcadorX, marcadorY);
		marcadorY += MarcadorSeparadorNormal;
		//mensaje bonus
		Ctx.beginPath();
		Ctx.fillText(Mensaje.MarcadorBonus + " " + Jugadores[jugador].BonusActual, marcadorX, marcadorY);
		marcadorY += MarcadorSeparadorNormal;

		//DibujarFinPartida
		if (FinPartida) {
			var xIni;
			if (jugador == 0) {
				xIni = 0;
			}
			else if (jugador == 1) {
				if (TipoPartida != TipoPartidaPCDobles)
					return; //sale porque no hay que dibujar al oponente salvo en partida dobles

				xIni = PosicionXTablero2Jugador;
			}

			//dibuja fin partida
			Ctx.beginPath();
			Ctx.fillStyle = "black";
			Ctx.font = "bold 150px Arial";
			//mensaje OK/KO
			var mensaje;
			if (Jugadores[jugador].Ganar)
				mensaje = Mensaje.Ganar;
			else
			    mensaje = Mensaje.Perder;
			var ancho = Ctx.measureText(mensaje).width;
			x = Canvas.width / 2 - ancho / 2; //poner centrado
			if (TipoPartida == TipoPartidaPCDobles) {
			    //no centrado, uno en cada lado
			    x = xIni + MensajeFinPartidaX;
			}
			Ctx.fillText(mensaje, x, yIni + MensajeFinPartidaY);
		}
	}
}

function DibujarPantallaResultado() {
    if (Pantalla == PantallaJuegoResultadoPartida) {
        var xIni = CanvasPosicionX;
        var yIni = CanvasPosicionY;

	   ////dibujar fondo pantalla
	   // Ctx.drawImage(iFondoPpal, 0, 0, Width, Height,
	   // 	0, 0, Width, Height);
			
		//poner los resultados
		if (TipoPartida == TipoPartidaOponenteIA) {
		    var resultadoX = xIni + ResultadoPosicionX; //posicion inicial marcador
		    var resultadoY = yIni + ResultadoPosicionY; 

		    var fase = Partidas[PartidaActual].FaseActual;
		    var encuentro = Partidas[PartidaActual].ResultadosFases[fase].EncuentroActual;
		    var resultado = Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].ResultadoActual;
		    var res = Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].Resultados[resultado];

		    //poner marcador encuentro
		    var msg = Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].ResultadoAvatar + " - " + Partidas[PartidaActual].ResultadosFases[fase].Encuentros[encuentro].ResultadoOponente;
		    Ctx.beginPath();
		    Ctx.fillStyle = "rgb(255,200,150)";
		    Ctx.font = "bold " + ResultadoMarcadorEscala + "px Arial";
		    resultadoX = Math.round(Canvas.width / 2 - Ctx.measureText(msg).width / 2); //centrado
		    Ctx.fillText(msg, resultadoX, resultadoY); //destacar marcador y animarlo
		    //resultadoY += ResultadoSeparadorNormal + 20; //!!!

		    //poner resultados partida
		    var ganarAvatar = Mensaje.ResultadoPerder;
		    if (res.GanarAvatar)
		        ganarAvatar = Mensaje.ResultadoGanar;
		    resultadoX = xIni + ResultadoPosicionX; //columna izq
		    resultadoY = yIni + ResultadoPosicionY2; //posicion inicial estadisticas
		    Ctx.beginPath();
		    Ctx.fillStyle = "rgb(255,255,255)";
		    Ctx.font = "bold 16px Arial";
		    Ctx.fillText(ganarAvatar, resultadoX, resultadoY); //victoria o derrota
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoTiempo + " " + GetTiempoTexto(res.Tiempo), resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoLineas + " " + res.Lineas, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMayorLineas + " " + res.MayorLineas, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoDeshacer + " " + res.Deshacer, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMayorDeshacer + " " + res.MayorDeshacer, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoRapido + " " + res.Rapido, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMayorRapido + " " + res.MayorRapido, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoRecuadro + " " + res.Recuadro, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMayorRecuadro + " " + res.MayorRecuadro, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoPerfect + " " + res.Perfect, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMayorPerfect + " " + res.MayorPerfect, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;

		    //otras estadisticas partida
		    resultadoX = xIni + ResultadoPosicionX2; //columna dcha
		    resultadoY = yIni + ResultadoPosicionY2; //posicion inicial estadisticas
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMandar + " " + res.Mandar, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMayorMandar + " " + res.MayorMandar, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoGemas + " " + res.Gemas, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMayorGema + " " + res.MayorGema, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoBonus + " " + res.Bonus, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMayorBonus + " " + res.MayorBonus, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoRecibido + " " + res.Recibido, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMayorRecibido + " " + res.MayorRecibido, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoLluviaRecibida + " " + res.LluviaRecibida, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoPiezaMolestaRecibida + " " + res.PiezaMolestaRecibida, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		    Ctx.beginPath();
		    Ctx.fillText(Mensaje.ResultadoMayorPiezaMolesta + " " + res.MayorPiezaMolesta, resultadoX, resultadoY);
		    resultadoY += ResultadoSeparadorNormal;
		}
		else {
            //poner las estadisticas del modo maraton, 2 jugadores PC y online
		}
	}
}

function DibujarFPS() {
    Ctx.beginPath();
    Ctx.fillStyle = "black";
    Ctx.font = "bold 28px Arial";
    Ctx.fillText("FPS " + ContadorFPS, 5, SpriteSize);
}



//-------------------------------------------------------------------------------------
//Bucle principal del juego

function BucleJuego() {
    var DebugCompleto = false;
    var DebugBucle = false;
    var jugador;

    if (DebugActivo && DebugBucle) VerTiempoDebug("BucleJuego"); //un mensaje por iteracion

    //logica del juego
    if (DebugActivo && DebugCompleto) VerDebug("ActualizarAnimacion"); //multiples mensajes por iteracion
    for (jugador = 0; jugador < GetNumeroJugadores(); jugador++)
        ActualizarAnimacion(jugador);
		
    if (DebugActivo && DebugCompleto) VerDebug("ActualizarOponenteIA"); //multiples mensajes por iteracion
	ActualizarOponenteIA();

	if (DebugActivo && DebugCompleto) VerDebug("ActualizarGravedadPieza");
    for (jugador = 0; jugador < GetNumeroJugadores(); jugador++)
        ActualizarGravedadPieza(jugador);

    if (DebugActivo && DebugCompleto) VerDebug("ActualizarMoverPieza");
    for (jugador = 0; jugador < GetNumeroJugadores(); jugador++)
        ActualizarMoverPieza(jugador);

    if (DebugActivo && DebugCompleto) VerDebug("ActualizarControles");
    ActualizarControles(); //teclas globales

    if (DebugActivo)
        ActualizarFPS();

    //para optimizarlo podria ver si ha habido algun cambio en la logica y sino no dibujar. Ahorro de bateria!!!
    //ojo con las animaciones, que siempre hay que dibujar si hay cambio en algún sprite. 
    //otra forma seria marcar en update si hay cambios en el dibujo indicando un recuadro con la unica parte a dibujar


    //dibuja en canvas oculto
    if (DebugActivo && DebugCompleto) VerDebug("BorrarCanvas");
    BorrarCanvas();

    if (DebugActivo && DebugCompleto) VerDebug("PantallaDibujarElementos");
    PantallaDibujarElementos(); //funcion de pantalla.js

    if (DebugActivo && DebugCompleto) VerDebug("DibujarTablero");
    for (jugador = 0; jugador < GetNumeroJugadores(); jugador++)
        DibujarTablero(jugador);

    //if (DebugActivo && DebugCompleto) VerDebug("DibujarAnimacion");
    //for (jugador = 0; jugador < GetNumeroJugadores(); jugador++)
    //    DibujarAnimacion(jugador);

    if (DebugActivo && DebugCompleto) VerDebug("DibujarPieza");
    for (jugador = 0; jugador < GetNumeroJugadores(); jugador++)
        DibujarPieza(jugador);
    
    if (DebugActivo && DebugCompleto) VerDebug("DibujarMarcador");
    for (jugador = 0; jugador < GetNumeroJugadores(); jugador++)
        DibujarMarcador(jugador);
	
	if (DebugActivo && DebugCompleto) VerDebug("DibujarPantallaResultado");
	DibujarPantallaResultado();

    if (DebugActivo)
        DibujarFPS();

    //dibuja en canvas real
    if (DebugActivo && DebugCompleto) VerDebug("Flip");
    Flip(); 

    //ver si salir
    if (DebugActivo && DebugCompleto) VerDebug("VerSalir");
    VerSalir();   
    if (!Salir) {
        IntervaloBucleJuego = RequestAnimationFrame.request(BucleJuego);
    }
}


