package com.api.backend.controller;



import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.backend.model.CalificarRequest;
import com.api.backend.model.DisponibilidadRequest;
import com.api.backend.model.ReservarRequest;
import com.api.backend.model.User;
import com.api.backend.model.UserResponse;
import com.api.backend.service.RecursoService;
import com.api.backend.service.ReservaService;
import com.api.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    
    private final UserService userService;
    private final RecursoService recursoService;
    private final ReservaService reservaService;

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable("id") Long id){
        return userService.getUser(id);
    }

    @PostMapping("/disponibilidad")
    public boolean getDisponibilidad(@RequestBody DisponibilidadRequest request){
        return recursoService.consultarDisponibilidad(request);
    }

    @PostMapping("/reservar")
    public boolean reservarRecurso(@RequestBody ReservarRequest request){
        if(recursoService.consultarDisponibilidad(new DisponibilidadRequest(request.getDia(), request.getHoraInicio(), request.getHoraFinal(), request.getIdRecurso()))){
            if(reservaService.reservarRecurso(request)){
                recursoService.deleteDisponibilidad(request.getIdRecurso(), request.getDia(), request.getHoraInicio(), request.getHoraFinal());
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    @GetMapping("/cancelar/{id}")
    public String cancelarReserva(@PathVariable("id") String idReserva, Authentication auth){
        User user = (User) auth.getPrincipal();
        return reservaService.cancelarReserva(idReserva, user.getKIdusuario());
    }

    @PostMapping("/calificar")
    public String calificarReserva(@RequestBody CalificarRequest calificacion, Authentication auth){
        User user = (User) auth.getPrincipal();
        return reservaService.calificarReserva(calificacion.getIdReserva(), calificacion.getCalificacion(), user.getKIdusuario());
    }
}
