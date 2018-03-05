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
  (function($) {
    var _config;
    _config = {
      system: {
        api: {
          domain: 'https://api.trashout.ngo/v1/',
          endpoints: {
            zoomPoints: 'trash/zoom-point/',
            trashList: 'trash/',
            trashDetail: 'trash/',
            trashStatistics: 'trash/count/',
            eventDetail: 'event/',
            areaList: 'area/'
          }
        },
        admin: {
          domain: 'https://admin.trashout.ngo/',
          endpoints: {
            trashList: 'trash-management/list/',
            trashDetail: 'trash-management/detail/',
            trashUpdate: 'trash-management/update/',
            eventCreate: 'events/create/',
            eventDetail: 'events/detail/',
            subscribe: 'my-profile/add-area/'
          }
        },
        paths: {
          images: 'https://widgets.trashout.ngo/assets/images/'
        }
      }
    };
    $.fn.config = function(path) {
      return $.fn.arrPath(_config, path);
    };
    $.fn.arrPath = function(obj, path) {
      var i, len;
      i = 0;
      path = path.split('.');
      len = path.length;
      while (i < len) {
        obj = obj[path[i]];
        i++;
      }
      return obj;
    };
    moment.fn.ago = function() {
      var diff, today, yesterday;
      today = moment();
      yesterday = moment().subtract(1, 'day');
      if (this.isSame(today, 'day')) {
        return 'trash.filter.lastUpdate.today';
      }
      if (this.isSame(yesterday, 'day')) {
        return 'trash.lastUpdate.yesterday';
      }
      diff = this.diff(today, 'days');
      if (diff === 0) {
        return 'trash.filter.lastUpdate.today';
      } else if (diff === 1) {
        return 'trash.lastUpdate.tomorrow';
      } else if (diff === -1) {
        return 'trash.lastUpdate.yesterday';
      } else if (diff <= 7 && diff >= -7) {
        return 'trash.filter.lastUpdate.lastWeek';
      } else if (diff <= 31 && diff >= -31) {
        return 'trash.filter.lastUpdate.lastMonth';
      } else {
        return 'trash.lastUpdate.moreThanMonthAgo';
      }
    };
    return ['en', 'de', 'cs', 'sk', 'ru', 'es'].forEach(function(lang) {
      moment.updateLocale(lang, {
        calendar: {
          lastDay: '[Yesterday]',
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          lastWeek: '[This week]',
          nextWeek: '[This week]',
          sameElse: 'l'
        }
      });
    });
  })(jQuery);

}).call(this);
