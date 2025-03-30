package com.sa.comercio.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotBlank(message = "O nome não pode estar em branco")
    @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "O CPF não pode estar em branco")
    @Size(min = 14, max = 14, message = "O CPF deve ter exatamente 14 caracteres")
    @Pattern(regexp = "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$", message = "CPF inválido")
    @Column(name = "cpf", nullable = false, unique = true, length = 14)
    private String cpf;

    @Past(message = "A data de nascimento deve ser válida")
    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Size(max = 255, message = "O endereço deve ter no máximo 255 caracteres")
    @Column(name = "endereco", length = 255)
    private String endereco;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private List<Contato> contatos = new ArrayList<>();
}
