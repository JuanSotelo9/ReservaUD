package com.api.backend.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

public record ReservaRequest(
        LocalTime horaInicio,
        LocalTime horaFinal,
        LocalDate dia,
        Long idUsuario,
        int idRecurso) {
}
