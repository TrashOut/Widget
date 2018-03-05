/** TrashOut 
 * Copyright 2016 TrashOut NGO. All rights reserved.
 * Created 15.1. 2017
 * License GNU GPLv3
*/


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
  global.assert = require('assert');

  global.chai = require('chai');

  global.expect = chai.expect;

  global.jsdom = require('jsdom');

  global.$ = global.jQuery = require('../vendor/jquery.min.js')(jsdom.jsdom().defaultView);

  global.und = require('../vendor/underscore-min.js');

  global.lib = require('../vendor/libs.js');

  describe('$.fn.getQueryVariable - Get query varibale from given URL or from window.location object', function() {
    describe('Basic test', function() {
      var query;
      query = '?a=1&b=aa&c=CCC';
      it('should extract and return single value from query', function() {
        expect($.fn.getQueryVariable('a', query)).to.equal('1');
      });
      it('should extract and return single value from query (case-sensitive)', function() {
        expect($.fn.getQueryVariable('c', query)).to.equal('CCC');
      });
      return it('should return null when variable not exists in query', function() {
        expect($.fn.getQueryVariable('f', query)).to.equal(null);
      });
    });
  });

  describe('$.fn.getQueryObject - Get complete query from given URL as an object', function() {
    describe('Basic test', function() {
      var query;
      query = '?id=1569&width=2';
      it('should have object structure', function() {
        expect($.fn.getQueryObject(query)).to.be.an('object');
      });
      it('should have all properties', function() {
        expect($.fn.getQueryObject(query)).to.have.all.keys('id', 'width');
      });
      it('should have all properties with expected values', function() {
        var data;
        data = $.fn.getQueryObject(query);
        expect(data.id).to.equal('1569');
        expect(data.width).to.equal('2');
      });
    });
  });

  describe('$.fn.isEmpty - Test an javascript object for empty / undefined / null / nil value', function() {
    describe('Basic test', function() {
      it('test empty string', function() {
        expect($.fn.isEmpty('')).to.be["true"];
      });
      it('test non-object value - such as number (arguably could be a TypeError)', function() {
        expect($.fn.isEmpty(33)).to.be["true"];
      });
      it('test empty array', function() {
        expect($.fn.isEmpty([])).to.be["true"];
      });
      it('test empty object', function() {
        expect($.fn.isEmpty({})).to.be["true"];
      });
      it('test non object, but with empty array', function() {
        expect($.fn.isEmpty({
          length: 0,
          custom_property: []
        })).to.be["true"];
      });
      it('test not empty string', function() {
        expect($.fn.isEmpty('HELLO')).to.be["false"];
      });
      it('test not empty array', function() {
        expect($.fn.isEmpty([1, 2, 3])).to.be["false"];
      });
      it('test not empty simple object', function() {
        expect($.fn.isEmpty({
          test: 1
        })).to.be["false"];
      });
      it('test not empty scalar object', function() {
        expect($.fn.isEmpty({
          length: 3,
          custom_property: [1, 2, 3]
        })).to.be["false"];
      });
    });
  });

  describe('$.fn.arrayIntersect - Provide intersecting of two arrays', function() {
    describe('Basic test', function() {
      it('simple array of int intersection [1,2,3] and [2,3,4] ~> [2,3]', function() {
        expect($.fn.arrayIntersect([1, 2, 3], [2, 3, 4])).to.eql([2, 3]);
      });
      it('simple array of string intersection [\'apple\',\'raspberry\',\'pear\'] and [\'apple\',\'pear\',\'pinapple\'] ~> [\'apple\', \'pear\']', function() {
        expect($.fn.arrayIntersect(['apple', 'raspberry', 'pear'], ['apple', 'pear', 'pinapple'])).to.eql(['apple', 'pear']);
      });
      it('empty intersection [1,2,3] and [4,5,6] ~> []', function() {
        expect($.fn.arrayIntersect([1, 2, 3], [4, 5, 6])).to.eql([]);
      });
    });
  });

  describe('$.fn.round - Round number to given precision', function() {
    describe('Basic test - round to 0 decimals', function() {
      it('small number - round down', function() {
        expect($.fn.round(5.49999)).to.eql('5');
      });
      it('small number - round up', function() {
        expect($.fn.round(5.500001)).to.eql('6');
      });
      it('large number - round down', function() {
        expect($.fn.round(9999999999.499999)).to.eql('9999999999');
      });
      it('large number - round up', function() {
        expect($.fn.round(9999999999.500001)).to.eql('10000000000');
      });
    });
    describe('Basic test - with precision', function() {
      it('large number with precision - round down', function() {
        expect($.fn.round(9999999999.499999, 5)).to.eql('9999999999.50000');
      });
      it('large number with precision - round up', function() {
        expect($.fn.round(9999999999.500001, 5)).to.eql('9999999999.50000');
      });
    });
    describe('Extended test - precision scale', function() {
      it('count of precision numbers in return value', function() {
        expect($.fn.round(0.499999, 3).length).to.eql(5);
      });
    });
  });

  describe('$.fn.humanRound - Round number to better human readable format', function() {
    describe('Basic test - all types from 0 - 100 000 000', function() {
      it('small numbers - without thousand separator', function() {
        expect($.fn.humanRound(9)).to.equal(9);
      });
      it('small numbers - without thousand separator with +', function() {
        expect($.fn.humanRound(19)).to.equal('15+');
        expect($.fn.humanRound(39)).to.equal('35+');
        expect($.fn.humanRound(59)).to.equal('50+');
        expect($.fn.humanRound(159)).to.equal('150+');
      });
      it('large numbers - with thousand separator and with +', function() {
        expect($.fn.humanRound(1999)).to.equal('2K+');
        expect($.fn.humanRound(19999)).to.equal('20K+');
        expect($.fn.humanRound(199999)).to.equal('200K+');
        expect($.fn.humanRound(1999999)).to.equal('2M+');
        expect($.fn.humanRound(19999999)).to.equal('20M+');
      });
    });
  });

  describe('$.fn.customCalculator - Special calculation method for MarkerClusterer for Google Maps v3 class, this can provide different output values', function() {
    describe('Basic test - based on $.fn.humanRound (reverse check)', function() {
      it('result should have both properties - text, index', function() {
        expect($.fn.customCalculator([
          {
            data: {
              status: 'cleaned'
            }
          }, {
            data: {
              status: 'less'
            }
          }, {
            data: {
              status: 'stillHere'
            }
          }
        ], 1)).to.have.all.keys('text', 'index');
      });
      it('check text - small number and mixed values, reverse check with $.fn.humanRound ', function() {
        var markers;
        markers = [
          {
            data: {
              status: 'cleaned'
            }
          }, {
            data: {
              status: 'cleaned'
            }
          }, {
            data: {
              status: 'cleaned'
            }
          }, {
            data: {
              status: 'more'
            }
          }, {
            data: {
              status: 'less'
            }
          }, {
            data: {
              status: 'less'
            }
          }, {
            data: {
              status: 'stillHere'
            }
          }, {
            data: {
              status: 'stillHere'
            }
          }
        ];
        expect($.fn.customCalculator(markers, 1)).to.have.property('text').and.equal($.fn.humanRound(markers.length));
      });
      it('check text - large number and mixed values, reverse check with $.fn.humanRound', function() {
        var i, markers;
        markers = [];
        i = 0;
        while (i < 9999) {
          markers.push({
            data: {
              status: 'cleaned'
            }
          });
          markers.push({
            data: {
              status: 'more'
            }
          });
          markers.push({
            data: {
              status: 'less'
            }
          });
          markers.push({
            data: {
              status: 'stillHere'
            }
          });
          i++;
        }
        expect($.fn.customCalculator(markers, 1)).to.have.property('text').and.equal($.fn.humanRound(markers.length));
      });
    });
    describe('Extended test - based on $.fn.humanRound and $.fn.getClusterIcon (reverse check)', function() {
      it('check text and index - status: cleaned', function() {
        var i, markers, nr;
        markers = [];
        i = 0;
        nr = 9;
        while (i < nr) {
          markers.push({
            data: {
              status: 'cleaned'
            }
          });
          i++;
        }
        expect($.fn.customCalculator(markers, 1)).to.eql({
          text: $.fn.humanRound(markers.length),
          index: $.fn.getClusterIcon(nr, 0, 0)
        });
      });
      it('check text and index - status: stillHere', function() {
        var i, markers, nr;
        markers = [];
        i = 0;
        nr = 9;
        while (i < nr) {
          markers.push({
            data: {
              status: 'stillHere'
            }
          });
          i++;
        }
        expect($.fn.customCalculator(markers, 1)).to.eql({
          text: $.fn.humanRound(markers.length),
          index: $.fn.getClusterIcon(0, 0, nr)
        });
      });
      it('check text and index - status: lessMore', function() {
        var i, markers, nr;
        markers = [];
        i = 0;
        nr = 9;
        while (i < nr) {
          markers.push({
            data: {
              status: 'less'
            }
          });
          markers.push({
            data: {
              status: 'more'
            }
          });
          i++;
        }
        expect($.fn.customCalculator(markers, 1)).to.eql({
          text: $.fn.humanRound(markers.length),
          index: $.fn.getClusterIcon(0, nr * 2, 0)
        });
      });
      it('check text and index - status: cleaned, lessMore, stillHere', function() {
        var i, markers, nr;
        markers = [];
        i = 0;
        nr = 9;
        while (i < nr) {
          markers.push({
            data: {
              status: 'less'
            }
          });
          markers.push({
            data: {
              status: 'more'
            }
          });
          markers.push({
            data: {
              status: 'cleaned'
            }
          });
          markers.push({
            data: {
              status: 'stillHere'
            }
          });
          i++;
        }
        expect($.fn.customCalculator(markers, 1)).to.eql({
          text: $.fn.humanRound(markers.length),
          index: $.fn.getClusterIcon(nr, nr * 2, nr)
        });
      });
      it('check text and index - status: cleaned, lessMore', function() {
        var i, markers, nr;
        markers = [];
        i = 0;
        nr = 9;
        while (i < nr) {
          markers.push({
            data: {
              status: 'less'
            }
          });
          markers.push({
            data: {
              status: 'more'
            }
          });
          markers.push({
            data: {
              status: 'cleaned'
            }
          });
          i++;
        }
        expect($.fn.customCalculator(markers, 1)).to.eql({
          text: $.fn.humanRound(markers.length),
          index: $.fn.getClusterIcon(nr, nr * 2, 0)
        });
      });
      it('check text and index - status: lessMore, stillHere', function() {
        var i, markers, nr;
        markers = [];
        i = 0;
        nr = 9;
        while (i < nr) {
          markers.push({
            data: {
              status: 'less'
            }
          });
          markers.push({
            data: {
              status: 'more'
            }
          });
          markers.push({
            data: {
              status: 'stillHere'
            }
          });
          i++;
        }
        expect($.fn.customCalculator(markers, 1)).to.eql({
          text: $.fn.humanRound(markers.length),
          index: $.fn.getClusterIcon(0, nr * 2, nr)
        });
      });
      it('check text and index - status: stillHere, cleaned', function() {
        var i, markers, nr;
        markers = [];
        i = 0;
        nr = 9;
        while (i < nr) {
          markers.push({
            data: {
              status: 'cleaned'
            }
          });
          markers.push({
            data: {
              status: 'stillHere'
            }
          });
          i++;
        }
        expect($.fn.customCalculator(markers, 1)).to.eql({
          text: $.fn.humanRound(markers.length),
          index: $.fn.getClusterIcon(nr, 0, nr)
        });
      });
    });
  });

  describe('$.fn.groupByAndSum - Grouping array of Markers via data.status value and make a sum', function() {
    describe('Basic test', function() {
      return it('complete test based on random values', function() {
        var i, markers, max, min, _cl, _ls, _mr, _sh;
        markers = [];
        max = 999;
        min = 1;
        _cl = Math.floor(Math.random() * (max - min)) + min;
        _sh = Math.floor(Math.random() * (max - min)) + min;
        _mr = Math.floor(Math.random() * (max - min)) + min;
        _ls = Math.floor(Math.random() * (max - min)) + min;
        i = 0;
        while (i < _cl) {
          markers.push({
            data: {
              status: 'cleaned'
            }
          });
          i++;
        }
        i = 0;
        while (i < _sh) {
          markers.push({
            data: {
              status: 'stillHere'
            }
          });
          i++;
        }
        i = 0;
        while (i < _ls) {
          markers.push({
            data: {
              status: 'less'
            }
          });
          i++;
        }
        i = 0;
        while (i < _mr) {
          markers.push({
            data: {
              status: 'more'
            }
          });
          i++;
        }
        expect($.fn.groupByAndSum(markers)).to.eql({
          cleaned: _cl,
          stillHere: _sh,
          less: _ls,
          more: _mr
        });
        expect($.fn.groupByAndSum(markers)).to.have.all.keys('cleaned', 'stillHere', 'less', 'more');
      });
    });
  });

}).call(this);
