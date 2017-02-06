$(function(){

    // Géolocation script

    function bindInfoWindow(marker, map, infowindow, description) {
        marker.addListener('click', function() {
            infowindow.setContent(description);
            infowindow.open(map, this);
        });
    }

    function initMap(lat,lon) {
        console.log('My latitude and longitude in initMap function : ',lat,lon);
        var coordinates = {lat: lat, lng: lon};
        var map = new google.maps.Map(document.getElementById('googleMap'), {
            zoom: 13,
            center: coordinates,
            scrollwheel: false
        });
        console.log(map);

        var yourMarker = 'http://maps.google.com/mapfiles/kml/pal2/icon5.png';
        var myMarker = new google.maps.Marker({
            position: coordinates,
            map: map,
//                    label: 'Vous êtes ici',
            icon: yourMarker
        });
        console.log(myMarker);

        // Add some markers to the map.
        var boxMarkers = 'http://maps.google.com/mapfiles/kml/pal2/icon13.png';

        //popup info window
        var infowindow =  new google.maps.InfoWindow({
            content: ""
        });

        for (var j = 0; j < locations.length; j++) {
            var markers = locations.map(function (location, i) {
                return new google.maps.Marker({
                    position: location,
                    icon: boxMarkers,
                    label: labels[j].lb_com+' '+labels[j].lb_voie_ext
                });
//                        bindInfoWindow(marker, map, infowindow, labels[j].lb_com+' '+labels[j].lb_voie_ext);
            });
        }


//                    var data=labels[j];
//                    var latLng = locations.map(data.lat, data.lng);
//                    // Creating a marker and putting it on the map
//                    var markers = new google.maps.Marker({
//                        position: latLng,
//                        map: map,
//                        title: data.title
//                    });
//
//                    bindInfoWindow(marker, map, infowindow, data.description);
//                }

//                for (var j = 0; j < markers.length; j++) {
//                    var infowindow = new google.maps.InfoWindow({
//                        map: map,
//                        content: labels[j].lb_com+' '+labels[j].lb_voie_ext
//                    });
//                }
        console.log('les markers : ',markers);

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(
            map,
            markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
        );

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
            initMap(lat,lon);
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

    var locations = [];
    var labels=[];

    $.getJSON("http://freegeoip.net/json/?")
        .done(function (getConnectionInfos) {
            console.log(getConnectionInfos);
            var myZipCode = getConnectionInfos.zip_code;
            var initialLatitude = getConnectionInfos.latitude;
            var initialLongitude = getConnectionInfos.longitude;

            //show a map on init before geolocation
            var initialCenter = {lat: initialLatitude, lng: initialLongitude};
            var initialMap = new google.maps.Map(document.getElementById('googleMap'), {
                zoom: 10,
                center: initialCenter,
                scrollwheel: false
            });

            var urlJson = "https://datanova.legroupe.laposte.fr/api/records/1.0/search/?dataset=laposte_boiterue&q="+myZipCode+"&rows=10&facet=lb_voie_ext&facet=lb_com&facet=co_insee_com&facet=co_postal&facet=lb_type_geo&facet=syst_proj_ini";
            $.getJSON(urlJson)
                .done(function (jsonDatas) {
                    console.log('json response loaded with succes!',jsonDatas);
                    var urlJson = "https://datanova.legroupe.laposte.fr/api/records/1.0/search/?dataset=laposte_boiterue&q="+myZipCode+"&rows=10&facet=lb_voie_ext&facet=lb_com&facet=co_insee_com&facet=co_postal&facet=lb_type_geo&facet=syst_proj_ini";
                    $.getJSON(urlJson)
                        .done(function (jsonDatas) {
                            console.log("json response loaded with succes!");
                            //console.log(jsonDatas);
                            for (var i = 0; i < jsonDatas.records.length; i++) {
                                locations.push({
                                    lat: jsonDatas.records[i].fields.latlong[0],
                                    lng: jsonDatas.records[i].fields.latlong[1]
                                });
                                labels.push({
                                    lb_com: jsonDatas.records[i].fields.lb_com,
                                    lb_voie_ext: jsonDatas.records[i].fields.lb_voie_ext
                                })
                            }
                            console.log(locations);
                            console.log(labels);
                        })
                        .fail(function (jsonDatas, textStatus, error) {
                            var err = textStatus + ", " + error;
                            console.log("JSON request Failed: " + err);
                        });

                }).fail(function(getConnectionInfos, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log( "JSON request Failed: " + err );
            });
        });
});