package com.sa.comercio.service;

import com.sa.comercio.model.Cliente;
import com.sa.comercio.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Autowired
    public ClienteService (ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> getAllClientes() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> getClienteById(Integer id) {
        return clienteRepository.findById(id);
    }

    public Optional<Cliente> getClienteByCpf(String cpf) {
        return clienteRepository.findByCpf(cpf);
    }

    public List<Cliente> getClienteByNome(String nome) {
        return clienteRepository.findByNome(nome);
    }


    public Cliente createCliente(Cliente cliente) {
        if (cliente.getCpf() == null || cliente.getCpf().trim().isEmpty()) {
            throw new IllegalArgumentException("CPF não pode ser nulo ou estar vazio");
        }

        if (clienteRepository.existsByCpf(cliente.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }

        return clienteRepository.save(cliente);
    }


    public Cliente updateCliente(Integer id, Cliente cliente) {
        Optional<Cliente> existingClienteOpt = clienteRepository.findById(id);
        if (existingClienteOpt.isEmpty()) {
            throw new RuntimeException("Cliente não encontrado");
        }
        Cliente existingCliente = existingClienteOpt.get();
        existingCliente.setNome(cliente.getNome());
        existingCliente.setCpf(cliente.getCpf());
        existingCliente.setDataNascimento(cliente.getDataNascimento());
        existingCliente.setEndereco(cliente.getEndereco());
        return clienteRepository.save(existingCliente);
    }

    public void deleteCliente (Integer id) {
        clienteRepository.deleteById(id);
    }
}
