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
  # the Statistics constructor
  Statistics = (elem, options) ->
    @elem = elem
    @$elem = $(elem)
    @options = options
    # customization via Query params
    @metadata = $.fn.getQueryObject()
    return

  # the Statistics prototype
  self = @
  Statistics.prototype =
    # widget parametrization variables
    defmeta:
      type: 'continent' # default geoarea
      blocks_chart: 1 # show block with charts, [1 - true, 0 - false]
      blocks_geoarea: 1 # show block with geoareas, [1 - true, 0 - false]
      blocks_trashlist: 1 # show block with trashes, [1 - true, 0 - false]
      charts_type: 'both' # default graph types, both x donut x bar (which chart will be visible at the very first time)
      chart_status: 1 # show status chart, [1 - true, 0 - false]
      chart_type: 1 # show type chart, [1 - true, 0 - false]
      chart_size: 1 # show size chart, [1 - true, 0 - false]
      chart_accessibility: 1 # show accessibility chart, [1 - true, 0 - false]
      trashlists_type: 'both' # default trash view, both x photo x list (which view will be visible at the very first time)
      width: 150 # TODO: iframe width
      height: 150 # TODO: iframe height
      theme: '' # TODO: default theme
      language: '' # TODO: default language

    # widget config variables
    defaults:
      widget:
        id: 'body'
      trashCharts:
        id: '#trash-graphs'
      trashList:
        id: '#trash-update'
      trashCountries:
        id: '#trash-countries'
      footer:
        id: '#footer'
      lists:
        geoareas: [ # attributes for geoareas
          'continent', 'country', 'aa1', 'aa2', 'aa3', 'locality', 'sub_locality'
        ]
        size:  # attributes for sizes
          bag: 'bag'
          wheelbarrow: 'wheelbarrow'
          car: 'car'
        status: # attributes for statuses
          reported: 'stillHere,less,more'
          cleaned: 'cleaned'
        type:  # attributes for geoareas
          plastic: 'plastic'
          domestic: 'domestic'
          automotive: 'automotive'
          liquid: 'liquid'
          dangerous: 'dangerous'
          metal: 'metal'
          electronic: 'electronic'
          deadAnimals: 'deadAnimals'
          organic: 'organic'
          construction: 'construction'
          glass: 'glass'
        accessibility: # attributes for geoareas
          byCar: 'byCar'
          inCave: 'inCave'
          underWater: 'underWater'
          notForGeneralCleanup: 'notForGeneralCleanup'
      graphs:
        donut:
          pieHole: 0.5 # should be set to a number between 0 and 1, corresponding to the ratio of radii between the hole and the chart
          chartArea: # an object with members to configure the placement and size of the chart area
            width: '92%' # chart area width
            height: '60%' # chart area height
            top: '10%' # chart area top
          titleTextStyle: # an object that specifies the horizontal axis title text style
            fontName: '"Roboto", sans-serif'
            fontSize: 18
          legend: # an object with members to configure various aspects of the legend
            position: 'bottom' # position of the legend
            textStyle: # an object that specifies the horizontal axis title text style
              fontName: '"Roboto", sans-serif'
              fontSize: 11
          slices: # prefered colors
            0: color: '#fe4646'
            1: color: '#8cc947'
            2: color: '#ffb732'
            3: color: '#674f81'
            4: color: '#378da3'
            5: color: '#c75b1c'
            6: color: '#c69b70'
            7: color: '#068652'
            8: color: '#054652'
            9: color: '#043652'
            10: color: '#c2660b'
        bar:
          orientation: 'horizontal' # bar chart orientation
          titlePosition: 'none' # hide title of an chart
          titleTextStyle: # an object that specifies the horizontal axis title text style
            fontName: '"Roboto", sans-serif'
            fontSize: 18
          chartArea: # an object with members to configure the placement and size of the chart area
            width: '82%' # chart area width
            height: '72%' # chart area height
            top: '10%' # chart area top
          legend: # an object with members to configure various aspects of the legend
            position: 'none' # no legend is displayed.
            textStyle: # an object that specifies the horizontal axis title text style
              fontName: '"Roboto", sans-serif'
              fontSize: 11
          slices: # prefered colors
            0: color: '#ff484a'
            1: color: '#00b06c'
            2: color: '#ffb732'
            3: color: '#674f81'
            4: color: '#378da3'
            5: color: '#c75b1c'
            6: color: '#c69b70'
            7: color: '#068652'
            8: color: '#054652'
            9: color: '#043652'
    data: # local data cache
      charts:
        status: []
        size: []
        type: []
        accessibility: []
      name: 'the World' # default name
      object: {} # trash object

    init: ->
      # Introduce defaults that can be extended either globally or using an object literal.
      @config = $.extend({}, @defaults, @options, @metadata)
      @metadata = $.extend({}, @defmeta, @metadata)
      self = @

      @initI18n()
      @initData()
      @initLoader()
      @initHandlers()

      @renderHTML()

      @initTabsSwitcher()
      @initSorting()

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
      if parseInt(self.metadata.blocks_chart) == 1
        self.renderGraphs()

      if parseInt(self.metadata.blocks_trashlist) == 1
        self.renderLastUpdatedDumps()

      if parseInt(self.metadata.blocks_geoarea) == 1
        self.renderCountries()

      self.renderFooter()

    # @method renderGraphs
    # @desctiption - Render HTML markup for Graphs block part
    # @return null
    renderGraphs: () ->
      # load chart data from server and prepare structure
      if parseInt(self.metadata.chart_status) == 1
        self.getChartData 'status'

      if parseInt(self.metadata.chart_size) == 1
        self.getChartData 'size'

      if parseInt(self.metadata.chart_type) == 1
        self.getChartData 'type'

      if self.metadata.chart_accessibility == 1
        self.getChartData 'accessibility'

      # generate chart skelet
      self.renderGraphsSkelet()

      # render whole charts
      if self.metadata.charts_type == 'both' or self.metadata.charts_type == 'donut'
        if parseInt(self.metadata.chart_status) == 1
          self.initGraph('round-1', i18n('widget.statistics.chartStatus'), self.data.charts.status)
        else $('#round-1').parent().hide()

        if parseInt(self.metadata.chart_size) == 1
          self.initGraph('round-2', i18n('widget.statistics.chartSize'), self.data.charts.size)
        else $('#round-2').parent().hide()

        if parseInt(self.metadata.chart_type) == 1
          self.initGraph('round-3', i18n('widget.statistics.chartType'), self.data.charts.type)
        else $('#round-3').parent().hide()

        if parseInt(self.metadata.chart_accessibility) == 1
          self.initGraph('round-4', i18n('widget.statistics.chartAccessibility'), self.data.charts.accessibility)
        else $('#round-4').parent().hide()

      if self.metadata.charts_type == 'both' or self.metadata.charts_type == 'bar'
        self.initChartRadiosHandlers()


    # @method renderGraphsSkelet
    # @desctiption - Render HTML markup for Graphs block part
    # @return null
    renderGraphsSkelet: () ->
      data = [i18n('widget.statistics.chartStatus'), i18n('widget.statistics.chartSize'), i18n('widget.statistics.chartType'), i18n('widget.statistics.chartAccessibility')]
      charts = ['status', 'size', 'type', 'accessibility']

      $header = $('<h1/>', {'html': i18n('widget.statistics.breakdownOfDumps') + ' ' + self.data.name})

      $tabs = $('<div/>', {'class': 'tabs'})

      # prepare tab navigation structure
      if self.metadata.charts_type == 'both'
        $nav = $('<div/>', {'class': 'tabs-nav'})
        $a_donut = $('<a/>', {'class': 'current', 'href': '#round', 'html': i18n('widget.statistics.donutChart')})
        $a_bar = $('<a/>', {'href': '#histogram', 'html': i18n('widget.statistics.barChart')})
        $nav.append($a_donut).append($a_bar)

      $donut = $('<div/>', {'id': 'round', 'class': 'tabs-content current'})
      for d, i in data
        $wp = $('<div/>', {'class': 'graph-wrapper'})
        $round = $('<div/>', {'id': 'round-' + (i+1)})

        $wp.append $round
        $donut.append $wp

      $bar = $('<div/>', {'id': 'histogram', 'class': 'tabs-content'})
      $radios = $('<div/>', {'class': 'input-wrapper'})
      for d, i in data
        slug = d.toLowerCase().replace(RegExp(' ', 'g'), '-').replace /[^\w-]+/g, ''
        $radio = $('<input/>', {'id': slug, 'name': 'bar-chart', 'type': 'radio', 'data-title': d, 'data-data': JSON.stringify self.data.charts[charts[i]]})
        $label = $('<label/>', {'for': slug, 'html': d})

        if i == 0
          $radio.attr 'checked', 'checked'

        $radios.append($radio).append($label)

      $bar.append $radios
      $bar.append $('<div/>', {'id': 'histogram-1'})

      if self.metadata.charts_type == 'both'
        $tabs.append($nav).append($donut).append($bar)

      if self.metadata.charts_type == 'donut'
        $tabs.append($nav).append($donut)

      if self.metadata.charts_type == 'bar'
        $bar.addClass 'current'
        $tabs.append($nav).append($bar)

      $(self.config.trashCharts.id).append($header).append($tabs)


    # @method initGraph1
    # @desctiption - Initialize first rounded graph - by status
    # @return null
    initGraph: (id, title, data) ->
      cfg = self.config.graphs.donut

      # check: if data empty, hide this chart (both types: donut and bar)
      totalSum = 0
      for d,i in data
        if $.isNumeric(d[1])
          totalSum += d[1]

      # empty data set - hide this type of chart
      if totalSum == 0
        $('#' + id).parent().hide()
        return

      google.charts.load 'current', packages: [ 'corechart' ]
      google.charts.setOnLoadCallback ->

        data = google.visualization.arrayToDataTable(data)

        options = $.extend {}, cfg,
          title: title,
          legend:
            position: 'bottom'
            alignment: 'center'

        chart = new (google.visualization.PieChart)(document.getElementById(id))
        chart.draw data, options

        return

    # @method initHistogram
    # @desctiption - Initialize first histogram
    # @return null
    initHistogram: (id, title, data) ->
      cfg = self.config.graphs.bar

      google.charts.load 'current', packages: [ 'corechart' ]
      google.charts.setOnLoadCallback ->
        data = google.visualization.arrayToDataTable(data)

        options = $.extend {}, cfg,
          title: title
          vAxis:
            minValue: 1

        chart = new (google.visualization.BarChart)(document.getElementById(id))
        chart.draw data, options
        return


    # @method initChartRadiosHandlers
    # @desctiption - Initialize histogram switcher events
    # @return null
    initChartRadiosHandlers: () ->
      cfg = self.config.graphs.bar

      $('[name="bar-chart"]').on 'change', ->
        $this = $(this)
        title = $this.attr 'data-title'
        data = $this.data 'data' # JSON parse

        self.initHistogram('histogram-1', title, data)

      # show first chart
      $('[name="bar-chart"]').first().trigger('change')


    # @method renderCountries
    # @desctiption - Render HTML markup for Countries list block part
    # @return null
    renderCountries: () ->
      query = self.metadata
      type = query.type

      # don't show Countries block:
      # - when we are on the bottom line in geoArea model
      # - when type is non valid
      if (type == 'none') or ($.inArray(type, self.config.lists.geoareas) == -1)
        return ''

      delete query.type
      data = self.getDataCountries type, query

      $heading = $('<h1/>', {'html': i18n('widget.statistics.breakdownOfDumps') + ' ' + self.data.name})
      $panel = $('<div/>', {'class': 'dumps-list'})

      for item in data
        $box = $('<div/>', {})
        $box.append $('<div/>', {'class': 'country', 'html': item['_anchor']})
        $box.append $('<div/>', {'class': 'reported', 'html': item['_total'] + ' ' + i18n('notifications.reported')})
        $box.append $('<div/>', {'class': 'cleaned', 'html': $.fn.round(item['_cleaned']) + '% ' + i18n('global.cleaned')})
        $panel.append $box

      # insert heading and panel to the widget root element
      $(self.config.trashCountries.id).append($heading).append($panel)


    # @method renderLastUpdatedDumps
    # @desctiption - Render HTML markup for last updated dumps in current geographical area
    # @return null
    renderLastUpdatedDumps: (data) ->
      cfg = $.fn.config('system.admin')

      if !data
        data = self.getTrashList()

      # console.log('trashlist 2', data)

      imgPath = $.fn.config('system.paths.images')
      $heading = $('<h1/>', {'html': i18n('widget.statistics.lastUpdatedDumps') + ' ' + self.data.name})
      $panel = $('<div/>', {'class': 'tabs'})

      # prepare tab navigation structure
      if self.metadata.trashlists_type == 'both'
        $navigation = $('<div/>', {'class': 'tabs-nav'})
        $navigation.append $('<a/>', {'href': '#photos', 'html': i18n('global.photos')})
        $navigation.append $('<a/>', {'href': '#list-view', 'class': 'current', 'html': i18n('global.list')})

      # prepare list of dumps photos structure
      $photos = $('<div/>', {'id': 'photos', 'class': 'tabs-content'})
      dataImg = $.extend true, {}, data # clone object
      for i of dataImg
        trash = dataImg[i]
        image = $.fn.config('system.paths.images') + 'placeholder_rectangle.png'
        if $.isArray(trash.images) and trash.images.length > 0
          img = trash.images.pop()
          img = img.fullDownloadUrl
          if img
            image = img

        $anchor = $('<a/>', {'href': cfg.domain + cfg.endpoints.trashDetail + trash.id, 'target': '_blank', 'class': 'photo'})
        $anchor.append $('<img/>', {'src': image, 'alt': '', 'title': ''})
        $photos.append $anchor

      # prepare main list of dumps structure (list view)
      $listView = $('<div/>', {'id': 'list-view', 'class': 'tabs-content current'})

      $listHeader = $('<div/>', {'class': 'list'})
      $listHeaderBox = $('<div/>', {'class': 'list-header'})
      $sortingIcon = $('<a/>', {'href': '#', 'onclick' : 'return false;', 'html': $('<img/>', {'src': imgPath + 'icons/sort.png'})})
      $listHeaderBox.append $('<span/>', {'html': i18n('global.photos')})
      $listHeaderBox.append $('<span/>', {'html': i18n('global.dumps')})
      $listHeaderBox.append $('<span/>', {'html': i18n('global.status') + $sortingIcon[0].outerHTML, 'id': 'sort-status'})
      $listHeaderBox.append $('<span/>', {'html': i18n('global.lastUpdate') + $sortingIcon[0].outerHTML, 'id': 'sort-update'})

      $listHeader.append $listHeaderBox

      $listContent = $('<div/>', {'id': 'sortable', 'class': 'list'})
      for i of data
        trash = data[i]

        image = $.fn.config('system.paths.images') + 'placeholder_rectangle.png'
        if $.isArray(trash.images) and trash.images.length > 0
          img = trash.images.pop()
          img = img.fullDownloadUrl
          if img
            image = img

        $listItem = $('<div/>', {'class': 'list-item'})
        $listItemPhoto = $('<div/>', {'class': 'list-photo'})

        $listItemPhotoLink = $('<a/>', {'href': cfg.domain + cfg.endpoints.trashDetail + trash.id, 'target': '_blank'})
        $listItemPhotoLink.append $('<img/>', {'src': image, 'alt': '', 'title': ''})
        $listItemPhoto.append $listItemPhotoLink
        $listItemInfo = $('<div/>', {'class': 'info'})

        address = ''
        if !$.fn.isEmpty(trash.gps.area)
          area = trash.gps.area
          address += if !$.fn.isEmpty(area.subLocality) then area.subLocality else ''
          address += if !$.fn.isEmpty(area.locality) then ', ' + area.locality else ''
          address += if !$.fn.isEmpty(area.country) then ', ' + area.country else ''

        $listItemInfo.append $('<h2/>', {'html': address.replace(/^, /gi, '')})
        $listItemInfo.append $('<span/>', {'class': 'ico ico-' + trash.size + ' green trash-type', 'html': i18n('trash.size.' + (if trash.size == 'car' then 'carNeeded' else trash.size))})

        $wrapper = $('<div/>', {'class': 'ico-types-wrapper'})
        if $.isArray(trash.types) and trash.types.length > 0
          $.each trash.types, (key, object) ->
            $wrapper.append $('<span/>', {'class': 'ico ico-type ico-' + object, 'html': i18n('trash.types.' + object)})
          $listItemInfo.append $wrapper

        if trash.status == 'cleaned'
          status =
            name: 'trash.status.cleaned'
            icon: 'cleaned'
        else if trash.updateNeeded == true
          status =
            name: 'trash.updateNeeded'
            icon: 'unknown'
        else
          status =
            name: 'trash.created'
            icon: 'reported'

        $listItemStatus = $('<div/>', {'class': 'status'})
        $listItemStatus.append $('<div/>', {'class': 'status-' + status.icon, 'html': i18n(status.name) + '<em class="hide">' + status.name + '-' + trash.id + '</em>'})

        $listItemLastUpdate = $('<div/>', {'class': 'last-update'})
        $listItemLastUpdate.append $('<h3/>', {'html': '' + i18n(moment(trash.updateTime).ago()) + '<small>' + moment(trash.updateTime).format('ll') + '</small><em class="hide">' + moment(trash.updateTime).unix() + '</em>'})

        # insert each segment to the panel
        $listItem.append($listItemPhoto).append($listItemInfo).append($listItemStatus).append($listItemLastUpdate)
        $listContent.append $listItem

      $listView.append($listHeader).append($listContent)


      # insert each segment to the panel
      if self.metadata.trashlists_type == 'both'
        $panel.append($navigation).append($photos).append($listView)

      if self.metadata.trashlists_type == 'list'
        $listView.addClass 'current'
        $panel.append($navigation).append($listView)

      if self.metadata.trashlists_type == 'photo'
        $panel.append($navigation).append($photos)

      # insert heading and panel to the widget root element
      $(self.config.trashList.id).append($heading).append($panel)

    # @method renderFooter
    # @desctiption - Init default handlers (close button) and show/hide close button
    # @return null
    renderFooter: () ->
      cfg = $.fn.config('system.admin')

      $newsletter = $('<div/>', {'class': 'newsletter'})
      $newsletter.append $('<a/>', {'href': cfg.domain + cfg.endpoints.subscribe, 'target': '_blank', 'html': i18n('global.subscribe')})

      $(self.config.footer.id).append($newsletter)

    # @method initHandlers
    # @desctiption - Init default handlers (close button) and show/hide close button
    # @return null
    initHandlers: () ->
      return false


    # @method initData
    # @desctiption - Init default data from query string
    # @return null
    initData: () ->
      geoareas = self.config.lists.geoareas.slice 0 # array clone
      query = self.metadata

      for i of geoareas.reverse()
        if query[geoareas[i]]
          self.data.name = query[geoareas[i]]
          break


    # @method getDataCountries
    # @desctiption - Load Trash data from API
    # @return {mixed}
    getDataCountries: (type, params) ->
      cfg = $.fn.config('system.api')

      # prepare ajax params
      query =
        type: type

      if params
        query = $.extend query, params

      # get trash list from API
      result = []
      $.ajax(
        url: cfg.domain + cfg.endpoints.areaList + '?' + $.param(query)
        async: false # this request has to be synchronous
        headers:
          'x-api-key': self.config.key
      ).done((data) ->
        # prepare properties
        for item in data
          item['_total'] = parseInt(item.less) + parseInt(item.more) + parseInt(item.stillHere) + parseInt(item.cleaned)
          item['_cleaned'] = if item['_total'] > 0 then (parseInt(item.cleaned) / item['_total'] ) * 100 else 0

          item['_name'] = item[type]
          item['_anchor'] = self.getAnchor type, item

        result = data
      ).fail(->

        return false
      )

      return result

    # @method getAnchor
    # @desctiption - generate right anchor for geoArea list
    # @return {mixed}
    getAnchor: (type, item) ->
      cfg = $.fn.config('system.api')
      geoareas = self.config.lists.geoareas

      _key = geoareas[geoareas.indexOf(type) + 1]
      _params =
        'key' : self.config.key

      # prepare query segment
      i = geoareas.indexOf(type)
      while i >= 0
        _id = geoareas[i]
        if item[_id]
          _params[_id] = item[_id]
        i--

      # check for empty results - we want to eliminate empty results as much as we can
      if geoareas.indexOf(type) > 1 # empty results could be from aa1 key
        i = geoareas.indexOf(type) + 1
        while i < geoareas.length
          _key = geoareas[i]

          result = []
          $.ajax(
            url: cfg.domain + cfg.endpoints.areaList + '?type=' + _key + '&' + $.param(_params).replace(/\+/g, '%20')
            async: false # this request has to be synchronous
            headers:
              'x-api-key': self.config.key
          ).done((data) ->
            result = data
          )

          if result.length > 0
            return $('<a/>', {'href': 'statistics.html?type=' + _key + '&' + $.param(_params).replace(/\+/g, '%20'), 'html': item['_name']})

          i++
      else
        return $('<a/>', {'href': 'statistics.html?type=' + _key + '&' + $.param(_params).replace(/\+/g, '%20'), 'html': item['_name']})

      return $('<a/>', {'href': 'statistics.html?type=none&' + $.param(_params).replace(/\+/g, '%20'), 'html': item['_name']})


    # @method getTrashList
    # @desctiption - Get trashlist data from server
    # @return {mixed} array of list item / false when something went wrong
    getTrashList: () ->
      # get global widget config (API)
      cfg = $.fn.config('system.api')

      # allow only this attributes
      geoareas = self.config.lists.geoareas

      # get current query
      queryData = self.metadata

      # prepare ajax params
      query =
        attributesNeeded: 'id,status,types,size,updateNeeded,gpsShort,created,note,images,updateTime,updateHistory,gpsFull'
        limit: 24
        page: 1
        orderBy: '-update'

      # allow only valid API params
      Object.keys(queryData).forEach (key, index) ->
        if ($.inArray key, geoareas) > -1
          # calmel case in keys - capitalize first letter
          _key = key.charAt(0).toUpperCase() + key.substring(1).toLowerCase()
          # exception - because of renaming Sub_locality => SubLocality
          _key = _key.replace('ub_loc', 'bLoc')
          query['geoArea' + _key ] = queryData[key]
        return

      # get trash list from API
      result = false
      $.ajax(
        url: cfg.domain + cfg.endpoints.trashList + '?' + $.param(query)
        async: false # this request has to be synchronous
        headers:
          'x-api-key': self.config.key
      ).done((data) ->
        result = data
      ).fail(->
        result = false
      )

      return result


    # @method getChartDataStatus
    # @desctiption - Load Trash data from API
    # @return {mixed}
    getChartData: (type, params) ->
      cfg = $.fn.config('system.api')
      slices = self.config.graphs.donut.slices

      # first line is chart styles
      result = [
        ['','', {role:'style'}]
      ]

      types = self.config.lists[type]
      query = {}

      # get current query
      queryData = self.metadata

      # allow only this attributes
      geoareas = self.config.lists.geoareas

      # prepare ajax params
      Object.keys(queryData).forEach (key, index) ->
        if ($.inArray key, geoareas) > -1
          # calmel case in keys - capitalize first letter
          _key = key.charAt(0).toUpperCase() + key.substring(1).toLowerCase()
          # exception - because of renaming Sub_locality => SubLocality
          _key = _key.replace('ub_loc', 'bLoc')
          query['geoArea' + _key ] = queryData[key]

      Object.keys(types).forEach (key, index) ->
        _key = 'trash' + type.charAt(0).toUpperCase() + type.substring(1).toLowerCase()

        query[_key] = types[key]

        if params
          query = $.extend query, params

        if type == 'type'
          translationString = 'trash.types.' + key
        else if type == 'size'
          translationString = 'trash.size.' + (if key == 'car' then 'carNeeded' else key)
        else if type == 'status'
          translationString = (if key == 'reported' then 'trash.created' else 'trash.status.' + key)
        else if type == 'accessibility'
          translationString = 'trash.accessibility.' + key

        section = if type == 'type' then 'types' else type

        # get trash list from API
        $.ajax(
          url: cfg.domain + cfg.endpoints.trashStatistics + '?' + $.param(query)
          async: false # this request has to be synchronous
          headers:
            'x-api-key': self.config.key
        ).done((data) ->
          _color = if index < slices.length then slices[index].color else '#000000'
          result.push [i18n(translationString), data.count, 'color:' + slices[index].color]
        ).fail(->
          # TODO: show message OR retry all again
        )

      self.data.charts[type] = result.slice 0

      return result

    # @method initLoader
    # @desctiption - Prepare ajax loader (spinner)
    # @return null
    initLoader: () ->
      # this will be called when ALL running AJAX calls have completed
      $(document).ajaxStart ->
        $('.spinner-overlay').removeClass 'hide'

      # this will be called when ANY AJAX call have started
      $(document).ajaxStop ->
        $('.spinner-overlay').addClass 'hide'


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


    # @method initTabsSwitcher
    # @desctiption - Simple methods for tabs switching
    # @return null
    initTabsSwitcher: () ->
      $tabLinks = $('.tabs .tabs-nav a')
      $tabLinks.on 'click', (e) ->
        e.preventDefault()
        # Use only current tabs
        $tabs = $(this).parents('.tabs')
        tabsHref = $(this).attr('href')
        $tabs.find('.tabs-nav a.current').removeClass 'current'
        $tabs.find('.tabs-content.current').removeClass 'current'
        $(this).addClass 'current'
        $tabs.find(tabsHref).addClass 'current'
        # Force browser reflow (iPhone transition fix)
        $('.tabs-content.current').each ->
          reflow = @offsetHeight
          return
        return


    # @method initSorting
    # @desctiption - Simple sorting methods for list of dumps
    # @return null
    initSorting: () ->
      $('#sort-status').on 'click', (e) ->
        $('#sortable').sortChildren( $.sortFunc([ '$(this).find(\'.status em\').text()' ]) , 0, 0, $(this).hasClass('reverse') )
        $(this).toggleClass 'reverse'
        return false

      $('#sort-update').on 'click', (e) ->
        $('#sortable').sortChildren( $.sortFunc([ '+$(this).find(\'.last-update em\').text()' ]) , 0, 0, $(this).hasClass('reverse') )
        $(this).toggleClass 'reverse'
        return false

  Statistics.defaults = Statistics::defaults

  $.fn.Statistics = (options) ->
    @each ->
      new Statistics(this, options).init()
      return

  #optional: window.Statistics = Statistics;
  return
) jQuery, window, document

$ ->
  $(document).Statistics();