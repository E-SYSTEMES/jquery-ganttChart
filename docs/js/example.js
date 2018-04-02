/*! jquery.ganttChart 1.0.0
 * ©2018 Lionel Astol - https://github.com/E-SYSTEMES/jquery-ganttchart
 * Licensed under MIT (https://github.com/E-SYSTEMES/jquery-ganttchart/blob/master/LICENSE)
 */

/**
 * @summary      ganttChart
 * @description  demo
 * @author       Lionel Astol
 * @version      1.0.0
 * @file         example.js
 * @contact      lionel@e-systemes.com
 * @repo         https://github.com/E-SYSTEMES/jquery.ganttChart/
 * @doc          https://e-systemes.github.io/
 */
 
$('#demo').ganttChart ( {
  startDate: new Date( new Date().getTime() - 15*86400000 ),
  endDate: new Date( new Date().getTime() + 45*86400000 ),
  events: [ {
    startDate : new Date( new Date().getTime() - 2*86400000 ),
    endDate   : new Date( new Date().getTime() + 4*86400000 ),
    title     :  'event 1',
    href      :  'https://www.e-systemes.com',
    style     : ''
  },
  {
    startDate : new Date( new Date().getTime() - 4*86400000 ),
    endDate   : new Date( new Date().getTime() + 2*86400000 ),
    title     :  'event 2',
    href      :  'https://www.e-systemes.com',
    style     : ''
  } ],
  tmpl: {
    month : '<div class="example-month"></div>',
    week  : '<div class="example-week">W</div>',
    date  : '<div class="example-date"></div>',
    day   : '<div class="example-day"></div>',
    col   : '<div class="example-col"></div>',
    row   : '<div class="example-row"></div>',
    event : '<div class="example-event"></div>'
  }
} );
