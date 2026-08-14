package com.api.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.backend.dto.request.CalificarRequest;
import com.api.backend.dto.request.DisponibilidadRequest;
import com.api.backend.dto.request.ReservaRequest;
import com.api.backend.exception.BusinessException;
import com.api.backend.model.User;
import com.api.backend.service.RecursoService;
import com.api.backend.service.ReservaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reservas")
public class ReservaController {

    private final ReservaService reservaService;
    private final RecursoService recursoService;

    @PostMapping
    public boolean reservarRecurso(@RequestBody ReservaRequest request, Authentication auth){
        User user = (User) auth.getPrincipal();
        ReservaRequest requestAutenticado = new ReservaRequest(
            request.horaInicio(), request.horaFinal(), request.dia(), user.getKIdusuario(), request.idRecurso());
        if(!recursoService.consultarDisponibilidad(new DisponibilidadRequest(requestAutenticado.dia(), requestAutenticado.horaInicio(), requestAutenticado.horaFinal(), requestAutenticado.idRecurso()))){
            throw new BusinessException("recurso no disponible");
        }
        reservaService.reservarRecurso(requestAutenticado);
        recursoService.deleteDisponibilidad(requestAutenticado.idRecurso(), requestAutenticado.dia(), requestAutenticado.horaInicio(), requestAutenticado.horaFinal());
        return true;
    }

    @PatchMapping("/{id}/cancelar")
    public String cancelarReserva(@PathVariable("id") String idReserva, Authentication auth){
        User user = (User) auth.getPrincipal();
        return reservaService.cancelarReserva(idReserva, user.getKIdusuario());
    }

    @PatchMapping("/{id}/calificar")
    public String calificarReserva(@PathVariable("id") String idReserva, @RequestBody CalificarRequest calificacion, Authentication auth){
        User user = (User) auth.getPrincipal();
        return reservaService.calificarReserva(idReserva, calificacion.calificacion(), user.getKIdusuario());
    }
}
