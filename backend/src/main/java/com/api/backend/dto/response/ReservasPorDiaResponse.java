package com.api.backend.dto.response;

import java.time.LocalDate;

public record ReservasPorDiaResponse(
        LocalDate dia,
        Long total) {
}
