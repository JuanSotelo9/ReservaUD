package com.api.backend.repository;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.api.backend.model.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, String>{
    
    public List<Reserva> findBykIdusuario(Long kIdusuario);

    @Query("SELECT r.nCalificacion FROM Reserva r WHERE r.kIdrecurso = :kIdrecurso AND r.nEstadoreserva = :nEstadoreserva")
    public List<Integer> findCalificacion(@Param("kIdrecurso") int kIdrecurso, @Param("nEstadoreserva") String nEstadoreserva);

    long countBynEstadoreserva(String nEstadoreserva);

    @Query("SELECT r.kIdrecurso, COUNT(r) FROM Reserva r GROUP BY r.kIdrecurso ORDER BY COUNT(r) DESC")
    List<Object[]> findTopRecursos(Pageable pageable);

    @Query("SELECT r.fFechareserva, COUNT(r) FROM Reserva r GROUP BY r.fFechareserva ORDER BY r.fFechareserva")
    List<Object[]> countReservasPorDia();

    @Query("SELECT r.fHorainicioreserva, COUNT(r) FROM Reserva r GROUP BY r.fHorainicioreserva ORDER BY r.fHorainicioreserva")
    List<Object[]> countReservasPorHora();

    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.kIdrecurso = :idRecurso AND r.fFechareserva = :fecha "
            + "AND r.fHorainicioreserva <= :hora AND r.fHorafinalreserva > :hora "
            + "AND r.nEstadoreserva IN ('reservado', 'en progreso')")
    long countReservasActivas(@Param("idRecurso") int idRecurso, @Param("fecha") LocalDate fecha, @Param("hora") LocalTime hora);
}
