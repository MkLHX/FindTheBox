var values=[];
$(function(){

    // Géolocation script

    function bindInfoWindow(marker, map, infowindow, description) {
        marker.addListener('click', function() {
            infowindow.setContent(description);
            infowindow.open(map, this);
        });
    }

    function setMarkers(map,locations){

        for (var i = 0; i < locations.length; i++)
        {
            var loan = locations[i]['lb_com'];
            var lat = locations[i]['lat'];
            var long = locations[i]['lng'];
            var add =  locations[i]['lb_voie_ext'];

            latlngset = new google.maps.LatLng(lat, long);

            var boxMarkers = 'http://maps.google.com/mapfiles/kml/pal2/icon13.png';
            var marker = new google.maps.Marker({
                map: map,
                title: loan ,
                position: latlngset,
                icon: boxMarkers
            });
            map.setCenter(marker.getPosition());


            var content = "Ville : " + loan +  '</h3>' + " Adresse : " + add;

            var infowindow = new google.maps.InfoWindow();

            google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
                return function() {
                    infowindow.setContent(content);
                    infowindow.open(map,marker);
                };
            })(marker,content,infowindow));
        }
    }

    function initMap(lat,lon,values) {
        console.log('My latitude and longitude in initMap function : ',lat,lon);
        console.log(values);
        var coordinates = {lat: lat, lng: lon};
        var map = new google.maps.Map(document.getElementById('googleMap'), {
            zoom: 13,
            center: coordinates,
            scrollwheel: false
        });
        // console.log(map);

        var yourMarker = 'http://maps.google.com/mapfiles/kml/pal2/icon5.png';
        var myMarker = new google.maps.Marker({
            position: coordinates,
            map: map,
            icon: yourMarker
        });
        setMarkers(map, values);
    }

    function positionError(error) {
        //console.log(error);
        switch( error.code ) {
            case error.TIMEOUT:
                alert("Timeout !");
                break;
            case error.PERMISSION_DENIED:
                alert("Vous n'avez pas donné la permission d'accéder à votre position via votre GPS ou navigateur web");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("La position n'a pu être déterminée. Nous allons utiliser la position par rapport à votre adresse ip.");
                break;
            case error.UNKNOWN_ERROR:
                alert("Erreur inconnue");
                break;
        }
    }

    function getPosition(data) {
        console.log(data);
        var lat = data.coords.latitude;
        var lon = data.coords.longitude;
        if(lat && lon ){
            navigator.geolocation.clearWatch(watchId);
            initMap(lat,lon,values);
        }
    }

    if ( navigator.geolocation ) {
        var watchId = navigator.geolocation.watchPosition(
            getPosition,
            positionError,
            { maximumAge:300000 }
        );

    }else{
        $('#msg').show('slow',function () {
            $('p').text("Désolé mais, la géolocalisation n'est pas supportée par votre navigateur").fadeIn('slow');
        }).delay(4000).fadeOut('slow');
    }

    $.getJSON("http://freegeoip.net/json/?")
        .done(function (getConnectionInfos) {
            console.log(getConnectionInfos);
            var myZipCode = getConnectionInfos.zip_code;
            var initialLatitude = getConnectionInfos.latitude;
            var initialLongitude = getConnectionInfos.longitude;

            //show a map on init before geolocation
            var initialCenter = {lat: initialLatitude, lng: initialLongitude};
            var initialMap = new google.maps.Map(document.getElementById('googleMap'), {
                zoom: 13,
                center: initialCenter,
                scrollwheel: false
            });
            var yourMarker = 'http://maps.google.com/mapfiles/kml/pal2/icon5.png';
            var myMarker = new google.maps.Marker({
                position: initialCenter,
                map: initialMap,
                icon: yourMarker
            });

            var urlJson = "https://datanova.legroupe.laposte.fr/api/records/1.0/search/?dataset=laposte_boiterue&q="+myZipCode+"&rows=10&facet=lb_voie_ext&facet=lb_com&facet=co_insee_com&facet=co_postal&facet=lb_type_geo&facet=syst_proj_ini";
            $.getJSON(urlJson)
                .done(function (jsonDatas) {
                    // console.log('json response loaded with succes!',jsonDatas);
                    for (var i = 0; i < jsonDatas.records.length; i++) {
                        values.push({
                            lat: jsonDatas.records[i].fields.latlong[0],
                            lng: jsonDatas.records[i].fields.latlong[1],
                            lb_com: jsonDatas.records[i].fields.lb_com,
                            lb_voie_ext: jsonDatas.records[i].fields.lb_voie_ext
                        });
                    }
                    console.log(values);
                })
                .fail(function (jsonDatas, textStatus, error) {
                    var err = textStatus + ", " + error;
                    console.log("JSON request Failed: " + err);
                });
        });
});