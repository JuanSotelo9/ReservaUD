package com.api.backend.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaResponse(
        String id,
        LocalTime horaInicio,
        LocalTime horaFinal,
        LocalDate fecha,
        String estado,
        Long idUsuario,
        Integer idRecurso,
        Integer calificacion) {
}
