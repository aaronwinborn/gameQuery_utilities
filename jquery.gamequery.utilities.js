/**
 * @file jquery.gamequery.utilities.js
 *
 * GameQuery Utilities version 1.0-ALPHA-1
 *
 * Various functions to make building games with the GameQuery library easier.
 * The GameQuery library is a javascript game engine with jQuery available at
 * http://gamequery.onaluf.org. The latest version of these utilities can be
 * found at http://github.com/aaronwinborn/gameQuery_utilities.
 *
 * Copyright (c) 2010 Aaron Winborn
 * Dual licensed under the MIT license and GPL v.3 or greater.
 */

/**
 * Basic functions:
 *  .x() and .y() are overloaded functions, accepting a wide range of values.
 *  For performance reasons, you may choose to use .getx(), .sety(), etc.
 *  However, I have not yet run benchmark tests, and it probably won't matter
 *  for less than a hundred objects on screen, from anectdotal results.
 *
 *  $(this).x();
 *  $(this).y();
 *  $(this).x({x: INTEGER|FUNCTION, [relative: BOOLEAN|FUNCTION]});
 *  $(this).y({y: INTEGER|FUNCTION, [relative: BOOLEAN|FUNCTION]});
 *  $(this).x(INTEGER|FUNCTION, [BOOLEAN|FUNCTION]);
 *  $(this).y(INTEGER|FUNCTION, [BOOLEAN|FUNCTION]);
 *
 * Low level functions (possibly preferred for performance):
 *  $(this).getx([BOOLEAN]);
 *  $(this).gety([BOOLEAN]);
 *  $(this).setx(INTEGER);
 *  $(this).sety(INTEGER);
 *  $(this).getPreviousx();
 *  $(this).getPreviousy();
 *
 * Convenience functions:
 *  $(this).position({[x: INTEGER|FUNCTION], [y: INTEGER|FUNCTION], [relative: BOOLEAN|FUNCTION]});
 *  $(this).position(INTEGER|FUNCTION, [INTEGER:FUNCTION], [BOOLEAN|FUNCTION]);
 *  $(this).move({[x: INTEGER|FUNCTION], [y: INTEGER|FUNCTION], [relative: BOOLEAN|FUNCTION]});
 *  $(this).move(INTEGER|FUNCTION, [INTEGER:FUNCTION], [BOOLEAN|FUNCTION]);
 *
 * Helper functions:
 *  $(this).getposxy('x'|'y', [BOOLEAN]);
 *  $(this).setposxy('x'|'y', INTEGER);
 *  $(this).posxy(); -- Overloaded as per x() and y().
 */

$(function(){
  /**
   * Constants
   */

  /**
   * This namespace will be prepended to data values stored by this plugin.
   */
  var GAMEQUERY_NAMESPACE = 'GAMEQUERY__';

  /**
   * An associative array of the CSS properties to affect for x and y.
   */
  var GAMEQUERY_XY_ATTRIBUTES = {x: 'left', y: 'top'};

  /**
   * This will return the sprite's horizontal position.
   * It may also be used to set that position.
   *
   * If relative: true, then we add x to the position.
   * If called without a new value, then it returns the current x position.
   * Otherwise it returns the object itself.
   *
   * @param mixed options
   *  (Optional) If not provided, then we simply return the current position.
   *  Otherwise, it is used to specify the value to set, according to the type:
   *    Object: The x value will be used, along with the relative property of
   *      the parameter.
   *    Function: The return value of the function will be used.
   *    Other: The value will be used directly.
   * @param boolean relative
   *  (Optional) If provided, this will override the relative value of options.
   *  In either case, this determines whether to add the value to the current
   *  position if false, or to set the position to the value (default).
   * @return integer
   *  The horizontal position of the object.
   *
   *  Examples:
   *  _x = $('#sprite-65').x();
   *  $('#sprite-33').x({x: 5, relative: true});
   *  $('#sprite-99').x('120');
   *  _x = $('.monster').each().x(function() { return $(this).data('hspeed') / 2; });
   */
  $.fn.x = function(options, relative) {
    return $(this).posxy('x', options, relative);
  }

  /**
   * This will return the sprite's vertical position.
   * It may also be used to set that position.
   *
   * If relative: true, then we add y to the position.
   * If called without a new value, then it returns the current x position.
   * Otherwise it returns the object itself.
   *
   * @param mixed options
   *  (Optional) If not provided, then we simply return the current position.
   *  Otherwise, it is used to specify the value to set, according to the type:
   *    Object: The x value will be used, along with the relative property of
   *      the parameter.
   *    Function: The return value of the function will be used.
   *    Other: The value will be used directly.
   * @param boolean relative
   *  (Optional) If provided, this will override the relative value of options.
   *  In either case, this determines whether to add the value to the current
   *  position if false, or to set the position to the value (default).
   * @return integer
   *  The horizontal position of the object.
   *
   *  _y = $('#sprite-65').y();
   *  $('#sprite-33').y({y: 45});
   *  _y = $('#sprite-99').y('120');
   *  $('.robot').each().y({y: function() { return $(this).data('vspeed') / 2; }, relative: true});
   *  $('.bouncy').each().y(-10, true);
   */
  $.fn.y = function(options, relative) {
    return $(this).posxy('y', options, relative);
  }

  /**
   * Low level function to get the item's horizontal position.
   *
   * @param boolean _reset
   *  (Optional) If true, then take the value directly from the object's DOM.
   *  Otherwise, the value is cached for performance.
   * @return integer
   *  The horizontal position of the object.
   */
  $.fn.getx = function(_reset) {
    return $(this).getposxy('x', _reset);
  }

  /**
   * Low level function to get the item's vertical position.
   *
   * @param boolean _reset
   *  (Optional) If true, then take the value directly from the object's DOM.
   *  Otherwise, the value is cached for performance.
   * @return integer
   *  The vertical position of the object.
   */
  $.fn.gety = function(_reset) {
    return $(this).getposxy('y', _reset);
  }

  /**
   * Low level function to set the item's horizontal position.
   *
   * @param integer pos
   *  The value to set the object's 'left' css value.
   * @return integer
   *  The horizontal position of the object.
   */
  $.fn.setx = function(pos) {
    return $(this).setposxy('x', pos);
  }

  /**
   * Low level function to set the item's vertical position.
   *
   * @param integer pos
   *  The value to set the object's 'top' css value.
   * @return integer
   *  The vertical position of the object.
   */
  $.fn.sety = function(pos) {
    return $(this).setposxy('y', pos);
  }

  /**
   * Return the most recent horizontal position before its last change.
   */
  $.fn.getPreviousx = function() {
    var prev = $(this).data(GAMEQUERY_NAMESPACE + 'prevx');
    if (prev === null || prev === undefined) {
      prev = $(this).getx();
      $(this).data(GAMEQUERY_NAMESPACE + 'prevx', prev);
    }
    return prev;
  }

  /**
   * Return the most recent vertical position before its last change.
   */
  $.fn.getPreviousy = function() {
    var prev = $(this).data(GAMEQUERY_NAMESPACE + 'prevy');
    if (prev === null || prev === undefined) {
      prev = $(this).gety();
      $(this).data(GAMEQUERY_NAMESPACE + 'prevy', prev);
    }
    return prev;
  }

  /*************************
   * Convenience functions.
   *************************/

  // This will set the sprite's position to the parameters for x,y.
  // $('#sprite-12').position({y: 240}).show();
  // $('#sprite-n').position({x: 5, y: 5, relative: true});
  // $('.boat').position(2, function() { return $(this).data('vspeed'); }, true);
  $.fn.position = function(options, y, relative) {
    if (typeof options != 'object') {
      options = { x: options };
    }

    // Add the optional parameters.
    if (y !== null && y !== undefined) {
      // Add the value to our options.
      options.y = y;
    }
    if (relative !== null && relative !== undefined) {
      // Add the value to our options.
      options.relative = relative;
    }

    // Merge in our defaults.
    var defaults = {
      relative: false
    }
    var options = $.extend(defaults, options);

    if (options.x || (!options.relative && !(options.x === null || options.x === undefined))) {
      $(this).x(options);
    }
    if (options.y || (!options.relative && !(options.y === null || options.y === undefined))) {
      $(this).y(options);
    }
    return $(this);
  }

  // This will move an object relative to its current position.
  //   $('.missile').each().move({x: -3});
  //   $(this).move({x: 2, y: -1}).addClass('moving');
  //   $('#my-sprite').move(3, 0, true);
  //   $('.goblin').each.move(function() { return $(this).data('hspeed')*1.5; }, $(this).data('vspeed'));
  $.fn.move = function(options, y, relative) {
    if (typeof options != 'object') {
      options = { x: options };
    }

    // Add the optional parameters.
    if (y !== null && y !== undefined) {
      // Add the value to our options.
      options.y = y;
    }
    if (relative !== null && relative !== undefined) {
      // Add the value to our options.
      options.relative = relative;
    }

    // Merge in our defaults.
    var defaults = {
      relative: true
    }
    var options = $.extend(defaults, options);
    return $(this).position(options);
  }

  /********************
   * Helper functions.
   ********************/

  $.fn.getposxy = function(_which, _reset) {
    // Get the stored value.
    var pos = $(this).data(GAMEQUERY_NAMESPACE + _which);
    if (pos === null || pos === undefined || _reset) {
      // If there is currently no stored value, or we've been told to reset it,
      // then set the actual position from the element's DOM.
      pos = parseInt($(this).css(GAMEQUERY_XY_ATTRIBUTES[_which]));
      $(this).data(GAMEQUERY_NAMESPACE + _which, pos);
    }
    return pos;
  }

  $.fn.setposxy = function(_which, pos) {
    var _currentPos = $(this).getposxy(_which);
    if (pos != _currentPos) {
      $(this).data(GAMEQUERY_NAMESPACE + 'prev' + _which, _currentPos);
      $(this).data(GAMEQUERY_NAMESPACE + _which, pos);
      $(this).css(GAMEQUERY_XY_ATTRIBUTES[_which], '' + pos + 'px');
    }
    return pos;
  }

  /**
   * This will set or return the sprite's horizontal or vertical position.
   *
   * Note that this is a helper function for .x() and .y(), which are generally
   * easier to call than this directly.
   *
   * @param string _which
   *  This must be either 'x' or 'y', corresponding to the appropriate
   *  property to modify or retrieve.
   * @param mixed options
   *  (Optional) If not provided, then we simply return the current position.
   *  Otherwise, it is used to specify the value to set, according to the type:
   *    Object: The x or y value as appropriate will be used, along with the
   *      relative property of the object.
   *    Function: The return value of the function will be used.
   *    Other: The value will be used directly.
   * @param boolean relative
   *  (Optional) If provided, this will override the relative value of options.
   *  In either case, this determines whether to add the value to the current
   *  position if false, or to set the position to the value (default).
   *
   *  Examples:
   *    _y = $('#sprite-65').posxy('y');
   *    $('#sprite-33').posxy('x', {x: 45});
   *    _x = $('#sprite-99').posxy('x', '120');
   *    $('.robot').each().posxy('x', {x: $(this).data('hspeed'), relative: true});
   *    $('.bouncy').each()
   *      .posxy('y', function() { return $(this).data('vspeed')/2; }, true);
   */
  $.fn.posxy = function(_which, options, relative) {
    var currentPos = $(this).getposxy(_which);
    if (options === null || options === undefined) {
      // We simply need to return the original value.
      return currentPos;
    }

    if (typeof options != 'object') {
      // Convert the passed value to an object.
      var pos = options;
      options = {};
      options[_which] = pos;
    }

    // Add the optional second parameter.
    if (relative !== null && relative !== undefined) {
      // Add the value to our options.
      options.relative = relative;
    }

    // Merge in the defaults.
    var defaults = {
      relative: false
    }
    defaults[_which] = currentPos;

    var options = $.extend(defaults, options);

    // Call any functions passed as parameters.
    if (jQuery.isFunction(options[_which])) {
      options[_which] = options[_which].call();
    }
    if (jQuery.isFunction(options.relative)) {
      options.relative = options.relative.call();
    }

    // Allow for a relative assignment.
    if (options.relative) {
      options[_which] += currentPos;
    }

    return $(this).setposxy(_which, options[_which]);
  }

})(jQuery);
