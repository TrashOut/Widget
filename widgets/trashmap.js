/**
Â *Â TrashOut is an environmental project that teaches people how to recycleÂ 
Â * and showcases the worst way of handling waste - illegal dumping.Â All you need is a smart phone.
Â *
Â *
Â *Â There are 10 types of programmers - those who are helping TrashOut and those who are not.
Â *Â Clean up our code, so we can clean up our planet.Â 
Â * Get in touch with us: help@trashout.ngo
Â *
Â * Copyright 2017 TrashOut, n.f.
Â *
Â * This file is part of the TrashOut project.
Â *
Â * This program is free software; you can redistribute it and/or modify
Â * it under the terms of the GNU General Public License as published by
Â * the Free Software Foundation; either version 3 of the License, or
Â * (at your option) any later version.
Â *
Â * This program is distributed in the hope that it will be useful,
Â * but WITHOUT ANY WARRANTY; without even the implied warranty of
Â * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.Â  See the
Â * GNU General Public License for more details.
Â *
Â * See the GNU General Public License for more details: <https://www.gnu.org/licenses/>.
*/


(function() {
  (function($, window, document) {
    var TrashMap, self;
    TrashMap = function(elem, options) {
      this.elem = elem;
      this.$elem = $(elem);
      this.options = options;
      this.metadata = $.fn.getQueryObject();
    };
    self = this;
    TrashMap.prototype = {
      defaults: {
        widget: {
          id: '#trash-map'
        },
        trashDetail: {
          id: '#trashdetail-widget'
        },
        filter: {
          id: '#trash-map-filter',
          structure: {
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
          id: '#map',
          options: {
            center: [48.8620722, 2.352047],
            zoom: 5,
            minZoom: 4,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            mapTypeControl: false,
            navigationControl: true,
            scrollwheel: true,
            streetViewControl: false,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [
                  {
                    visibility: 'off'
                  }
                ]
              }
            ]
          },
          cluster: {
            imagePath: $.fn.config('system.paths.images') + '/trashmap/cluster/m',
            minimumClusterSize: 2,
            zoomOnClick: true,
            averageCenter: true
          },
          zoomDelimiter: 10
        }
      },
      map: {
        object: null,
        cluster: null,
        markers: [],
        initialize: false
      },
      data: {
        trashlist: [],
        trashlistGeocells: [],
        zoompoints: []
      },
      init: function() {
        this.config = $.extend({}, this.defaults, this.options, this.metadata);
        self = this;
        this.initI18n();
        this.initLoader();
        this.initMap();
        this.initFilter();
        this.initMessages();
        return this;
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
      initMap: function() {
        this.map.object = $(this.config.map.id);
        this.loadMap();
        this.map.object.gmap3(this.config.map.options).on({
          tilesloaded: function() {
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
        this.setMapType();
      },
      loadMap: function() {
        var data;
        data = self.parseURL();
        if (data.length >= 3 && typeof data[2] !== 'undefined') {
          self.config.map.options.zoom = parseInt(data[2]);
        }
        if (data.length >= 2 && typeof data[1] !== 'undefined' && typeof data[0] !== 'undefined') {
          return self.config.map.options.center = [data[0], data[1]];
        }
      },
      addMarkers: function() {
        var currenZoom, i, index, map, marker, marker_icon, obj, tmpData;
        map = self.map.object.gmap3().get(0);
        currenZoom = map.getZoom();
        tmpData = self.data.zoompoints[currenZoom];
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
            marker.addListener('click', function() {
              map.setZoom(map.getZoom() + 2);
              return map.setCenter(this.position);
            });
            self.map.markers.push(marker);
          }
        }
        return true;
      },
      addCluster: function(data, init) {
        var i, marker, markers, obj, styles;
        if (init == null) {
          init = false;
        }
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
          }, {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '1.png'
          }, {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '2.png'
          }, {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '3.png'
          }, {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '4.png'
          }, {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '5.png'
          }, {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '6.png'
          }, {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '7.png'
          }, {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '8.png'
          }, {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '9.png'
          }, {
            width: 60,
            height: 60,
            url: self.config.map.cluster.imagePath + '10.png'
          }
        ];
        if (self.map.cluster === null) {
          MarkerClusterer.prototype.setCalculator($.fn.customCalculator);
          self.map.cluster = new MarkerClusterer(self.map.object.gmap3().get(0), markers, {
            styles: styles
          });
        } else {
          self.map.cluster.addMarkers(markers);
        }
        self.applyFilterTrashList();
        return true;
      },
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
      getTrashList: function(geocells) {
        var cfg, query;
        if (geocells === null || geocells.length === 0) {
          return false;
        }
        $.each(geocells, function(key, obj) {
          return self.data.trashlistGeocells[obj] = {};
        });
        cfg = $.fn.config('system.api');
        query = {
          attributesNeeded: 'id,status,types,size,updateNeeded,gpsShort,created,note,accessibility,updateTime',
          geocells: geocells.join(),
          limit: 10000,
          page: 1
        };
        return $.ajax({
          url: cfg.domain + cfg.endpoints.trashList + '?' + $.param(query),
          async: true,
          headers: {
            'x-api-key': self.config.key
          }
        }).done(function(data) {
          $.each(data, function(key, obj) {
            return self.data.trashlistGeocells[obj.geocell] = {};
          });
          self.addCluster(data);
        }).fail(function() {
          $.each(geocells, function(key, obj) {
            return delete self.data.trashlistGeocells[obj];
          });
        });
      },
      processTrashListResponse: function(response) {},
      drawTrashList: function() {
        var data, geocells;
        if (self.data.trashlist.length > 0 && self.map.cluster === null) {
          self.clearMap();
          self.addCluster(self.data.trashlist, true);
        }
        geocells = self.filterGeocellsTrashList(self.getGeocells());
        return data = self.getTrashList(geocells);
      },
      getZoomPoints: function(zoomLevel, geocells) {
        var cfg, filter, query, _days, _states;
        if (zoomLevel === null || geocells === null || geocells.length === 0) {
          return false;
        }
        if (!self.data.zoompoints[zoomLevel] || typeof self.data.zoompoints[zoomLevel] === void 0) {
          self.data.zoompoints[zoomLevel] = [];
        }
        $.each(geocells, function(key, obj) {
          return self.data.zoompoints[zoomLevel][obj] = {};
        });
        cfg = $.fn.config('system.api');
        query = {
          zoomLevel: zoomLevel,
          geocells: geocells.join()
        };
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
          $.each(geocells, function(key, obj) {
            return delete self.data.zoompoints[zoomLevel][obj];
          });
          return true;
        });
      },
      processZoomPointsResponse: function(response) {},
      drawZoomPoints: function() {
        var geocells, map;
        map = self.map.object.gmap3().get(0);
        geocells = self.filterGeocellsZoomPoints(map.getZoom(), self.getGeocells());
        self.getZoomPoints(map.getZoom(), geocells);
        return self.addMarkers();
      },
      updateMap: function(clear) {
        var map;
        if (clear == null) {
          clear = true;
        }
        if (!self.map.initialize) {
          return false;
        }
        map = this.map.object.gmap3().get(0);
        if (map.getZoom() <= this.config.map.zoomDelimiter) {
          if (clear) {
            self.clearMap();
          }
          return this.drawZoomPoints();
        } else {
          self.clearMap('zoompoint');
          return this.drawTrashList();
        }
      },
      clearMap: function(type) {
        var i;
        if (type == null) {
          type = 'all';
        }
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
      updateURL: function() {
        var hash, map;
        map = this.map.object.gmap3().get(0);
        hash = "#" + $.fn.round(map.getCenter().lat(), 6) + ";" + $.fn.round(map.getCenter().lng(), 6) + ";" + map.getZoom() + ";" + 'false;' + $('#trash-map-filter-form').serialize();
        return window.location.hash = hash;
      },
      parseURL: function() {
        var data, hash;
        hash = window.location.hash;
        if (hash.charAt(0) === '#') {
          hash = hash.slice(1);
        }
        data = hash.split(';');
        return data;
      },
      initLoader: function() {
        $(document).ajaxStart(function() {
          return $('.spinner').removeClass('hide');
        });
        return $(document).ajaxStop(function() {
          return $('.spinner').addClass('hide');
        });
      },
      initI18n: function() {
        var lang;
        lang = self.config.language || navigator.language || navigator.userLanguage || 'en';
        lang.substr(0, 2).toLowerCase();
        moment.locale(lang);
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
      getGeocells: function() {
        var Geomodel, bb, geocell1, geocell2, geocells1, geocells2, map, ne, sw, zoom;
        if (!self.map.initialize) {
          return false;
        }
        map = this.map.object.gmap3().get(0);
        zoom = map.getZoom();
        Geomodel = create_geomodel();
        ne = map.getBounds().getNorthEast();
        geocells1 = Geomodel.generate_geocells(Geomodel.create_point(ne.lat(), ne.lng()));
        geocell1 = geocells1[this.getGeocellResolution(zoom)];
        sw = map.getBounds().getSouthWest();
        geocells2 = Geomodel.generate_geocells(Geomodel.create_point(sw.lat(), sw.lng()));
        geocell2 = geocells2[this.getGeocellResolution(zoom)];
        bb = Geomodel.interpolate(geocell1, geocell2);
        if (this.config.debug) {
          console.log('getGeocells:', bb);
        }
        return bb;
      },
      initFilter: function() {
        self.renderFilter();
        return self.loadFilter();
      },
      renderFilter: function() {
        var $accessibilityWrapper, $headerWrapper, $heading, $lastWrapper, $lastWrapperContent, $sizeWrapper, $statusWrapper, $typeWrapper, structure;
        structure = self.config.filter.structure;
        $heading = $('.widget-heading').html(i18n('user.widget.trashMap'));
        if (typeof self.config.hidefilter !== 'undefined') {
          $('#filter-button').addClass('hide');
        }
        $headerWrapper = $('<h2/>', {
          'html': '<span id="close-filter"></span>' + i18n('global.filter') + '<span id="update-filter"></span>'
        });
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
        $('#filter-button').on('click', function() {
          return $(self.config.widget.id).addClass('filter-visible');
        });
        $('#close-filter').on('click', function() {
          $(self.config.widget.id).removeClass('filter-visible');
          return self.loadFilter();
        });
        $('#update-filter').on('click', function() {
          self.updateURL();
          self.data.zoompoints = [];
          self.updateMap();
          self.applyFilterTrashList();
          return $(self.config.widget.id).removeClass('filter-visible');
        });
        $('input[type="radio"]').on('click', function() {
          var $radio;
          $radio = $(this);
          if ($radio.data('waschecked') === true) {
            $radio.prop('checked', false);
            $radio.data('waschecked', false);
          } else {
            $radio.data('waschecked', true);
          }
          return $radio.siblings('input[type="radio"]').data('waschecked', false);
        });
        $('input[type="range"]').on('change mousemove', function() {
          var $this, val;
          $this = $(this);
          val = ($this.val() - $this.attr('min')) / ($this.attr('max') - $this.attr('min'));
          return $this.css('background-image', '-webkit-gradient(linear, left top, right top, ' + 'color-stop(' + val + ', #dedede), ' + 'color-stop(' + val + ', #8cc947)' + ')');
        });
      },
      loadFilter: function() {
        var $form, data;
        data = self.parseURL();
        $form = $('#trash-map-filter-form');
        if (data.length >= 5 && typeof data[4] !== 'undefined' && data[4] !== '') {
          $form.deserialize(data[4]);
        } else {
          $form[0].reset();
        }
        return $('input[type="range"]').trigger('change');
      },
      getFilterData: function() {
        var data, parsed;
        data = self.parseURL();
        if (data.length >= 5 && typeof data[4] !== 'undefined' && data[4] !== '') {
          parsed = $.parseParams('?' + data[4]);
          return parsed;
        } else {
          return null;
        }
      },
      applyFilterTrashList: function() {
        var data, filter, i, obj, tmpData, visibility, _accessibility, _days, _states, _updateNeeded;
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
          if (typeof filter['filter-status'] !== 'undefined' && $.inArray('updateNeeded', filter['filter-status']) > -1) {
            filter['filter-status'].push('more');
            filter['filter-status'].push('less');
          }
          if (typeof filter['filter-last'] !== 'undefined' && parseInt(filter['filter-last']) > 0) {
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
        return self.map.cluster.repaint();
      },
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
  })(jQuery, window, document);

  $(function() {
    return $(document).TrashMap();
  });

}).call(this);
