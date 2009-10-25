(function($) {
  //
  // jQuery tooltip definition
  //
  $.fn.tooltip = function(options) {
    debug(options);

    var opts = $.extend({}, $.fn.tooltip.defaults, options);

    // Iterate over each matched element
    return this.each(function() {
      $this = $(this);
      $tooltip = $(options);
      
      // Mouse enter
      $this.bind('mouseenter.tooltip', function(e) {
        $this = $(this);

        debug('over: ' + e.pageY + e.pageX);

        setTimer();

        return false;
      });

      // Mouse leave
      $this.bind('mouseleave.tooltip', function(e) {
        $this = $(this);

        debug('out: ' + e.pageY + ':' + e.pageX);

        stopTimer();

        hide($this, $tooltip, e);

        return false;
      });

      // build element specific options
      var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

      // update element styles
      $this.css({
        backgroundColor: o.background,
        color: o.foreground
      });

      var markup = $this.html();

      // call our format function
      markup = $.fn.tooltip.format(markup);
      $this.html(markup);
    });

    //
    // Show tooltip
    //
    function show(e) {
      position($this, $tooltip, e);
      $tooltip.remove().appendTo($this); // Avoid unwanted mouseleave
      $tooltip.show();
    };

    //
    // Hide tooltip
    //
    function hide() {
      $tooltip.hide();
    };

    //
    // Start tooltip timer countdown
    //
    function setTimer() {  
      $this.timer = setTimeout(show, options.delay);  
    }  

    //
    // Stops tooltip timer from executing
    //
    function stopTimer() {  
      clearTimeout($this.timer);  
    }  

    //
    // Position tooltip
    //
    function position(element, tooltip, e) {
      var point = null;

      switch (opts.anchor) {
      case 'cursor':
        point = { x: e.pageX, y: e.pageY}
        point = offset_from_cursor(point, element, tooltip, e);
        break;
      case 'element':
        var left = element.position().left;
        var top = element.position().top;

        point = { x: left, y: top}
        point = offset_from_element(point, element, tooltip, e);
        break;
      default:
        throw "Invalid anchor '" + opts.anchor + "'";
      }

      tooltip.css({
        position: 'absolute',
        top:      point.y,
        left:     point.x 
      });

      tooltip.animate({"top": "+=20px", "opacity": "toggle"}, options.speed);  
    };

    //
    // Calculate offset from cursor
    //
    function offset_from_cursor(point, element, tooltip, e) {
      switch (opts.position) {
      case 'topleft':
        point = { x: point.x - 10, y: point.y + 10}
        break;
      case 'topright':
        point = { x: point.x + 10, y: point.y + 10}
        break;
      case 'bottomleft':
        point = { x: point.x - 10, y: point.y - 10}
        break;
      case 'bottomright':
        point = { x: point.x + 10, y: point.y - 10}
        break;
      default:
        throw "Invalid anchor '" + opts.anchor + "'";
      }
      return point;
    };

    //
    // Calculate offset from element
    //
    function offset_from_element(point, element, tooltip, e) {
      switch (opts.position) {
      case 'topleft':
        point = { x: point.x, y: point.y}

        point.x = point.x -10 - tooltip.width();
        point.y = point.y -10 - tooltip.height();
        
        break;
      case 'topright':
        point = { x: point.x + 10, y: point.y + 10}
        break;
      case 'bottomleft':
        point = { x: point.x - 10, y: point.y - 10}
        break;
      case 'bottomright':
        point = { x: point.x + 10, y: point.y - 10}
        break;
      default:
        throw "Invalid anchor '" + opts.anchor + "'";
      }
      return point;
    };
  };

  //
  // private function for printing messages to the console.
  //
  function debug(message) {
    if (window.console && window.console.log) {
      window.console.log(message);
    }
  };

  //
  // private function for writing an object to the console.
  //
  function dir(message) {
    if (window.console && window.console.dir) {
      window.console.dir(message);
    }
  };

  //
  // define and expose our format function
  //
  $.fn.tooltip.format = function(txt) {
    return '<strong>' + txt + '</strong>';
  };

  //
  // plugin defaults
  //
  $.fn.tooltip.defaults = {
    anchor:     'element',  // anchor, element
    position:   'topleft',  // topleft, topright, bottomleft, bottomright
    foreground: 'red',
    background: 'yellow',
    delay:       100,
    speed:       100
  };

})(jQuery);
