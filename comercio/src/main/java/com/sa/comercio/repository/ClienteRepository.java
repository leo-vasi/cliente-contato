package com.sa.comercio.repository;

import com.sa.comercio.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    List<Cliente> findByNome(String nome);
    Optional<Cliente> findByCpf(String cpf);
    boolean existsByCpf(String cpf);
}

