/*! jquery.ganttChart 1.0.0
 * ©2018 Lionel Astol - https://github.com/E-SYSTEMES/jquery-ganttchart
 * Licensed under MIT (https://github.com/E-SYSTEMES/jquery-ganttchart/blob/master/LICENSE)
 */

/**
 * @summary      ganttChart
 * @description  display a gantt chart
 * @author       Lionel Astol
 * @version      1.0.0
 * @file         jquery.ganttChart.js
 * @contact      lionel@e-systemes.com
 * @repo         https://github.com/E-SYSTEMES/jquery.ganttChart/
 * @doc          https://e-systemes.github.io/
 */
 
(function($) {
  
  $.fn.ganttChart = function( options ) {

    // options
    var opts = $.extend( true, {}, $.fn.ganttChart.defaultOpts, options );
        
    try {
      
      if ( !opts.startDate && !opts.endDate ) {
        throw 'ganttChart startDate and endDate are undefined!';
      }
      else if ( !opts.startDate ) {
        throw 'ganttChart startDate is undefined!';
      }
      else if ( !opts.endDate ) {
        throw 'ganttChart endDate is undefined!';
      }
      
    }
    catch( e ) {
      
      console.error( e );
      return;
    }
    
    try {

      if ( Array.isArray( opts.events ) === false && opts.events.length === 0 ) {
        throw 'There is no events';
      }
      
    }
    catch( e ) {
      
      console.error( e );
      return;
    }
      
      
    // chart container
    var $this = $(this);
        
    // constant
    var DAYTIME = 864e5;

    // calculating days and events
    var daysLength   = Math.ceil( ( opts.endDate.getTime() - opts.startDate.getTime() + DAYTIME ) / DAYTIME ),
        eventsLength = opts.events.length;

    // calculating sizes
    var chartWidth = opts.tmpl.cell.width * daysLength,
        colWidth   = opts.tmpl.cell.width,
        colHeight  = opts.tmpl.cell.height * eventsLength,
        rowHeight  = opts.tmpl.cell.height;
        
    // Template Header
    var $header = $('<div class="Gantt-header"></div>'),
        $months = $('<div class="Gantt-months"></div>').css( { 'width' : chartWidth } ),
        $weeks  = $('<div class="Gantt-weeks"></div>').css( { 'width' : chartWidth } ),
        $dates  = $('<div class="Gantt-dates"></div>').css( { 'width' : chartWidth } ),
        $days   = $('<div class="Gantt-days"></div>').css( { 'width' : chartWidth } );
        
    // Template grid
    var $events = $('<div class="Gantt-events"></div>').css( { 'width' : chartWidth } ),
        $cols   = $('<div class="Gantt-cols"></div>'), 
        $rows   = $('<div class="Gantt-rows"></div>');

    // creating the header and the cols of the chart
    var  i = 0;
    
    var remainingMonthsWidth = chartWidth,
        remainingWeeksWidth = chartWidth;
        
    var today      = new Date(),
        todayDate  = today.getDate(),
        todayMonth = today.getMonth(),
        todayYear  = today.getFullYear();
    
    while ( i < daysLength ) {

      // define the header and grid elements
      var $month = $(opts.tmpl.month).addClass('Gantt-month'),
          $week  = $(opts.tmpl.week).addClass('Gantt-week'),
          $date  = $(opts.tmpl.date).addClass('Gantt-date'),
          $day   = $(opts.tmpl.day).addClass('Gantt-day'),
          $col   = $(opts.tmpl.col).addClass('Gantt-col');

      // calculating the current Date
      var current = new Date( opts.startDate.getTime() + ( DAYTIME * i ) );
      
      var currentDate     = current.getDate(),
          currentDay      = current.getDay(),
          currentMonth    = current.getMonth(),
          currentYear     = current.getFullYear(),
          currentWeek     =  new ImprovedDate ( current.getFullYear(), current.getMonth(), current.getDate() ).getWeek(),
          currentMoLength = new ImprovedDate ( current.getFullYear(), current.getMonth(), current.getDate() ).getMonthLength(),
          nwd             = new ImprovedDate ( current.getFullYear(), current.getMonth(), current.getDate() ).getNonWorkingDay(),
          currentWeLength = 7;

			var displayHeader = [];
			
      // adding every month to header 
      if( opts.tmpl.display.months === true ) {
        
        if ( currentDate === 1 || i === 0 ) {
          
          if ( currentDate !== 1 ) {
            
            currentMoLength = currentMoLength - currentDate + 1;
            
          }
          
          var monthWidth = Math.min ( colWidth * currentMoLength , remainingMonthsWidth ) ;
          
          $month
            .css( { 'width' : monthWidth } )
            .append( opts.lang.months[ currentMonth ] );
          
          $months.append( $month );
          
          remainingMonthsWidth -= colWidth * currentMoLength;
          
        }
        
        displayHeader.push( $months );
        
      }
      
      // adding every week to header 
      if( opts.tmpl.display.weeks === true ) {
        
        if ( currentDay === 1 || i === 0 ) {
          
          if ( currentDay !== 1 ) {
            
            currentWeLength =  7 - ( ( currentDay + 6 ) % 7 );
            
          }
  
          var weekWidth = Math.min ( colWidth * currentWeLength , remainingWeeksWidth ) ;
          
          $week
            .css( { 'width' : weekWidth } )
            .append( currentWeek );
          
          $weeks.append( $week );
  
          remainingWeeksWidth -= colWidth * currentWeLength;
          
        }
        
        displayHeader.push( $weeks );
        
      }
      
      // adding every date to header
      if( opts.tmpl.display.dates === true ) {
        
	      $date
	        .css( { 'width' : colWidth } )
	        .append( currentDate );
	
	      if ( currentDate === todayDate && currentMonth === todayMonth && currentYear === todayYear ) {
	        
	        $date.addClass('today');
	
	      }
	      
	      else if ( nwd === true ) { 
	        
	        $date.addClass('nwd');
	        
	      }
	
	      $dates.append( $date );
	      
	      displayHeader.push( $dates );
	      
      }
        
      // adding every day to header
      if( opts.tmpl.display.days === true ) {
        
        $day
          .css( { 'width' : colWidth } )
          .append( opts.lang.days[ currentDay ] );
          
        if ( currentDate === todayDate && currentMonth === todayMonth && currentYear === todayYear ) {
          
          $day.addClass('today');
  
        }
        
        else if ( nwd === true ) { 
          
          $day.addClass('nwd');
          
        }
          
        $days.append( $day );
        
        displayHeader.push( $days );
        
      }
      
      // adding every col
      $col.css( { 'width' : colWidth , 'height' : colHeight } );
      
      if ( currentDate === todayDate && currentMonth === todayMonth && currentYear === todayYear ) {
        
        $col.addClass('today');

      }
      
      else if ( nwd === true ) { 
        
        $col.addClass('nwd');
        
      }
          
      $cols.append( $col );
      
      i++;
      
    }
    
    // creating the rows of the chart
    i = 0;
        
    while ( i < eventsLength ) {
      
      var $row = $(opts.tmpl.row).addClass('Gantt-row');

      $row.css( { 'width' : chartWidth , 'height' : rowHeight } );
      
      $rows.append( $row );
      
      i++;
    }

    // append items to the header
    if ( displayHeader.length > 0 ) {
      
      displayHeader.forEach( function( item ) {
        
        $header.append( item );
        
      });
      
    }
    // no item in header
    else {
      
      $header = '';
    
    }
          
    // append cols and rows to the chart
    $events
      .append( $cols )
      .append( $rows );

    // creating the events
    if ( Array.isArray( opts.events ) === true && opts.events.length > 0 ) {
      
      i = 0;
      
      opts.events.forEach( function( item ) {
        try {
          
          if ( !item.startDate && !item.endDate ) {
            throw 'event [' + i + '] ' + item.title + ' startDate and endDate are undefined!';
          }
          else if ( !item.startDate ) {
            throw 'event [' + i + '] ' + item.title + ' startDate is undefined!';
          }
          else if ( !item.endDate ) {
            throw 'event [' + i + '] ' + item.title + ' endDate is undefined!';
          }
          
        }
        catch( e ) {
          
          console.warn( e );
          return;
        }
        
        var eventLength    = Math.ceil( ( item.endDate.getTime() - item.startDate.getTime() + DAYTIME ) / DAYTIME );
        
        var eventWidth  = eventLength * colWidth,
            eventHeight  = rowHeight - ( opts.tmpl.margin * 2 ),
            posleft      = Math.ceil( ( item.startDate.getTime() - opts.startDate.getTime() ) / DAYTIME ) * colWidth,
            posTop      = i * rowHeight + opts.tmpl.margin;
        
        var $event = $(opts.tmpl.event).addClass('Gantt-event').addClass(item.style);
        
        if( item.title === '') {
          item.title = 'The title is empty!';
        }
        
        if ( item.href ) {
          
          item.title = '<a href="' + item.href + '">' + item.title + '</a>';
          
        }
        
        $event
          .css( { width: eventWidth  , height: eventHeight , left: posleft , top: posTop , lineHeight: eventHeight + 'px' } )
          .append(item.title);
        
        $events.append( $event );
        
        i++;
        
      });

    }
    
    // drawing chart
    $this
      .addClass('Gantt-container')
      .append( $header )
      .append( $events );
    
  };

  // default options
  $.fn.ganttChart.defaultOpts = {
    startDate : undefined,
    endDate   : undefined,
    events    : [],
    lang      : {
                  months  : [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
                  days    : [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
                },
    tmpl      : {
							    display : {
							                months : true , 
							                weeks  : true , 
							                dates  : true , 
							                days   : true
							              },
                  cell    : { width: 20, height: 40 },
                  margin  : 5,
                  month   : '<div></div>',
                  week    : '<div></div>',
                  date    : '<div></div>',
                  day     : '<div></div>',
                  col     : '<div></div>',
                  row     : '<div></div>',
                  event   : '<div></div>'
                }
  };
  
} )( jQuery );