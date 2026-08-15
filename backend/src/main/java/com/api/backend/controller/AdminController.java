package com.api.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.api.backend.dto.request.DisponibilidadRequest;
import com.api.backend.dto.request.RecursoRequest;
import com.api.backend.dto.request.TipoRecursoRequest;
import com.api.backend.dto.response.DashboardResponse;
import com.api.backend.dto.response.DisponibilidadResponse;
import com.api.backend.dto.response.RecursoResponse;
import com.api.backend.dto.response.ReservaResponse;
import com.api.backend.dto.response.TipoRecursoResponse;
import com.api.backend.service.AdminService;
import com.api.backend.service.RecursoService;
import com.api.backend.service.ReservaService;
import com.api.backend.service.TipoRecursoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final RecursoService recursoService;
    private final TipoRecursoService tipoRecursoService;
    private final ReservaService reservaService;

    @GetMapping("/dashboard")
    public DashboardResponse getDashboard(){
        return adminService.getDashboard();
    }

    /* ---------------- RECURSOS ---------------- */

    @GetMapping("/recursos")
    public Page<RecursoResponse> getRecursos(Pageable pageable){
        return recursoService.getRecursos(null, null, null, pageable);
    }

    @PostMapping("/recursos")
    @ResponseStatus(HttpStatus.CREATED)
    public RecursoResponse crearRecurso(@RequestBody RecursoRequest request){
        return recursoService.crearRecurso(request);
    }

    @PutMapping("/recursos/{id}")
    public RecursoResponse actualizarRecurso(@PathVariable int id, @RequestBody RecursoRequest request){
        return recursoService.actualizarRecurso(id, request);
    }

    @DeleteMapping("/recursos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarRecurso(@PathVariable int id){
        recursoService.eliminarRecurso(id);
    }

    /* ---------------- TIPOS ---------------- */

    @GetMapping("/tipos")
    public Page<TipoRecursoResponse> getTipos(Pageable pageable){
        return tipoRecursoService.getTiposRecurso(pageable);
    }

    @PostMapping("/tipos")
    @ResponseStatus(HttpStatus.CREATED)
    public TipoRecursoResponse crearTipo(@RequestBody TipoRecursoRequest request){
        return tipoRecursoService.crearTipoRecurso(request);
    }

    @PutMapping("/tipos/{id}")
    public TipoRecursoResponse actualizarTipo(@PathVariable int id, @RequestBody TipoRecursoRequest request){
        return tipoRecursoService.actualizarTipoRecurso(id, request);
    }

    @DeleteMapping("/tipos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarTipo(@PathVariable int id){
        tipoRecursoService.eliminarTipoRecurso(id);
    }

    /* ---------------- DISPONIBILIDADES ---------------- */

    @GetMapping("/disponibilidades")
    public List<DisponibilidadResponse> getDisponibilidades(){
        return adminService.getDisponibilidades();
    }

    @PostMapping("/disponibilidades")
    @ResponseStatus(HttpStatus.CREATED)
    public DisponibilidadResponse crearDisponibilidad(@RequestBody DisponibilidadRequest request){
        return adminService.crearDisponibilidad(request);
    }

    @DeleteMapping("/disponibilidades/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarDisponibilidad(@PathVariable int id){
        adminService.eliminarDisponibilidad(id);
    }

    /* ---------------- RESERVAS ---------------- */

    @GetMapping("/reservas")
    public Page<ReservaResponse> getReservas(Pageable pageable){
        return reservaService.getAllReservas(pageable);
    }
}
