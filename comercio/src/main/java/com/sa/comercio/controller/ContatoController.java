package com.sa.comercio.controller;

import com.sa.comercio.model.Cliente;
import com.sa.comercio.model.Contato;
import com.sa.comercio.service.ClienteService;
import com.sa.comercio.service.ContatoService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/contatos")
public class ContatoController {

    private ContatoService contatoService;
    private ClienteService clienteService;

    public ContatoController(ContatoService contatoService, ClienteService clienteService) {
        this.contatoService = contatoService;
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<Contato>> getAllContatos() {
        List<Contato> contatos = contatoService.getAllContatos();
        if (contatos.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(contatos);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contato> getContatoById (@PathVariable Integer id) {
        Optional<Contato> contato = contatoService.getContatoById(id);
        if (contato.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            return ResponseEntity.ok(contato.get());
        }
    }

    @PostMapping
    public ResponseEntity<Contato> createContato(@Valid @RequestBody Contato contato) {
        if (contato.getCliente() == null || contato.getCliente().getId() == null) {
            return ResponseEntity.badRequest().build();
        } else {
            Cliente cliente = clienteService.getClienteById(contato.getCliente().getId()).orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));
            contato.setCliente(cliente);
            Contato createContato = contatoService.createContato(contato);
            return ResponseEntity.status(HttpStatus.CREATED).body(createContato);
        }
    }

    @PutMapping("/alter/{id}")
    public ResponseEntity<Contato> updateContato (@PathVariable Integer id, @RequestBody Contato contato) {
        Optional<Contato> existingContato = contatoService.getContatoById(id);
        if (existingContato.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } else {
            Contato updatedContato = contatoService.updateContato(id, contato);
            return ResponseEntity.ok(updatedContato);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteContato(@PathVariable Integer id) {
        try {
            contatoService.deleteContato(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
