package com.api.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.api.backend.model.SerCaracterisado;
import com.api.backend.model.SerCaracterisadoId;

@Repository
public interface SerCaracterisadoRepository extends JpaRepository<SerCaracterisado, SerCaracterisadoId>{

    @Query("SELECT sc.serCaracterisadoId.kIdcaracteristicas FROM SerCaracterisado sc WHERE sc.serCaracterisadoId.kIdrecurso = :kIdrecurso")
    List<Integer> findCaracteristicaIdsByRecurso(@Param("kIdrecurso") int kIdrecurso);
}
