/**
 * --------------------------------------------------------------------
 * jQuery filebutton plugin
 * Author: Micah Woods, micahwoods@gmail.com
 *  heavily based on jQuery fileinput
 *    by Scott Jehl, scott@filamentgroup.com
 * Copyright (c) 2011 licensed under MIT
 * --------------------------------------------------------------------
 */

(function($){

  var settings = {
    'text': 'No file selected...'
  };

/* This plugin allows the creation of a button for files, instead of a
 * <input type='file' />.  Inputs are difficult to style in older browsers
 * and security 'features' of non-html5 browsers prevent access to the
 * file system except through file inputs.  Because of these limitations
 * filebutton was born.  Filebutton floats an input under the
 * cursor.  If the input is styled properly (hidden and overflow:none;)
 * then a user will actually click a button without knowing it.
*/
  $.fn.filebutton = function( options ){

    // If options exist, merge them with settings
    if (options) $.extend(settings, options);

    return $(this).each(function(){
      //apply events and styles for file input element
      var $this = $(this);

      $this.addClass('filebutton-input'); //add class for CSS

      $this.mouseover(function(){
        $upload.addClass('filebutton-hover');
      });

      $this.mouseout(function(){
        $upload.removeClass('filebutton-hover');
      });

      $this.focus(function(){
        $upload.addClass('filebutton-focus');
        $this.data('val', $this.val());
      });

      $this.blur(function(){
        $upload.removeClass('filebutton-focus');
        $(this).trigger('checkChange');
      });

      $this.bind('disable',function(){
        $this.attr('disabled',true);
        $upload.addClass('filebutton-disabled');
      });

      $this.bind('enable',function(){
        $this.removeAttr('disabled');
        $upload.removeClass('filebutton-disabled');
      });

      $this.bind('checkChange', function(){
        if($this.val() && $this.val() != $this.data('val')){
          $this.trigger('change');
        }
      });

      $this.bind('change',function(){
        //get file name
        var fileName = $(this).val().split(/\\/).pop();
        //update the feedback
        $uploadFeedback
          .text(fileName) //set feedback text to filename
          .addClass('filebutton-feedback-populated'); //add class to show populated state

        $upload.addClass('filebutton-populated');
      });

      $this.click(function() { //for IE and Opera, make sure change fires after choosing a file, using an async callback
        $this.data('val', $this.val());
        setTimeout(function(){
          $this.trigger('checkChange');
        },100);
      });

      //create custom control container
      var $upload = $('<div class="filebutton"></div>');
      //create custom control feedback
      var $uploadFeedback = $('<span class="filebutton-feedback" aria-hidden="true">' + settings['text'] +'</span>').appendTo($upload);

      //match disabled state
      if($this.is('[disabled]')){
        $this.trigger('disable');
      }

      //on mousemove, keep file input under the cursor to steal click
      $upload.mousemove(function(e){
        $this.css({
          'left': e.pageX - $upload.offset().left - $this.outerWidth() + 20, //position right side 20px right of cursor X)
          'top': e.pageY - $upload.offset().top /*- $(window).scrollTop()*/ - 3
        });
      });

      $upload.insertAfter($this); //insert after the input

      $this.appendTo($upload);

    });
  };
})(jQuery);
