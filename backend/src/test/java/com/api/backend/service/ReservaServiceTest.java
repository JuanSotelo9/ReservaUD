package com.api.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.api.backend.exception.BusinessException;
import com.api.backend.exception.UnauthorizedException;
import com.api.backend.model.Reserva;
import com.api.backend.repository.ReservaRepository;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private RecursoService recursoService;

    @InjectMocks
    private ReservaService reservaService;

    private Reserva reservaFutura(LocalDateTime inicio, LocalDateTime fin) {
        Reserva reserva = new Reserva();
        reserva.setKIdreserva("R-TEST");
        reserva.setNEstadoreserva("reservado");
        reserva.setKIdusuario(2L);
        reserva.setKIdrecurso(1);
        reserva.setFFechareserva(inicio.toLocalDate());
        reserva.setFHorainicioreserva(inicio.toLocalTime());
        reserva.setFHorafinalreserva(fin.toLocalTime());
        return reserva;
    }

    @Test
    void cancelarReservaConDosHorasExactasDeAntelacionCancelaYRestauraTodosLosSlots() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime inicio = now.plusHours(2);
        LocalDateTime fin = inicio.plusHours(1);
        Reserva reserva = reservaFutura(inicio, fin);

        when(reservaRepository.findById("R-TEST")).thenReturn(Optional.of(reserva));

        String resultado = reservaService.cancelarReserva("R-TEST", 2L);

        assertThat(resultado).isEqualTo("cancelado");
        assertThat(reserva.getNEstadoreserva()).isEqualTo("cancelado");
        verify(reservaRepository).save(reserva);
        // Se restaura la franja horaria COMPLETA (inicio y fin), no solo 1 slot
        verify(recursoService).restaurarDisponibilidad(
                1, inicio.toLocalDate(), inicio.toLocalTime(), fin.toLocalTime());
    }

    @Test
    void cancelarReservaConMenosDeDosHorasDeAntelacionLanzaBusinessException() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime inicio = now.plusHours(1);
        LocalDateTime fin = inicio.plusHours(1);
        Reserva reserva = reservaFutura(inicio, fin);

        when(reservaRepository.findById("R-TEST")).thenReturn(Optional.of(reserva));

        assertThatThrownBy(() -> reservaService.cancelarReserva("R-TEST", 2L))
                .isInstanceOf(BusinessException.class)
                .hasMessage("fuera de plazo");
    }

    @Test
    void cancelarReservaDeOtroUsuarioLanzaUnauthorized() {
        Reserva reserva = reservaFutura(LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(1).plusHours(1));

        when(reservaRepository.findById("R-TEST")).thenReturn(Optional.of(reserva));

        assertThatThrownBy(() -> reservaService.cancelarReserva("R-TEST", 99L))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessage("no autorizado");
    }

    @Test
    void noSePuedeCalificarUnaReservaNoFinalizada() {
        Reserva reserva = new Reserva();
        reserva.setKIdreserva("R-1");
        reserva.setNEstadoreserva("reservado");
        reserva.setKIdusuario(2L);
        reserva.setNCalificacion(0);

        when(reservaRepository.findById("R-1")).thenReturn(Optional.of(reserva));

        assertThatThrownBy(() -> reservaService.calificarReserva("R-1", 5, 2L))
                .isInstanceOf(BusinessException.class)
                .hasMessage("reserva no ha finalizado");
    }

    @Test
    void calificarReservaFinalizadaSinCalificarDevuelveCalificado() {
        Reserva reserva = new Reserva();
        reserva.setKIdreserva("R-2");
        reserva.setNEstadoreserva("finalizado");
        reserva.setKIdusuario(2L);
        reserva.setNCalificacion(0);

        when(reservaRepository.findById("R-2")).thenReturn(Optional.of(reserva));

        String resultado = reservaService.calificarReserva("R-2", 5, 2L);

        assertThat(resultado).isEqualTo("calificado");
        assertThat(reserva.getNCalificacion()).isEqualTo(5);
        verify(reservaRepository).save(reserva);
    }
}
