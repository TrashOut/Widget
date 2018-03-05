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
    var EventDetail, self;
    EventDetail = function(elem, options) {
      this.elem = elem;
      this.$elem = $(elem);
      this.options = options;
      this.metadata = $.fn.getQueryObject();
    };
    self = this;
    EventDetail.prototype = {
      defaults: {
        widget: {
          id: '#trash-map-detail'
        },
        map: {
          options: {
            zoom: 16,
            size: {
              w: 400,
              h: 200
            }
          }
        }
      },
      data: {
        object: {}
      },
      init: function() {
        this.config = $.extend({}, this.defaults, this.options, this.metadata);
        self = this;
        this.initI18n();
        this.initLoader();
        this.initHandlers();
        if (this.initData()) {
          this.renderHTML();
        } else {
          this.renderError(i18n('global.loadingError'));
        }
        return this;
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
        return $(self.config.widget.id).find('.panels-wrapper.info').append($panel);
      },
      renderHTML: function() {
        self.renderMain();
        self.renderDirection();
        self.renderDetailedInfo();
        return self.renderListOfDumps();
      },
      renderMain: function() {
        var $box, $box2, $heading, $panel, $panel2, cfg, contact, event;
        cfg = $.fn.config('system.admin');
        event = self.data.object;
        $heading = $('.widget-heading').html(i18n('user.widget.eventDetail'));
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $box = $('<div/>', {
          'class': 'white-box'
        });
        $box.append($('<h2/>', {
          'html': event.name
        }));
        $box.append($('<p/>', {
          'class': 'grey',
          'html': moment(event.start).format('D/M/YYYY') + ', ' + i18n('event.detail.duration') + ': ' + moment.duration(event.duration, 'minutes').humanize()
        }));
        $box.append($('<p/>', {
          'html': event.description
        }));
        $box.append($('<a/>', {
          'class': 'small-button',
          'href': cfg.domain + cfg.endpoints.eventDetail + event.id,
          'target': '_blank',
          'html': i18n('event.join')
        }));
        $panel.append($box);
        $(self.config.widget.id).find('.panels-wrapper.info').append($panel);
        contact = event.contact;
        if (!$.fn.isEmpty(contact.phone) || !$.fn.isEmpty(contact.email)) {
          $panel2 = $('<div/>', {
            'class': 'panel'
          });
          $box2 = $('<div/>', {
            'class': 'white-box'
          });
          if (!$.fn.isEmpty(contact.name)) {
            $box2.append($('<h3/>', {
              'class': 'big-icon big-icon-person',
              'html': contact.name + '<br/><span class="grey">' + i18n('event.detail.organizer') + '</span>'
            }));
          }
          if (!$.fn.isEmpty(contact.occupation)) {
            $box2.append($('<h3/>', {
              'class': 'big-icon big-icon-home',
              'html': contact.occupation + '<br/><span class="grey">' + i18n('global.occupation') + '</span>'
            }));
          }
          if (!$.fn.isEmpty(contact.phone)) {
            $box2.append($('<h3/>', {
              'class': 'big-icon big-icon-phone',
              'html': contact.phone + '<br/><span class="grey">' + i18n('global.phone') + '</span>'
            }));
          }
          if (!$.fn.isEmpty(contact.email)) {
            $box2.append($('<h3/>', {
              'class': 'big-icon big-icon-email',
              'html': '<a href="mailto:' + contact.email + '">' + contact.email + '</a><br/><span class="grey">' + i18n('global.email') + '</span>'
            }));
          }
          $panel2.append($box2);
          return $(self.config.widget.id).find('.panels-wrapper.info').append($panel2);
        }
      },
      renderDirection: function() {
        var $box, $panel, address, directionURL, event, opts;
        event = self.data.object;
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $panel.append($('<div/>', {
          'class': 'mini-map'
        }));
        $box = $('<div/>', {
          'class': 'white-box'
        });
        address = '';
        if (!$.fn.isEmpty(event.gps.area)) {
          address += !$.fn.isEmpty(event.gps.area.street) ? event.gps.area.street : '';
          address += !$.fn.isEmpty(event.gps.area.zip) ? ', ' + event.gps.area.zip : '';
          address += !$.fn.isEmpty(event.gps.area.subLocality) ? ' ' + event.gps.area.subLocality : '';
          address += !$.fn.isEmpty(event.gps.area.locality) ? ', ' + event.gps.area.locality : '';
          address += !$.fn.isEmpty(event.gps.area.country) ? ', ' + event.gps.area.country : '';
        }
        $box.append($('<p/>', {
          'html': address.replace(/^, /gi, '') + '<br><small><span class="grey">' + event.gps.lat + ', ' + event.gps.long + '</span>'
        }));
        directionURL = 'https://www.google.com/maps/dir//' + event.gps.lat + ',' + event.gps.long;
        $box.append($('<a/>', {
          'class': 'small-button',
          'href': directionURL,
          'target': '_blank',
          'html': i18n('global.direction')
        }));
        $panel.append($box);
        $(self.config.widget.id).find('.panels-wrapper.info').append($panel);
        opts = self.config.map.options;
        return $('.mini-map').html('<iframe width="600" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBQa-0pghBXFAOjvvWGfIieQcTvMAefNPY&q=' + event.gps.lat + ',' + event.gps.long + '&zoom=' + opts.zoom + '" allowfullscreen></iframe>');
      },
      renderListOfDumps: function() {
        var $box, $box1, $box2, $box3, $panel, $panel1, $panel2, $panel3, cfg, event, trashPoints;
        cfg = $.fn.config('system.admin');
        event = self.data.object;
        trashPoints = event.trashPoints;
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $panel.append($('<h2/>', {
          'html': i18n('event.listOfDumpsToBeCleaned')
        }));
        if (trashPoints.length <= 0) {
          return;
        }
        $box = $('<div/>', {
          'class': 'white-box to-be-cleaned'
        });
        $panel1 = $('<div/>', {
          'class': 'panel'
        });
        $panel2 = $('<div/>', {
          'class': 'panel'
        });
        $panel3 = $('<div/>', {
          'class': 'panel'
        });
        $box1 = $('<div/>', {
          'class': 'white-box to-be-cleaned'
        });
        $box2 = $('<div/>', {
          'class': 'white-box to-be-cleaned'
        });
        $box3 = $('<div/>', {
          'class': 'white-box to-be-cleaned'
        });
        $.each(trashPoints, function(key, object) {
          var $item, $this, address, image, img, status, typesImages, typesText;
          $this = $(this);
          image = $.fn.config('system.paths.images') + 'placeholder_rectangle.png';
          if ($.isArray(object.images) && object.images.length > 0) {
            img = object.images[0];
            img = img.fullDownloadUrl;
            if (img) {
              image = img;
            }
          }
          status = 'unknown';
          if (object.status === 'cleaned') {
            status = 'cleaned';
          } else if (object.updateNeeded === false && (object.status === 'less' || object.status === 'more' || object.status === 'stillHere')) {
            status = 'reported';
          }
          typesImages = '';
          typesText = '';
          if ($.isArray(object.types) && object.types.length > 0) {
            $.each(object.types, function(key, object2) {
              typesImages += '<span class="ico ico-type ico-' + object2 + '" title="' + i18n('trash.types.' + object2) + '">' + '</span>';
              return typesText += i18n(object2) + ', ';
            });
            typesText = typesText.trim().replace(/,+$/, '');
          }
          address = '';
          if (!$.fn.isEmpty(object.gps.area)) {
            address += !$.fn.isEmpty(object.gps.area.subLocality) ? object.gps.area.subLocality : '';
            address += !$.fn.isEmpty(object.gps.area.locality) ? ', ' + object.gps.area.locality : '';
            address += !$.fn.isEmpty(object.gps.area.country) ? ', ' + object.gps.area.country : '';
          }
          address = address.replace(/^, /gi, '');
          address = address === '' ? object.gps.lat + ', ' + object.gps.long : address;
          $item = $('<div/>', {
            'class': 'event-item'
          });
          $item.append($('<div/>', {
            'class': 'trash-photo ' + status,
            'html': '<a href="' + cfg.domain + cfg.endpoints.trashDetail + object.id + '" target="_blank"><img src="' + image + '" alt="' + typesText + '" /></a>'
          }));
          $item.append($('<p/>', {
            'html': '<small><span class="grey">' + address + '</span></small><br/><div class="types-small">' + typesImages + '</div><br/><small><span class="grey">' + moment(object.created).fromNow() + '</span></small>'
          }));
          if (key % 3 === 0) {
            $box1.append($item);
            if (key + 4 < trashPoints.length) {
              $box1.append($('<hr/>', {}));
            }
          }
          if (key % 3 === 1) {
            $box2.append($item);
            if (key + 3 < trashPoints.length) {
              $box2.append($('<hr/>', {}));
            }
          }
          if (key % 3 === 2) {
            $box3.append($item);
            if (key + 4 < trashPoints.length) {
              return $box3.append($('<hr/>', {}));
            }
          }
        });
        $panel1.append($box1);
        $panel2.append($box2);
        $panel3.append($box3);
        if (trashPoints.length) {
          $(self.config.widget.id).find('.panels-wrapper.trashes-title').append($panel);
        }
        if (trashPoints.length >= 1) {
          $(self.config.widget.id).find('.panels-wrapper.trashes').append($panel1);
        }
        if (trashPoints.length >= 2) {
          $(self.config.widget.id).find('.panels-wrapper.trashes').append($panel2);
        }
        if (trashPoints.length >= 3) {
          return $(self.config.widget.id).find('.panels-wrapper.trashes').append($panel3);
        }
      },
      renderDetailedInfo: function() {
        var $box, $panel, event;
        event = self.data.object;
        if ($.fn.isEmpty(event.have) && $.fn.isEmpty(event.bring)) {
          return;
        }
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $box = $('<div/>', {
          'class': 'white-box basic-info'
        });
        if (!$.fn.isEmpty(event.have)) {
          $box.append($('<p/>', {
            'html': i18n('event.whatWeHave')
          }));
          $box.append($('<p/>', {
            'class': 'grey',
            'html': event.have
          }));
          $box.append($('<hr/>', {}));
        }
        if (!$.fn.isEmpty(event.bring)) {
          $box.append($('<p/>', {
            'html': i18n('event.detail.pleaseBring')
          }));
          $box.append($('<p/>', {
            'class': 'grey',
            'html': event.bring
          }));
        }
        $panel.append($box);
        return $(self.config.widget.id).find('.panels-wrapper.info').append($panel);
      },
      initHandlers: function() {
        var $trashMap, $trashMapDetail, $widget;
        $widget = window.$('#eventdetail-widget');
        $trashMap = window.$('#trash-map');
        $trashMapDetail = window.$('#trash-map-detail');
        if ($widget.length <= 0) {
          return $('#close-detail').addClass('hide');
        } else {
          return $('#close-detail').on('click', function() {
            $trashMapDetail.removeClass('event-detail-open');
            return $widget.addClass('hidden-right');
          });
        }
      },
      initData: function() {
        var cfg, objectId, query;
        objectId = self.config.id;
        cfg = $.fn.config('system.api');
        query = {
          attributesNeeded: 'id'
        };
        $.ajax({
          url: cfg.domain + cfg.endpoints.eventDetail + objectId + '?' + $.param(query),
          async: false,
          headers: {
            'x-api-key': self.config.key
          }
        }).done(function(data) {
          self.data.object = data;
          return console.log(data);
        }).fail(function() {
          return true;
        });
        return !$.fn.isEmpty(self.data.object);
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
        lang = lang.substr(0, 2).toLowerCase();
        moment.locale(lang);
        return i18nLoadLanguages(lang);
      }
    };
    EventDetail.defaults = EventDetail.prototype.defaults;
    $.fn.EventDetail = function(options) {
      return this.each(function() {
        new EventDetail(this, options).init();
      });
    };
  })(jQuery, window, document);

  $(function() {
    return $(document).EventDetail();
  });

}).call(this);
