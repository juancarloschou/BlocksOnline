/////////////////////////////////////////////////////
// Blocks Online
// Autor Juan Carlos Perez Casal
// Compañia AJU Software
// Comenzado el 01/01/2015
// Todos los derechos reservados
/////////////////////////////////////////////////////





"use strict";

// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
//if (screen.width < 800) {
    Dispositivo = Movil;
}
else {
    Dispositivo = PC;
}

if (Dispositivo == PC) {
    //faltaria un jquery onready!!!
    IniciarPrincipal(); //Inicia el script principal en caso de PC
}
else if (Dispositivo == Movil) {
    AddEvent(document, 'deviceready', onDeviceReady.bind(this));
}

function onDeviceReady() {
    keepscreenon.enable(); //mantener la pantalla abierta (plugin para evitar bloqueo pantalla)

    // Handle the Cordova pause and resume events
    AddEvent(document, 'pause', onPause.bind(this));
    AddEvent(document, 'resume', onResume.bind(this));

    // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    IniciarPrincipal(); //Inicia el script principal
};

function onPause() {
    // TODO: This application has been suspended. Save application state here.

    //hay que parar el bucle de rendering, o la CPU se sigue usando (defecto de navegador Android con RequestAnimationFrame)!!!
    if (Jugar) {
        ForzarSalir();
    }
    else {
        PantallaForzarSalir();
    }

    keepscreenon.disable();

    //si esta en bucle recursos lo termina
    if (IntervaloBucleRecursos != null)
        clearInterval(IntervaloBucleRecursos);
};

function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
    if (Dispositivo == PC) {
        //faltaria un jquery onready!!!
        IniciarPrincipal(); //Inicia el script principal en caso de PC
    }
    else if (Dispositivo == Movil) {
        AddEvent(document, 'deviceready', onDeviceReady.bind(this));
    }
};
