// =============================================
// CONSTANTES E UTILITÁRIOS
// =============================================

const API_BASE_URL = "http://localhost:8080/clientes";

/**
 * Formata data para exibição
 * @param {String} dateString - Data em formato string
 * @returns {String} Data formatada
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// =============================================
// FUNÇÕES DE EXIBIÇÃO
// =============================================

/**
 * Exibe lista de clientes na tabela
 * @param {Array} clientes - Lista de clientes
 */
function showClientes(clientes) {
    if (!clientes || clientes.length === 0) {
        return showEmptyMessage("Nenhum cliente cadastrado");
    }

    const headers = ["ID", "Nome", "CPF", "Data Nascimento", "Endereço", "Contatos"];
    
    const rows = clientes.map(cliente => ({
        id: cliente.id,
        nome: cliente.nome,
        cpf: cliente.cpf,
        dataNascimento: formatDate(cliente.dataNascimento),
        endereco: cliente.endereco || 'Não informado',
        contatos: `
            <button onclick="redirectToContatos(${cliente.id})" class="contato-button">
                <img src="assets/img/contact-icon.png" alt="Contatos" width="30" height="30">
            </button>
        `,
        editAction: `
        <button class="btn-action" onclick="editFormCliente(${cliente.id})">
            <img src="assets/img/edit-img.png" width="20" height="20">
        </button>
        `,
        deleteAction: `
        <button class="btn-action" onclick="deleteCliente(${cliente.id})">
            <img src="assets/img/trash-img.png" width="20" height="20">
        </button>
        `
    }));

    renderClientTable(headers, rows);
}

/**
 * Renderiza tabela de clientes
 * @param {Array} headers - Cabeçalhos da tabela
 * @param {Array} rows - Dados das linhas
 */
function renderClientTable(headers, rows) {
    const table = document.querySelector(".clients-table tbody");
    if (!table) return;
    
    let html = `
    <thead class="table-header">
        <tr>
            ${headers.map(h => `<th class="table-cell">${h}</th>`).join('')}
            <th class="table-cell">Editar</th>
            <th class="table-cell">Remover</th>
        </tr>
    </thead>
    <tbody class="table-body">`;

    rows.forEach(row => {
        html += `
        <tr class="table-row">
            <td class="table-cell">${row.id}</td>
            <td class="table-cell">${row.nome}</td>
            <td class="table-cell">${row.cpf}</td>
            <td class="table-cell">${row.dataNascimento}</td>
            <td class="table-cell">${row.endereco}</td>
            <td class="table-cell">${row.contatos}</td>
            <td class="table-cell">${row.editAction}</td>
            <td class="table-cell">${row.deleteAction}</td>
        </tr>`;
    });

    html += `</tbody>`;
    table.innerHTML = html;
}

function showEmptyMessage(message) {
    const table = document.getElementById("clientes");
    if (table) table.innerHTML = `<p>${message}</p>`;
}

// =============================================
// OPERAÇÕES CRUD - CLIENTES
// =============================================

async function getAllClientes() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Erro ao carregar clientes");
        
        const clientes = await response.json();
        showClientes(clientes);
    } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        showEmptyMessage("Erro ao carregar lista de clientes");
    }
}

async function createCliente(clienteData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao cadastrar cliente');
        }

        alert("Cliente cadastrado com sucesso!");
        return await response.json();
    } catch (error) {
        console.error("Erro no cadastro:", error);
        throw error;
    }
}

// =============================================
// MANIPULAÇÃO DE CLIENTES
// =============================================

async function editFormCliente(id) {
    if (!confirm("Deseja editar este cliente?")) return;

    try {
        const cliente = await fetchCliente(id);
        fillEditFormCliente(cliente);
        document.querySelector(".client-form-container").style.display = "block";
    } catch (error) {
        console.error("Erro ao carregar cliente:", error);
        alert("Erro ao carregar dados do cliente");
    }
}

async function fetchCliente(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Cliente não encontrado");
    return await response.json();
}

function fillEditFormCliente(cliente) {
    document.getElementById("edit-id").value = cliente.id;
    document.getElementById("edit-name").value = cliente.nome;
    document.getElementById("edit-cpf").value = cliente.cpf;
    document.getElementById("edit-birth-date").value = cliente.dataNascimento?.split('T')[0] || '';
    document.getElementById("edit-address").value = cliente.endereco || '';
}

async function updateCliente() {
    try {
        const clienteData = getClienteFormData();
        validateClienteData(clienteData);

        const response = await fetch(`${API_BASE_URL}/alter/${clienteData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clienteData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro na atualização');
        }

        alert("Cliente atualizado com sucesso!");
        closeEditForm();
        getAllClientes();
    } catch (error) {
        console.error("Erro na atualização:", error);
        alert(`Erro: ${error.message}`);
    }
}

function getClienteFormData() {
    return {
        id: document.getElementById("edit-id").value.trim(),
        nome: document.getElementById("edit-name").value.trim(),
        cpf: document.getElementById("edit-cpf").value.trim(),
        dataNascimento: document.getElementById("edit-birth-date").value.trim(),
        endereco: document.getElementById("edit-address").value.trim()
    };
}

function validateClienteData({ nome, cpf, dataNascimento, endereco }) {
    if (!nome || nome.length > 100) {
        throw new Error("Nome deve ter entre 1 e 100 caracteres");
    }

    if (!cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
        throw new Error("CPF deve estar no formato 000.000.000-00");
    }

    if (!dataNascimento) {
        throw new Error("Data de nascimento é obrigatória");
    }

    if (endereco && endereco.length > 255) {
        throw new Error("Endereço deve ter no máximo 255 caracteres");
    }
}

async function deleteCliente(id) {
    if (!confirm("Confirmar exclusão deste cliente?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/delete/${id}`, { 
            method: "DELETE" 
        });

        if (response.status === 204) {
            alert("Cliente deletado com sucesso!");
            getAllClientes();
        } else {
            throw new Error("Erro ao deletar cliente");
        }
    } catch (error) {
        console.error("Erro ao deletar:", error);
        alert(`Erro: ${error.message}`);
    }
}

// =============================================
// BUSCA E FILTROS
// =============================================

async function searchCliente() {
    const searchOption = document.getElementById("search-option").value;
    const searchInput = document.getElementById("search-input").value.trim();
    const searchResultDiv = document.querySelector(".search-results"); // Alterado para usar a classe

    if (!searchInput) {
        alert("Por favor, insira um valor de busca válido!");
        return;
    }

    try {
        const results = await performSearch(searchOption, searchInput);
        displaySearchResult(results, searchResultDiv);
    } catch (error) {
        console.error("Erro na busca:", error);
        if (searchResultDiv) {
            searchResultDiv.innerHTML = `<p>${error.message}</p>`;
        } else {
            alert(error.message); // Fallback caso o elemento não seja encontrado
        }
    }
}

async function performSearch(option, value) {
    let url;
    switch (option) {
        case "id": url = `${API_BASE_URL}/${value}`; break;
        case "nome": url = `${API_BASE_URL}/find/nome/${value}`; break;
        case "cpf": url = `${API_BASE_URL}/find/cpf/${value}`; break;
        default: throw new Error("Tipo de busca inválido");
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Nenhum resultado encontrado");

    const result = await response.json();
    return Array.isArray(result) ? result : [result];
}

function displaySearchResult(clientes, container) {
    if (!container) {
        console.error("Elemento container não encontrado");
        return;
    }

    if (!clientes || clientes.length === 0) {
        container.innerHTML = "<p>Nenhum cliente encontrado</p>";
        return;
    }

    const headers = ["ID", "Nome", "CPF", "Data Nascimento", "Endereço", "Contatos"];
    
    let html = `
    <h3>Resultado da Busca</h3>
    <table class="search-result-table">
        <thead>
            <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
                <th>Editar</th>
                <th>Remover</th>
            </tr>
        </thead>
        <tbody>`;

    clientes.forEach(cliente => {
        html += `
        <tr>
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${formatDate(cliente.dataNascimento)}</td>
            <td>${cliente.endereco || 'Não informado'}</td>
            <td>
                <button onclick="redirectToContatos(${cliente.id})" class="contato-button">
                    <img src="assets/img/contact-icon.png" alt="Contatos" width="30" height="30">
                </button>
            </td>
            <td>
                <img src="assets/img/edit-img.png" width="38" height="33" 
                     class="btn-action" onclick="editFormCliente(${cliente.id})">
            </td>
            <td>
                <img src="assets/img/trash-img.png" width="38" height="33" 
                     class="btn-action" onclick="deleteCliente(${cliente.id})">
            </td>
        </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

// =============================================
// FUNÇÕES AUXILIARES
// =============================================

function redirectToContatos(clienteId) {
    window.location.href = `contato-details.html?clienteId=${clienteId}`;
}

function closeEditForm() {
    document.querySelector(".client-form-container").style.display = "none";
}

// =============================================
// INICIALIZAÇÃO
// =============================================

document.addEventListener('DOMContentLoaded', getAllClientes);