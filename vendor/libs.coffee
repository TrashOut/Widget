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

  # @method $.fn.getQueryVariable
  # @desctiption - Get query varibale from given URL or from window.location object
  # @param {string} name - Name of given parametr
  # @param {string} url - URL to decode (if empty, we use window.location object)
  # @return {string} String representing the decoded URI
  $.fn.getQueryVariable = (name, url) ->
    if !url
      url = window.location.href
    name = name.replace(/[\[\]]/g, '\\$&')
    regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    results = regex.exec(url)
    if !results
      return null
    if !results[2]
      return ''
    decodeURIComponent results[2].replace(/\+/g, ' ')

  # @method $.fn.getQueryObject
  # @desctiption - Get complete query from given URL as an object
  # @return {string} String representing the decoded URI
  $.fn.getQueryObject = (url) ->
    if url
      search = url.substring(1)
    else
      search = location.search.substring(1)
    if search then JSON.parse('{"' + search.replace(/&/g, '","').replace(RegExp('=', 'g'), '":"') + '"}', ((key, value) ->
      if key == '' then value else decodeURIComponent(value)
    ))

  # @method $.fn.loadJS
  # @desctiption - Load javascript file dynamically from script
  # @param {string} url - Javascript file URL
  # @param {method} callback - Function you want to call after script is loaded
  # @return null
  $.fn.loadJS = (url, callback) ->
    # Adding the script tag to the head as suggested before
    head = document.getElementsByTagName('head')[0]
    script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    # Then bind the event to the callback function.
    # There are several events for cross browser compatibility.
    script.onreadystatechange = callback
    script.onload = callback
    # Fire the loading
    head.appendChild script

  # @method $.fn.isEmpty
  # @desctiption - Test an javascript object for empty / undefined / null / nil value
  # @param {mixed} obj - Object you want to test
  # @return {boolean} Is given object empty?
  $.fn.isEmpty = (obj) ->
    hasOwnProperty = Object.prototype.hasOwnProperty

    # null and undefined are "empty"
    if typeof obj == 'undefined'
      return true
    # null and undefined are "empty"
    if obj == null
      return true
    # Assume if it has a length property with a non-zero value
    # that that property is correct.
    if obj.length > 0
      return false
    if obj.length == 0
      return true
    # If it isn't an object at this point
    # it is empty, but it can't be anything *but* empty
    # Is it empty?  Depends on your application.
    if typeof obj != 'object'
      return true
    # Otherwise, does it have any properties of its own?
    # Note that this doesn't handle
    # toString and valueOf enumeration bugs in IE < 9
    for key of obj
      if hasOwnProperty.call(obj, key)
        return false

    true

  # @method $.fn.arrayIntersect
  # @desctiption - Provide intersecting of two arrays
  # @param {array} a - first array
  # @param {array} b - second array
  # @return {array} intersected array
  $.fn.arrayIntersect = (a, b) ->
    t = undefined
    if b.length > a.length
      t = b
      b = a
      a = t
    # indexOf to loop over shorter
    a.filter (e) ->
      if b.indexOf(e) != -1
        return true
      return

  # @method $.fn.round
  # @desctiption - Truncate number
  # @return {int} truncated number
  $.fn.truncate = (nr) ->
    Math.trunc nr

  # @method $.fn.round
  # @desctiption - Round number to given precision
  # @param {float} nr - float number you want to round
  # @param {int} precision - default 0
  # @return {int} rounded number
  $.fn.round = (nr, precision = 0) ->
    nr.toFixed precision

  # @method $.fn.humanRound
  # @desctiption - Round number to better human readable format
  # @param {float} nr - float number you want to round
  # @return {string} rounded number
  $.fn.humanRound = (nr) ->
    sizes = ['', 'K', 'M', 'G', 'T']
    values = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]

    if nr < 10
       return nr

    sign = ''
    if nr >= 10
      sign = '+'

    i = parseInt(Math.floor(Math.log(nr) / Math.log(1000)))
    nr_rounded = parseInt($.fn.truncate(nr / Math.pow(1000, i)))

    j = 0
    while j < values.length - 1
      if nr_rounded >= values[j] and nr_rounded < values[j+1]
        nr_rounded = values[j]
        break
      j++

    return nr_rounded + sizes[i] + sign


  # @method $.fn.getClusterIcon
  # @desctiption - Returns index of marker image, which is needed for TrashMap clustered markers
  # @param {int} cleaned - number of cleaned trashes
  # @param {int} moreLess - number of moreLess trashes
  # @param {int} stillHere - number of stillHere trashes
  # @param {int} updateNeeded - number of updateNeeded trashes
  # @return {int} index of icon
  $.fn.getClusterIcon = (cleaned, moreLess, stillHere, updateNeeded) ->
    # all types of trashes - YGR
    index = 1

    if updateNeeded == 0
      if cleaned > (stillHere + moreLess)
        index = 4 # GGR
      else
        index = 2 # RRG
      if (cleaned > 0) and (stillHere + moreLess == 0)
        index = 9 # GGG
      if (cleaned == 0) and (stillHere + moreLess > 0)
        index = 8 # RRR
    else if updateNeeded == (stillHere + moreLess + cleaned)
      index = 10 # YYY
    else
      if cleaned >= updateNeeded
        index = 5 # GGY
      else if (cleaned > 0) and (updateNeeded > cleaned)
        index = 6 # YYG
      else if ((stillHere + moreLess - updateNeeded) >= updateNeeded) and (cleaned == 0)
        index = 3 # RRY
      else if ((stillHere + moreLess - updateNeeded) < updateNeeded) and (cleaned == 0)
        index = 7 # YYR
      else
        index = 1 # YGR

    # index of icon
    return index

  # @method $.fn.customCalculator
  # @desctiption - Special calculation method for MarkerClusterer for Google Maps v3 class, this can provide different output values
  # @param {array} markers - markers The markers in the clusterer.
  # @param {int} numStyles - the number of available styles
  # @return {Object} an object properties: 'text' (string) and 'index' (number)
  $.fn.customCalculator = (markers, numStyles) ->
    index = 0
    count = markers.length
    #console.log 'MM', markers

    # group by via status
    result = $.fn.groupByAndSum(markers)

    # TODO: zde podle toho budu volit index a dle indexu obrazek s kolecky :)
    #dash = ''
    #$.each result, (key, obj) ->
    #  dash += '<b>' + key + ':' + obj + '</b>'

    #dv = count
    #while dv != 0
    #  dv = parseInt(dv / 10, 10)
    #  index++
    #index = Math.min(index, numStyles)

    result.cleaned = result.cleaned || 0
    result.less = result.less || 0
    result.more = result.more || 0
    result.stillHere = result.stillHere || 0
    result.updateNeeded = result.updateNeeded || 0

    index = $.fn.getClusterIcon result.cleaned, result.less + result.more, result.stillHere, result.updateNeeded

    return {
      #text: $.fn.humanRound(count) + dash
      text: $.fn.humanRound(count)
      index: index + 1
    }

  # @method $.fn.groupByAndSum
  # @desctiption - Grouping array of Markers via data.status (dependency - updateNeeded) value and make a sum
  # @param {array} arr - array you want to group by
  # @return {array} grouped array
  $.fn.groupByAndSum = (arr) ->
    hist = {}
    result = []

    for i of arr
      trash = arr[i]
      if trash.data.updateNeeded == 1
        result.push 'updateNeeded'

      result.push trash.data.status

    result.map (a) ->
      if a of hist
        hist[a]++
      else
        hist[a] = 1
      return
    return hist

  return
) jQuery