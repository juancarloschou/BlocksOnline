//-------------------------------------------------------------------------------------
//funciones plugin banners admob

var Admob_BANNER = "BANNER";
var Admob_IAB_MRECT= "IAB_MRECT";
var Admob_IAB_BANNER= "IAB_BANNER";
var Admob_IAB_LEADERBOARD= "IAB_LEADERBOARD";
var Admob_SMART_BANNER= "SMART_BANNER";

var Admob_Banner_Superior_Mapa_Android = "ca-app-pub-6945259204820562/2314689932"; 

function CrearAdmob(TipoBanner, IdAndroid, IdIOS, bArriba, bDebug) {
    var admob_ios_key = IdIOS; //Si tienes tu id para ios ponlo aquí 
    var admob_android_key = IdAndroid; //Si tienes tu id para android ponlo aquí 
    var adId = (navigator.userAgent.indexOf("Android") >= 0) ? admob_android_key : admob_ios_key; //Detecta si el móvil es ios o android y pone el id que necesites 

    if (window.plugins && window.plugins.AdMob) {

        var am = window.plugins.AdMob;
        am.createBannerView(
            {
                "publisherId": adId, //Añade tu clave de anunciante 
                "adSize": TipoBanner, //Indicas el tipo de nuncio
                "overlap": true, //Indicas que el anuncio flote
                "bannerAtTop": bArriba //Indica si quieres el banner arriba del todo (true) o abajo del todo (false) 
            }, function () {
                am.requestAd({ "isTesting": bDebug }, function () {
                    am.showAd(true);
                }, function () {
                    if (DebugActivo)
                        alert("fallo al cargar el anuncio");
                })
            }, function () {
                if (DebugActivo)
                    alert("fallo al crear la vista del anuncio");
            });
    } else {
        if (DebugActivo)
            alert("El plugin AdMob no esta listo/disponible.");
    }
}

function DibujarAdmob(bDibujar) {
    if (window.plugins && window.plugins.AdMob) {
        var am = window.plugins.AdMob;
        am.showAd(bDibujar);
    } else {
        if (DebugActivo)
            alert("El plugin AdMob no esta listo/disponible.");
    }
}



