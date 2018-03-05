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

# @decription Basic test skeleton
# @decription Run command: ./mocha complete.js

# main initialization and library loader
global.assert = require 'assert'
global.chai = require 'chai' # npm install --save-dev chai
#chai.should()
global.expect = chai.expect
global.jsdom = require 'jsdom' # npm install -g jsdom
global.$ = global.jQuery = require('../vendor/jquery.min.js')(jsdom.jsdom().defaultView) # jquery always needs window object
global.und = require('../vendor/underscore-min.js')
global.lib = require('../vendor/libs.js') # tested library

describe '$.fn.getQueryVariable - Get query varibale from given URL or from window.location object', ->
  describe 'Basic test', ->
    query = '?a=1&b=aa&c=CCC'

    it 'should extract and return single value from query', ->
      expect(
        $.fn.getQueryVariable('a', query)
      ).to.equal(
        '1'
      )
      return

    it 'should extract and return single value from query (case-sensitive)', ->
      expect(
        $.fn.getQueryVariable('c', query)
      ).to.equal(
        'CCC'
      )
      return

    it 'should return null when variable not exists in query', ->
      expect(
        $.fn.getQueryVariable('f', query)
      ).to.equal(
        null
      )
      return

  return


describe '$.fn.getQueryObject - Get complete query from given URL as an object', ->
  describe 'Basic test', ->
    query = '?id=1569&width=2'

    it 'should have object structure', ->
      expect(
        $.fn.getQueryObject(query)
      ).to.be.an(
        'object'
      )

      return

    it 'should have all properties', ->
      expect(
        $.fn.getQueryObject(query)
      ).to.have.all.keys(
        'id', 'width'
      )

      return

    it 'should have all properties with expected values', ->
      data = $.fn.getQueryObject(query)
      expect(
        data.id
      ).to.equal(
        '1569'
      )

      expect(
        data.width
      ).to.equal(
        '2'
      )

      return

    return

  return


describe '$.fn.isEmpty - Test an javascript object for empty / undefined / null / nil value', ->
  describe 'Basic test', ->

    it 'test empty string', ->
      expect(
        $.fn.isEmpty('')
      ).to.be.true
      return

    it 'test non-object value - such as number (arguably could be a TypeError)', ->
      expect(
        $.fn.isEmpty(33)
      ).to.be.true
      return

    it 'test empty array', ->
      expect(
        $.fn.isEmpty([])
      ).to.be.true
      return

    it 'test empty object', ->
      expect(
        $.fn.isEmpty({})
      ).to.be.true
      return

    it 'test non object, but with empty array', ->
      expect(
        $.fn.isEmpty({length: 0, custom_property: []})
      ).to.be.true
      return

    it 'test not empty string', ->
      expect(
        $.fn.isEmpty('HELLO')
      ).to.be.false
      return

    it 'test not empty array', ->
      expect(
        $.fn.isEmpty([1,2,3])
      ).to.be.false
      return

    it 'test not empty simple object', ->
      expect(
        $.fn.isEmpty({test: 1})
      ).to.be.false
      return

    it 'test not empty scalar object', ->
      expect(
        $.fn.isEmpty({length: 3, custom_property: [1,2,3]})
      ).to.be.false
      return


    return

  return


describe '$.fn.arrayIntersect - Provide intersecting of two arrays', ->
  describe 'Basic test', ->

    it 'simple array of int intersection [1,2,3] and [2,3,4] ~> [2,3]', ->
      expect(
        $.fn.arrayIntersect([1,2,3],[2,3,4])
      ).to.eql(
        [2,3]
      )
      return

    it 'simple array of string intersection [\'apple\',\'raspberry\',\'pear\'] and [\'apple\',\'pear\',\'pinapple\'] ~> [\'apple\', \'pear\']', ->
      expect(
        $.fn.arrayIntersect(['apple','raspberry','pear'], ['apple','pear','pinapple'])
      ).to.eql(
        ['apple', 'pear']
      )
      return

    it 'empty intersection [1,2,3] and [4,5,6] ~> []', ->
      expect(
        $.fn.arrayIntersect([1,2,3],[4,5,6])
      ).to.eql(
        []
      )
      return


    return

  return


describe '$.fn.round - Round number to given precision', ->
  describe 'Basic test - round to 0 decimals', ->

    it 'small number - round down', ->
      expect(
        $.fn.round(5.49999)
      ).to.eql(
        '5'
      )
      return

    it 'small number - round up', ->
      expect(
        $.fn.round(5.500001)
      ).to.eql(
        '6'
      )
      return

    it 'large number - round down', ->
      expect(
        $.fn.round(9999999999.499999)
      ).to.eql(
        '9999999999'
      )
      return

    it 'large number - round up', ->
      expect(
        $.fn.round(9999999999.500001)
      ).to.eql(
        '10000000000'
      )
      return

    return

  describe 'Basic test - with precision', ->
    it 'large number with precision - round down', ->
      expect(
        $.fn.round(9999999999.499999, 5)
      ).to.eql(
        '9999999999.50000'
      )
      return

    it 'large number with precision - round up', ->
      expect(
        $.fn.round(9999999999.500001, 5)
      ).to.eql(
        '9999999999.50000'
      )
      return

    return

  describe 'Extended test - precision scale', ->
    it 'count of precision numbers in return value', ->
      expect(
        $.fn.round(0.499999, 3).length
      ).to.eql(
        5
      )
      return

    return

  return


describe '$.fn.humanRound - Round number to better human readable format', ->
  describe 'Basic test - all types from 0 - 100 000 000', ->

    it 'small numbers - without thousand separator', ->
      expect(
        $.fn.humanRound 9
      ).to.equal(
        9
      )

      return

    it 'small numbers - without thousand separator with +', ->
      expect(
        $.fn.humanRound 19
      ).to.equal(
        '15+'
      )

      expect(
        $.fn.humanRound 39
      ).to.equal(
        '35+'
      )

      expect(
        $.fn.humanRound 59
      ).to.equal(
        '50+'
      )

      expect(
        $.fn.humanRound 159
      ).to.equal(
        '150+'
      )

      return

    it 'large numbers - with thousand separator and with +', ->
      expect(
        $.fn.humanRound 1999
      ).to.equal(
        '2K+'
      )

      expect(
        $.fn.humanRound 19999
      ).to.equal(
        '20K+'
      )

      expect(
        $.fn.humanRound 199999
      ).to.equal(
        '200K+'
      )

      expect(
        $.fn.humanRound 1999999
      ).to.equal(
        '2M+'
      )

      expect(
        $.fn.humanRound 19999999
      ).to.equal(
        '20M+'
      )

      return


    return


  return


describe '$.fn.customCalculator - Special calculation method for MarkerClusterer for Google Maps v3 class, this can provide different output values', ->
  describe 'Basic test - based on $.fn.humanRound (reverse check)', ->

    it 'result should have both properties - text, index', ->
      expect(
        $.fn.customCalculator([{data: status: 'cleaned'},{data: status: 'less'},{data: status: 'stillHere'}], 1)
      ).to.have.all.keys(
        'text', 'index'
      )

      return

    it 'check text - small number and mixed values, reverse check with $.fn.humanRound ', ->
      markers = [
        {data: status: 'cleaned'},{data: status: 'cleaned'},{data: status: 'cleaned'},{data: status: 'more'},{data: status: 'less'},{data: status: 'less'},{data: status: 'stillHere'},{data: status: 'stillHere'},
      ]

      expect(
        $.fn.customCalculator(markers, 1)
      ).to.have.property(
        'text'
      ).and.equal(
        $.fn.humanRound(markers.length)
      )

      return

    it 'check text - large number and mixed values, reverse check with $.fn.humanRound', ->
      markers = []

      i = 0
      while i < 9999
        markers.push {data: status: 'cleaned'}
        markers.push {data: status: 'more'}
        markers.push {data: status: 'less'}
        markers.push {data: status: 'stillHere'}
        i++

      expect(
        $.fn.customCalculator(markers, 1)
      ).to.have.property(
        'text'
      ).and.equal(
        $.fn.humanRound(markers.length)
      )

      return

    return


  describe 'Extended test - based on $.fn.humanRound and $.fn.getClusterIcon (reverse check)', ->

    it 'check text and index - status: cleaned', ->
      markers = []

      i = 0
      nr = 9
      while i < nr
        markers.push {data: status: 'cleaned'}
        i++

      expect(
        $.fn.customCalculator(markers, 1)
      ).to.eql(
        { text: $.fn.humanRound(markers.length), index: $.fn.getClusterIcon(nr, 0, 0)}
      )

      return

    it 'check text and index - status: stillHere', ->
      markers = []

      i = 0
      nr = 9
      while i < nr
        markers.push {data: status: 'stillHere'}
        i++

      expect(
        $.fn.customCalculator(markers, 1)
      ).to.eql(
        { text: $.fn.humanRound(markers.length), index: $.fn.getClusterIcon(0, 0, nr)}
      )

      return

    it 'check text and index - status: lessMore', ->
      markers = []

      i = 0
      nr = 9
      while i < nr
        markers.push {data: status: 'less'}
        markers.push {data: status: 'more'}
        i++

      expect(
        $.fn.customCalculator(markers, 1)
      ).to.eql(
        { text: $.fn.humanRound(markers.length), index: $.fn.getClusterIcon(0, nr*2, 0)}
      )

      return

    it 'check text and index - status: cleaned, lessMore, stillHere', ->
      markers = []

      i = 0
      nr = 9
      while i < nr
        markers.push {data: status: 'less'}
        markers.push {data: status: 'more'}
        markers.push {data: status: 'cleaned'}
        markers.push {data: status: 'stillHere'}
        i++

      expect(
        $.fn.customCalculator(markers, 1)
      ).to.eql(
        { text: $.fn.humanRound(markers.length), index: $.fn.getClusterIcon(nr, nr*2, nr)}
      )

      return

    it 'check text and index - status: cleaned, lessMore', ->
      markers = []

      i = 0
      nr = 9
      while i < nr
        markers.push {data: status: 'less'}
        markers.push {data: status: 'more'}
        markers.push {data: status: 'cleaned'}
        i++

      expect(
        $.fn.customCalculator(markers, 1)
      ).to.eql(
        { text: $.fn.humanRound(markers.length), index: $.fn.getClusterIcon(nr, nr*2, 0)}
      )

      return

    it 'check text and index - status: lessMore, stillHere', ->
      markers = []

      i = 0
      nr = 9
      while i < nr
        markers.push {data: status: 'less'}
        markers.push {data: status: 'more'}
        markers.push {data: status: 'stillHere'}
        i++

      expect(
        $.fn.customCalculator(markers, 1)
      ).to.eql(
        { text: $.fn.humanRound(markers.length), index: $.fn.getClusterIcon(0, nr*2, nr)}
      )

      return

    it 'check text and index - status: stillHere, cleaned', ->
      markers = []

      i = 0
      nr = 9
      while i < nr
        markers.push {data: status: 'cleaned'}
        markers.push {data: status: 'stillHere'}
        i++

      expect(
        $.fn.customCalculator(markers, 1)
      ).to.eql(
        { text: $.fn.humanRound(markers.length), index: $.fn.getClusterIcon(nr, 0, nr)}
      )

      return

    return

  return



describe '$.fn.groupByAndSum - Grouping array of Markers via data.status value and make a sum', ->
  describe 'Basic test', ->

    it 'complete test based on random values', ->
      markers = []

      max = 999
      min = 1

      _cl = Math.floor(Math.random() * (max - min)) + min
      _sh = Math.floor(Math.random() * (max - min)) + min
      _mr = Math.floor(Math.random() * (max - min)) + min
      _ls = Math.floor(Math.random() * (max - min)) + min

      i = 0
      while i < _cl
        markers.push {data: status: 'cleaned'}
        i++

      i = 0
      while i < _sh
        markers.push {data: status: 'stillHere'}
        i++

      i = 0
      while i < _ls
        markers.push {data: status: 'less'}
        i++

      i = 0
      while i < _mr
        markers.push {data: status: 'more'}
        i++

      expect(
        $.fn.groupByAndSum(markers)
      ).to.eql(
        {cleaned: _cl, stillHere: _sh, less: _ls, more: _mr}
      )

      expect(
        $.fn.groupByAndSum(markers)
      ).to.have.all.keys(
        'cleaned', 'stillHere', 'less', 'more'
      )

      return

  return