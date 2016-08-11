var jugadores = ['x','o'];
var indiceJugadorActual;
var jugadorActual = function(){
  return jugadores[indiceJugadorActual];
};
var siguienteJugador = function(){
  controlarGanador();

  if(indiceJugadorActual<1){
    indiceJugadorActual++;
  }else{
    indiceJugadorActual = 0;
  }
  $('#titulo').html(mensajeTurno(jugadorActual()));
};

var mensajeTurno = function(jugador){
  return 'Turno de <b class="turno">' + jugador + '</b>';
};

var controlarGanador = function(){
  // Control de filas
  var hayGanador = false;
  $('table.tateti tr').each(function(){
    hayGanador = hayGanador || $(this).find('[data-jugador='+jugadorActual()+']').length == 3;
  });

  if(!hayGanador){
    // Control de columnas
    for(var i=1;i<=3;i++){
      hayGanador = hayGanador || $('table.tateti td[data-columna='+i+'][data-jugador='+jugadorActual()+']').length == 3;
    }
  }

  if(!hayGanador){
    // Control de diagonal principal
    var contador = 0;
    for(var i=1;i<=3;i++){
      contador += $('table.tateti tr[data-fila='+i+'] td[data-columna='+i+'][data-jugador='+jugadorActual()+']').length;
    }
    hayGanador = contador==3;
  }

  var casillasJugadas = $('[data-jugador]').length;
  if(hayGanador){
    $('table.tateti').find('td').unbind();
    alert('¡' + jugadorActual().toUpperCase() + ' ha ganado con '
      + casillasJugadas + ' casillas jugadas!');
  }else if(casillasJugadas==9){
    alert('¡Ha sido un empate!')
  }
}

var jugar = function(){
  indiceJugadorActual = -1;
  $('#contenedor').empty();
  var tablero = $('#tablero-ejemplo').clone();
  tablero.removeAttr('id');
  tablero.appendTo('#contenedor');
  tablero.hide();
  tablero.removeClass('hidden');
  tablero.slideDown('fast',function(){
    $(window).trigger('resize');
  });
  $('[data-jugar]').html('Empezar de nuevo');
  siguienteJugador();

  tablero.find('td').click(function(){
    var celda = $(this);
    if(celda.is('[data-jugador]')){
      return;
    }
    celda.attr('data-jugador',jugadorActual());
    celda.html(jugadorActual());
    siguienteJugador();
  });
};

$(document).ready(function(){

  // Tablero Responsive
  $(window).on('resize',function(){
    $('table.tateti td').each(function(){
      $(this).removeAttr('style');
      var ancho = $('#contenedor').width() / 3;
      var alto = ancho;
      $(this).css({
        width: ancho,
        height: alto
      });
    });
  });

  // Damos acciones a los botones que tienen el atributo data-jugar
  $('[data-jugar]').click(jugar);

});
