(function() {
  /**
   * TrashOut is an environmental project that teaches people how to recycle 
   * and showcases the worst way of handling waste - illegal dumping. All you need is a smart phone.
   *
   *
   * There are 10 types of programmers - those who are helping TrashOut and those who are not.
   * Clean up our code, so we can clean up our planet. 
   * Get in touch with us: help@trashout.ngo
   *
   * Copyright 2017 TrashOut, n.f.
   *
   * This file is part of the TrashOut project.
   *
   * This program is free software; you can redistribute it and/or modify
   * it under the terms of the GNU General Public License as published by
   * the Free Software Foundation; either version 3 of the License, or
   * (at your option) any later version.
   *
   * This program is distributed in the hope that it will be useful,
   * but WITHOUT ANY WARRANTY; without even the implied warranty of
   * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   * GNU General Public License for more details.
   *
   * See the GNU General Public License for more details: <https://www.gnu.org/licenses/>.
   */
  (function($, window, document) {
    var TrashMap, self;
    // the TrashMap constructor
    TrashMap = function(elem, options) {
      this.elem = elem;
      this.$elem = $(elem);
      this.options = options;
      // customization via Query params
      this.metadata = $.fn.getQueryObject();
    };
    // the TrashMap prototype skelet
    self = this;
    TrashMap.prototype = {
      // widget config variables
      defaults: {
        widget: {
          id: '#trash-map' // main trashmap div#id
        },
        trashDetail: {
          id: '#trashdetail-widget' // TrashMap includes TrashDetail widget via iframe
        },
        filter: {
          id: '#trash-map-filter', // filter div#id
          structure: { // filter structure, it has to be same as list of values in API
            status: {
              'reported': {
                name: 'trash.created'
              },
              'cleaned': {
                name: 'trash.status.cleaned'
              },
              'updateNeeded': {
                name: 'trash.updateNeeded'
              }
            },
            lastUpdate: {
              'no-limit': {
                name: 'trash.filter.lastUpdate.noLimit'
              },
              'last-year': {
                name: 'trash.filter.lastUpdate.lastYear'
              },
              'last-month': {
                name: 'trash.filter.lastUpdate.lastMonth'
              },
              'last-week': {
                name: 'trash.filter.lastUpdate.lastWeek'
              },
              'today': {
                name: 'trash.filter.lastUpdate.today'
              }
            },
            size: {
              'bag': {
                name: 'trash.size.bag',
                icon: 'bag',
                css: ''
              },
              'wheelbarrow': {
                name: 'trash.size.wheelbarrow',
                icon: 'wheelbarrow',
                css: 'width-auto'
              },
              'car': {
                name: 'trash.size.carNeeded',
                icon: 'car',
                css: 'car'
              }
            },
            accessibility: {
              'byCar': {
                name: 'trash.accessibility.byCar',
                icon: 'bycar',
                css: ''
              },
              'inCave': {
                name: 'trash.accessibility.inCave',
                icon: 'incave',
                css: ''
              },
              'underWater': {
                name: 'trash.accessibility.underWater',
                icon: 'underwater',
                css: ''
              },
              'notForGeneralCleanup': {
                name: 'trash.accessibility.notForGeneralCleanup',
                icon: 'notforgeneralcleanup',
                css: 'width-auto'
              }
            },
            type: {
              'domestic': {
                name: 'trash.types.domestic',
                icon: 'household'
              },
              'automotive': {
                name: 'trash.types.automotive',
                icon: 'automotive'
              },
              'construction': {
                name: 'trash.types.construction',
                icon: 'construction'
              },
              'plastic': {
                name: 'trash.types.plastic',
                icon: 'plastic'
              },
              'electronic': {
                name: 'trash.types.electronic',
                icon: 'electronic'
              },
              'glass': {
                name: 'trash.types.glass',
                icon: 'glass'
              },
              'metal': {
                name: 'trash.types.metal',
                icon: 'metal'
              },
              'liquid': {
                name: 'trash.types.liquid',
                icon: 'liquid'
              },
              'dangerous': {
                name: 'trash.types.dangerous',
                icon: 'dangerous'
              },
              'deadAnimals': {
                name: 'trash.types.deadAnimals',
                icon: 'dead-animals'
              },
              'organic': {
                name: 'trash.types.organic',
                icon: 'organic'
              }
            }
          }
        },
        map: {
          id: '#map', // trashmap div#id
          options: { // classic google mas options
            center: [
              48.8620722,
              2.352047 // the initial Map center
            ],
            zoom: 5, // initial zoom level
            minZoom: 4, // the minimum zoom level which will be displayed on the map. If omitted, or set to null, the minimum zoom from the current map type is used instead
            mapTypeId: 'terrain', // the initial Map mapTypeId. Defaults to ROADMAP
            mapTypeControl: false, // the initial enabled/disabled state of the Map type control
            navigationControl: true, // the initial enabled/disabled state of the Navigation type control
            scrollwheel: true, // if false, disables scrollwheel zooming on the map
            streetViewControl: false, // the initial enabled/disabled state of the Street View Pegman control
            styles: [ // special style - disable points and other annoying stuff
              {
                featureType: 'poi', // the feature, or group of features, to which a styler should be applied
                elementType: 'labels', // the element to which a styler should be applied
                stylers: [
                  {
                    visibility: 'off' // the style rules to apply to the selected map features and elements. The rules are applied in the order that you specify in this array
                  }
                ]
              }
            ]
          },
          cluster: {
            imagePath: $.fn.config('system.paths.images') + '/trashmap/cluster/m', // default imagepath where markers are stored
            minimumClusterSize: 2, // The minimum number of markers to be in a cluster before the markers are hidden and a count is shown.
            zoomOnClick: true, // Whether the default behaviour of clicking on a cluster is to zoom into it.
            averageCenter: true //  Whether the center of each cluster should be the average of all markers in the cluster.
          },
          zoomDelimiter: 10 // When current zoom <= zoomDelimiter drawZoomPoints, when zoom > zoomDelimiter drawTrashList
        }
      },
      map: {
        object: null, // gmap3 object
        cluster: null, // gmap clustered marker object
        markers: [], // array of markers in current viewport in map
        initialize: false // is inicialized?
      },
      data: { // local cache
        trashlist: [], // array of trashlist object
        trashlistGeocells: [], // array of geocell object (I want to know what geocell has been loaded because I dont want to call server again)
        zoompoints: [] // array of zoompoints object
      },
      init: function() {
        // Introduce defaults that can be extended either globally or using an object literal.
        this.config = $.extend({}, this.defaults, this.options, this.metadata);
        self = this;
        this.initI18n();
        this.initLoader();
        this.initFilter();
        this.initMessages();
        // Lazy loading map (by user click)
        $('#init').html(i18n('user.widget.trashMapInit'));
        $('#init').on('click', function() {
          self.initPreMap();
          return $('#filter-button').removeClass('hide');
        });
        return this;
      },
      initPreMap: function() {
        var script;
        script = document.createElement('script');
        script.src = 'https://maps.google.com/maps/api/js?key=AIzaSyCiWJGftXWabPAMlDciNS-8zkDaAXaUMS0';
        script.onload = function() {
          return self.initMap();
        };
        return document.head.appendChild(script);
      },
      initMessages: function() {
        var eventMethod, eventer, messageEvent;
        if (window.addEventListener) {
          eventMethod = "addEventListener";
          messageEvent = "message";
        } else {
          eventMethod = "attachEvent";
          messageEvent = "onmessage";
        }
        eventer = window[eventMethod];
        eventer(messageEvent, function() {
          var $trashmap, $widget, wdg;
          $('#trashdetail-widget').hide("slow");
          $trashmap = $(self.config.widget.id);
          $trashmap.removeClass('detail-visible');
          wdg = self.config.trashDetail;
          $widget = $(wdg.id);
          $widget.addClass('hidden-right');
        }, false);
      },
      // @method initMap
      // @desctiption - complete widget / map initialization
      // @return null
      initMap: function() {
        // init jquery object
        this.map.object = $(this.config.map.id);
        // load map config from URL hash params
        this.loadMap();
        // create gmap3 plugin object
        this.map.object.gmap3(this.config.map.options).on({
          tilesloaded: function() {
            // set this variable to true so this will not fire up again
            if (self.map.initialize === false) {
              self.map.initialize = true;
              self.updateMap();
            }
          },
          dragend: function(marker, event) {
            self.updateURL();
            self.updateMap(false);
          },
          zoom_changed: function() {
            self.updateURL();
            self.setMapType();
            self.updateMap();
          }
        });
        // set map type - when loading from config
        this.setMapType();
      },
      // @method loadMap
      // @desctiption - load map config from URL
      // @return null
      loadMap: function() {
        var data;
        data = self.parseURL(); // parse map data from URL
        
        // deserialize data from URL and load them to form
        // choosed pinId
        //if data.length >= 4 and typeof data[3] != 'undefined'

        // zoom
        if (data.length >= 3 && typeof data[2] !== 'undefined') {
          self.config.map.options.zoom = parseInt(data[2]);
        }
        // gps position
        if (data.length >= 2 && typeof data[1] !== 'undefined' && typeof data[0] !== 'undefined') {
          return self.config.map.options.center = [data[0], data[1]];
        }
      },
      // @method addMarkers
      // @desctiption - add cluster to trashmap. Don't use gmap3().cluster() because of performance issues
      // @return {Boolean} Returns true on success
      addMarkers: function() {
        var currenZoom, i, index, map, marker, marker_icon, obj, tmpData;
        map = self.map.object.gmap3().get(0);
        currenZoom = map.getZoom();
        tmpData = self.data.zoompoints[currenZoom];
// console.log tmpData
        for (i in tmpData) {
          obj = tmpData[i];
          if (obj.hasOwnProperty('counts')) {
            self.data.zoompoints[currenZoom][i].onMap = true;
            index = $.fn.getClusterIcon(obj.counts.cleaned, obj.counts.less + obj.counts.more, obj.counts.stillHere, obj.counts.updateNeeded);
            marker_icon = $.fn.config('system.paths.images') + '/trashmap/cluster/m' + index + '.png';
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(obj.lat, obj.long),
              label: '' + $.fn.humanRound(obj.counts.cleaned + obj.counts.less + obj.counts.more + obj.counts.stillHere),
              map: map,
              icon: {
                url: marker_icon,
                anchor: new google.maps.Point(30, 30)
              }
            });
            // zoom and center map to marker
            marker.addListener('click', function() {
              map.setZoom(map.getZoom() + 2);
              return map.setCenter(this.position);
            });
            self.map.markers.push(marker);
          }
        }
        return true;
      },
      // @method addCluster
      // @desctiption - add cluster to trashmap. Don't use gmap3().cluster() because of performance issues
      // @param {boolean} init - kdyz jsem na pokraji zoomu a prechazim mezi trashy/zoompointy, tak inicializuju cele z cache
      // @return {Boolean} Returns true on success
      addCluster: function(data, init = false) {
        var i, marker, markers, obj, styles;
        markers = [];
        for (i in data) {
          obj = data[i];
          if (init || !(obj.id in self.data.trashlist)) {
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(obj.gps.lat, obj.gps.long),
              options: {
                icon: self.getMarkerIcon(obj.status, obj.updateNeeded)
              },
              data: {
                id: obj.id,
                activityId: obj.activityId,
                size: obj.size,
                status: obj.status,
                types: obj.types,
                created: obj.created,
                accessibility: obj.accessibility,
                updateTime: obj.updateTime,
                updateNeeded: obj.updateNeeded
              }
            });
            marker.addListener('click', function() {
              return self.showTrashDetail(this.data.id);
            });
            markers.push(marker);
            self.data.trashlist[obj.id] = obj;
          }
        }
        styles = [
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '0.png'
          },
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '1.png'
          },
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '2.png'
          },
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '3.png'
          },
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '4.png'
          },
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '5.png'
          },
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '6.png'
          },
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '7.png'
          },
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '8.png'
          },
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '9.png'
          },
          {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '10.png'
          }
        ];
        if (self.map.cluster === null) {
          MarkerClusterer.prototype.setCalculator($.fn.customCalculator); //set custom calculator
          self.map.cluster = new MarkerClusterer(self.map.object.gmap3().get(0), markers, {
            styles: styles
          });
        } else {
          self.map.cluster.addMarkers(markers);
        }
        self.applyFilterTrashList();
        return true;
      },
      // @method setMapType
      // @desctiption - Set map type based on current map zoom
      // @return null
      setMapType: function() {
        var map, zoom;
        map = self.map.object.gmap3().get(0);
        zoom = map.getZoom();
        if (zoom <= 14) {
          return map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        } else if (zoom > 14 && zoom < 17) {
          return map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        } else if (zoom >= 17) {
          return map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
      },
      // @method getTrashList
      // @desctiption - Get trashlist data from server
      // @param {array} geocells - list of given geocells
      // @return {boolean} null / false when something went wrong
      getTrashList: function(geocells) {
        var cfg, query;
        // test attributes
        if (geocells === null || geocells.length === 0) {
          return false;
        }
        $.each(geocells, function(key, obj) {
          return self.data.trashlistGeocells[obj] = {};
        });
        // get global widget config (API)
        cfg = $.fn.config('system.api');
        // prepare ajax params
        query = {
          attributesNeeded: 'id,status,types,size,updateNeeded,gpsShort,created,note,accessibility,updateTime',
          geocells: geocells.join(),
          limit: 10000,
          page: 1
        };
        // get trash list from API
        return $.ajax({
          url: cfg.domain + cfg.endpoints.trashList + '?' + $.param(query),
          async: true,
          headers: {
            'x-api-key': self.config.key
          }
        }).done(function(data) {
          //console.log 'getTrashList', data
          $.each(data, function(key, obj) {
            return self.data.trashlistGeocells[obj.geocell] = {};
          });
          self.addCluster(data);
        }).fail(function() {
          // when ajax call fails, delete all pre-cached data
          $.each(geocells, function(key, obj) {
            return delete self.data.trashlistGeocells[obj];
          });
        });
      },
      // @method processTrashListResponse
      // @desctiption -
      // @param {object} API response
      // @return null
      processTrashListResponse: function(response) {},
      // @method drawTrashList
      // @desctiption - draw list of trashes on map
      // @return {array} of trash object
      drawTrashList: function() {
        var data, geocells;
        // todo: budeme prekreslovat pouze, kdyz nacitame nove geocelly - ze zacatku nacachuje vetsi mnostvi, nez skutecne mame, aby se dalo jednoduse posouvat po mape
        //console.log 'drawTrashList'

        // init cluster with data in local cache
        // when I have some data in cache and Iam on zoom delimiter
        if (self.data.trashlist.length > 0 && self.map.cluster === null) {
          self.clearMap();
          self.addCluster(self.data.trashlist, true);
        }
        //console.log 'vykresluji', self.data.trashlist

        // ask server only for geocells which I have not in local storage (cache)
        //console.log 'needed', self.getGeocells()
        geocells = self.filterGeocellsTrashList(self.getGeocells());
        //console.log 'missing', geocells
        return data = self.getTrashList(geocells);
      },
      // @method getZoomPoints
      // @desctiption - receive list of ZoomPoints from API for given zoomLevel and inside geocells area
      // @param {int} zoomLevel Required zoom level
      // @param {array of string} geocells Array of geocells which I want data for
      // @return {Boolean} Returns true on success
      getZoomPoints: function(zoomLevel, geocells) {
        var _days, _states, cfg, filter, query;
        // test attributes
        if (zoomLevel === null || geocells === null || geocells.length === 0) {
          return false;
        }
        if (!self.data.zoompoints[zoomLevel] || typeof self.data.zoompoints[zoomLevel] === void 0) {
          self.data.zoompoints[zoomLevel] = [];
        }
        $.each(geocells, function(key, obj) {
          return self.data.zoompoints[zoomLevel][obj] = {};
        });
        // get global widget config (API)
        cfg = $.fn.config('system.api');
        // prepare ajax params
        query = {
          zoomLevel: zoomLevel,
          geocells: geocells.join()
        };
        // apply filter    TODO: filter
        filter = self.getFilterData();
        if (filter && filter.hasOwnProperty('filter-size')) {
          query.trashSize = filter['filter-size'].join();
        }
        if (filter && filter.hasOwnProperty('filter-accessibility')) {
          query.trashAccessibility = filter['filter-accessibility'].join();
        }
        if (filter && filter.hasOwnProperty('filter-status') && typeof filter['filter-status'] !== 'undefined') {
          _states = [];
          if ($.inArray('cleaned', filter['filter-status']) > -1) {
            _states.push('cleaned');
          }
          if ($.inArray('reported', filter['filter-status']) > -1) {
            _states.push('more');
            _states.push('less');
            _states.push('stillHere');
            query.updateNeeded = false;
          }
          if ($.inArray('updateNeeded', filter['filter-status']) > -1) {
            query.updateNeeded = true;
          }
          if ($.inArray('cleaned', filter['filter-status']) > -1 && $.inArray('reported', filter['filter-status']) > -1) {
            query.updateNeeded = false;
          }
          if ($.inArray('cleaned', filter['filter-status']) > -1 && $.inArray('updateNeeded', filter['filter-status']) > -1 && !($.inArray('reported', filter['filter-status']))) {
            _states.push('cleaned');
            query.updateNeeded = false;
          }
          query.trashStatus = _states.join();
        }
        if (filter && filter.hasOwnProperty('filter-type')) {
          query.trashType = filter['filter-type'].join();
        }
        if (filter && filter.hasOwnProperty('filter-last') && parseInt(filter['filter-last']) > 0) {
          // 25 - last year, 50 - last month, 75 - last week, 100 - today
          _days = 365;
          if (parseInt(filter['filter-last']) === 50) {
            _days = 31;
          }
          if (parseInt(filter['filter-last']) === 75) {
            _days = 7;
          }
          if (parseInt(filter['filter-last']) === 100) {
            _days = 1;
          }
          query.timeBoundaryFrom = moment().subtract(_days, 'days').format();
          query.timeBoundaryTo = moment().format();
          console.log(query);
        }
        // get trash list from API
        return $.ajax({
          url: cfg.domain + cfg.endpoints.zoomPoints + '?' + $.param(query),
          async: true,
          headers: {
            'x-api-key': self.config.key
          }
        }).done(function(data) {
          $.each(data, function(key, obj) {
            return self.data.zoompoints[zoomLevel][obj.geocell] = obj;
          });
          self.updateMap();
          return true;
        }).fail(function() {
          // when ajax call fails, delete all pre-cached data
          $.each(geocells, function(key, obj) {
            return delete self.data.zoompoints[zoomLevel][obj];
          });
          return true;
        });
      },
      // @method processZoomPointsResponse
      // @desctiption -
      // @param {object} API response
      // @return null
      processZoomPointsResponse: function(response) {},
      // @method drawZoomPoints
      // @desctiption - draw zoom points on map
      // @return {Boolean} Returns true on success
      drawZoomPoints: function() {
        var geocells, map;
        //console.log 'drawZoomPoints'
        map = self.map.object.gmap3().get(0);
        // ask server only for geocells which I have not in local storage (cache)
        //console.log 'needed', self.getGeocells()
        geocells = self.filterGeocellsZoomPoints(map.getZoom(), self.getGeocells());
        //console.log 'missing', geocells
        self.getZoomPoints(map.getZoom(), geocells);
        return self.addMarkers();
      },
      // @method updateMap
      // @desctiption - re-draw all clusters / markers, depends on current zoom level
      // @return {Boolean} null / false when something wrong
      updateMap: function(clear = true) {
        var map;
        if (!self.map.initialize) {
          return false;
        }
        map = this.map.object.gmap3().get(0); // get google maps object
        if (map.getZoom() <= this.config.map.zoomDelimiter) {
          if (clear) { // clear map directly only in zoompoints mode
            self.clearMap(); // todo: CLEAR by se mel asi pote volat jen v pripadech, kdy uz jsem mimo areu nebo pri zoomovani
          }
          return this.drawZoomPoints();
        } else {
          // clear cluster data
          //self.map.cluster = null
          self.clearMap('zoompoint');
          return this.drawTrashList();
        }
      },
      //@applyFilterTrashList()

      // @method clearMap
      // @desctiption - delete all maps elements
      // @param type {string} - all / trash / zoompoint
      // @return {Boolean} Returns true on success
      clearMap: function(type = 'all') {
        var i;
        if (type === 'all' || type === 'trash') {
          if (self.map.cluster) {
            self.map.cluster.clearMarkers();
            self.map.cluster = null;
          }
        }
        if (type === 'all' || type === 'zoompoint') {
          if (self.map.markers && self.map.markers.length) {
            i = 0;
            while (i < self.map.markers.length) {
              self.map.markers[i].setMap(null);
              i++;
            }
            return self.map.markers = [];
          }
        }
      },
      // @method updateURL
      // @desctiption - Set data to URL - current / iframe
      // @return null
      updateURL: function() {
        var hash, map;
        map = this.map.object.gmap3().get(0); // get google maps object
        hash = "#" + $.fn.round(map.getCenter().lat(), 6) + ";" + $.fn.round(map.getCenter().lng(), 6) + ";" + map.getZoom() + ";" + 'false;' + $('#trash-map-filter-form').serialize();
        return window.location.hash = hash;
      },
      // @method parseURL
      // @desctiption - Parse URL (check iframe / current URL) and get data.
      // @return {array} parsed data
      parseURL: function() {
        var data, hash;
        hash = window.location.hash;
        // clean hash
        if (hash.charAt(0) === '#') {
          hash = hash.slice(1);
        }
        // create array from hash string
        data = hash.split(';');
        return data;
      },
      // @method initLoader
      // @desctiption - Prepare ajax loader (spinner)
      // @return null
      initLoader: function() {
        // this will be called when ALL running AJAX calls have completed
        $(document).ajaxStart(function() {
          return $('.spinner').removeClass('hide');
        });
        // this will be called when ANY AJAX call have started
        return $(document).ajaxStop(function() {
          return $('.spinner').addClass('hide');
        });
      },
      // @method initI18n
      // @desctiption - Prepare translation module
      // @return null
      initI18n: function() {
        var lang;
        // detect language
        lang = self.config.language || navigator.language || navigator.userLanguage || 'en';
        lang.substr(0, 2).toLowerCase();
        moment.locale(lang);
        // set i18n enviroment
        return i18nLoadLanguages(lang);
      },
      getMarkerIcon: function(status, updateNeeded) {
        var imgPath;
        imgPath = $.fn.config('system.paths.images') + '/trashmap/';
        if (status === 'cleaned') {
          return imgPath + 'map_cleaned.png';
        } else if (updateNeeded) {
          return imgPath + 'map_unknown.png';
        } else {
          return imgPath + 'map_reported.png';
        }
      },
      // @method sampleMethod
      // @description Method for testing purpose. This can interpolate two geocells.
      // @return null
      sampleMethod: function() {
        var Geomodel, bb, geocell1, geocell2, geocells1, geocells2;
        Geomodel = create_geomodel();
        geocells1 = Geomodel.generate_geocells(Geomodel.create_point(48.20561072519023, 12.206815704703331));
        geocell1 = geocells1[2];
        console.log(geocell1);
        geocells2 = Geomodel.generate_geocells(Geomodel.create_point(51.590417901298196, 16.158253736793995));
        geocell2 = geocells2[2];
        console.log(geocell2);
        bb = Geomodel.interpolate(geocell1, geocell2);
        console.log(bb);
      },
      // @method filterGeocellsZoomPoints
      // @description filter geocells which we still have in cache
      // @param {int} zoom - current zoom level
      // @param {array} geocells - list of geocells for filtering
      // @return {array} of new geocells (which are not in local cache)
      filterGeocellsZoomPoints: function(zoom, geocells) {
        var result;
        result = [];
        $.each(geocells, function(key, obj) {
          if (typeof self.data.zoompoints[zoom] === 'undefined') {
            return result.push(obj);
          } else if (typeof self.data.zoompoints[zoom][obj] === 'undefined') {
            return result.push(obj);
          }
        });
        return result;
      },
      // @method filterGeocellsTrashList
      // @description filter geocells which we still have in cache
      // @param {array} geocells - list of geocells for filtering
      // @return {array} of new geocells (which are not in local cache)
      filterGeocellsTrashList: function(geocells) {
        var result;
        result = [];
        $.each(geocells, function(key, obj) {
          if (typeof self.data.trashlistGeocells[obj] === 'undefined') {
            return result.push(obj);
          }
        });
        return result;
      },
      // @method getGeocells
      // @description Return list of geocells based on current map view. This method interpolate geocells from NorthEast to SouthWest corner
      // @param {int} zoom
      // @return {array} of geocells object
      getGeocells: function() {
        var Geomodel, bb, geocell1, geocell2, geocells1, geocells2, map, ne, sw, zoom;
        if (!self.map.initialize) {
          return false;
        }
        map = this.map.object.gmap3().get(0); // get google maps object
        zoom = map.getZoom();
        Geomodel = create_geomodel();
        // console.log map.getZoom()
        // console.log map.getBounds()

        // generate geocells for given point (gps - top right - north east)
        ne = map.getBounds().getNorthEast();
        geocells1 = Geomodel.generate_geocells(Geomodel.create_point(ne.lat(), ne.lng()));
        // get first geocell for given resolution based on current zoom level
        geocell1 = geocells1[this.getGeocellResolution(zoom)];
        // generate geocells for given point (gps - bottom left - south west)
        sw = map.getBounds().getSouthWest();
        geocells2 = Geomodel.generate_geocells(Geomodel.create_point(sw.lat(), sw.lng()));
        // get second geocell for given resolution based on current zoom level
        geocell2 = geocells2[this.getGeocellResolution(zoom)];
        // get list of geocells between this two geopoints
        bb = Geomodel.interpolate(geocell1, geocell2);
        if (this.config.debug) {
          console.log('getGeocells:', bb);
        }
        return bb;
      },
      // @method initFilter
      // @desctiption - initialize filter: render HTML skelet and set input variables to current values (based on current url)
      // @return null
      initFilter: function() {
        self.renderFilter();
        return self.loadFilter();
      },
      // @method renderFilter
      // @desctiption - Render HTML skelet for map filter. Input options is based on widget settings property
      // @return null
      renderFilter: function() {
        var $accessibilityWrapper, $headerWrapper, $heading, $lastWrapper, $lastWrapperContent, $sizeWrapper, $statusWrapper, $typeWrapper, structure;
        structure = self.config.filter.structure;
        $heading = $('.widget-heading').html(i18n('user.widget.trashMap'));
        // change filter is hidden by config
        if (typeof self.config.hidefilter !== 'undefined') {
          $('#filter-button').addClass('hide');
        }
        $headerWrapper = $('<h2/>', {
          'html': '<span id="close-filter"></span>' + i18n('global.filter') + '<span id="update-filter"></span>'
        });
        // render status
        $statusWrapper = $('<div/>', {
          'class': 'filter-wrapper'
        });
        $statusWrapper.append($('<div/>', {
          'class': 'title',
          'html': i18n('trash.status')
        }));
        $.each(structure.status, function(key, object) {
          $statusWrapper.append($('<input/>', {
            'type': 'checkbox',
            'id': key,
            'name': 'filter-status[]',
            'value': key
          }));
          return $statusWrapper.append($('<label/>', {
            'for': key,
            'html': i18n(object.name)
          }));
        });
        // render lastUpdate
        $lastWrapper = $('<div/>', {
          'class': 'filter-wrapper'
        });
        $lastWrapper.append($('<div/>', {
          'class': 'title',
          'html': i18n('trash.filter.dateOfLastUpdate')
        }));
        $lastWrapper.append($('<input/>', {
          'type': 'range',
          'id': 'filter-last',
          'name': 'filter-last',
          'min': 0,
          'max': 100,
          'step': 25,
          'value': 0
        }));
        $lastWrapperContent = $('<div/>', {
          'class': 'range-steps'
        });
        $.each(structure.lastUpdate, function(key, object) {
          return $lastWrapperContent.append($('<span/>', {
            'html': i18n(object.name)
          }));
        });
        $lastWrapperContent.appendTo($lastWrapper);
        // render size
        $sizeWrapper = $('<div/>', {
          'class': 'filter-wrapper'
        });
        $sizeWrapper.append($('<div/>', {
          'class': 'title special',
          'html': i18n('trash.trashSize')
        }));
        $.each(structure.size, function(key, object) {
          $sizeWrapper.append($('<input/>', {
            'type': 'checkbox',
            'id': key,
            'name': 'filter-size[]',
            'class': 'special',
            'value': key
          }));
          return $sizeWrapper.append($('<label/>', {
            'for': key,
            'html': i18n(object.name),
            'class': 'ico ico-' + object.icon + ' ' + object.css
          }));
        });
        // render type
        $typeWrapper = $('<div/>', {
          'class': 'filter-wrapper'
        });
        $typeWrapper.append($('<div/>', {
          'class': 'title special',
          'html': i18n('trash.trashType')
        }));
        $.each(structure.type, function(key, object) {
          $typeWrapper.append($('<input/>', {
            'type': 'checkbox',
            'id': key,
            'name': 'filter-type[]',
            'class': 'special',
            'value': key
          }));
          return $typeWrapper.append($('<label/>', {
            'for': key,
            'html': i18n(object.name),
            'class': 'ico ico-' + object.icon
          }));
        });
        // render accessibility
        $accessibilityWrapper = $('<div/>', {
          'class': 'filter-wrapper filter-checkcs'
        });
        $accessibilityWrapper.append($('<div/>', {
          'class': 'title special',
          'html': i18n('trash.accessibility')
        }));
        $.each(structure.accessibility, function(key, object) {
          $accessibilityWrapper.append($('<input/>', {
            'type': 'checkbox',
            'id': key,
            'name': 'filter-accessibility[]',
            'class': 'special',
            'value': key
          }));
          return $accessibilityWrapper.append($('<label/>', {
            'for': key,
            'html': i18n(object.name),
            'class': 'ico ico-' + object.icon
          }));
        });
        $(self.config.filter.id).append($headerWrapper).append($statusWrapper).append($lastWrapper).append($sizeWrapper).append($typeWrapper).append($accessibilityWrapper);
        // open button
        $('#filter-button').on('click', function() {
          return $(self.config.widget.id).addClass('filter-visible');
        });
        // close button
        $('#close-filter').on('click', function() {
          $(self.config.widget.id).removeClass('filter-visible');
          return self.loadFilter();
        });
        // update-filter button
        $('#update-filter').on('click', function() {
          self.updateURL();
          // update and clear map, clear cache, update zoompoint with filter
          self.data.zoompoints = [];
          self.updateMap();
          // nastavime filter pro pripadne trashlisty
          self.applyFilterTrashList();
          return $(self.config.widget.id).removeClass('filter-visible');
        });
        //console.log $('#trash-map-filter-form').serialize()

        // because we want to uncheck radiobox
        $('input[type="radio"]').on('click', function() {
          var $radio;
          $radio = $(this);
          // if this was previously checked
          if ($radio.data('waschecked') === true) {
            $radio.prop('checked', false);
            $radio.data('waschecked', false);
          } else {
            $radio.data('waschecked', true);
          }
          // remove was checked from other radios
          return $radio.siblings('input[type="radio"]').data('waschecked', false);
        });
        // update range plugin
        $('input[type="range"]').on('change mousemove', function() {
          var $this, val;
          $this = $(this);
          val = ($this.val() - $this.attr('min')) / ($this.attr('max') - $this.attr('min'));
          return $this.css('background-image', '-webkit-gradient(linear, left top, right top, ' + 'color-stop(' + val + ', #dedede), ' + 'color-stop(' + val + ', #8cc947)' + ')');
        });
      },
      // @method loadFilter
      // @desctiption - Load current filter settings from current URL to Filter form and init input values
      // @return null
      //console.log $(self.config.filter.id).html()
      loadFilter: function() {
        var $form, data;
        data = self.parseURL(); // parse filter data from URL
        $form = $('#trash-map-filter-form');
        // deserialize data from URL and load them to form
        if (data.length >= 5 && typeof data[4] !== 'undefined' && data[4] !== '') {
          $form.deserialize(data[4]);
        } else {
          // clean form
          $form[0].reset();
        }
        return $('input[type="range"]').trigger('change');
      },
      // @method getFilterData
      // @desctiption - Get current filter settings from current URL
      // @return {object} - parsed data in object structure
      getFilterData: function() {
        var data, parsed;
        data = self.parseURL(); // save to cache
        if (data.length >= 5 && typeof data[4] !== 'undefined' && data[4] !== '') {
          parsed = $.parseParams('?' + data[4]);
          return parsed;
        } else {
          return null;
        }
      },
      // @method applyFilterTrashList   TODO: filter
      // @desctiption - Show/hide markers on map after setting new parameters in map filter
      // @return null
      applyFilterTrashList: function() {
        var _accessibility, _days, _states, _updateNeeded, data, filter, i, obj, tmpData, visibility;
        data = self.parseURL();
        if (data.length >= 5 && typeof data[4] !== 'undefined' && data[4] !== '') {
          filter = $.parseParams('?' + data[4]);
        } else {
          return;
        }
        if (self.map.cluster === null) {
          return;
        }
        tmpData = self.map.cluster.getMarkers();
        for (i in tmpData) {
          visibility = true;
          obj = tmpData[i];
          // console.log obj
          if (typeof filter['filter-size'] !== 'undefined' && $.inArray(obj.data.size, filter['filter-size']) === -1) {
            visibility = false;
          }
          _accessibility = [];
          if (obj.data.accessibility.byCar) {
            _accessibility.push('byCar');
          }
          if (obj.data.accessibility.inCave) {
            _accessibility.push('inCave');
          }
          if (obj.data.accessibility.notForGeneralCleanup) {
            _accessibility.push('notForGeneralCleanup');
          }
          if (obj.data.accessibility.underWater) {
            _accessibility.push('underWater');
          }
          if (typeof filter['filter-accessibility'] !== 'undefined' && $.fn.arrayIntersect(filter['filter-accessibility'], _accessibility).length === 0) {
            visibility = false;
          }
          if (typeof filter['filter-type'] !== 'undefined' && $.isArray(obj.data.types) && $.fn.arrayIntersect(filter['filter-type'], _.values(obj.data.types)).length === 0) {
            visibility = false;
          }
          // add more / less under updateNeeded
          if (typeof filter['filter-status'] !== 'undefined' && $.inArray('updateNeeded', filter['filter-status']) > -1) {
            filter['filter-status'].push('more');
            filter['filter-status'].push('less');
          }
          if (typeof filter['filter-last'] !== 'undefined' && parseInt(filter['filter-last']) > 0) {
            // 25 - last year, 50 - last month, 75 - last week, 100 - today
            _days = 365;
            if (parseInt(filter['filter-last']) === 50) {
              _days = 31;
            }
            if (parseInt(filter['filter-last']) === 75) {
              _days = 7;
            }
            if (parseInt(filter['filter-last']) === 100) {
              _days = 1;
            }
            if (!(moment(obj.data.updateTime).isBetween(moment().subtract(_days, 'days'), moment().format()))) {
              visibility = false;
            }
          }
          if (typeof filter['filter-status'] !== 'undefined') {
            _states = [];
            _updateNeeded = false;
            if ($.inArray('cleaned', filter['filter-status']) > -1) {
              _states.push('cleaned');
            }
            if ($.inArray('reported', filter['filter-status']) > -1) {
              _states.push('more');
              _states.push('less');
              _states.push('stillHere');
            }
            if ($.inArray('updateNeeded', filter['filter-status']) > -1) {
              _updateNeeded = true;
            }
            if (_states.length && _updateNeeded) {
              if ($.inArray(obj.data.status, _states) === -1 && obj.data.updateNeeded === 0) {
                visibility = false;
              }
            } else if (_states.length && !_updateNeeded) {
              if ($.inArray(obj.data.status, _states) === -1 || obj.data.updateNeeded === 1) {
                visibility = false;
              }
            } else if (!_states.length && _updateNeeded) {
              if (obj.data.updateNeeded === 0) {
                visibility = false;
              }
            }
          }
          obj.setVisible(visibility);
        }
        // because of empty clusters we have to call repaint()
        return self.map.cluster.repaint();
      },
      // @method showTrashDetail
      // @desctiption - show TrashDetail widget with given ID
      // @param {int} id - id of needed trash
      // @return null
      showTrashDetail: function(id) {
        var $spinner, $trashmap, $widget, lang, wdg;
        wdg = self.config.trashDetail;
        $trashmap = $(self.config.widget.id);
        $widget = $(wdg.id);
        $spinner = $('.spinner');
        lang = self.config.language || navigator.language || navigator.userLanguage || 'en';
        lang = lang.replace('-', '_');
        $widget.prop('src', 'trashdetail.html?key=' + self.config.key + '&id=' + id + '&language=' + lang);
        $spinner.removeClass('hide');
        $widget.on('load', function() {
          $widget.removeClass('hidden-right').show();
          $trashmap.addClass('detail-visible');
          return $spinner.addClass('hide');
        });
        return $('#map').on('click', function() {
          $trashmap.removeClass('detail-visible');
          return $widget.addClass('hidden-right');
        });
      },
      // console.log wdg

      // @method getGeocellResolution
      // @description determine proximity for this zoomlevel, how far away should markers be. Normally at leas 1cm from each other to be clearly visible

      // KM_5000(1), KM_2000(2), KM_500(3), KM_128(4), KM_32(5), KM_8(6), KM_2(7), METERS_500(8), METERS_126(9),
      // METERS_30(10), METERS_7(11), METERS_2(12), CENTIMETERS(13), MILIMETERS_50(14), MILIMETERS_20(15), MILIMETERS_5(16)

      // @param {int} zoom - current zoom level
      // @return {integer} geocell proximity
      getGeocellResolution: function(zoom) {
        var fix;
        if (!zoom) {
          return;
        }
        fix = -1;
        switch (zoom) {
          case 1:
          case 2:
          case 3:
          case 4:
            return 2 + fix;
          case 5:
          case 6:
            return 3 + fix;
          case 7:
          case 8:
            return 4 + fix;
          case 9:
          case 10:
            return 5 + fix;
          case 11:
          case 12:
            // from this zoomLevel, receiver should ask for TrashList,
            // because it's used for TrashNearby and can group markers by it's own
            return 6 + fix;
          case 13:
          case 14:
            return 7 + fix;
          case 15:
          case 16:
            return 8 + fix;
          case 17:
          case 18:
            return 9 + fix;
          // it will not group trashes anymore, so will show all trashes devided for given geocell
          case 19:
          case 20:
          case 21:
            return 7 + fix;
          default:
            return 8 + fix;
            if (this.config.debug) {
              console.log('Wrong zoom level!');
            }
            break;
        }
      }
    };
    TrashMap.defaults = TrashMap.prototype.defaults;
    $.fn.TrashMap = function(options) {
      return this.each(function() {
        new TrashMap(this, options).init();
      });
    };
  //optional: window.TrashMap = TrashMap;
  })(jQuery, window, document);

  $(function() {
    return $(document).TrashMap();
  });

}).call(this);

//# sourceMappingURL=trashmap.js.map
