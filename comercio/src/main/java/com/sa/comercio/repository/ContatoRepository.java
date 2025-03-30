package com.sa.comercio.repository;

import com.sa.comercio.model.Contato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContatoRepository extends JpaRepository<Contato, Integer> {
    List<Contato> findByClienteId(Integer clienteId);
}
