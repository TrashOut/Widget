###*
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
###

(($) ->
  # List of global configuration variables
  _config = {
    system:{
      api:{
        domain: 'https://api.trashout.ngo/v1/', # full domain name, with protocol, ends with slash
        endpoints: { # list of API endpoints
          zoomPoints: 'trash/zoom-point/', # list of zoomPoints based on geocells
          trashList: 'trash/', # list of trashes based on geocells
          trashDetail: 'trash/', # detailed info about current trash
          trashStatistics: 'trash/count/', # count trash items with specific attribute set
          eventDetail: 'event/', # detailed info about current event
          areaList: 'area/', # list of geographicals areas based on type (continent, country etc.)
        }
      },
      admin: {
        domain: 'https://admin.trashout.ngo/',
        endpoints: {
          trashList: 'trash-management/list/'
          trashDetail: 'trash-management/detail/',
          trashUpdate: 'trash-management/update/'
          eventCreate: 'events/create/',
          eventDetail: 'events/detail/',
          subscribe: 'my-profile/add-area/'
        }
      },
      paths:
        images: 'https://widgets.trashout.ngo/assets/images/' # full url to the images directory
    }
  }

  # @method $.fn.config
  # @desctiption - Gets a value from the global variable list using a dot separated path
  # @param {string} path - Key path string (delimiter separated)
  # @return {mixed} Current variable value
  $.fn.config = (path) ->
    $.fn.arrPath(_config, path)

  # @method $.fn.arrPath
  # @desctiption - Gets a value from and array using a dot separated path
  # @param {array} obj - Array to search
  # @param {string} path - Key path string (delimiter separated)
  # @return {mixed} Current variable value
  $.fn.arrPath = (obj, path) ->
      i = 0
      path = path.split('.')
      len = path.length
      while i < len
        obj = obj[path[i]]
        i++
      obj

  moment.fn.ago = () ->
    today = moment()
    yesterday = moment().subtract(1, 'day')

    if this.isSame(today, 'day')
      return 'trash.filter.lastUpdate.today'

    if this.isSame(yesterday, 'day')
      return 'trash.lastUpdate.yesterday'

    diff = this.diff(today, 'days')

    if diff == 0
      return 'trash.filter.lastUpdate.today'
    else if diff == 1
      return 'trash.lastUpdate.tomorrow'
    else if diff == -1
      return 'trash.lastUpdate.yesterday'
    else if diff <= 7 && diff >= -7
      return 'trash.filter.lastUpdate.lastWeek'
    else if diff <= 31 && diff >= -31
      return 'trash.filter.lastUpdate.lastMonth'
    else
      return 'trash.lastUpdate.moreThanMonthAgo'

  ['en', 'de', 'cs', 'sk', 'ru', 'es'].forEach (lang) ->
    moment.updateLocale(lang, {
        calendar : {
            lastDay : '[Yesterday]',
            sameDay : '[Today]',
            nextDay : '[Tomorrow]',
            lastWeek : '[This week]',
            nextWeek : '[This week]',
            sameElse : 'l'
        }
    })

    return

) jQuery