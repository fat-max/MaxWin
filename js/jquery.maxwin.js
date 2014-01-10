(function($){
  $.fn.maxwin = function(options) {
    
    var position = {
      height: null,
      width: null,
      top: null,
      left: null
    };
    
    var settings = $.extend({}, $.fn.maxwin.defaults, options)

    var maxWin = $('<div class="mw" />')
            .attr(settings.wrapperAttrs)
            .css(settings.wrapperCSS)
            .mousedown(putOnTop);
    
    setPosition({
      left:($(document).width()-maxWin.width())/2,
      top:($(document).height()-maxWin.height())/2
    });

    // set title
    var title = $('<span class="mw-title" />')
            .text(settings.title);
    
    // action-bar
    var actionBar = $('<span class="mw-action-bar" />');
    
    if(settings.actionBar.minimize) {
      $('<i class="mv-minimize">_</i>').mouseup(function() {
        var tmpPos = {};
        if(!$(this).hasClass('mw-min')) {
          position = getPosition();
          if(settings.stackMinimized) {
            toggleBraggable('disable');
            tmpPos.top = $(document).height()-22;
            tmpPos.left = 20;
            tmpPos.width = 150;
          }
          tmpPos.height = 22;
          setPosition(tmpPos);
          $(this).addClass('mw-min');
        } else {
          if(settings.stackMinimized) {
            setPosition(position);
            toggleBraggable("enable");
          } else {
            setPosition({
              height: position.height+'px'
            });
          }
          $(this).removeClass('mw-min');
        }
      }).appendTo(actionBar);
    }
    
    if(settings.actionBar.maximize) {
      $('<i class="mv-maximize">O</i>').mouseup(function() {
        if(!$(this).hasClass('mv-fullscreen')) {
          toggleBraggable("disable");
          position = getPosition();
          setPosition({
            top: 0,
            left: 0,
            height: '100%',
            width: '100%'
          });
          $(this).text('oO').addClass('mv-fullscreen');
        } else {
          toggleBraggable("enable");
          setPosition(position);
          $(this).text('O').removeClass('mv-fullscreen');
        }
      }).appendTo(actionBar);
    }
    
    if(settings.actionBar.close) {
      $('<i class="mv-close">X</i>').mouseup(function() {
        maxWin.remove();
      }).appendTo(actionBar);
    }
    
    // add header
    var header = $('<div class="mw-header" />')
            .append(title)
            .append(actionBar);
    
    // content
    var content = $('<div class="mw-content" />');

    if(settings.url.length) {
      content.load(settings.url);
    }
    if(settings.draggable) {
      maxWin.draggable({handle: '.mw-header', containment: "html", scroll: false});
    }
    maxWin.append(header)
            .append(content)
            .appendTo('body');
    putOnTop();
    if($.isFunction(settings.complete)) {
      settings.complete.call(maxWin);
    }
    
    
    function putOnTop() {
      var elements = document.getElementsByTagName("*");
      var highest_index = 0;
      for (var i = 0; i < elements.length - 1; i++) {
        if (parseInt(elements[i].style.zIndex) > highest_index) {        
          highest_index = parseInt(elements[i].style.zIndex);
        }
      }
      var obj = $(this).hasClass('mv')?$(this):maxWin;
      obj.css('z-index', highest_index + 1);
    }
    
    function setPosition(arr) {
      maxWin.css(arr);
    }
    function getPosition() {
      var pos = maxWin.position();

      return {
        height: maxWin.height(),
        width: maxWin.width(),
        top: pos.top,
        left: pos.left
      };
    }
    
    function toggleBraggable(action) {
      action = action?action:settings.draggable?'enable':'disable';
      if(settings.draggable)
        maxWin.draggable(action);
    }
    
    
    return window;
  };




  // Dafault options
  $.fn.maxwin.defaults = {
    url: '',
    title: '',
    wrapperCSS: {},
    wrapperAttrs: {
      id: "win-"
    },
    actionBar: {
      close: true,
      maximize: true,
      minimize: true
    },
    modal: false,
    fullscreen: false,
    draggable: true,
    stackMinimized: true,
  };
})(jQuery);