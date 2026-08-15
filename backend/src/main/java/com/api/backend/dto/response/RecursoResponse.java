package com.api.backend.dto.response;

import java.util.List;

public record RecursoResponse(
        Integer id,
        String nombre,
        String descripcion,
        Integer idTipoRecurso,
        String nombreTipoRecurso,
        Float calificacionPromedio,
        List<String> caracteristicas) {
}
