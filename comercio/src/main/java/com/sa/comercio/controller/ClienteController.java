package com.sa.comercio.controller;

import com.sa.comercio.exception.ErrorResponse;
import com.sa.comercio.model.Cliente;
import com.sa.comercio.model.Contato;
import com.sa.comercio.service.ClienteService;
import com.sa.comercio.service.ContatoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final ContatoService contatoService;

    public ClienteController(ClienteService clienteService, ContatoService contatoService) {
        this.clienteService = clienteService;
        this.contatoService = contatoService;
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> getAllClientes() {
        List<Cliente> clientes = clienteService.getAllClientes();
        if (clientes.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(clientes);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Integer id) {
        Optional<Cliente> cliente = clienteService.getClienteById(id);
        if (cliente.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.ok(cliente.get());
        }
    }

    @GetMapping("/find/nome/{nome}")
    public ResponseEntity<List<Cliente>> getClienteByrNome(@PathVariable String nome) {
        List<Cliente> clientes = clienteService.getClienteByNome(nome);
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/find/cpf/{cpf}")
    public ResponseEntity<Cliente> getClienteByCpf(@PathVariable String cpf) {
        Optional<Cliente> cliente = clienteService.getClienteByCpf(cpf);
        if (cliente.isPresent()) {
            return ResponseEntity.ok(cliente.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/{id}/contatos")
    public ResponseEntity<List<Contato>> getContatosByClienteId(@PathVariable Integer id) {
        Optional<Cliente> existingCliente = clienteService.getClienteById(id);
        if (existingCliente.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            List<Contato> contatos = contatoService.getContatosByClienteId(id);
            return ResponseEntity.ok(contatos);
        }
    }

    @PostMapping
    public ResponseEntity<?> createCliente(@Valid @RequestBody Cliente cliente) {
        try {
            Cliente createdCliente = clienteService.createCliente(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCliente);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }


    @PutMapping("/alter/{id}")
    public ResponseEntity<Cliente> updateCliente(@PathVariable Integer id, @RequestBody Cliente cliente) {
        Optional<Cliente> existingCliente = clienteService.getClienteById(id);
        if (existingCliente.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            Cliente updatedCliente = clienteService.updateCliente(id, cliente);
            return ResponseEntity.ok(updatedCliente);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Integer id) {
        if (clienteService.getClienteById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            clienteService.deleteCliente(id);
            return ResponseEntity.noContent().build();
        }
    }
}
