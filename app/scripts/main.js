$(function () {
  window.clicks = 0;

  var $iframe = $('iframe'),
      $finishBtn = $('#finish-task-btn');

  var clickOnIframe = function () {
    window.clicks++;
  }
  
  $iframe.load(function () {
    $(this).contents().find('body')
      .on('click', function () { 
        clickOnIframe()
      });
  });
  
  var groups = [{
      'name': 'Comunes',
      'tasks': [{
        'name': 'Login',
        'timeExpected': 15,
        'btn': 'login'
      }]
    }, {
      'name': 'Administrador',
      'tasks': [{
        'name': 'Crear colegio',
          'timeExpected': 25,
          'btn': '#_819'
        }, {
          'name': 'Editar colegio',
          'timeExpected': 25,
          'btn': '#_819'
        }, {
          'name': 'Crear Clase',
          'timeExpected': 25,
          'btn': '#_819'
        }, {
          'name': 'Eliminar Clase',
          'timeExpected': 30,
          'btn': '#_819'
        }, {
          'name': 'Invitar Profesor',
          'timeExpected': 20,
          'btn': '#_819'
        }, {
          'name': 'Eliminar Profesor',
          'timeExpected': 20,
          'btn': '#_819'
        }, {
          'name': 'Invitar Alumno',
          'timeExpected': 20,
          'btn': '#_819'
        }, {
          'name': 'Eliminar Alumno',
          'timeExpected': 30,
          'btn': '#_819'
      }]
    }, {
      'name': 'Profesor',
      'tasks': [{
          'name': 'Invitar Alumno',
          'timeExpected': 25,
          'btn': '#_820'
        }, {
          'name': 'Eliminar Alumno',
          'timeExpected': 25,
          'btn': '#_820'
        }, {
          'name': 'Editar Clase',
          'timeExpected': 25,
          'btn': '#_820'
        }, {
          'name': 'Gestionar Alumnos de Clase',
          'timeExpected': 35,
          'btn': '#_820'
        }, {
          'name': 'Gestionar Contenido de Clase',
          'timeExpected': 35,
          'btn': '#_820'
        }, {
          'name': 'Crear Competencia',
          'timeExpected': 15,
          'btn': '#_820'
        }, {
          'name': 'Editar Competencia',
          'timeExpected': 15,
          'btn': '#_820'
        }, {
          'name': 'Eliminar Contenido',
          'timeExpected': 25,
          'btn': '#_820'
        }, {
          'name': 'Ver Contenido',
          'timeExpected': 15,
          'btn': '#_820'
      }]
    }, {
      'name': 'Alumno',
      'tasks': [{
          'name': 'Ver Contenido',
          'timeExpected': 15,
          'btn': '#_821'
      }]
    }
  ];
  window.groups = groups;

  var loadTask = function (task) {
    var frameSrc = location.href.replace('index.html', '');
    frameSrc += 'ninja/index.html';
    
    if (task.btn === 'login') {
      $iframe
        .addClass('invisible')
        .attr({src: frameSrc})
        .one('load', function () {
          $(this).contents().find('body').find('iframe').one('load', function () {
            var that = this;
            setTimeout(function () {
              var currentSrc = this.frames[0].frames[0].location.href;
              console.log(currentSrc);
              this.frames[0].frames[0].location.href = 'http://localhost:9000/ninja/pages/6a057175-8c4b-d977-cd25-1d98396e3a4b.html';
              //currentSrc = currentSrc.replace = 'pages/6a057175-8c4b-d977-cd25-1d98396e3a4b.html'
              //location.href = 'pages/6a057175-8c4b-d977-cd25-1d98396e3a4b.html';
              $iframe.removeClass('invisible');
              initTask(task);
            }, 1000);
          });
        });
    } else {
      $iframe
        .addClass('invisible')
        .attr({src: frameSrc})
        .one('load', function () {
          $(this).contents().find('body').find('iframe').one('load', function () {
            var $btn = $(this).contents().find(task.btn);

            setTimeout(function () {
              $btn.click();
              $iframe.removeClass('invisible');
              initTask(task);
            }, 1000);
          });
        });
    }
  };

  var initTask = function (task) {
    var finishTime,
        initTime = (new Date()).getTime(),
        totalTime,
        clicks = 0;

    task.current = true;
    drawIndex();

    $finishBtn
      .removeClass('hidden')
      .one('click', function () {
        $(this).addClass('hidden');
        clicks = window.clicks;
        window.clicks = 0;
        finishTime = (new Date()).getTime();
        totalTime = parseInt((finishTime - initTime) / 1000, 10);
        task.clicks = clicks;
        task.time = totalTime;
        task.completed = true;
        task.current = false;
        task.passed = task.time <= task.timeExpected;
        drawIndex();
        if (checkAllTasksFinish()) {
          $('#final-report-btn').removeAttr('disabled');
        }
      });
  };

  var checkAllTasksFinish = function () {
    var group, allFinish = true;
    var i = groups.length;
    while (i--) {
      group = groups[i];
      allFinish = group.tasks.every(function (task) {
        return !!task.completed;
      });
    }
    return allFinish;
  }

  var drawFinalReport = function () {
    var source   = $('#final-template').html();
    var template = Handlebars.compile(source);
    $('#workspace').html(template({ groups: groups }));
  };

  $(document)
    .on('click', '.js-task', function () {
      var boundData = Handlebars.getBoundData(this);
      loadTask(boundData);
    })
    .on('click', '#final-report-btn', function () {
      debugger;
      if ($(this).is('[disabled]')) return;
      drawFinalReport();
    });

  var id = 0, cache = [];
  Handlebars.registerHelper('bindData', function (data) {
    var dataKey = id++;
    cache[dataKey] = data;

    return 'data-handlebar-id=' + dataKey;
  });

  Handlebars.getBoundData = function(handlebarId) {
    if (typeof(handlebarId) !== "string") {
      // If a string was not passed in, it is the html element, so grab it's id.
      handlebarId = handlebarId.getAttribute("data-handlebar-id");
    }

    return cache[handlebarId];
  };

  Handlebars.registerPartial('group', $('#group-partial').html());
  Handlebars.registerPartial('task', $('#task-partial').html());

  var drawIndex = function () {
    var source   = $('#sb-template').html();
    var template = Handlebars.compile(source);
    $('#sidebar').html(template({ groups: groups }));
  }

  drawIndex();

});
