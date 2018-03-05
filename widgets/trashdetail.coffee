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

(($, window, document) ->
  # the TrashDetail constructor
  TrashDetail = (elem, options) ->
    @elem = elem
    @$elem = $(elem)
    @options = options
    # customization via Query params
    @metadata = $.fn.getQueryObject()
    return

  # the TrashDetail prototype
  self = @
  TrashDetail.prototype =
    # widget config variables
    defaults:
      widget:
        id: '#trash-map-detail'
      eventDetail:
        id: '#eventdetail-widget'
    data: # local cache
      object: {} # trash object

    init: ->
      # Introduce defaults that can be extended either globally or using an object literal.
      @config = $.extend({}, @defaults, @options, @metadata)
      self = @

      @initI18n()
      @initLoader()
      @initHandlers()
      if @initData()
        @renderHTML()
      else
        @renderError i18n('global.loadingError')
      this

    # @method renderError
    # @desctiption - Render custom error message
    # @param {string} msg - error message
    # @return null
    renderError: (msg) ->
      $panel = $('<div/>', {'class': 'panel'})
      $panel.append('<br /><br /><br />')
      $panel.append $('<h2/>', {'html': msg})
      $(self.config.widget.id).find('.panels-wrapper').append($panel)

    # @method renderHTML
    # @desctiption - Render complete HTML markup
    # @return null
    renderHTML: () ->
      self.renderMain()
      self.renderInfo()
      self.renderEvent()
      self.renderHistory()
      self.renderMunicipality()
      self.renderSpam()


    # @method renderMain
    # @desctiption - Render HTML markup for Main panel
    # @return null
    renderMain: () ->
      cfg = $.fn.config('system.admin')

      trash = self.data.object

      image = $.fn.config('system.paths.images') + 'placeholder_rectangle.png'
      if $.isArray(trash.images) and trash.images.length > 0
        img = trash.images[0].fullDownloadUrl
        if img
          image = img

      $heading = $('.widget-heading').html(i18n('trash.detail.header'))

      $panel = $('<div/>', {'class': 'panel'})
      $imgWrapper = $('<div/>', {'class': 'photo-header'})
      $imgWrapper.append $('<a/>', {'href': image, 'target': '_blank', 'html': '<img src="' + image + '" />'})

      status =
        name: 'notifications.reported'
        icon: 'reported'
      if trash.updateHistory.length > 0 and (trash.status == 'stillHere')
        status =
          name: 'global.updated'
          icon: 'updated'
      if trash.updateHistory.length > 0 and (trash.status == 'less' or trash.status == 'more')
        status =
          name: 'trash.status.' + trash.status
          icon: 'updated'
      if trash.status == 'cleaned'
        status =
          name: 'global.cleaned'
          icon: 'cleaned'
      else if trash.updateHistory.length > 0 and trash.updateNeeded
        status =
          name: 'trash.updateNeeded'
          icon: 'unknown'
      $imgWrapper.append $('<div/>', {'class': 'trash-status status-' + status.icon, 'html': '<h3>' + i18n(status.name) + '<br/><span>' + moment(trash.updateTime).fromNow() + '</span></h3>'})
      $panel.append $imgWrapper

      $box = $('<div/>', {'class': 'white-box'})
      $box.append $('<h2/>', {'html': i18n('trash.message.updateThisTrash') + '<small>' + i18n('trash.create.TakeSomePictures') + '</small>'   })
      $box.append $('<a/>', {'class': 'button green', 'href': cfg.domain + cfg.endpoints.trashUpdate + trash.id, 'target': '_blank', 'html': i18n('trash.status.cleaned')})
      $box.append $('<a/>', {'class': 'button red', 'href': cfg.domain + cfg.endpoints.trashUpdate + trash.id, 'target': '_blank', 'html': i18n('trash.status.stillHere')})
      address = ''
      if !$.fn.isEmpty(trash.gps.area)
        address += if !$.fn.isEmpty(trash.gps.area.subLocality) then trash.gps.area.subLocality else ''
        address += if !$.fn.isEmpty(trash.gps.area.locality) then ', ' + trash.gps.area.locality else ''
        address += if !$.fn.isEmpty(trash.gps.area.country) then ', ' + trash.gps.area.country else ''
      gps = trash.gps.lat + ', ' + trash.gps.long
      accuracy = trash.gps.accuracy
      $box.append $('<p/>', {'html': address.replace(/^, /gi, '') + '<br><small><span class="grey">' + gps + '</span><br>' + i18n('trash.accuracyOfLocation') + ': <span class="grey">&lt; ' + accuracy + ' m</span></small>'})

      directionURL = 'https://www.google.com/maps/dir//' + trash.gps.lat + ',' + trash.gps.long
      $box.append $('<a/>', {'class': 'small-button', 'href': directionURL, 'target': '_blank', 'html': i18n('global.direction')})

      $panel.append $box

      $(self.config.widget.id).find('.panels-wrapper').append($panel)

    # @method renderInfo
    # @desctiption - Render HTML markup for Info panel
    # @return null
    renderInfo: () ->
      trash = self.data.object

      # Information
      $panel = $('<div/>', {'class': 'panel'})
      $panel.append $('<h2/>', {'html': i18n('global.information')})

      $box = $('<div/>', {'class': 'white-box'})

      $p = $('<p/>', {'html': i18n('trash.trashSize') + '<br>'})
      $p.append $('<span/>', {'class': 'ico ico-' + trash.size + ' green', 'html': '<span class="type-name">' + i18n('trash.size.' + if trash.size == 'car' then 'carNeeded' else trash.size) + '</span>'})
      $box.append $p

      if $.isArray(trash.types) and trash.types.length > 0
        $box.append $('<hr/>', {})
        $p = $('<p/>', {'html': i18n('trash.trashType') + '<br>'})
        $.each trash.types, (key, object) ->
          $p.append $('<span/>', {'class': 'ico ico-type ico-' + object, 'html': '<span class="type-name">' + i18n('trash.types.' + object) + '</span>'})

        $box.append $p

      accessibility = []

      $.each trash.accessibility, (key, object) ->
        if object
          accessibility.push(i18n('trash.accessibility.' + key))

      if accessibility.length > 0
        $box.append $('<hr/>', {})
        $box.append $('<p/>', {'html': i18n('trash.accessibility') + '<br><small class="grey">' + accessibility.join(', ') + '</small>'})

      $panel.append $box

      $(self.config.widget.id).find('.panels-wrapper').append($panel)

      # Additional information
      $panel2 = $('<div/>', {'class': 'panel'})
      $panel2.append $('<h2/>', {'html': i18n('trash.note')})
      $panel2.append $('<div/>', {'class': 'grey-box', 'html': '<p class="grey">' + trash.note + '</p>'})

      $(self.config.widget.id).find('.panels-wrapper').append($panel2)


    # @method renderEvent
    # @desctiption - Render HTML markup for Event panel
    # @return null
    renderEvent: () ->
      cfg = $.fn.config('system.admin')

      trash = self.data.object

      $panel = $('<div/>', {'class': 'panel'})
      $panel.append $('<h2/>', {'html': i18n('event.header')})

      if !$.fn.isEmpty(trash.events)
        for i of trash.events
          event = trash.events[i]

          $box = $('<div/>', {'class': 'white-box'})
          $box.append $('<h2/>', {'html': event.name})
          $box.append $('<p/>', {'class': 'grey', 'html':  moment(event.start).format('lll')})
          if !$.fn.isEmpty(event.description)
            $box.append $('<p/>', {'html': event.description})
          $box.append $('<a/>', {'class': 'small-button', 'href' : '#', 'html': i18n('Join')})
          $box.append $('<a/>', {'class': 'small-button btn-event-detail', 'href' : '#', 'html': i18n('Detail'), 'data-id': event.id})

          $panel.append $box
      else
        $box = $('<div/>', {'class': 'grey-box'})
        $box.append $('<p/>', {'class': 'grey', 'html': i18n('trash.detail.noCleaningEvent')})

        if trash.status != 'cleaned'
          $box.append $('<a/>', {'class': 'button green', 'href' : cfg.domain + cfg.endpoints.eventCreate, 'target': '_blank', 'html': i18n('event.create.header')})

        $panel.append $box


      $(self.config.widget.id).find('.panels-wrapper').append($panel)

      $('.btn-event-detail').on 'click', ->
        $this = $ this
        self.showEventDetail($this.attr('data-id'))


    # @method renderHistory
    # @desctiption - Render HTML markup for History panel
    # @return null
    renderHistory: () ->
      trashDetail = self.data.object
      history = self.data.object.updateHistory

      # add current staus
      history.push
        changed:
          images: JSON.parse(JSON.stringify(trashDetail.images)) #deep copy, clone whole object
          status: trashDetail.status
        userInfo: trashDetail.userInfo
        updateTime: trashDetail.updateTime

      history = history.reverse()

      if history.length <= 0
        return

      $panel = $('<div/>', {'class': 'panel'})
      $panel.append $('<h2/>', {'html': i18n('trash.history')})
      $whiteBox = $('<div/>', {'class': 'white-box'})

      lastStatus = 
        name: if trashDetail.status == 'stillHere' then 'trash.created' else 'trash.status.' + trashDetail.status
        icon: if trashDetail.status == 'stillHere' then 'reported' else (if trashDetail.status == 'cleaned' then 'cleaned' else 'updated')

      $.each history, (key, object) ->
        if (key+1) == history.length # first status = reported
          status = lastStatus =
            name: 'trash.created'
            icon: 'reported'
        else if object.changed.status == 'stillHere'
          status = lastStatus =
            name: 'trash.updated'
            icon: 'updated'
        else if object.changed.status == 'more' or object.changed.status == 'less'
          status = lastStatus =
            name: 'trash.status.' + object.changed.status
            icon: 'updated'
        else if object.changed.status == 'cleaned'
          status = lastStatus =
            name: 'trash.status.cleaned'
            icon: 'cleaned'

        if $.fn.isEmpty status
          status = lastStatus

        $this = $(this)
        $box = $('<div/>', {'class': 'user'})
        $box.append $('<div/>', {'class': 'user-ago ' + status.icon, 'html': '<span>' + i18n(status.name) + '</span><br>' + moment(object.updateTime).fromNow(), 'title': object.updateTime})
        name = i18n('trash.anonymous')
        if object.userInfo.firstName
          name = object.userInfo.firstName + ' ' + object.userInfo.lastName
        $box.append $('<h3/>', {'class': 'ico ico-' + status.icon, 'html': name})

        # draw images
        if $.isArray(object.changed.images) and object.changed.images.length > 0
          for img, i in object.changed.images
            $box.append $('<a/>', {'href': img.fullDownloadUrl, 'target': '_blank', 'html': '<img src="' + img.fullDownloadUrl + '" />'})

        $whiteBox.append $box
        if key != history.length - 1 # don't show last separator
          $whiteBox.append $('<hr/>', {})

      $panel.append $whiteBox

      $(self.config.widget.id).find('.panels-wrapper').append($panel)


    # @method renderSpam
    # @desctiption - Render HTML markup for Spam panel
    # @return null
    renderSpam: () ->
      cfg = $.fn.config('system.admin')

      trash = self.data.object

      $panel = $('<div/>', {'class': 'panel'})
      $panel.append $('<h2/>', {'html': i18n('trash.detail.spam')})

      $box = $('<div/>', {'class': 'grey-box'})
      $box.append $('<p/>', {'class': 'grey', 'html': i18n('trash.detail.spamText')})
      $box.append $('<a/>', {'class': 'button red', 'href' : cfg.domain + cfg.endpoints.trashDetail + trash.id, 'target': '_blank', 'html': i18n('global.reportSpam')})

      $panel.append $box

      $(self.config.widget.id).find('.panels-wrapper').append($panel)

    # @method renderMunicipality
    # @desctiption - Render HTML markup for Municipality panel
    # @return null
    renderMunicipality: () ->
      trash = self.data.object

      $panel = $('<div/>', {'class': 'panel'})
      $panel.append $('<h2/>', {'html': i18n('trash.detail.reportToMunicipality')})

      $box = $('<div/>', {'class': 'grey-box'})
      $box.append $('<p/>', {'class': 'grey', 'html': i18n('trash.detail.municipalityText')})
      $box.append $('<a/>', {'class': 'button green', 'html': i18n('trash.detail.sendNotification'), 'href': 'mailto:?subject=' + i18n('mail.report.subject') + '&body=' + i18n('mail.report.body')})

      $panel.append $box

      $(self.config.widget.id).find('.panels-wrapper').append($panel)


    # @method initHandlers
    # @desctiption - Init default handlers (close button) and show/hide close button
    # @return null
    initHandlers: () ->
      $widget = window.$('#trashdetail-widget')
      $trashMap = window.$('#trash-map')

      if $widget.length <= 0
        $('#close-detail').on 'click', ->
          parent.postMessage("Hello", '*')
      else
        $('#close-detail').on 'click', ->
          $trashMap.removeClass 'detail-visible'
          $widget.addClass 'hidden-right'

    # @method initData
    # @desctiption - Load Trash data from API
    # @return {mixed}
    initData: () ->
      objectId = self.config.id

      cfg = $.fn.config('system.api')

      # prepare ajax params
      query =
        attributesNeeded: 'id'

      # get trash list from API
      $.ajax(
        url: cfg.domain + cfg.endpoints.trashDetail + objectId + '?' + $.param(query)
        async: false # this request has to be synchronous
        headers:
          'x-api-key': self.config.key
      ).done((data) ->
        self.data.object = data
      ).fail(->

        return true
      )

      return !$.fn.isEmpty(self.data.object)

    # @method showEventDetail
    # @desctiption - Show Event detail widget with given ID
    # @param {int} id - event identifier
    # @return false - because of preventin defaults
    showEventDetail: (id) ->
      wdg = self.config.eventDetail
      $trashmap = $(self.config.widget.id)
      $widget = $(wdg.id)
      $spinner = $('.spinner')

      $widget.prop 'src', 'eventdetail.html?key=' + self.config.key + '&id=' + id
      $spinner.removeClass 'hide'
      $widget.on 'load', ->
        $widget.removeClass 'hidden-right'
        $trashmap.addClass 'event-detail-open'
        $spinner.addClass 'hide'

      return false # prevent default

    # @method initLoader
    # @desctiption - Prepare ajax loader (spinner)
    # @return null
    initLoader: () ->
      # this will be called when ALL running AJAX calls have completed
      $(document).ajaxStart ->
        $('.spinner').removeClass 'hide'

      # this will be called when ANY AJAX call have started
      $(document).ajaxStop ->
        $('.spinner').addClass 'hide'


    # @method initI18n
    # @desctiption - Prepare translation module
    # @return null
    initI18n: () ->
      # detect language
      lang = self.config.language || navigator.language || navigator.userLanguage || 'en'
      lang = lang.substr(0, 2).toLowerCase()

      moment.locale(lang)

      # set i18n enviroment
      i18nLoadLanguages lang

  TrashDetail.defaults = TrashDetail::defaults

  $.fn.TrashDetail = (options) ->
    @each ->
      new TrashDetail(this, options).init()
      return

  #optional: window.TrashDetail = TrashDetail;
  return
) jQuery, window, document

$ ->
  $(document).TrashDetail();