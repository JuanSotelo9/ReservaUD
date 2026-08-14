package com.api.backend.dto.request;

import java.sql.Date;
import java.sql.Time;

public record ReservaRequest(
        Time horaInicio,
        Time horaFinal,
        Date dia,
        Long idUsuario,
        int idRecurso) {
}
