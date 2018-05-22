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


(function() {
  (function($, window, document) {
    var Statistics, self;
    Statistics = function(elem, options) {
      this.elem = elem;
      this.$elem = $(elem);
      this.options = options;
      this.metadata = $.fn.getQueryObject();
    };
    self = this;
    Statistics.prototype = {
      defmeta: {
        type: 'continent',
        blocks_chart: 1,
        blocks_geoarea: 1,
        blocks_trashlist: 1,
        charts_type: 'both',
        chart_status: 1,
        chart_type: 1,
        chart_size: 1,
        chart_accessibility: 1,
        trashlists_type: 'both',
        width: 150,
        height: 150,
        theme: '',
        language: ''
      },
      defaults: {
        widget: {
          id: 'body'
        },
        trashCharts: {
          id: '#trash-graphs'
        },
        trashList: {
          id: '#trash-update'
        },
        trashCountries: {
          id: '#trash-countries'
        },
        footer: {
          id: '#footer'
        },
        lists: {
          geoareas: ['continent', 'country', 'aa1', 'aa2', 'aa3', 'locality', 'sub_locality'],
          size: {
            bag: 'bag',
            wheelbarrow: 'wheelbarrow',
            car: 'car'
          },
          status: {
            reported: 'stillHere,less,more',
            cleaned: 'cleaned'
          },
          type: {
            plastic: 'plastic',
            domestic: 'domestic',
            automotive: 'automotive',
            liquid: 'liquid',
            dangerous: 'dangerous',
            metal: 'metal',
            electronic: 'electronic',
            deadAnimals: 'deadAnimals',
            organic: 'organic',
            construction: 'construction',
            glass: 'glass'
          },
          accessibility: {
            byCar: 'byCar',
            inCave: 'inCave',
            underWater: 'underWater',
            notForGeneralCleanup: 'notForGeneralCleanup'
          }
        },
        graphs: {
          donut: {
            pieHole: 0.5,
            chartArea: {
              width: '92%',
              height: '60%',
              top: '10%'
            },
            titleTextStyle: {
              fontName: '"Roboto", sans-serif',
              fontSize: 18
            },
            legend: {
              position: 'bottom',
              textStyle: {
                fontName: '"Roboto", sans-serif',
                fontSize: 11
              }
            },
            slices: {
              0: {
                color: '#fe4646'
              },
              1: {
                color: '#8cc947'
              },
              2: {
                color: '#ffb732'
              },
              3: {
                color: '#674f81'
              },
              4: {
                color: '#378da3'
              },
              5: {
                color: '#c75b1c'
              },
              6: {
                color: '#c69b70'
              },
              7: {
                color: '#068652'
              },
              8: {
                color: '#054652'
              },
              9: {
                color: '#043652'
              },
              10: {
                color: '#c2660b'
              }
            }
          },
          bar: {
            orientation: 'horizontal',
            titlePosition: 'none',
            titleTextStyle: {
              fontName: '"Roboto", sans-serif',
              fontSize: 18
            },
            chartArea: {
              width: '82%',
              height: '72%',
              top: '10%'
            },
            legend: {
              position: 'none',
              textStyle: {
                fontName: '"Roboto", sans-serif',
                fontSize: 11
              }
            },
            slices: {
              0: {
                color: '#ff484a'
              },
              1: {
                color: '#00b06c'
              },
              2: {
                color: '#ffb732'
              },
              3: {
                color: '#674f81'
              },
              4: {
                color: '#378da3'
              },
              5: {
                color: '#c75b1c'
              },
              6: {
                color: '#c69b70'
              },
              7: {
                color: '#068652'
              },
              8: {
                color: '#054652'
              },
              9: {
                color: '#043652'
              }
            }
          }
        }
      },
      data: {
        charts: {
          status: [],
          size: [],
          type: [],
          accessibility: []
        },
        name: 'the World',
        object: {}
      },
      init: function() {
        this.config = $.extend({}, this.defaults, this.options, this.metadata);
        this.metadata = $.extend({}, this.defmeta, this.metadata);
        self = this;
        this.initI18n();
        this.initData();
        this.initLoader();
        this.initHandlers();
        this.renderHTML();
        this.initTabsSwitcher();
        return this.initSorting();
      },
      renderError: function(msg) {
        var $panel;
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $panel.append('<br /><br /><br />');
        $panel.append($('<h2/>', {
          'html': msg
        }));
        return $(self.config.widget.id).find('.panels-wrapper').append($panel);
      },
      renderHTML: function() {
        if (parseInt(self.metadata.blocks_chart) === 1) {
          self.renderGraphs();
        }
        if (parseInt(self.metadata.blocks_trashlist) === 1) {
          self.renderLastUpdatedDumps();
        }
        if (parseInt(self.metadata.blocks_geoarea) === 1) {
          self.renderCountries();
        }
        return self.renderFooter();
      },
      renderGraphs: function() {
        if (parseInt(self.metadata.chart_status) === 1) {
          self.getChartData('status');
        }
        if (parseInt(self.metadata.chart_size) === 1) {
          self.getChartData('size');
        }
        if (parseInt(self.metadata.chart_type) === 1) {
          self.getChartData('type');
        }
        if (self.metadata.chart_accessibility === 1) {
          self.getChartData('accessibility');
        }
        self.renderGraphsSkelet();
        if (self.metadata.charts_type === 'both' || self.metadata.charts_type === 'donut') {
          if (parseInt(self.metadata.chart_status) === 1) {
            self.initGraph('round-1', i18n('widget.statistics.chartStatus'), self.data.charts.status);
          } else {
            $('#round-1').parent().hide();
          }
          if (parseInt(self.metadata.chart_size) === 1) {
            self.initGraph('round-2', i18n('widget.statistics.chartSize'), self.data.charts.size);
          } else {
            $('#round-2').parent().hide();
          }
          if (parseInt(self.metadata.chart_type) === 1) {
            self.initGraph('round-3', i18n('widget.statistics.chartType'), self.data.charts.type);
          } else {
            $('#round-3').parent().hide();
          }
          if (parseInt(self.metadata.chart_accessibility) === 1) {
            self.initGraph('round-4', i18n('widget.statistics.chartAccessibility'), self.data.charts.accessibility);
          } else {
            $('#round-4').parent().hide();
          }
        }
        if (self.metadata.charts_type === 'both' || self.metadata.charts_type === 'bar') {
          return self.initChartRadiosHandlers();
        }
      },
      renderGraphsSkelet: function() {
        var $a_bar, $a_donut, $bar, $donut, $header, $label, $nav, $radio, $radios, $round, $tabs, $wp, charts, d, data, i, slug, _i, _j, _len, _len1;
        data = [i18n('widget.statistics.chartStatus'), i18n('widget.statistics.chartSize'), i18n('widget.statistics.chartType'), i18n('widget.statistics.chartAccessibility')];
        charts = ['status', 'size', 'type', 'accessibility'];
        $header = $('<h1/>', {
          'html': i18n('widget.statistics.breakdownOfDumps') + ' ' + self.data.name
        });
        $tabs = $('<div/>', {
          'class': 'tabs'
        });
        if (self.metadata.charts_type === 'both') {
          $nav = $('<div/>', {
            'class': 'tabs-nav'
          });
          $a_donut = $('<a/>', {
            'class': 'current',
            'href': '#round',
            'html': i18n('widget.statistics.donutChart')
          });
          $a_bar = $('<a/>', {
            'href': '#histogram',
            'html': i18n('widget.statistics.barChart')
          });
          $nav.append($a_donut).append($a_bar);
        }
        $donut = $('<div/>', {
          'id': 'round',
          'class': 'tabs-content current'
        });
        for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
          d = data[i];
          $wp = $('<div/>', {
            'class': 'graph-wrapper'
          });
          $round = $('<div/>', {
            'id': 'round-' + (i + 1)
          });
          $wp.append($round);
          $donut.append($wp);
        }
        $bar = $('<div/>', {
          'id': 'histogram',
          'class': 'tabs-content'
        });
        $radios = $('<div/>', {
          'class': 'input-wrapper'
        });
        for (i = _j = 0, _len1 = data.length; _j < _len1; i = ++_j) {
          d = data[i];
          slug = d.toLowerCase().replace(RegExp(' ', 'g'), '-').replace(/[^\w-]+/g, '');
          $radio = $('<input/>', {
            'id': slug,
            'name': 'bar-chart',
            'type': 'radio',
            'data-title': d,
            'data-data': JSON.stringify(self.data.charts[charts[i]])
          });
          $label = $('<label/>', {
            'for': slug,
            'html': d
          });
          if (i === 0) {
            $radio.attr('checked', 'checked');
          }
          $radios.append($radio).append($label);
        }
        $bar.append($radios);
        $bar.append($('<div/>', {
          'id': 'histogram-1'
        }));
        if (self.metadata.charts_type === 'both') {
          $tabs.append($nav).append($donut).append($bar);
        }
        if (self.metadata.charts_type === 'donut') {
          $tabs.append($nav).append($donut);
        }
        if (self.metadata.charts_type === 'bar') {
          $bar.addClass('current');
          $tabs.append($nav).append($bar);
        }
        return $(self.config.trashCharts.id).append($header).append($tabs);
      },
      initGraph: function(id, title, data) {
        var cfg, d, i, totalSum, _i, _len;
        cfg = self.config.graphs.donut;
        totalSum = 0;
        for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
          d = data[i];
          if ($.isNumeric(d[1])) {
            totalSum += d[1];
          }
        }
        if (totalSum === 0) {
          $('#' + id).parent().hide();
          return;
        }
        google.charts.load('current', {
          packages: ['corechart']
        });
        return google.charts.setOnLoadCallback(function() {
          var chart, options;
          data = google.visualization.arrayToDataTable(data);
          options = $.extend({}, cfg, {
            title: title,
            legend: {
              position: 'right'
            }
          });
          chart = new google.visualization.PieChart(document.getElementById(id));
          chart.draw(data, options);
        });
      },
      initHistogram: function(id, title, data) {
        var cfg;
        cfg = self.config.graphs.bar;
        google.charts.load('current', {
          packages: ['corechart']
        });
        return google.charts.setOnLoadCallback(function() {
          var chart, options;
          data = google.visualization.arrayToDataTable(data);
          options = $.extend({}, cfg, {
            title: title,
            vAxis: {
              minValue: 1
            }
          });
          chart = new google.visualization.BarChart(document.getElementById(id));
          chart.draw(data, options);
        });
      },
      initChartRadiosHandlers: function() {
        var cfg;
        cfg = self.config.graphs.bar;
        $('[name="bar-chart"]').on('change', function() {
          var $this, data, title;
          $this = $(this);
          title = $this.attr('data-title');
          data = $this.data('data');
          return self.initHistogram('histogram-1', title, data);
        });
        return $('[name="bar-chart"]').first().trigger('change');
      },
      renderCountries: function() {
        var $box, $heading, $panel, data, item, query, type, _i, _len;
        query = self.metadata;
        type = query.type;
        if ((type === 'none') || ($.inArray(type, self.config.lists.geoareas) === -1)) {
          return '';
        }
        delete query.type;
        data = self.getDataCountries(type, query);
        $heading = $('<h1/>', {
          'html': i18n('widget.statistics.breakdownOfDumps') + ' ' + self.data.name
        });
        $panel = $('<div/>', {
          'class': 'dumps-list'
        });
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          item = data[_i];
          $box = $('<div/>', {});
          $box.append($('<div/>', {
            'class': 'country',
            'html': item['_anchor']
          }));
          $box.append($('<div/>', {
            'class': 'reported',
            'html': item['_total'] + ' ' + i18n('notifications.reported')
          }));
          $box.append($('<div/>', {
            'class': 'cleaned',
            'html': $.fn.round(item['_cleaned']) + '% ' + i18n('global.cleaned')
          }));
          $panel.append($box);
        }
        return $(self.config.trashCountries.id).append($heading).append($panel);
      },
      renderLastUpdatedDumps: function(data) {
        var $anchor, $heading, $listContent, $listHeader, $listHeaderBox, $listItem, $listItemInfo, $listItemLastUpdate, $listItemPhoto, $listItemPhotoLink, $listItemStatus, $listView, $navigation, $panel, $photos, $sortingIcon, $wrapper, address, area, cfg, dataImg, i, image, img, imgPath, status, trash;
        cfg = $.fn.config('system.admin');
        if (!data) {
          data = self.getTrashList();
        }
        imgPath = $.fn.config('system.paths.images');
        $heading = $('<h1/>', {
          'html': i18n('widget.statistics.lastUpdatedDumps') + ' ' + self.data.name
        });
        $panel = $('<div/>', {
          'class': 'tabs'
        });
        if (self.metadata.trashlists_type === 'both') {
          $navigation = $('<div/>', {
            'class': 'tabs-nav'
          });
          $navigation.append($('<a/>', {
            'href': '#photos',
            'html': i18n('global.photos')
          }));
          $navigation.append($('<a/>', {
            'href': '#list-view',
            'class': 'current',
            'html': i18n('global.list')
          }));
        }
        $photos = $('<div/>', {
          'id': 'photos',
          'class': 'tabs-content'
        });
        dataImg = $.extend(true, {}, data);
        for (i in dataImg) {
          trash = dataImg[i];
          image = $.fn.config('system.paths.images') + 'placeholder_rectangle.png';
          if ($.isArray(trash.images) && trash.images.length > 0) {
            img = trash.images.pop();
            img = img.fullDownloadUrl;
            if (img) {
              image = img;
            }
          }
          $anchor = $('<a/>', {
            'href': cfg.domain + cfg.endpoints.trashDetail + trash.id,
            'target': '_blank',
            'class': 'photo'
          });
          $anchor.append($('<img/>', {
            'src': image,
            'alt': '',
            'title': ''
          }));
          $photos.append($anchor);
        }
        $listView = $('<div/>', {
          'id': 'list-view',
          'class': 'tabs-content current'
        });
        $listHeader = $('<div/>', {
          'class': 'list'
        });
        $listHeaderBox = $('<div/>', {
          'class': 'list-header'
        });
        $sortingIcon = $('<a/>', {
          'href': '#',
          'onclick': 'return false;',
          'html': $('<img/>', {
            'src': imgPath + 'icons/sort.png'
          })
        });
        $listHeaderBox.append($('<span/>', {
          'html': i18n('global.photos')
        }));
        $listHeaderBox.append($('<span/>', {
          'html': i18n('global.dumps')
        }));
        $listHeaderBox.append($('<span/>', {
          'html': i18n('global.status') + $sortingIcon[0].outerHTML,
          'id': 'sort-status'
        }));
        $listHeaderBox.append($('<span/>', {
          'html': i18n('global.lastUpdate') + $sortingIcon[0].outerHTML,
          'id': 'sort-update'
        }));
        $listHeader.append($listHeaderBox);
        $listContent = $('<div/>', {
          'id': 'sortable',
          'class': 'list'
        });
        for (i in data) {
          trash = data[i];
          image = $.fn.config('system.paths.images') + 'placeholder_rectangle.png';
          if ($.isArray(trash.images) && trash.images.length > 0) {
            img = trash.images.pop();
            img = img.fullDownloadUrl;
            if (img) {
              image = img;
            }
          }
          $listItem = $('<div/>', {
            'class': 'list-item'
          });
          $listItemPhoto = $('<div/>', {
            'class': 'list-photo'
          });
          $listItemPhotoLink = $('<a/>', {
            'href': cfg.domain + cfg.endpoints.trashDetail + trash.id,
            'target': '_blank'
          });
          $listItemPhotoLink.append($('<img/>', {
            'src': image,
            'alt': '',
            'title': ''
          }));
          $listItemPhoto.append($listItemPhotoLink);
          $listItemInfo = $('<div/>', {
            'class': 'info'
          });
          address = '';
          if (!$.fn.isEmpty(trash.gps.area)) {
            area = trash.gps.area;
            address += !$.fn.isEmpty(area.subLocality) ? area.subLocality : '';
            address += !$.fn.isEmpty(area.locality) ? ', ' + area.locality : '';
            address += !$.fn.isEmpty(area.country) ? ', ' + area.country : '';
          }
          $listItemInfo.append($('<h2/>', {
            'html': address.replace(/^, /gi, '')
          }));
          $listItemInfo.append($('<span/>', {
            'class': 'ico ico-' + trash.size + ' green trash-type',
            'html': i18n('trash.size.' + (trash.size === 'car' ? 'carNeeded' : trash.size))
          }));
          $wrapper = $('<div/>', {
            'class': 'ico-types-wrapper'
          });
          if ($.isArray(trash.types) && trash.types.length > 0) {
            $.each(trash.types, function(key, object) {
              return $wrapper.append($('<span/>', {
                'class': 'ico ico-type ico-' + object,
                'html': i18n('trash.types.' + object)
              }));
            });
            $listItemInfo.append($wrapper);
          }
          if (trash.status === 'cleaned') {
            status = {
              name: 'trash.status.cleaned',
              icon: 'cleaned'
            };
          } else if (trash.updateNeeded === true) {
            status = {
              name: 'trash.updateNeeded',
              icon: 'unknown'
            };
          } else {
            status = {
              name: 'trash.created',
              icon: 'reported'
            };
          }
          $listItemStatus = $('<div/>', {
            'class': 'status'
          });
          $listItemStatus.append($('<div/>', {
            'class': 'status-' + status.icon,
            'html': i18n(status.name) + '<em class="hide">' + status.name + '-' + trash.id + '</em>'
          }));
          $listItemLastUpdate = $('<div/>', {
            'class': 'last-update'
          });
          $listItemLastUpdate.append($('<h3/>', {
            'html': '' + i18n(moment(trash.updateTime).ago()) + '<small>' + moment(trash.updateTime).format('ll') + '</small><em class="hide">' + moment(trash.updateTime).unix() + '</em>'
          }));
          $listItem.append($listItemPhoto).append($listItemInfo).append($listItemStatus).append($listItemLastUpdate);
          $listContent.append($listItem);
        }
        $listView.append($listHeader).append($listContent);
        if (self.metadata.trashlists_type === 'both') {
          $panel.append($navigation).append($photos).append($listView);
        }
        if (self.metadata.trashlists_type === 'list') {
          $listView.addClass('current');
          $panel.append($navigation).append($listView);
        }
        if (self.metadata.trashlists_type === 'photo') {
          $panel.append($navigation).append($photos);
        }
        return $(self.config.trashList.id).append($heading).append($panel);
      },
      renderFooter: function() {
        var $newsletter, cfg;
        cfg = $.fn.config('system.admin');
        $newsletter = $('<div/>', {
          'class': 'newsletter'
        });
        $newsletter.append($('<a/>', {
          'href': cfg.domain + cfg.endpoints.subscribe,
          'target': '_blank',
          'html': i18n('global.subscribe')
        }));
        return $(self.config.footer.id).append($newsletter);
      },
      initHandlers: function() {
        return false;
      },
      initData: function() {
        var geoareas, i, query, _results;
        geoareas = self.config.lists.geoareas.slice(0);
        query = self.metadata;
        _results = [];
        for (i in geoareas.reverse()) {
          if (query[geoareas[i]]) {
            self.data.name = query[geoareas[i]];
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      getDataCountries: function(type, params) {
        var cfg, query, result;
        cfg = $.fn.config('system.api');
        query = {
          type: type
        };
        if (params) {
          query = $.extend(query, params);
        }
        result = [];
        $.ajax({
          url: cfg.domain + cfg.endpoints.areaList + '?' + $.param(query),
          async: false,
          headers: {
            'x-api-key': self.config.key
          }
        }).done(function(data) {
          var item, _i, _len;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            item = data[_i];
            item['_total'] = parseInt(item.less) + parseInt(item.more) + parseInt(item.stillHere) + parseInt(item.cleaned);
            item['_cleaned'] = item['_total'] > 0 ? (parseInt(item.cleaned) / item['_total']) * 100 : 0;
            item['_name'] = item[type];
            item['_anchor'] = self.getAnchor(type, item);
          }
          return result = data;
        }).fail(function() {
          return false;
        });
        return result;
      },
      getAnchor: function(type, item) {
        var cfg, geoareas, i, result, _id, _key, _params;
        cfg = $.fn.config('system.api');
        geoareas = self.config.lists.geoareas;
        _key = geoareas[geoareas.indexOf(type) + 1];
        _params = {
          'key': self.config.key
        };
        i = geoareas.indexOf(type);
        while (i >= 0) {
          _id = geoareas[i];
          if (item[_id]) {
            _params[_id] = item[_id];
          }
          i--;
        }
        if (geoareas.indexOf(type) > 1) {
          i = geoareas.indexOf(type) + 1;
          while (i < geoareas.length) {
            _key = geoareas[i];
            result = [];
            $.ajax({
              url: cfg.domain + cfg.endpoints.areaList + '?type=' + _key + '&' + $.param(_params).replace(/\+/g, '%20'),
              async: false,
              headers: {
                'x-api-key': self.config.key
              }
            }).done(function(data) {
              return result = data;
            });
            if (result.length > 0) {
              return $('<a/>', {
                'href': 'statistics.html?type=' + _key + '&' + $.param(_params).replace(/\+/g, '%20'),
                'html': item['_name']
              });
            }
            i++;
          }
        } else {
          return $('<a/>', {
            'href': 'statistics.html?type=' + _key + '&' + $.param(_params).replace(/\+/g, '%20'),
            'html': item['_name']
          });
        }
        return $('<a/>', {
          'href': 'statistics.html?type=none&' + $.param(_params).replace(/\+/g, '%20'),
          'html': item['_name']
        });
      },
      getTrashList: function() {
        var cfg, geoareas, query, queryData, result;
        cfg = $.fn.config('system.api');
        geoareas = self.config.lists.geoareas;
        queryData = self.metadata;
        query = {
          attributesNeeded: 'id,status,types,size,updateNeeded,gpsShort,created,note,images,updateTime,updateHistory,gpsFull',
          limit: 24,
          page: 1,
          orderBy: '-update'
        };
        Object.keys(queryData).forEach(function(key, index) {
          var _key;
          if (($.inArray(key, geoareas)) > -1) {
            _key = key.charAt(0).toUpperCase() + key.substring(1).toLowerCase();
            _key = _key.replace('ub_loc', 'bLoc');
            query['geoArea' + _key] = queryData[key];
          }
        });
        result = false;
        $.ajax({
          url: cfg.domain + cfg.endpoints.trashList + '?' + $.param(query),
          async: false,
          headers: {
            'x-api-key': self.config.key
          }
        }).done(function(data) {
          return result = data;
        }).fail(function() {
          return result = false;
        });
        return result;
      },
      getChartData: function(type, params) {
        var cfg, geoareas, query, queryData, result, slices, types;
        cfg = $.fn.config('system.api');
        slices = self.config.graphs.donut.slices;
        result = [
          [
            '', '', {
              role: 'style'
            }
          ]
        ];
        types = self.config.lists[type];
        query = {};
        queryData = self.metadata;
        geoareas = self.config.lists.geoareas;
        Object.keys(queryData).forEach(function(key, index) {
          var _key;
          if (($.inArray(key, geoareas)) > -1) {
            _key = key.charAt(0).toUpperCase() + key.substring(1).toLowerCase();
            _key = _key.replace('ub_loc', 'bLoc');
            return query['geoArea' + _key] = queryData[key];
          }
        });
        Object.keys(types).forEach(function(key, index) {
          var section, translationString, _key;
          _key = 'trash' + type.charAt(0).toUpperCase() + type.substring(1).toLowerCase();
          query[_key] = types[key];
          if (params) {
            query = $.extend(query, params);
          }
          if (type === 'type') {
            translationString = 'trash.types.' + key;
          } else if (type === 'size') {
            translationString = 'trash.size.' + (key === 'car' ? 'carNeeded' : key);
          } else if (type === 'status') {
            translationString = (key === 'reported' ? 'trash.created' : 'trash.status.' + key);
          } else if (type === 'accessibility') {
            translationString = 'trash.accessibility.' + key;
          }
          section = type === 'type' ? 'types' : type;
          return $.ajax({
            url: cfg.domain + cfg.endpoints.trashStatistics + '?' + $.param(query),
            async: false,
            headers: {
              'x-api-key': self.config.key
            }
          }).done(function(data) {
            var _color;
            _color = index < slices.length ? slices[index].color : '#000000';
            return result.push([i18n(translationString), data.count, 'color:' + slices[index].color]);
          }).fail(function() {});
        });
        self.data.charts[type] = result.slice(0);
        return result;
      },
      initLoader: function() {
        $(document).ajaxStart(function() {
          return $('.spinner-overlay').removeClass('hide');
        });
        return $(document).ajaxStop(function() {
          return $('.spinner-overlay').addClass('hide');
        });
      },
      initI18n: function() {
        var lang;
        lang = self.config.language || navigator.language || navigator.userLanguage || 'en';
        lang = lang.substr(0, 2).toLowerCase();
        moment.locale(lang);
        return i18nLoadLanguages(lang);
      },
      initTabsSwitcher: function() {
        var $tabLinks;
        $tabLinks = $('.tabs .tabs-nav a');
        return $tabLinks.on('click', function(e) {
          var $tabs, tabsHref;
          e.preventDefault();
          $tabs = $(this).parents('.tabs');
          tabsHref = $(this).attr('href');
          $tabs.find('.tabs-nav a.current').removeClass('current');
          $tabs.find('.tabs-content.current').removeClass('current');
          $(this).addClass('current');
          $tabs.find(tabsHref).addClass('current');
          $('.tabs-content.current').each(function() {
            var reflow;
            reflow = this.offsetHeight;
          });
        });
      },
      initSorting: function() {
        $('#sort-status').on('click', function(e) {
          $('#sortable').sortChildren($.sortFunc(['$(this).find(\'.status em\').text()']), 0, 0, $(this).hasClass('reverse'));
          $(this).toggleClass('reverse');
          return false;
        });
        return $('#sort-update').on('click', function(e) {
          $('#sortable').sortChildren($.sortFunc(['+$(this).find(\'.last-update em\').text()']), 0, 0, $(this).hasClass('reverse'));
          $(this).toggleClass('reverse');
          return false;
        });
      }
    };
    Statistics.defaults = Statistics.prototype.defaults;
    $.fn.Statistics = function(options) {
      return this.each(function() {
        new Statistics(this, options).init();
      });
    };
  })(jQuery, window, document);

  $(function() {
    return $(document).Statistics();
  });

}).call(this);
