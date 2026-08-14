package com.api.backend.dto.response;

import java.sql.Date;
import java.sql.Time;

public record ReservaResponse(
        String id,
        Time horaInicio,
        Time horaFinal,
        Date fecha,
        String estado,
        Long idUsuario,
        Integer idRecurso,
        Integer calificacion) {
}
