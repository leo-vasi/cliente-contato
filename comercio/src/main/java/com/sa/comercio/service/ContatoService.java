package com.sa.comercio.service;

import com.sa.comercio.model.Contato;
import com.sa.comercio.repository.ContatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContatoService {

    private ContatoRepository contatoRepository;


    @Autowired
    public ContatoService (ContatoRepository contatoRepository) {
        this.contatoRepository = contatoRepository;
    }

    public List<Contato> getAllContatos() {
        return contatoRepository.findAll();
    }

    public Optional<Contato> getContatoById(Integer id) {
        return contatoRepository.findById(id);
    }

    public List<Contato> getContatosByClienteId(Integer clienteId) {
        return contatoRepository.findByClienteId(clienteId);
    }

    public Contato createContato(Contato contato) {
        if (contato.getTipo() == null || contato.getValor() == null) {
            throw new RuntimeException("Tipo e Valor são obrigatórios");
        }
        return contatoRepository.save(contato);
    }

    public Contato updateContato(Integer id, Contato contato) {
        Optional<Contato> existingContatoOpt = contatoRepository.findById(id);
        if (existingContatoOpt.isEmpty()) {
            throw new RuntimeException("Contato não encontrado");
        }
        Contato existingContato = existingContatoOpt.get();
        existingContato.setCliente(contato.getCliente());
        existingContato.setTipo(contato.getTipo());
        existingContato.setValor(contato.getValor());
        existingContato.setObservacao(contato.getObservacao());
        return contatoRepository.save(existingContato);
    }


    public void deleteContato(Integer id) {
        contatoRepository.deleteById(id);
    }
}
