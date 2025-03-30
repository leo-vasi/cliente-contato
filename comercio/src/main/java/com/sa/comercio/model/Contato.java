package com.sa.comercio.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "contato")
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonBackReference
    private Cliente cliente;

    @NotBlank(message = "O tipo de contato não pode estar em branco")
    @Size(max = 50, message = "O tipo de contato deve ter no máximo 50 caracteres")
    @Column(nullable = false, length = 50)
    private String tipo;

    @NotBlank(message = "O valor do contato não pode estar em branco")
    @Size(max = 100, message = "O valor do contato deve ter no máximo 100 caracteres")
    @Column(nullable = false, length = 100)
    private String valor;

    @Size(max = 255, message = "A observação deve ter no máximo 255 caracteres")
    @Column(length = 255)
    private String observacao;
}


