/////////////////////////////////////////////////////
// Blocks Online
// Desarrollo Juan Carlos Perez Casal
// Compañia AJU Software
// Realizado en 2015
// Todos los derechos reservados
/////////////////////////////////////////////////////





"use strict";

//-------------------------------------------------------------------------------------
//variables juego

//juego 
var Juego = false; //Pantalla o Juego
var Pausa;
var Salir;
var BotoneraActivo; //si hay que mostrar la botonera de juego de debajo
var SpriteSize = 32; //ancho y alto de imagen bloque
var NumeroJugadores = 1; //1 o 2

//resolucion PC para 2 jugadores
var SeparadorTablero2Jugadores = 5;
var PosicionXTablero2Jugador = WidthNormal + SeparadorTablero2Jugadores;

//fin de partida
var FinPartida = false; //al ganar o perder se termina
//var MensajeGanar = "OK";
//var MensajePerder = "KO";
//esperar a pantalla resultado partida
var FinPartidaTiempo; //tiempo en que empieza la cuenta hasta pantalla resultado
var FinPartidaIntervalo = 1500; //duracion de la pausa hasta pantalla resultado
//tiempo de partida
var TiempoPartida; //hora inicial partida
var TiempoPausa; //hora inicial pausa/fin partida
var IntervaloPausa; //duracion total de las pausas/fin partidas
var OponenteIntervaloUltimaPausa; //duracion de la ultima pausa/fin partida
//velocidad de la grevedad
var VelocidadSize = 20;

//tablero global
var TableroSizeH = 10 + 2; //incluye los bordes laterales
var TableroSizeV = 25 + 1; //y el borde inferior
//ficha siguiente
var SiguientePosX = 3; //cojo el centro de MapaPieza, desde 3,3 con 4x4 de tamaño
var SiguientePosY = 3;
var SiguienteSizeH = 4; //ancho
var SiguienteSizeV = 4; //alto

//RECURSOS juego
var JuegoRecursos = false; //indica si estan cargados los recursos de pantalla
var IntervaloRecursos = 10000; //tiempo maximo que espera por la carga de recursos, en miliseg
//imagenes juego
var iBloques; //bloques de colores y bordes del tablero (SpriteSize 32)
var iGemas; //sprites gemas (SpriteSize 32)
var iBotones; //botones para manejar el juego desde movil
var SpriteBoton = 100; //ancho y alto de imagen boton
var SpriteGemas = 32;
var iFondoJuego; 
//sonidos juego
var sPosarPieza; //se usa cuando la ficha choca con el suelo
var sCargandoPartida;
var sDeshacerPuntos;
var sHacerLinea;
var sGanar;
var sPerder;
var sComenzarPartida;
var sConseguirGema;
var sUnirGema;
var sDestruirGema;
var sRelojTermina;

//pruebas imagenes
var PiezasNuevasActivo = true;
var GemasNuevasActivo = true;
//var GemasTransparencia = 50;
var DebugGemasActivo = true;

//animacion borrar lineas
var AnimacionBorrarLineasSize = 11; //numero de tramos de la animacion (9 pinta, 10 borra, 11 termina)
var IntervaloBorrarLineas = 100; //duracion de cada tramo de animación en milisegs (total animacion 1 seg)
//animacion borrar puntos
var AnimacionBorrarPuntosSize = 17; //numero de tramos de la animacion, hay 16 bordes (15 borde penultimo, 16 borde interior, 17 termina)
var IntervaloBorrarPuntos = 62; //duracion de cada tramo de animación en milisegs (total animacion 1 seg)
//animacion borrar recuadro
var AnimacionRecuadroSize = 17; //numero de tramos de la animacion, hay 16 bordes (15 borde penultimo, 16 borde interior, 17 termina)
var IntervaloRecuadro = 62; //duracion de cada tramo de animación en milisegs (total animacion 1 seg)

//piezas
var PiezaI = 0; //larga de 4
var PiezaJ = 1;
var PiezaL = 2;
var PiezaO = 3;
var PiezaS = 4;
var PiezaZ = 5;
var PiezaT = 6;
var Pieza6 = 7; //larga de 6
var Pieza8 = 8; //larga de 8
var Pieza10 = 9; //larga de 10
var Pieza2 = 10; //pieza de dos puntos
var Pieza3 = 11; //pieza de 3 puntos con esquina
var PiezaP = 12; //punto multicolor
//var PiezaLL = 13; //L grande
//var PiezaE = 14; //estrella
//var PiezaC = 15; //cuadrado gigante
var PiezaSize = PiezaP + 1; //hasta punto
//mapa de cada pieza
var MapaPiezaSizeH = 10;
var MapaPiezaSizeV = 10;
var MapaPieza; //[piezas][rotation(4)][vertical blocks(10)][horizontal blocks(10)]
var ColorPieza = new Array(); //[piezas] -> los colores se corresponden a los sprites del bloques.png
var ColorPiezaSize = Pieza10 + 1; //lo usa el punto para rotar colores, hasta el color del Pieza10, mas ColorMandar
var ColorMandar = 20;
var RotarPieza; //[piezas] -> maxima rotacion de cada pieza
//posicion de salida de las piezas (y posicion en el MapaPieza)
var PosicionPiezaX = 4;
var PosicionPiezaY = 4;

//codigo de cada movimiento, iguales para boton y tecla
var MoverIzq = 0
var MoverDer = 1;
var MoverRotDer = 2;
var MoverAba = 3;
var MoverRotIzq = 4;
var MoverAbaAll = 5;
var MoverSize = MoverAbaAll + 1;
//tamaño botones y cuantos son visibles
var BotonesSize = MoverSize; //numero de botones
var BotonesVisiblesSize = MoverAba + 1; //solo se usan estos botones
//definir botones
var DefinirBotones = new Array();
for (contador = 0; contador < BotonesSize; contador++)
    DefinirBotones.push(new Boton()); //coordenadas de cada boton
//posicion de la botonera
var BotoneraX = 10;
var BotoneraY = TableroSizeV * SpriteSize + 20;
//captura eventos botones
var Botonera = new Array(BotonesSize); //0 sin pulsar, 1 pulsada, 2 touch press (debe soltarla)
var TiempoTouchStart = new Array(BotonesSize); //guarda el momento de iniciar el touchDown por cada boton

//pulsada mover teclado
var IntervaloKeyDown = new Array(MoverSize);
IntervaloKeyDown[MoverAba] = 0; //tiempo (mseg) que debe pasar con la tecla pulsada hasta superar el keyDown y ejecutar la accion repetidamente
IntervaloKeyDown[MoverDer] = 400;
IntervaloKeyDown[MoverIzq] = 400;
IntervaloKeyDown[MoverRotDer] = 400;
IntervaloKeyDown[MoverRotIzq] = 400;
//pulsada mover touch
var IntervaloTouchStart = new Array(MoverSize);
IntervaloTouchStart[MoverAba] = 0; //tiempo (mseg) que debe pasar con el boton pulsado hasta superar el touchDown y ejecutar la accion repetidamente
IntervaloTouchStart[MoverDer] = 400;
IntervaloTouchStart[MoverIzq] = 400;
IntervaloTouchStart[MoverRotDer] = 400;
IntervaloTouchStart[MoverRotIzq] = 400;
//velocidad movimiento
var IntervaloVelocidad = new Array(MoverSize);
IntervaloVelocidad[MoverAba] = 25; //ms
IntervaloVelocidad[MoverDer] = 80;
IntervaloVelocidad[MoverIzq] = 80;
IntervaloVelocidad[MoverRotDer] = 140;
IntervaloVelocidad[MoverRotIzq] = 140;
//velocidad movimiento botonera
var Botonera_TiempoMoverVelocidad = new Array(MoverSize);

//tamaño teclas y jugadorTeclado
var TeclasSize = MoverSize; //numero de teclas
//teclas globales para todos jugadores
//var TeclaSalir = 0;
//var TeclaDebug = 1;
//var TeclaPausa = 2;
var TeclasGlobalSize = TeclaPausa + 1;
var DefinirTeclasGlobales = new Array(TeclasGlobalSize); //define teclas globales
var TecladoGlobal = new Array(TeclasGlobalSize); //0 sin pulsar, 1 pulsada, 2 keypress (debe soltarla)

//siguiente pieza
var SiguientePieza; //array de piezas para ambos jugadores

//oponente
//var Oponente = false; //jugador online
//barra indica altura oponente
var BarraOponenteX = TableroSizeH * SpriteSize + SpriteSize * 0.75;
var BarraOponenteH = SpriteSize / 2;
var BarraOponenteY = SpriteSize * 0.66 * 2;
var BarraOponenteV = (TableroSizeV - 1) * SpriteSize - BarraOponenteY;
//circulo indica lo que manda oponente
var BarraOponenteCirculoRadio = SpriteSize * 0.66;
var BarraOponenteCirculoX = BarraOponenteX + BarraOponenteH / 2;
var BarraOponenteCirculoY = BarraOponenteCirculoRadio;

//marcadores
//calcularse como variable del jugador, dependiendo de si hay barra oponente, sino separadorX = SpriteSize
var MarcadorPosicionXSinOponente = TableroSizeH * SpriteSize + SpriteSize;
var MarcadorPosicionXConOponente = TableroSizeH * SpriteSize + SpriteSize * 2.25; //deja espacio para la barra oponente. 
var MarcadorPosicionX = 0; //posicion X
var MarcadorPosicionY = SpriteSize; //posicion inicial Y
var MarcadorSeparadorNormal = Math.round(1.6 * SpriteSize); //separa texto de altura normal
var MarcadorSeparadorSiguiente = Math.round(5.6 * SpriteSize); //separa recuadro siguiente pieza

//posicion mensaje fin partida KO y OK
var MensajeFinPartidaX = TableroSizeH * SpriteSize / 2 - 110;
var MensajeFinPartidaY = TableroSizeV * SpriteSize / 2;

//resultados
var ResultadoPosicionX = 60; //primera columna estadisticas
var ResultadoPosicionX2 = 350; //segunda columna estadisticas
var ResultadoPosicionY = 170; //resultado marcador
var ResultadoPosicionY2 = 230; //estadisticas y resultados
var ResultadoSeparadorNormal = 45; //separador vertical
var ResultadoMarcadorEscala; //indica la escala marcador (tamaño fuente texto)
var ResultadoMarcadorEscalaInicio = "42"; //tamaño inicial fuente texto resultado marcador
var ResultadoMarcadorEscalaFinal = "68"; //tamaño final fuente texto resultado marcador
var ResultadoMarcadorTiempo; //tiempo se inicia animacion marcador
var ResultadoMarcadorIntervalo = 1000; //tiempo para cambiar y agrandar el marcador

//mascaras gemas
//tablero: dejo 5 bits (32 numeros) para los colores, bits 6-10 son para las gemas
var BitsNumeroColor = 32;
var BitsGema = 6;
var GemaNivelSize = 3; //numero maximo de niveles de las gemas, esta hardcoded en unir gemas

//conseguir gemas
//gema por hacer lineas rapido, cuantas lineas debe hacer y en cuanto tiempo 
var GemaLineasRapidoLineas = 3; //debe hacer 3 tandas de lineas (de al menos una cada uno)
var GemaLineasRapidoIntervalo = 19000; //hay que hacerlas en 9 segundos (3 por linea)
//dos gemas por hacer lineas rapido, si consigues el de 3 lineas, y juesto despues haces otro, logras dos gemas. Si luego hicieses otro mas contaria como una gema
var Gema2LineasRapidoLineas = 3; //debe hacer 3 tandas de lineas (de al menos una cada uno)
var Gema2LineasRapidoIntervalo = 19000; //hay que hacerlas en 9 segundos (3 por linea)
//gema por hacer muchas lineas a la vez
var GemaMuchasLineas = 8; //debe hacer al menos 8 lineas
//dos gemas por hacer muchas lineas a la vez
var Gema2MuchasLineas = 10; //debe hacer al menos 10 lineas
//gema por deshacer muchos puntos a la vez
var GemaDeshacerMuchos = 100; //debe deshacer al menos 100 puntos
//dos gemas por deshacer muchos puntos a la vez
var Gema2DeshacerMuchos = 200; //debe deshacer al menos 200 puntos
//gema por hacer recuadro del mismo color
//hay unas fichas que permiten hacer recuadro de 3x3 con 3 piezas iguales, y 4x4 con 4 piezas (T, Z, S, L, J)
//y hay otras fichas que solo permiten 4x4, como el cuadrado, y la larga4 es muy frecuente y se puede hacer un 5x5
var GemaRecuadroLado = 3; //debe hacer un recuadro de 3x3, excepto piezas excluidas
var GemaRecuadroLadoExcepto = 4; //las piezas excluidas deben hacer recuadro 4x4
var GemaRecuadroExcepto = [PiezaI, PiezaO]; //array con las piezas que son excepcion: larga4, cuadrado
//dos gemas por hacer recuadro mas grande del mismo color
var Gema2RecuadroLado = 4; //debe hacer un recuadro de 4x4, excepto piezas excluidas
var Gema2RecuadroLadoExcepto = 5; //las piezas excluidas deben hacer recuadro 5x5
//gema por perfect de lineas
var GemaPerfectLineas = 1; //debe hacer al menos una linea perfect
var Gema2PerfectLineas = 4; //debe hacer al menos 4 lineas perfect
//gema por perfect de deshacer
var GemaPerfectDeshacer = 10; //debe deshacer al menos 10 puntos
var Gema2PerfectDeshacer = 100; //debe deshacer al menos 100 puntos

//ataques extra por perfect
var PerfectLineasMandar = 5; //si has hecho un perfect de lineas añade 5 lineas al ataque
var PerfectDeshacerMandar = 3; //si has hecho un perfect de deshacer añade 3 lineas al ataque

//bonus
var DuracionBonus = 10000; //10 segundos por nivel maximo gema, se usa para calcular el intervalo
var BonusAnimacionGemasIntervalo = 1500; //1,5 segundos dura primera animacion
var BonusAnimacionBonusIntervalo = 800; //0,8 segs dura segunda animacion
//posicion destino gemas
var BonusGemasDestino = new Array(GemaNivelSize); //array de nivel gema, coordenadas de los destino animacion gemas

//FPS
var NumeroFrames = 0;
var ContadorFPS = 0; //guarda la media de FPS
var TiempoFPS; //calcula cuando pasa un segundo para actualizar el contador de FPS
//debug
var TiempoDebug;



//-------------------------------------------------------------------------------------
//clase con datos de cada jugador (para partida dos jugadores en un PC)

//crear objeto jugador que contenga lo relacionado con cada jugador (tablero, piezas, animacion, etc) 
function Jugador() {
    //Jugador IA
    this.JugadorIA; //indica si es una inteligencia artificial

    //velocidad
    this.Velocidad; //de 1 a 20
    this.IntervaloVelocidad; //ms hasta que cae la pieza
    this.TiempoVelocidad; //gravedad, guarda el momento de reinicio del contador de velocidad

    //datos del marcador
    this.Lineas; //numero lineas total
	this.MayorLineas; //mejor grupo lineas
    this.Deshacer; //puntos deshechos total
	this.MayorDeshacer; //mejor ataque deshacer
	this.Rapido; //numero de rapidos hechos
    this.MayorRapido; //mejor rapido hecho
    this.Recuadro; //numero de recuadros hechos
	this.MayorRecuadro; //mejor recuadro hecho
    this.Perfect; //numero de perfects hechos
    this.MayorPerfect; //mejor perfect hecho
	//otras estadisticas partida
    this.MandarActual; //ataque actual
    this.Mandar; //total lineas mandadas (por lineas o deshacer)
	this.MayorMandar; //mejor ataque hecho
	this.GemasActual; //gemas actuales
	this.Gemas; //numero de gemas obtenidas total
    this.MayorGemas; //mejor gema obtenida
    this.BonusActual; //bonus actual (nivel)
	this.Bonus; //numero de bonus totales
    this.MayorBonus; //mejor bonus
    this.RecibidoActual; //ataques recibidos (lineas suben) actual
	this.Recibido; //numero de lineas recibidas total
    this.MayorRecibido; //mejor ataque recibido
    this.LluviaRecibida; //numero de lluvias recibidas
    this.PiezaMolestaRecibida; //numero de piezas molestas recibidas
    this.MayorPiezaMolesta; //mejor pieza molesta recibida	
    //fin partida
    this.Ganar; //true Ganar, false Perder (si FinPartida)

    //tablero
    this.Tablero = new Array(TableroSizeH);
    for (contador = 0; contador < TableroSizeH; contador++)
        this.Tablero[contador] = new Array(TableroSizeV); //crea array[x][y]
    //dejo 5 bits (32 numeros) para los colores, bits 6-10 son para las gemas (5 niveles)

    //animacion borrar lineas
    this.AnimacionBorrarLineas; //animacion de borrar lineas completas, 0 no animacion, 1 pinta, 2 borra, 3 pinta, 4 borra,... hasta Size
    this.BorrarLineasPosicion = new Array(TableroSizeV); //array[y] de las lineas completas
    this.TiempoBorrarLineas; //guarda el momento de inicial de cada tramo de animacion
    this.BorrarLineasPerfect; //si es un perfect

    //animacion borrar puntos
    this.AnimacionBorrarPuntos; //animacion de borrar puntos, 0 no animacion, 1 borra borde exterior, 2 borra borde siguiente,... hasta Size
    this.BorrarPuntosPosicion = new Array(TableroSizeH); //coordenadas de cada punto a deshacer
    for (contador = 0; contador < TableroSizeH; contador++)
        this.BorrarPuntosPosicion[contador] = new Array(TableroSizeV); //crea array[x][y], 1 borrar punto, 0 no
    this.TiempoBorrarPuntos; //guarda el momento de inicial de cada tramo de animacion
    this.BorrarPuntosPerfect; //si es un perfect

    //animacion borrar recuadro
    this.AnimacionRecuadro; //animacion de recuadro, 0 no animacion, 1 borra borde exterior, 2 borra borde siguiente,... hasta Size
    this.GemaRecuadroPosicion = new Array(TableroSizeH); //coordenadas del recuadro que se ha hecho
    for (contador = 0; contador < TableroSizeH; contador++)
        this.GemaRecuadroPosicion[contador] = new Array(TableroSizeV); //crea array[x][y], 1 borrar punto, 0 no
    this.GemaRecuadroLado; //lado del recuadro
    this.GemaRecuadroGemas; //numero de gemas a obtener
    this.TiempoRecuadro; //guarda el momento de inicial de cada tramo de animacion

    //variables sobre la pieza
    this.PiezaX;
    this.PiezaY;
    this.PiezaRotacion;
    this.ActualPieza; //en vez de act y sig, guardar lista de 1000 piezas, al acabarse pedir 1000 mas (o pedirlas al servidor)
    this.SiguientePieza;
    this.NumeroSiguientePieza; //numero en el array de piezas

	//velocidad movimiento teclado
    this.TiempoMoverVelocidad = new Array(MoverSize);

    //definir teclado de cada jugador
    this.DefinirTeclas = new Array(TeclasSize);
    //captura eventos teclado de cada jugador
    this.Teclado = new Array(TeclasSize); //0 sin pulsar, 1 pulsada, 2 keypress (debe soltarla)
    this.TiempoKeyDown = new Array(TeclasSize); //guarda el momento de iniciar el keyDown por cada tecla

    //ataques, cantidad lineas manda
    this.MandarLineas = new Array(10); //cuanto manda por hacer lineas
    this.MandarDeshacer = 10; //manda una linea por cada MandarDeshacer puntos

    //nivel de la barra del oponente
    this.BarraOponenteAltura; //altura de la parte normal (aparte de la blanca)
    this.BarraOponenteAlturaBlanco; //altura de la parte blanca (lo mandado)
    this.Altura; //altura propia (para ver si ha cambiado y hay que informar al oponente)
    this.AlturaBlanco; //altura blanca propia

    //gemas
    this.PiezaGema; //indica si la pieza actual incluye una gema, 0 si no hay gema, 1-5 es el nivel de la gema
    this.PiezaSiguienteGema; //cola de gemas, para cada pieza siguiente dice si incluye gemas

    //conseguir gemas
    this.GemaLineasRapidoTiempo; //array que cuenta el tiempo en que se hizo cada linea, se van analizando las ultimas lineas
    this.GemaLineasRapidoInicio; //indica desde que elemento del array hay que comprobar si se hacen mas lineas
	
	//bonus
	this.BonusActivo; //si hay bonus activo
	this.BonusTiempo; //momento empieza bonus
	//gemas destruidas en lineas o deshacer
	this.BonusGemas; //cuantas gemas destruidas
	this.BonusGemasNivel; //suma de los niveles de las gemas
	this.BonusGemasNivelMaximo; //gema de mayor nivel
    //animacion gemas, se hace mientras dura la animacion de lineas o deshacer
	this.BonusAnimacionGemas; //si esta la primera parte de la animacion activa, mueve gemas y muestra la cuenta
	this.BonusGemasMover; //array de posicion, destino y velocidad de cada gema
	this.BonusGemasContar = new Array(GemaNivelSize); //array de niveles de gema con la cuenta de cada tipo
    //animacion bonus, al acabar la anterior, se permite seguir jugando
	this.BonusAnimacionBonus; //desde este momento entra en bonus, pone la resta de gemas y muestra el intervalo de bonus
	this.BonusGemasAntes; //gemas que habia en la pantalla
	this.BonusGemasResta; //gemas destruidas, se restan de las de antes
	//this.BonusNivel; //x1.5, x2, x5, x10 (lo tienes en BonusActual)
	this.BonusAtaque; //nivel de ataque (% de lineas extra que mandas)
	this.BonusDefensa; //nivel de defensa (% de lineas recibidas que se bloquean)
    //lo que dura el bonus
	this.BonusIntervalo; //milisegundos duracion

}
//array global varios jugadores (solo crear el segundo jugador si es necesario, pues ocupa un poco de memoria)
var Jugadores = new Array();



//-------------------------------------------------------------------------------------
//clases globales

//clase GemasMover
function GemasMover() {
    this.x = 0; //posicion
    this.y = 0;
    this.DestinoX = 0; //destino
    this.DestinoX = 0;
    this.Velocidad = 0; //velocidad
}
Coordenadas.prototype.Set = function (x, y, Nivel, DestinoX, DestinoY, Velocidad) { //método de la clase
    this.x = x;
    this.y = y;
    this.Nivel = Nivel;
    this.DestinoX = DestinoX;
    this.DestinoY = DestinoY;
    this.Velocidad = Velocidad;
};
