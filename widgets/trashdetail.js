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
    var TrashDetail, self;
    TrashDetail = function(elem, options) {
      this.elem = elem;
      this.$elem = $(elem);
      this.options = options;
      this.metadata = $.fn.getQueryObject();
    };
    self = this;
    TrashDetail.prototype = {
      defaults: {
        widget: {
          id: '#trash-map-detail'
        },
        eventDetail: {
          id: '#eventdetail-widget'
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
        return $(self.config.widget.id).find('.panels-wrapper').append($panel);
      },
      renderHTML: function() {
        self.renderMain();
        self.renderInfo();
        self.renderEvent();
        self.renderHistory();
        self.renderMunicipality();
        return self.renderSpam();
      },
      renderMain: function() {
        var $box, $heading, $imgWrapper, $panel, accuracy, address, cfg, directionURL, gps, image, img, status, trash;
        cfg = $.fn.config('system.admin');
        trash = self.data.object;
        image = $.fn.config('system.paths.images') + 'placeholder_rectangle.png';
        if ($.isArray(trash.images) && trash.images.length > 0) {
          img = trash.images[0].fullDownloadUrl;
          if (img) {
            image = img;
          }
        }
        $heading = $('.widget-heading').html(i18n('trash.detail.header'));
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $imgWrapper = $('<div/>', {
          'class': 'photo-header'
        });
        $imgWrapper.append($('<a/>', {
          'href': image,
          'target': '_blank',
          'html': '<img src="' + image + '" />'
        }));
        status = {
          name: 'notifications.reported',
          icon: 'reported'
        };
        if (trash.updateHistory.length > 0 && (trash.status === 'stillHere')) {
          status = {
            name: 'global.updated',
            icon: 'updated'
          };
        }
        if (trash.updateHistory.length > 0 && (trash.status === 'less' || trash.status === 'more')) {
          status = {
            name: 'trash.status.' + trash.status,
            icon: 'updated'
          };
        }
        if (trash.status === 'cleaned') {
          status = {
            name: 'global.cleaned',
            icon: 'cleaned'
          };
        } else if (trash.updateHistory.length > 0 && trash.updateNeeded) {
          status = {
            name: 'trash.updateNeeded',
            icon: 'unknown'
          };
        }
        $imgWrapper.append($('<div/>', {
          'class': 'trash-status status-' + status.icon,
          'html': '<h3>' + i18n(status.name) + '<br/><span>' + moment(trash.updateTime).fromNow() + '</span></h3>'
        }));
        $panel.append($imgWrapper);
        $box = $('<div/>', {
          'class': 'white-box'
        });
        $box.append($('<h2/>', {
          'html': i18n('trash.message.updateThisTrash') + '<small>' + i18n('trash.create.TakeSomePictures') + '</small>'
        }));
        $box.append($('<a/>', {
          'class': 'button green',
          'href': cfg.domain + cfg.endpoints.trashUpdate + trash.id,
          'target': '_blank',
          'html': i18n('trash.status.cleaned')
        }));
        $box.append($('<a/>', {
          'class': 'button red',
          'href': cfg.domain + cfg.endpoints.trashUpdate + trash.id,
          'target': '_blank',
          'html': i18n('trash.status.stillHere')
        }));
        address = '';
        if (!$.fn.isEmpty(trash.gps.area)) {
          address += !$.fn.isEmpty(trash.gps.area.subLocality) ? trash.gps.area.subLocality : '';
          address += !$.fn.isEmpty(trash.gps.area.locality) ? ', ' + trash.gps.area.locality : '';
          address += !$.fn.isEmpty(trash.gps.area.country) ? ', ' + trash.gps.area.country : '';
        }
        gps = trash.gps.lat + ', ' + trash.gps.long;
        accuracy = trash.gps.accuracy;
        $box.append($('<p/>', {
          'html': address.replace(/^, /gi, '') + '<br><small><span class="grey">' + gps + '</span><br>' + i18n('trash.accuracyOfLocation') + ': <span class="grey">&lt; ' + accuracy + ' m</span></small>'
        }));
        directionURL = 'https://www.google.com/maps/dir//' + trash.gps.lat + ',' + trash.gps.long;
        $box.append($('<a/>', {
          'class': 'small-button',
          'href': directionURL,
          'target': '_blank',
          'html': i18n('global.direction')
        }));
        $panel.append($box);
        return $(self.config.widget.id).find('.panels-wrapper').append($panel);
      },
      renderInfo: function() {
        var $box, $p, $panel, $panel2, accessibility, trash;
        trash = self.data.object;
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $panel.append($('<h2/>', {
          'html': i18n('global.information')
        }));
        $box = $('<div/>', {
          'class': 'white-box'
        });
        $p = $('<p/>', {
          'html': i18n('trash.trashSize') + '<br>'
        });
        $p.append($('<span/>', {
          'class': 'ico ico-' + trash.size + ' green',
          'html': '<span class="type-name">' + i18n('trash.size.' + (trash.size === 'car' ? 'carNeeded' : trash.size)) + '</span>'
        }));
        $box.append($p);
        if ($.isArray(trash.types) && trash.types.length > 0) {
          $box.append($('<hr/>', {}));
          $p = $('<p/>', {
            'html': i18n('trash.trashType') + '<br>'
          });
          $.each(trash.types, function(key, object) {
            return $p.append($('<span/>', {
              'class': 'ico ico-type ico-' + object,
              'html': '<span class="type-name">' + i18n('trash.types.' + object) + '</span>'
            }));
          });
          $box.append($p);
        }
        accessibility = [];
        $.each(trash.accessibility, function(key, object) {
          if (object) {
            return accessibility.push(i18n('trash.accessibility.' + key));
          }
        });
        if (accessibility.length > 0) {
          $box.append($('<hr/>', {}));
          $box.append($('<p/>', {
            'html': i18n('trash.accessibility') + '<br><small class="grey">' + accessibility.join(', ') + '</small>'
          }));
        }
        $panel.append($box);
        $(self.config.widget.id).find('.panels-wrapper').append($panel);
        $panel2 = $('<div/>', {
          'class': 'panel'
        });
        $panel2.append($('<h2/>', {
          'html': i18n('trash.note')
        }));
        $panel2.append($('<div/>', {
          'class': 'grey-box',
          'html': '<p class="grey">' + trash.note + '</p>'
        }));
        return $(self.config.widget.id).find('.panels-wrapper').append($panel2);
      },
      renderEvent: function() {
        var $box, $panel, cfg, event, i, trash;
        cfg = $.fn.config('system.admin');
        trash = self.data.object;
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $panel.append($('<h2/>', {
          'html': i18n('event.header')
        }));
        if (!$.fn.isEmpty(trash.events)) {
          for (i in trash.events) {
            event = trash.events[i];
            $box = $('<div/>', {
              'class': 'white-box'
            });
            $box.append($('<h2/>', {
              'html': event.name
            }));
            $box.append($('<p/>', {
              'class': 'grey',
              'html': moment(event.start).format('lll')
            }));
            if (!$.fn.isEmpty(event.description)) {
              $box.append($('<p/>', {
                'html': event.description
              }));
            }
            $box.append($('<a/>', {
              'class': 'small-button',
              'href': '#',
              'html': i18n('Join')
            }));
            $box.append($('<a/>', {
              'class': 'small-button btn-event-detail',
              'href': '#',
              'html': i18n('Detail'),
              'data-id': event.id
            }));
            $panel.append($box);
          }
        } else {
          $box = $('<div/>', {
            'class': 'grey-box'
          });
          $box.append($('<p/>', {
            'class': 'grey',
            'html': i18n('trash.detail.noCleaningEvent')
          }));
          if (trash.status !== 'cleaned') {
            $box.append($('<a/>', {
              'class': 'button green',
              'href': cfg.domain + cfg.endpoints.eventCreate,
              'target': '_blank',
              'html': i18n('event.create.header')
            }));
          }
          $panel.append($box);
        }
        $(self.config.widget.id).find('.panels-wrapper').append($panel);
        return $('.btn-event-detail').on('click', function() {
          var $this;
          $this = $(this);
          return self.showEventDetail($this.attr('data-id'));
        });
      },
      renderHistory: function() {
        var $panel, $whiteBox, history, lastStatus, trashDetail;
        trashDetail = self.data.object;
        history = self.data.object.updateHistory;
        history.push({
          changed: {
            images: JSON.parse(JSON.stringify(trashDetail.images)),
            status: trashDetail.status
          },
          userInfo: trashDetail.userInfo,
          updateTime: trashDetail.updateTime
        });
        history = history.reverse();
        if (history.length <= 0) {
          return;
        }
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $panel.append($('<h2/>', {
          'html': i18n('trash.history')
        }));
        $whiteBox = $('<div/>', {
          'class': 'white-box'
        });
        lastStatus = {
          name: trashDetail.status === 'stillHere' ? 'trash.created' : 'trash.status.' + trashDetail.status,
          icon: trashDetail.status === 'stillHere' ? 'reported' : (trashDetail.status === 'cleaned' ? 'cleaned' : 'updated')
        };
        $.each(history, function(key, object) {
          var $box, $this, i, img, name, status, _i, _len, _ref;
          if ((key + 1) === history.length) {
            status = lastStatus = {
              name: 'trash.created',
              icon: 'reported'
            };
          } else if (object.changed.status === 'stillHere') {
            status = lastStatus = {
              name: 'trash.updated',
              icon: 'updated'
            };
          } else if (object.changed.status === 'more' || object.changed.status === 'less') {
            status = lastStatus = {
              name: 'trash.status.' + object.changed.status,
              icon: 'updated'
            };
          } else if (object.changed.status === 'cleaned') {
            status = lastStatus = {
              name: 'trash.status.cleaned',
              icon: 'cleaned'
            };
          }
          if ($.fn.isEmpty(status)) {
            status = lastStatus;
          }
          $this = $(this);
          $box = $('<div/>', {
            'class': 'user'
          });
          $box.append($('<div/>', {
            'class': 'user-ago ' + status.icon,
            'html': '<span>' + i18n(status.name) + '</span><br>' + moment(object.updateTime).fromNow(),
            'title': object.updateTime
          }));
          name = i18n('trash.anonymous');
          if (object.userInfo.firstName) {
            name = object.userInfo.firstName + ' ' + object.userInfo.lastName;
          }
          $box.append($('<h3/>', {
            'class': 'ico ico-' + status.icon,
            'html': name
          }));
          if ($.isArray(object.changed.images) && object.changed.images.length > 0) {
            _ref = object.changed.images;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              img = _ref[i];
              $box.append($('<a/>', {
                'href': img.fullDownloadUrl,
                'target': '_blank',
                'html': '<img src="' + img.fullDownloadUrl + '" />'
              }));
            }
          }
          $whiteBox.append($box);
          if (key !== history.length - 1) {
            return $whiteBox.append($('<hr/>', {}));
          }
        });
        $panel.append($whiteBox);
        return $(self.config.widget.id).find('.panels-wrapper').append($panel);
      },
      renderSpam: function() {
        var $box, $panel, cfg, trash;
        cfg = $.fn.config('system.admin');
        trash = self.data.object;
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $panel.append($('<h2/>', {
          'html': i18n('trash.detail.spam')
        }));
        $box = $('<div/>', {
          'class': 'grey-box'
        });
        $box.append($('<p/>', {
          'class': 'grey',
          'html': i18n('trash.detail.spamText')
        }));
        $box.append($('<a/>', {
          'class': 'button red',
          'href': cfg.domain + cfg.endpoints.trashDetail + trash.id,
          'target': '_blank',
          'html': i18n('global.reportSpam')
        }));
        $panel.append($box);
        return $(self.config.widget.id).find('.panels-wrapper').append($panel);
      },
      renderMunicipality: function() {
        var $box, $panel, trash;
        trash = self.data.object;
        $panel = $('<div/>', {
          'class': 'panel'
        });
        $panel.append($('<h2/>', {
          'html': i18n('trash.detail.reportToMunicipality')
        }));
        $box = $('<div/>', {
          'class': 'grey-box'
        });
        $box.append($('<p/>', {
          'class': 'grey',
          'html': i18n('trash.detail.municipalityText')
        }));
        $box.append($('<a/>', {
          'class': 'button green',
          'html': i18n('trash.detail.sendNotification'),
          'href': 'mailto:?subject=' + i18n('mail.report.subject') + '&body=' + i18n('mail.report.body')
        }));
        $panel.append($box);
        return $(self.config.widget.id).find('.panels-wrapper').append($panel);
      },
      initHandlers: function() {
        var $trashMap, $widget;
        $widget = window.$('#trashdetail-widget');
        $trashMap = window.$('#trash-map');
        if ($widget.length <= 0) {
          return $('#close-detail').on('click', function() {
            return parent.postMessage("Hello", '*');
          });
        } else {
          return $('#close-detail').on('click', function() {
            $trashMap.removeClass('detail-visible');
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
          url: cfg.domain + cfg.endpoints.trashDetail + objectId + '?' + $.param(query),
          async: false,
          headers: {
            'x-api-key': self.config.key
          }
        }).done(function(data) {
          return self.data.object = data;
        }).fail(function() {
          return true;
        });
        return !$.fn.isEmpty(self.data.object);
      },
      showEventDetail: function(id) {
        var $spinner, $trashmap, $widget, wdg;
        wdg = self.config.eventDetail;
        $trashmap = $(self.config.widget.id);
        $widget = $(wdg.id);
        $spinner = $('.spinner');
        $widget.prop('src', 'eventdetail.html?key=' + self.config.key + '&id=' + id);
        $spinner.removeClass('hide');
        $widget.on('load', function() {
          $widget.removeClass('hidden-right');
          $trashmap.addClass('event-detail-open');
          return $spinner.addClass('hide');
        });
        return false;
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
    TrashDetail.defaults = TrashDetail.prototype.defaults;
    $.fn.TrashDetail = function(options) {
      return this.each(function() {
        new TrashDetail(this, options).init();
      });
    };
  })(jQuery, window, document);

  $(function() {
    return $(document).TrashDetail();
  });

}).call(this);
