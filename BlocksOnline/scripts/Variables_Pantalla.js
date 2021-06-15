/////////////////////////////////////////////////////
// Blocks Online
// Desarrollo Juan Carlos Perez Casal
// Compañia AJU Software
// Realizado en 2015
// Todos los derechos reservados
/////////////////////////////////////////////////////





"use strict";

//-------------------------------------------------------------------------------------
//variables globales

//objetos globales
var Canvas; //lienzo oculto sin escalar
var Ctx; //contexto oculto
var RealCanvas; //lienzo visible escalado
var RealCtx; //contexto visible

//objetos bucle de pantalla (unidos pantalla y juego)
var IntervaloBucleJuego; //interval del bucle de juego (y aparte el de recursos, unirlos!!!)
var RequestAnimationFrame; //objeto request animation frame

//dispositivo
var Movil = 0;
var PC = 1;
var Tablet = 2;
var DispositivoSin = -1; //sin dispositivo
var Dispositivo = DispositivoSin; //lo detecta index.js

//resolucion
//sin escalar, 560x840->0,666 (proporcion Baseline 320x480->0,666)
//con botonera debajo 560x960 (0,+120), con barra oponente 605x960 (+45,0)
//proporcion con botonera y con barra oponente:
//TAMAÑO PANTALLA 640x960->0,666 (antes)

//sony experia LT26i (JCPC) 360x615->0,585, woxter zielo (CPRM) 320x544->0,588, nexus 5 (PT) 360x567->0,635, Sony Xperia Z2 (EB) 360x567->0,635
//pantalla completa: sony experia LT26i (JCPC) 360x640->0,562, Samsung galaxi S3 (CPRM) 360x640->0,562, Meizu MX4 Pro (PT) 384x640->0,6, imagino que los otros seran altura 567+25 = 360x592->0,608
//escala media 0,562 - 0,608 = 640x1094->0,585
//fondo margen 150 = 940x1394

var WidthNormal = 640;
var HeightNormal = 1094;
var WidthFondo = 940;
var HeightFondo = 1394;
//var WidthNormal = 595; //595 sin barra oponente, 640 con barra oponente
//var WidthBarra = 45; //tamaño barra oponente
//var HeightNormal = 840; //sin botonera, 960 con botonera
//var HeightBotonera = 120; //tamaño botonera (ver variable BotoneraY)

//resolucion global dispositivo
var Width;
var Height;
var Escala; //proporcion
//posicion canvas usando fondo (desde que punto se dibuja la imagen de fondo)
var CanvasFondoPosicionX;
var CanvasFondoPosicionY;
//posicion canvas contenido
var CanvasPosicionX;
var CanvasPosicionY;

//admob
var PublicidadActivo = true;
var CrearBanner = false; //si se ha creado
//var BannerH = 50; //altura en realcanvas
var Banner = false; //si existe

//opciones dispositivo
var TecladoActivo; //deberia ser en funcion del dispositivo 
var TouchActivo; //touch activo
var RatonActivo; //raton activo
//opciones configurables
var AudioActivo = true; //indica si el sonido esta disponible
var SonidoActivo = true; //indica si se deben ejecutar los sonidos
var MusicaActivo = false; //indica si se debe ejecutar la musica, desactivado!!!
//debug
var DebugActivo = true; //false si estamos en produccion!!!
//mensajes
var MensajesGenerar = true; //false si estamos en produccion!!! con false utiliza archivos de idioma como en.txt
//musica
var MusicaSonando = false;
var MusicaActual; //objeto del sonido
//auxiliar (variable local)
var contador;


//-------------------------------------------------------------------------------------
//variables pantallas

//pantallas
var PantallaMenuCargando = 0;
var PantallaMenuPrincipal = 1;
var PantallaHistoriaPartidas = 10; //dejo sitio para muchas pantallas
var PantallaHistoriaAvatar = 11;
var PantallaHistoriaVideo = 12;
var PantallaHistoriaMapa = 13;
var PantallaOpciones = 30;
var PantallaMaraton = 40;
var PantallaBatalla = 50; //solo para PC (simultaneo, pantalla dividida)
var PantallaTutorial = 60;
var PantallaMultijugador = 70; //dejo sitio para muchas pantallas
var PantallaJuegoCargando = 100;
var PantallaJuegoPartida = 101;
var PantallaJuegoResultadoPartida = 102;
var PantallaSinPantalla = -1; //sin pantalla
var Pantalla = PantallaSinPantalla; //indica la pantalla actual
var PantallaAnterior = PantallaSinPantalla; //indica la pantalla anterior

//variables globales
var PantallaSalir;
var PantallaTiempoPartida; //tiempo de partida

//tipo partida
var TipoPartidaMaraton = 1; //un jugador contra el crono
var TipoPartidaPCDobles = 2;
var TipoPartidaOponenteIA = 3;
var TipoPartidaOponenteRed = 4;
var TipoPartidaSin = -1; //sin partida
var TipoPartida = TipoPartidaSin; 

//definir elementos pantallas
var PantallaDefinirBotones; //array de botones con texto
var PantallaDefinirBotonesImagen; //array de botones con imagen cuadradas
var PantallaDefinirBotonesCircular; //array de botones con imagen circulares
var PantallaDefinirBotonesResaltado; //array de botones resaltados
var PantallaDefinirImagenes; //array de imagenes
var PantallaDefinirEtiquetas; //array de etiquetas
var PantallaDefinirTextos; //array de textos
var PantallaBotonera; //0 sin pulsar, 1 pulsada, 2 touch press (debe soltarla)
var PantallaBotonResaltadoAvatarEstilo = "red"; //estilo del boton resaltado avatar

//variables pantallas
var PantallaMapaScrollX; //posicion del scroll horizontal del mapa modo historia
var PantallaMapaScrollXMover; //movimiento del scroll horizontal (con raton, no con touch)
var PantallaMapaScrollXTouchInicio; //posición inicial del touch al hacer el touch move
var PantallaMapaScrollXInicio; //posición inicial del scroll al hacer el touch move

//scroll partidas (hacerlo con botones de pagedown y pageup)
var PantallaPartidasScroll = false; //indica si hay scroll
//var PantallaPartidasScrollY; //posicion del scroll vertical del mapa modo historia
//var PantallaPartidasScrollYMover; //movimiento del scroll horizontal (con raton, no con touch)
//var PantallaPartidasScrollYTouchInicio; //posición inicial del touch al hacer el touch move
//var PantallaPartidasScrollYInicio; //posición inicial del scroll al hacer el touch move
//var PantallaPartidasScrollYSize; //limite superior del scroll

//posicion imagenes
var PosicionLogoPpalX = 0; //cambiar!!! posicion del logo en la pantalla menuprincipal
var PosicionLogoPpalY = 0;
var PosicionLogoPpalCargandoX = 0; //cambiar!!! posicion del logo en la pantalla cargando menuprincipal
var PosicionLogoPpalCargandoY = 0;
var DefinirEtiquetaCargando; //id de la etiqueta cargando, para actualizarla durante la carga

//RECURSOS pantallas
var PantallaRecursos = false; //indica si estan cargados los recursos de pantalla
var PantallaIntervaloRecursos = 10000; //tiempo maximo que espera por la carga de recursos, en miliseg
//variables recursos
var RecursosTotal;
var RecursosCargados;
var TiempoRecursos; //guarda el momento de iniciar la carga de recursos
var IntervaloBucleRecursos; //interval del bucle de carga de recursos
var FrecuenciaCargaRecursos = 50;
//imagenes pantallas
//var iLogoPpal; //logo de blocks online (en DOM)
//var iFondoPpal; //fondo del menu principal (en DOM)
var SpriteLogoPpalH = 640; //tamaño sprite logo
var SpriteLogoPpalV = 400; 
var iFondoMapa; //fondo del mapa granja
var iAnimales; //sprite animales de granja
var iAnimalesSombra; //version sombreada se calcula dinamicamente
var SpriteAnimal = 300;
var iAvatares; //sprite avatar protagonista
var SpriteAvatar = 300;
//de un archivo sprite con imagenes para menus hacer un sprite de diferentes tamaños, cargar el archivo con codigo a mano y separar las imagenes en diferentes variables
//meter iMusica, iSonido, iPausa
var iMusicaOn, iMusicaOff;
var SpriteMusica = 50;
var iSonidoOn, iSonidoOff;
var SpriteSonido = 50;
var iPausa; 
var SpritePausa = 64;
var MenuSize = 5; //numero de imagenes
var PosicionMusica = 0, PosicionSonido = 1;
//sonidos pantallas
var sAbrirPanel;
var sChoqueError;
var sCargandoPartida;
var sMusicaMenu;

//eventos 
var EventosPantalla = 0;
var EventosJuego = 1;
var EventosSin = -1; //sin eventos
var Eventos = EventosSin;

//teclas globales para todos jugadores
var TeclaSalir = 0;
var TeclaDebug = 1;
var TeclaPausa = 2;
var PantallaTeclasGlobalSize = TeclaDebug + 1;
var PantallaDefinirTeclasGlobales = new Array(PantallaTeclasGlobalSize); //define teclas globales
var PantallaTecladoGlobal = new Array(PantallaTeclasGlobalSize); //0 sin pulsar, 1 pulsada, 2 keypress (debe soltarla)

//novedades posibles en cada fase
var NovedadAtaques = 0; //enseña a atacar mandando lineas
var NovedadPiezaP = 1; //enseña el uso de la pieza Punto multicolor
var NovedadPiezaPAtacar = 2; //enseña a atacar deshaciendo puntos
var NovedadPiezaPBlancas = 3; //enseña como poner el punto multicolor en blanco y deshacer blancas (antes no se podia poner en blanco)
var NovedadPieza6 = 4; //enseña la nueva ficha larga de 6
var NovedadPieza8 = 5; //enseña la nueva ficha larga de 8
var NovedadPieza10 = 6; //enseña la nueva ficha larga de 10
var NovedadGemaMuchas = 7; //enseña como obtener gema haciendo muchas lineas, al destruirla solo da puntos
var NovedadGemaBonus = 8; //enseña a destruir la gema y entrar en bonus
var NovedadGema2Muchas = 9; //enseña como obtener 2 gemas haciendo muchas lineas
var NovedadGemaN2Juntar = 10; //enseña como juntar 2 gemas para obtener una superior (nivel2) y entrar en bonus mas tiempo
var NovedadGemaDeshacer = 11; //enseña como obtener gema deshaciendo muchos puntos
var NovedadGema2Deshacer = 12; //enseña como obtener 2 gemas deshaciendo muchos puntos
var NovedadGemaN3Juntar = 13; //enseña como juntar 2 gemas nivel 2 para obtener una superior (nivel3) y entrar en bonus mas tiempo
var NovedadGemaRapido = 14; //enseña como obtener gema haciendo lineas rapido (3 lineas 9 segundos)
var NovedadGema2Rapido = 15; //enseña como obtener gema haciendo lineas rapido dos veces seguidas (otras 3 lineas 9 segundos desde el anterior combo)
var NovedadGemaCuadrado = 16; //enseña como obtener gema haciendo cuadrado mismo color (aparece gema de ese color)
var NovedadGema2Cuadrado = 17; //enseña como obtener 2 gemas haciendo cuadrado mismo color
var NovedadGemaN2Cuadrado = 18; //enseña como obtener una gema superior si en el cuadrado habia ya una gema
var NovedadGemaN3Color = 19; //enseña como juntar 2 gemas (nivel1) del mismo color para obtener una muy superior (nivel3)
var NovedadGemaPerfectLineas = 20; //enseña como hacer un perfect de lineas y obtener ataque extra y una gema
var NovedadGema2PerfectLineas = 21; //enseña como hacer un perfect de lineas y obtener ataque extra y 2 gemas 
var NovedadGemaPerfectDeshacer = 22; //enseña como hacer un perfect de deshacer y obtener ataque extra y una gema
var NovedadGema2PerfectDeshacer = 23; //enseña como hacer un perfect de deshacer y obtener ataque extra y 2 gemas 
var NovedadGemaN2Perfect = 24; //enseña como hacer un perfect y obtener ataque extra y una gema superior si habia una gema en la construccion (superior a la mayor gema que habia, maximo nivel 3)
var NovedadGemaN3Perfect = 25; //enseña como hacer un perfect y obtener ataque extra y 2 gemas superiores si habia una gema en la construccion y es un perfect de 2 gemas
var NovedadSize = NovedadGemaN3Perfect;

//ataques recibidos, la idea es que solo lo usen los enemigos fuertes (o solo los jefes), se podria hacer que tú también lo puedas usar, según el ataque de gemas que realices
var AtaqueRecibidoPiezaMolesta1 = 0; //enseña el ataque recibido de ficha molesta1
var AtaqueRecibidoPiezaMolesta2 = 1; //enseña el ataque recibido de ficha molesta2
var AtaqueRecibidoPiezaMolesta3 = 2; //enseña el ataque recibido de ficha molesta3
var AtaqueRecibidoPiezaMolesta4 = 3; //enseña el ataque recibido de ficha molesta4
var AtaqueRecibidoPiezaMolesta5 = 4; //enseña el ataque recibido de ficha molesta5
var AtaqueRecibidoLluvia1 = 5; //enseña el ataque recibido de lluvia debil
var AtaqueRecibidoLluvia2 = 6; //enseña el ataque recibido de lluvia media
var AtaqueRecibidoLluvia3 = 7; //enseña el ataque recibido de lluvia fuerte
var AtaqueRecibidoGorila = 8; //enseña el ataque final del gorila
var AtaqueRecibidoSize = AtaqueRecibidoGorila;

//fases
var FaseSize = 50; //maximo numero de fases
var FaseNovedad = new Array(); //guardarlos en un integer y ver en cada bit si la fase tiene la novedad (maximo 32 bits)
var FaseAtaqueRecibido = new Array(); //guardarlos en otro integer y ver en cada bit si la fase tiene el ataque a recibir
//mundo
var MundoSize = 5; //maximo numero de mundos

//avatar movimiento por el mapa
var AnimacionAvatarMover = false;
var AvatarPosicion = new Coordenadas();
var AvatarSeparador = new Coordenadas();
var AvatarEscala = 0.35;
AvatarSeparador.x = - SpriteAvatar * AvatarEscala * 1.25;
AvatarSeparador.y = - SpriteAvatar * AvatarEscala * 0.5;
var AvatarMoverDestino = null; //new Coordenadas()
var AvatarMoverOrigen = null; //new Coordenadas()
var AvatarMoverRuta = new Array() //array de Coordenadas que forman la ruta;
var AvatarVelocidad = 4;
var AvatarMoverDistancia = 4; //distancia con el destino para considerar que ha llegado y moverse al destino
//var AvatarTiempo;
//var AvatarIntervalo = 33;

//animacion animal de fase ultima
var AnimacionAnimalUltimo = false;
var AnimalUltimoEscala; //indica la escala actual, si se esta animando
var AnimalUltimoEscalaHasta = 1.15; //hasta donde crece
var AnimalUltimoEscalaDesde = 0.85; //hasta donde decrece
var AnimalUltimoCrece; //si crece o decrece
var AnimalUltimoVelocidad = 0.005; //a que velocidad varia la escala
//var AnimalUltimoTiempo;
//var AnimalUltimoIntervalo = 30;

//FPS pantallas
var PantallaNumeroFrames = 0;
var PantallaContadorFPS = 0; //guarda la media de FPS
var PantallaTiempoFPS; //calcula cuando pasa un segundo para actualizar el contador de FPS



//-------------------------------------------------------------------------------------
//clase Mensajes Multiidioma

//mensajes hacer array multiidioma, que se cargue de archivo JSON con los obtetos de cada pais
function IdiomaMensaje() {
    //this.Idioma = 0; //ingles

    this.MenuPrincipal = "Main Menu"; //menu principal
    this.Historia = "History Mode";
    this.Multijugador = "Multiplayer Mode";
    this.Maraton = "Single Player Mode"; //Maraton, Solitario
    this.Tutorial = "Tutorial";
    this.Opciones = "Options";

	//modo historia
    this.ContinuarPartida = "Continue"; //modo historia, elegir partida
    this.NuevaPartida = "New Game";
    this.EmpezarPartida = "Start Game";
    this.NombreAvatar = "Name"; //etiqueta junto al nombre
    this.FaltaNombre = "Falta el nombre"; //mensaje error crear avatar
    this.NombreRepetido = "El nombre esta repetido"; //mensaje error crear avatar
    this.NombreAvatarInicial = "Player";
	this.MapaJugar = "Play"; //jugar siguiente fase
	this.Cargando = "Loading"; //pantalla cargando y juego cargando

	//opciones
	this.Musica = "Music"; 
	this.Sonido = "Sound";
	this.Idioma = "Language";
	this.Sincronizacion = "Synchronize FB";
	this.Controles = "Controls";
	this.Partidas = "Edit Games"; //editar partidas
	//this.RedefinirTeclas = "Redefine Keys"; //version PC
	
	//juego
	this.MarcadorSiguiente = "Next"; //marcador siguiente
	this.MarcadorLineas = "Lines"; //marcador lineas
	this.MarcadorDeshacer = "Blocks"; //marcador deshacer (puntos)
	this.MarcadorAtaques = "Sent"; //marcador ataques (total mandado)	
	this.MarcadorMandar = "Attack"; //marcador mandar (ataque concreto)
	this.MarcadorGemas = "Gems"; //marcador gemas (cuantas se destruyen para bonus actual)
	this.MarcadorBonus = "Bonus"; //marcador bonus (actual)
	
    //pantalla de resultado
	this.Ganar = "OK";
	this.Perder = "KO";
	this.Resultado = "Resultado";
	this.ResultadoFecha = "Date";
	this.ResultadoTiempo = "Time";
	this.ResultadoGanar = "Victory";
	this.ResultadoPerder = "Defeat";
	this.ResultadoContinuar = "Continue"; //boton continuar
	
	this.ResultadoLineas = "Lines";
	this.ResultadoMayorLineas = "Best Lines";
	this.ResultadoDeshacer = "Blocks";
    this.ResultadoMayorDeshacer = "Best Blocks";
    this.ResultadoRapido = "Combo";
    this.ResultadoMayorRapido = "Best Combo";
    this.ResultadoRecuadro = "Square";
    this.ResultadoMayorRecuadro = "Best Square";
    this.ResultadoPerfect = "Perfect";
	this.ResultadoMayorPerfect = "Best Perfect";
	
    this.ResultadoMandar = "Sent";
    this.ResultadoMayorMandar = "Best Attack";
    this.ResultadoGemas = "Gems";
    this.ResultadoMayorGema = "Best Gem";
    this.ResultadoBonus = "Bonus";
    this.ResultadoMayorBonus = "Best Bonus";
    this.ResultadoRecibido = "Incoming";
    this.ResultadoMayorRecibido = "Best Incoming";
    this.ResultadoLluviaRecibida = "Rain Incoming";
    this.ResultadoPiezaMolestaRecibida = "Disturb Incoming";
    this.ResultadoMayorPiezaMolesta = "Best Disturb Incoming";

    //mensajes fases animales
    this.Fase = new Array(FaseSize);
    contador = 0;
    this.Fase[contador++] = "Raton";
    this.Fase[contador++] = "Topo";
    this.Fase[contador++] = "Gato";
    this.Fase[contador++] = "Pato";
    this.Fase[contador++] = "Gallo";
    this.Fase[contador++] = "Perro";
    this.Fase[contador++] = "Oveja";
    this.Fase[contador++] = "Cerdo";
    this.Fase[contador++] = "Caballo";
    this.Fase[contador++] = "Toro";
}

//variables Multiidioma
var Mensaje; //instancia de la clase IdiomaMensaje
var IdiomaSize = 1;
var IdiomaIngles = 0;
//var IdiomaEspanol = 1;
var Idioma = IdiomaIngles; //idioma actual, sacarlo de la configuracion movil, o del paquete de instalacion por defecto (distintas versiones cada idioma)



//-------------------------------------------------------------------------------------
//clases globales

//clase Coordenadas
function Coordenadas() {
    this.x = 0;
    this.y = 0;
}
Coordenadas.prototype.Set = function (x, y) { //método de la clase
    this.x = x;
    this.y = y;
};

//clase Boton
function Boton() {
    this.x = 0;
    this.y = 0;
    this.h = 0;
    this.v = 0;
    this.texto = "";
    this.funcion = "";
    this.arg1 = "";
}
Boton.prototype.Set = function (x, y, h, v, texto, funcion, arg1) { //método de la clase
    this.x = x;
    this.y = y;
    this.h = h;
    this.v = v;
    this.texto = texto;
    this.funcion = funcion;
    this.arg1 = arg1;
};

//clase BotonImagen
function BotonImagen() {
    this.x = 0;
    this.y = 0;
    this.h = 0;
    this.v = 0;
    this.spriteH = 0;
    this.spriteV = 0;
    this.imagen = "";
    this.funcion = "";
    this.arg1 = "";
}
BotonImagen.prototype.Set = function (x, y, h, v, spriteH, spriteV, imagen, funcion, arg1) { //método de la clase
    this.x = x;
    this.y = y;
    this.h = h;
    this.v = v;
    this.spriteH = spriteH;
    this.spriteV = spriteV;
    this.imagen = imagen;
    this.funcion = funcion;
    this.arg1 = arg1;
};

//clase BotonCircular
function BotonCircular() {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.spriteH = 0;
    this.spriteV = 0;
    this.imagen = "";
    this.funcion = "";
    this.arg1 = "";
}
BotonCircular.prototype.Set = function (x, y, r, spriteH, spriteV, imagen, funcion, arg1) { //método de la clase
    this.x = x;
    this.y = y;
    this.r = r;
    this.spriteH = spriteH;
    this.spriteV = spriteV;
    this.imagen = imagen;
    this.funcion = funcion;
    this.arg1 = arg1;
};

//clase BotonResaltado
function BotonResaltado() {
    this.x = 0;
    this.y = 0;
    this.h = 0;
    this.v = 0;
    this.estilo = "";
}
BotonResaltado.prototype.Set = function (x, y, h, v, estilo) { //método de la clase
    this.x = x;
    this.y = y;
    this.h = h;
    this.v = v;
    this.estilo = estilo;
};

//clase Imagen
function Imagen() {
    this.x = 0;
    this.y = 0;
    this.h = 0;
    this.v = 0;
    this.spriteH = 0;
    this.spriteV = 0;
    this.imagen = "";
}
Imagen.prototype.Set = function (x, y, h, v, spriteH, spriteV, imagen) { //método de la clase
    this.x = x;
    this.y = y;
    this.h = h;
    this.v = v;
    this.spriteH = spriteH;
    this.spriteV = spriteV;
    this.imagen = imagen;
};

//clase Etiqueta
function Etiqueta() {
    this.x = 0;
    this.y = 0;
    this.h = 0;
    this.v = 0;
    this.texto = "";
	this.estilo = "";
	this.color = "";
	this.fondo = "";
}
Etiqueta.prototype.Set = function (x, y, h, v, texto, estilo, color, fondo) { //método de la clase
    this.x = x;
    this.y = y;
    this.h = h;
    this.v = v;
    this.texto = texto;
    this.estilo = estilo;
	this.color = color;
    this.fondo = fondo;
};

//clase Texto (cuadro de texto)
function Texto() {
    this.x = 0;
    this.y = 0;
    this.h = 0;
    this.v = 0;
    this.texto = "";
}
Texto.prototype.Set = function (x, y, h, v, texto) { //método de la clase
    this.x = x;
    this.y = y;
    this.h = h;
    this.v = v;
    this.texto = texto;
};



//-------------------------------------------------------------------------------------
//clase Oponente IA

function OponenteIA() {
	this.Nivel = 0; //de 0 a 99
	this.VelocidadJuego = 0; //de 0 a 99, velocidad para hacer acciones
	this.CapacidadLineas = 0; //de 0 a 99, capacidad de hacer lineas o de subir por no lograrlo
	this.CapacidadDefensa = 0; //de 0 a 99, capacidad para no cerrarse y aguantar ataques
	this.CapacidadAtaques = 0; //de 0 a 99, capacidad para hacer ataques con gemas y otras buenas jugadas
	
	//velocidad juego
	this.ActualizarIntervalo = 0; //velocidad de las acciones de la IA
	this.ActualizarTiempo; //tiempo para ver si ha pasado el intervalo de actualizar IA
	
	//capacidad lineas
	this.ProbabilidadLineas = 0; //porcentaje probabilidad hacer linea
	
	//estado partida (usa el objeto Jugadores[1])
    //this.Mandar = 0;
    //this.Recibir = 0;
	//this.Altura = 0;
	//this.AlturaBlanco = 0;
}

//variables Oponente
var NivelSize = 99;
var Oponente; //contiene el objeto OponenteIA
var JugadorOponenteIA = 1; //es el jugador 2
var JugadorHumanoContraIA = 0; //es el jugador 1



//-------------------------------------------------------------------------------------
//clase Partida y sus componentes

//clase Resultado
function Resultado() {
    this.Fecha; //fecha de la partida
    this.Tiempo; //milisegundos duracion
    this.GanarAvatar; //si ha ganado el avatar
	
    this.Lineas; //numero lineas total
    this.MayorLineas; //mejor grupo lineas
    this.Deshacer; //deshacer total
    this.MayorDeshacer; //mejor ataque deshacer
    this.Rapido; //numero de rapidos hechos
    this.MayorRapido; //mejor rapido hecho
    this.Recuadro; //numero de recuadros hechos
    this.MayorRecuadro; //mejor recuadro hecho
    this.Perfect; //numero de perfects hechos
	this.MayorPerfect; //mejor perfect hecho

    this.Mandar; //numero de lineas mandadas total
    this.MayorMandar; //mejor ataque hecho
    this.Gemas; //numero de gemas obtenidas
    this.MayorGema; //mejor gemas obtenidas
    this.Bonus; //numero de bonus hechos
    this.MayorBonus; //mejor bonus
    this.Recibido; //numero de lineas total
    this.MayorRecibido; //mejor ataque recibido
    this.LluviaRecibida; //numero de lluvias recibidas
    this.PiezaMolestaRecibida; //numero de piezas molestas recibidas
    this.MayorPiezaMolesta; //mejor pieza molesta recibida
}
Resultado.prototype.Set = function (Fecha, Tiempo, GanarAvatar, Lineas, MayorLineas, Deshacer, MayorDeshacer, 
		Rapido, MayorRapido, Recuadro, MayorRecuadro, Perfect, MayorPerfect, Mandar, MayorMandar, Gemas, MayorGema, Bonus, 
		MayorBonus,	Recibido, MayorRecibido, LluviaRecibida, PiezaMolestaRecibida, MayorPiezaMolesta) { //método de la clase
	this.Fecha = Fecha;
    this.Tiempo = Tiempo;
    this.GanarAvatar = GanarAvatar;
	
    this.Lineas = Lineas;
    this.MayorLineas = MayorLineas;
    this.Deshacer = Deshacer;
    this.MayorDeshacer = MayorDeshacer;
    this.Rapido = Rapido;
    this.MayorRapido = MayorRapido;
    this.Recuadro = Recuadro;
    this.MayorRecuadro = MayorRecuadro;
    this.Perfect = Perfect;
	this.MayorPerfect; 
	
    this.Mandar = Mandar;
    this.MayorMandar = MayorMandar;
    this.Gemas = Gemas;
    this.MayorGema = MayorGema;
    this.Bonus = Bonus;
    this.MayorBonus = MayorBonus;
    this.Recibido = Recibido; 
    this.MayorRecibido = MayorRecibido; 
    this.LluviaRecibida = LluviaRecibida; 
    this.PiezaMolestaRecibida = PiezaMolestaRecibida;
    this.MayorPiezaMolesta = MayorPiezaMolesta;
};

//clase Encuentro
function Encuentro() {
    this.ResultadoAvatar; //resultado del avatar (p ej 3)
    this.ResultadoOponente; //resultado del oponente (p ej 2)
    this.Resultados = new Array(); //array de resultados
    //this.Numero; //numero de resultados
    this.MaxResultados; //indicas si vas a 7 partidas, Math.floor(MaxRes / 2) = 3
    this.GanarAvatar; //si ha ganado el avatar
	this.Terminado; //si se ha termiando el encuentro
    //this.Fase; //cual es el oponente
	this.ResultadoActual; //indica el resultado que se va a jugar o se acaba de jugar
}

//variable ResultadosFase
var EncuentroSin = -1;

//clase ResultadosFase
function ResultadosFase() {
    this.Encuentros = new Array(); //array de encuentros
    //this.Numero; //numero de encuentros
    this.MejorEncuentro = EncuentroSin; //en el mapa se muestra el mejor encuentro de esta fase
    //el mejor se elige viendo el mejor resultado y en caso de empate la mejor partida
	this.EncuentroActual = EncuentroSin; //indica el encuentro que se va a jugar o se acaba de jugar
}

//clase Partida
function Partida() {
    //contiene toda la informacion de la partida, para guardarla en sql o nuevas variables de navegador
    this.Nombre; //a elegir, nombre del jugador de la partida
	this.Avatar; //id del avarar

	this.FaseUltima; //la ultima fase abierta, si le damos a "boton jugar" se abrira esta fase, aparecera resaltada en el mapa
	this.FaseActual; //la fase que estamos jugando, puede ser cualquiera (se cogeran las novedades y ataques recibidos de esta)
	this.MundoUltimo; //el mundo de la ultima fase abierta, al continuar una partida se abrira este, depende de la FaseUltima
	this.MundoActual; //el mundo que estamos viendo en el mapa, puede ser cualquiera (inferior al MundoUltimo)
	
    //resultados de las partidas con los animales, los records se obtienen comparando resultados
	this.ResultadosFases = new Array(FaseSize); //array de ResultadosFase (sin inicializa al crear la Partida)

	this.GanarFase; //si ha ganado una fase, el avatar se mueve
}

//variables Partida
var Partidas = null; //array de la clase GuardarPartida
var PartidaSin = -1; //sin partida cargada
var PartidaActual = PartidaSin; //la partida cargada
var PartidaNueva; //mientras se esta creando
//partida avatar (en objeto partida)
var AvatarInicial = 0;
var AvatarSize = 12;
//mundo y fase
var FasesMundo = 10; //numero de fases por mundo

