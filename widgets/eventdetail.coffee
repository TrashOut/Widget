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
  # the EventDetail constructor
  EventDetail = (elem, options) ->
    @elem = elem
    @$elem = $(elem)
    @options = options
    # customization via Query params
    @metadata = $.fn.getQueryObject()
    return

  # the EventDetail prototype
  self = @
  EventDetail.prototype =
    # widget config variables
    defaults:
      widget:
        id: '#trash-map-detail'
      map:
        options:
          zoom: 16 # initial zoom level
          size : # map size
            w : 400 # width
            h : 200 # heigth
    data: # local cache
      object: {} # event object

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
      $(self.config.widget.id).find('.panels-wrapper.info').append($panel)

    # @method renderHTML
    # @desctiption - Render complete HTML markup
    # @return null
    renderHTML: () ->
      self.renderMain()
      self.renderDirection()
      self.renderDetailedInfo()
      self.renderListOfDumps()

    # @method renderMain
    # @desctiption - Render HTML markup for Main panel
    # @return null
    renderMain: () ->
      cfg = $.fn.config('system.admin')

      event = self.data.object
      $heading = $('.widget-heading').html(i18n('user.widget.eventDetail'))

      # basic informations
      $panel = $('<div/>', {'class': 'panel'})
      $box = $('<div/>', {'class': 'white-box'})
      $box.append $('<h2/>', {'html': event.name})
      $box.append $('<p/>', {'class': 'grey', 'html': moment(event.start).format('D/M/YYYY') + ', ' + i18n('event.detail.duration') + ': ' + moment.duration(event.duration, 'minutes').humanize()})
      $box.append $('<p/>', {'html': event.description})
      $box.append $('<a/>', {'class': 'small-button', 'href': cfg.domain + cfg.endpoints.eventDetail + event.id, 'target': '_blank', 'html': i18n('event.join')})

      $panel.append $box
      $(self.config.widget.id).find('.panels-wrapper.info').append($panel)

      # contacts - phone / email
      contact = event.contact
      if !$.fn.isEmpty(contact.phone) or !$.fn.isEmpty(contact.email)
        $panel2 = $('<div/>', {'class': 'panel'})
        $box2 = $('<div/>', {'class': 'white-box'})
        if !$.fn.isEmpty(contact.name) 
          $box2.append $('<h3/>', {'class': 'big-icon big-icon-person', 'html': contact.name + '<br/><span class="grey">' + i18n('event.detail.organizer') + '</span>'})
        if !$.fn.isEmpty(contact.occupation) 
          $box2.append $('<h3/>', {'class': 'big-icon big-icon-home', 'html': contact.occupation + '<br/><span class="grey">' + i18n('global.occupation') + '</span>'})
        if !$.fn.isEmpty(contact.phone)
          $box2.append $('<h3/>', {'class': 'big-icon big-icon-phone', 'html': contact.phone + '<br/><span class="grey">' + i18n('global.phone') + '</span>'})
        if !$.fn.isEmpty(contact.email)
          $box2.append $('<h3/>', {'class': 'big-icon big-icon-email', 'html': '<a href="mailto:' + contact.email + '">' + contact.email + '</a><br/><span class="grey">' + i18n('global.email') + '</span>'})

        $panel2.append $box2

        $(self.config.widget.id).find('.panels-wrapper.info').append($panel2)


    # @method renderDirection
    # @desctiption - Render HTML markup for Direction panel
    # @return null
    renderDirection: () ->
      event = self.data.object

      $panel = $('<div/>', {'class': 'panel'})
      $panel.append $('<div/>', {'class': 'mini-map'})

      $box = $('<div/>', {'class': 'white-box'})

      address = ''
      if !$.fn.isEmpty(event.gps.area)
        address += if !$.fn.isEmpty(event.gps.area.street) then event.gps.area.street else ''
        address += if !$.fn.isEmpty(event.gps.area.zip) then ', ' + event.gps.area.zip else ''
        address += if !$.fn.isEmpty(event.gps.area.subLocality) then ' ' + event.gps.area.subLocality else ''
        address += if !$.fn.isEmpty(event.gps.area.locality) then ', ' + event.gps.area.locality else ''
        address += if !$.fn.isEmpty(event.gps.area.country) then ', ' + event.gps.area.country else ''
      $box.append $('<p/>', {'html': address.replace(/^, /gi, '') + '<br><small><span class="grey">' + event.gps.lat + ', ' + event.gps.long + '</span>'})

      directionURL = 'https://www.google.com/maps/dir//' + event.gps.lat + ',' + event.gps.long
      $box.append $('<a/>', {'class': 'small-button', 'href': directionURL, 'target': '_blank', 'html': i18n('global.direction')})

      $panel.append $box
      $(self.config.widget.id).find('.panels-wrapper.info').append($panel)

      opts = self.config.map.options
      #$map = $('<img/>', {'src': 'https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyBQa-0pghBXFAOjvvWGfIieQcTvMAefNPY&center=' + event.gps.lat + ',' + event.gps.long + '&zoom=' + opts.zoom + '&size=' + opts.size.w + 'x' + opts.size.h + '&maptype=roadmap&markers=color:green|' + event.gps.lat + ',' + event.gps.long})
      #$('.mini-map').append $('<a/>', {'href': directionURL, 'target': '_blank', 'html': $map})
      $('.mini-map').html('<iframe width="600" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBQa-0pghBXFAOjvvWGfIieQcTvMAefNPY&q=' + event.gps.lat + ',' + event.gps.long + '&zoom=' + opts.zoom + '" allowfullscreen></iframe>')



    # @method renderListOfDumps
    # @desctiption - Render HTML markup for List of dumps panel
    # @return null
    renderListOfDumps: () ->
      cfg = $.fn.config('system.admin')

      event = self.data.object
      trashPoints = event.trashPoints

      $panel = $('<div/>', {'class': 'panel'})
      $panel.append $('<h2/>', {'html': i18n('event.listOfDumpsToBeCleaned')})

      if trashPoints.length <= 0
        return

      $box = $('<div/>', {'class': 'white-box to-be-cleaned'})

      $panel1 = $('<div/>', {'class': 'panel'})
      $panel2 = $('<div/>', {'class': 'panel'})
      $panel3 = $('<div/>', {'class': 'panel'})
      $box1 = $('<div/>', {'class': 'white-box to-be-cleaned'})
      $box2 = $('<div/>', {'class': 'white-box to-be-cleaned'})
      $box3 = $('<div/>', {'class': 'white-box to-be-cleaned'})

      $.each trashPoints, (key, object) ->
        $this = $(this)

        image = $.fn.config('system.paths.images') + 'placeholder_rectangle.png'
        if $.isArray(object.images) and object.images.length > 0
          img = object.images[0]
          img = img.fullDownloadUrl
          if img
            image = img

        status = 'unknown'
        if object.status == 'cleaned'
          status = 'cleaned'
        else if object.updateNeeded == false and (object.status == 'less' or object.status == 'more' or object.status == 'stillHere')
          status = 'reported'

        typesImages = ''
        typesText = ''
        if $.isArray(object.types) and object.types.length > 0
          $.each object.types, (key, object2) ->
            typesImages += '<span class="ico ico-type ico-' + object2 + '" title="' + i18n('trash.types.' + object2) + '">' + '</span>'
            typesText += i18n(object2) + ', '
          typesText = typesText.trim().replace(/,+$/, '') # replace last separator

        address = ''
        if !$.fn.isEmpty(object.gps.area)
          address += if !$.fn.isEmpty(object.gps.area.subLocality) then object.gps.area.subLocality else ''
          address += if !$.fn.isEmpty(object.gps.area.locality) then ', ' + object.gps.area.locality else ''
          address += if !$.fn.isEmpty(object.gps.area.country) then ', ' + object.gps.area.country else ''

        address = address.replace(/^, /gi, '')
        address = if address == '' then object.gps.lat + ', ' + object.gps.long else address

        $item = $('<div/>', {'class': 'event-item'})
        $item.append $('<div/>', {'class': 'trash-photo ' + status, 'html': '<a href="' + cfg.domain + cfg.endpoints.trashDetail + object.id + '" target="_blank"><img src="' + image + '" alt="' + typesText + '" /></a>'})
        $item.append $('<p/>', {'html': '<small><span class="grey">' + address + '</span></small><br/><div class="types-small">' + typesImages + '</div><br/><small><span class="grey">' + moment(object.created).fromNow() + '</span></small>'})

        #$box.append $item
        #if key != trashPoints.length - 1 # don't slow last separator
        #  $box.append $('<hr/>', {})

        if key % 3 == 0
          $box1.append $item
          if key + 4 < trashPoints.length # don't slow last separator
            $box1.append $('<hr/>', {})

        if key % 3 == 1
          $box2.append $item
          if key + 3 < trashPoints.length # don't slow last separator
            $box2.append $('<hr/>', {})

        if key % 3 == 2
          $box3.append $item
          if key + 4 < trashPoints.length # don't slow last separator
            $box3.append $('<hr/>', {})

      $panel1.append $box1
      $panel2.append $box2
      $panel3.append $box3

      if trashPoints.length
        $(self.config.widget.id).find('.panels-wrapper.trashes-title').append($panel)

      if trashPoints.length >= 1
        $(self.config.widget.id).find('.panels-wrapper.trashes').append($panel1)
      
      if trashPoints.length >= 2
        $(self.config.widget.id).find('.panels-wrapper.trashes').append($panel2)
      
      if trashPoints.length >= 3
        $(self.config.widget.id).find('.panels-wrapper.trashes').append($panel3)


    # @method renderDetailedInfo
    # @desctiption - Render HTML markup for Detailed Info panel
    # @return null
    renderDetailedInfo: () ->
      event = self.data.object

      if $.fn.isEmpty(event.have) and $.fn.isEmpty(event.bring)
        return

      $panel = $('<div/>', {'class': 'panel'})
      $box = $('<div/>', {'class': 'white-box basic-info'})

      if !$.fn.isEmpty(event.have)
        $box.append $('<p/>', {'html': i18n('event.whatWeHave')})
        $box.append $('<p/>', {'class': 'grey', 'html': event.have})
        $box.append $('<hr/>', {})
      if !$.fn.isEmpty(event.bring)
        $box.append $('<p/>', {'html': i18n('event.detail.pleaseBring')})
        $box.append $('<p/>', {'class': 'grey', 'html': event.bring})

      $panel.append $box
      $(self.config.widget.id).find('.panels-wrapper.info').append($panel)


    # @method initHandlers
    # @desctiption - Init default handlers (close button) and show/hide close button
    # @return null
    initHandlers: () ->
      $widget = window.$('#eventdetail-widget')
      $trashMap = window.$('#trash-map')
      $trashMapDetail = window.$('#trash-map-detail')

      if $widget.length <= 0
        $('#close-detail').addClass 'hide'
      else
        $('#close-detail').on 'click', ->
          $trashMapDetail.removeClass 'event-detail-open'
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
        url: cfg.domain + cfg.endpoints.eventDetail + objectId + '?' + $.param(query)
        async: false # this request has to be synchronous
        headers:
          'x-api-key': self.config.key
      ).done((data) ->
        self.data.object = data
        console.log data
      ).fail(->

        return true
      )

      return !$.fn.isEmpty(self.data.object)

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

  EventDetail.defaults = EventDetail::defaults

  $.fn.EventDetail = (options) ->
    @each ->
      new EventDetail(this, options).init()
      return

  #optional: window.EventDetail = EventDetail;
  return
) jQuery, window, document

$ ->
  $(document).EventDetail();