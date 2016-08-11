/*globals $:false */

(function() {

  'use strict';

  var jugadores = ['x', 'o'];
  var indiceJugadorActual;

  var jugadorActual = function(){
    return jugadores[indiceJugadorActual];
  };


  var mensajeTurno = function(jugador){
    return 'Turno de <b class="turno">' + jugador + '</b>';
  };

  var mensajeModal = function(mensaje){
    $('#modal-mensajes').find('[data-mensaje]').html(mensaje);
    $('#modal-mensajes').modal('show');
  };

  var controlarGanador = function(){
    // Control de filas
    var hayGanador = false;
    $('table.tateti tr').each(function(){
      hayGanador = hayGanador || $(this).find('[data-jugador=' + jugadorActual() + ']').length === 3;
    });

    if(!hayGanador){
      // Control de columnas
      for(var i = 1; i <= 3; i++){
        hayGanador = hayGanador || $('table.tateti td[data-columna=' + i + '][data-jugador=' + jugadorActual() + ']').length === 3;
      }
    }

    if(!hayGanador){
      // Control de diagonal principal
      var matrizPrincipalMarcada = 0;
      for(var j = 1; j <= 3; j++){
        matrizPrincipalMarcada += $('table.tateti tr[data-fila=' + j + '] td[data-columna=' + j + '][data-jugador=' + jugadorActual() + ']').length;
      }
      hayGanador = matrizPrincipalMarcada === 3;
    }

    if(!hayGanador){
      // Control de diagonal secundaria
      var matrizInvertidaMarcada = 0;
      for(var k = 1; k <= 3; k++){
        matrizInvertidaMarcada += $('table.tateti tr[data-fila=' + k + '] td[data-columna=' + (4 - k) + '][data-jugador=' + jugadorActual() + ']').length;
      }
      hayGanador = matrizInvertidaMarcada === 3;
    }

    var casillasJugadas = $('[data-jugador]').length;
    if(hayGanador){
      $('table.tateti').find('td').unbind();
      mensajeModal('¡' + jugadorActual().toUpperCase() + ' ha ganado con '
        + casillasJugadas + ' casillas jugadas!');
      $('#titulo').html('Ganó ' + jugadorActual().toUpperCase());
    }else if(casillasJugadas === 9){
      mensajeModal('¡Ha sido un empate!');
      $('#titulo').html('Empate :-|');
      hayGanador = true;
    }

    return hayGanador;
  };

  var siguienteJugador = function(){
    if(controlarGanador()){
      return;
    }

    if(indiceJugadorActual < 1){
      indiceJugadorActual++;
    }else{
      indiceJugadorActual = 0;
    }

    $('#titulo').html(mensajeTurno(jugadorActual()));
  };

  var jugar = function(){
    indiceJugadorActual = -1;
    $('#contenedor').empty();
    var tablero = $('#tablero-ejemplo').clone();
    tablero.removeAttr('id');
    tablero.appendTo('#contenedor');
    tablero.hide();
    tablero.removeClass('hidden');
    tablero.slideDown('fast', function(){
      $(window).trigger('resize');
    });
    $('[data-jugar]').html('Empezar de nuevo');
    siguienteJugador();

    tablero.find('td').click(function(){
      var celda = $(this);
      if(celda.is('[data-jugador]')){
        return;
      }
      celda.attr('data-jugador', jugadorActual());
      celda.html(jugadorActual());
      siguienteJugador();
    });
  };

  $(document).ready(function(){

    // Tablero Responsive
    $(window).on('resize', function(){
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

}());
