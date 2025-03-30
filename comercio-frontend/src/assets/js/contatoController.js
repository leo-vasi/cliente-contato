// =============================================
// CONSTANTES E CONFIGURAÇÕES
// =============================================

const DOM = {
    contatosTable: () => document.querySelector(".clients-table tbody"),
    editForm: {
        container: () => document.querySelectorAll(".contact-form-container")[1],
        id: () => document.getElementById("edit-contato-id"),
        tipo: () => document.getElementById("edit-tipo"),
        valor: () => document.getElementById("edit-valor"),
        observacao: () => document.getElementById("edit-observacao")
    },
    addForm: {
        container: () => document.querySelector(".contact-form-container"),
        tipo: () => document.getElementById("add-tipo"),
        valor: () => document.getElementById("add-valor"),
        observacao: () => document.getElementById("add-observacao")
    },
    searchInput: () => document.getElementById("search-input"),
    pageTitle: () => document.getElementById("page-title"),
    addButton: () => document.querySelector(".btn-add-container")
};

const API_ENDPOINTS = {
    contatos: "http://localhost:8080/contatos",
    contatoById: (id) => `http://localhost:8080/contatos/${id}`,
    contatosByCliente: (clienteId) => `http://localhost:8080/clientes/${clienteId}/contatos`,
    clienteById: (clienteId) => `http://localhost:8080/clientes/${clienteId}`,
    updateContato: (id) => `http://localhost:8080/contatos/alter/${id}`,
    deleteContato: (id) => `http://localhost:8080/contatos/delete/${id}`
};

// =============================================
// FUNÇÕES DE EXIBIÇÃO
// =============================================

/**
 * Exibe contatos com ações (editar/deletar)
 * @param {Array} contatos - Lista de contatos
 */
function displayContatos(contatos) {
    if (!contatos || contatos.length === 0) {
        return showEmptyMessage("Nenhum contato encontrado");
    }

    const headers = ["ID", "Tipo", "Valor", "Observação"];
    const rows = contatos.map(contato => ({
        id: contato.id,
        tipo: contato.tipo,
        valor: contato.valor,
        observacao: contato.observacao || 'Nenhuma',
        editAction: `
            <img src="assets/img/edit-img.png" width="38" height="33" 
                 class="btn-action" onclick="editFormContato(${contato.id})">
        `,
        deleteAction: `
            <img src="assets/img/trash-img.png" width="38" height="33" 
                 class="btn-action" onclick="deleteContato(${contato.id})">
        `
    }));

    renderTableWithSeparateActions(headers, rows);
}

function renderTableWithSeparateActions(headers, rows) {
    const table = DOM.contatosTable();
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
            <td class="table-cell">${row.tipo}</td>
            <td class="table-cell">${row.valor}</td>
            <td class="table-cell">${row.observacao}</td>
            <td class="table-cell">${row.editAction}</td>
            <td class="table-cell">${row.deleteAction}</td>
        </tr>`;
    });

    html += `</tbody>`;
    table.innerHTML = html;
}

/**
 * Exibe contatos simplificados (sem ações)
 * @param {Array} contatos - Lista de contatos
 */
function displayContatosSimplificada(contatos) {
    const tableBody = document.querySelector(".clients-table tbody");
    
    if (!contatos || contatos.length === 0) {
        return showEmptyMessage("Nenhum contato encontrado");
    }

    const headers = ["ID", "Tipo", "Valor", "Observação"];
    const rows = contatos.map(contato => ({
        id: contato.id,
        tipo: contato.tipo,
        valor: contato.valor,
        observacao: contato.observacao || 'Nenhuma'
    }));

    renderSimplifiedTable(headers, rows, tableBody);
}

function renderSimplifiedTable(headers, rows, container) {
    if (!container) {
        console.error("Container da tabela não encontrado");
        return;
    }

    let html = `
    <thead class="table-header">
        <tr>
            ${headers.map(h => `<th class="table-cell">${h}</th>`).join('')}
        </tr>
    </thead>
    <tbody class="table-body">`;

    rows.forEach(row => {
        html += `
        <tr class="table-row">
            <td class="table-cell">${row.id}</td>
            <td class="table-cell">${row.tipo}</td>
            <td class="table-cell">${row.valor}</td>
            <td class="table-cell">${row.observacao}</td>
        </tr>`;
    });

    html += `</tbody>`;
    container.innerHTML = html;
}

function showEmptyMessage(message) {
    const table = document.querySelector(".clients-table tbody");
    if (table) table.innerHTML = `<p class="empty-message">${message}</p>`;
}

/**
 * Renderiza tabela de contatos
 * @param {Array} headers - Cabeçalhos da tabela
 * @param {Array} rows - Dados das linhas
 * @param {Boolean} showActions - Mostrar colunas de ação
 */
function renderTable(headers, rows, showActions) {
    const table = DOM.contatosTable();
    if (!table) return;

    let html = `
    <thead class="table-header">
        <tr>${headers.map(h => `<th class="table-cell">${h}</th>`).join('')}
        </tr>
    </thead>
    <tbody class="table-body">`;

    rows.forEach(row => {
        html += `
        <tr class="table-row">
            <td class="table-cell">${row.id}</td>
            <td class="table-cell">${row.tipo}</td>
            <td class="table-cell">${row.valor}</td>
            <td class="table-cell">${row.observacao}</td>`;
        
        if (showActions) {
            html += `
            <td class="table-cell">${row.actions}</td>`;
        }
        
        html += `</tr>`;
    });

    html += `</tbody>`;
    table.innerHTML = html;
}

function showEmptyMessage(message) {
    const table = DOM.contatosTable();
    if (table) table.innerHTML = `<p>${message}</p>`;
}

// =============================================
// OPERAÇÕES CRUD - CONTATOS
// =============================================

async function getAllContatos() {
    try {
        const response = await fetch(API_ENDPOINTS.contatos);
        if (!response.ok) throw new Error("Erro ao carregar contatos");
        
        const contatos = await response.json();
        displayContatosSimplificada(contatos);
    } catch (error) {
        console.error("Erro ao carregar contatos:", error);
        showEmptyMessage("Erro ao carregar lista de contatos");
    }
}

async function getContatosByClienteId(clienteId) {
    try {
        const clienteResponse = await fetch(API_ENDPOINTS.clienteById(clienteId));
        if (!clienteResponse.ok) throw new Error('Cliente não encontrado');
        const cliente = await clienteResponse.json();
        DOM.pageTitle().textContent = `Contatos de ${cliente.nome}`;
        const contatosResponse = await fetch(API_ENDPOINTS.contatosByCliente(clienteId));
        if (!contatosResponse.ok) throw new Error('Erro ao carregar contatos');
        const contatos = await contatosResponse.json();
        if (contatos.length > 0) {
            displayContatos(contatos);
        } else {
            DOM.contatosTable().innerHTML = "<p>Nenhum contato cadastrado para este cliente</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar contatos do cliente:", error);
        alert(`Erro: ${error.message}`);
    }
}

async function fetchCliente(clienteId) {
    const response = await fetch(API_ENDPOINTS.clienteById(clienteId));
    if (!response.ok) throw new Error('Cliente não encontrado');
    return await response.json();
}

async function fetchContatos(clienteId) {
    const response = await fetch(`${API_ENDPOINTS.contatos}?clienteId=${clienteId}`);
    if (!response.ok) throw new Error('Erro ao carregar contatos');
    return await response.json();
}

// =============================================
// MANIPULAÇÃO DE CONTATOS
// =============================================

async function editFormContato(id) {
    if (!confirm("Deseja editar este contato?")) return;

    try {
        const contato = await fetchContato(id);
        const clienteId = resolveClienteId(contato);
        
        if (!clienteId) throw new Error("Cliente não identificado");

        fillEditForm(contato, clienteId);
        DOM.editForm.container().style.display = "block";
    } catch (error) {
        console.error("Erro ao editar:", error);
        alert(`Erro: ${error.message}`);
    }
}

async function fetchContato(id) {
    const response = await fetch(API_ENDPOINTS.contatoById(id));
    if (!response.ok) throw new Error("Contato não encontrado");
    return await response.json();
}

function resolveClienteId(contato) {
    if (contato.cliente?.id) return contato.cliente.id;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('clienteId');
}

function fillEditForm(contato, clienteId) {
    DOM.editForm.container().dataset.clienteId = clienteId;
    DOM.editForm.id().value = contato.id;
    DOM.editForm.tipo().value = contato.tipo;
    DOM.editForm.valor().value = contato.valor;
    DOM.editForm.observacao().value = contato.observacao || '';
}

async function updateContato() {
    try {
        const { id, tipo, valor, observacao, clienteId } = getFormData();
        validateFormData(tipo, valor);

        const response = await fetch(API_ENDPOINTS.updateContato(id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: parseInt(id),
                tipo,
                valor,
                observacao: observacao || null,
                cliente: { id: parseInt(clienteId) }
            })
        });

        await handleApiResponse(response, "Contato atualizado com sucesso!");
        closeEditContatoForm();
        refreshContatosList(clienteId);
    } catch (error) {
        console.error("Erro na atualização:", error);
        alert(`Erro: ${error.message}`);
    }
}

function getFormData() {
    return {
        id: DOM.editForm.id().value,
        tipo: DOM.editForm.tipo().value.trim(),
        valor: DOM.editForm.valor().value.trim(),
        observacao: DOM.editForm.observacao().value.trim(),
        clienteId: DOM.editForm.container().dataset.clienteId
    };
}

function validateFormData(tipo, valor) {
    if (!tipo || !valor) {
        throw new Error("Tipo e Valor são campos obrigatórios!");
    }
}

async function deleteContato(id) {
    if (!confirm("Tem certeza que deseja excluir este contato?")) return;
    try {
        const response = await fetch(API_ENDPOINTS.deleteContato(id), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            alert("Contato excluído com sucesso!");
            const urlParams = new URLSearchParams(window.location.search);
            const clienteId = urlParams.get('clienteId');
            if (clienteId) {
                await getContatosByClienteId(clienteId);
            } else {
                await getAllContatos();
            }
        } else {
            const errorText = await response.text();
            throw new Error(errorText || `Erro ${response.status} ao excluir contato`);
        }
    } catch (error) {
        console.error("Erro ao deletar contato:", {
            message: error.message,
            stack: error.stack
        });
        alert(`Falha ao excluir: ${error.message}`);
    }
}

async function addContato() {
    try {
        const { tipo, valor, observacao, clienteId } = getAddFormData();
        validateFormData(tipo, valor);

        const response = await fetch(API_ENDPOINTS.contatos, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tipo,
                valor,
                observacao: observacao || null,
                cliente: { id: parseInt(clienteId) }
            })
        });

        await handleApiResponse(response, "Contato cadastrado com sucesso!");
        resetAddForm();
        refreshContatosList(clienteId);
    } catch (error) {
        console.error("Erro no cadastro:", error);
        alert(`Erro: ${error.message}`);
    }
}

function getAddFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('clienteId');
    
    if (!clienteId) throw new Error("Cliente não identificado");

    return {
        tipo: DOM.addForm.tipo().value.trim(),
        valor: DOM.addForm.valor().value.trim(),
        observacao: DOM.addForm.observacao().value.trim(),
        clienteId
    };
}

function resetAddForm() {
    DOM.addForm.tipo().value = '';
    DOM.addForm.valor().value = '';
    DOM.addForm.observacao().value = '';
    DOM.addForm.container().style.display = "none";
}

async function handleApiResponse(response, successMessage) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro na requisição");
    }
    alert(successMessage);
    return await response.json();
}

function refreshContatosList(clienteId) {
    if (clienteId) {
        getContatosByClienteId(clienteId);
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const currentClienteId = urlParams.get('clienteId');
        currentClienteId ? getContatosByClienteId(currentClienteId) : getAllContatos();
    }
}

// =============================================
// FUNÇÕES AUXILIARES
// =============================================

function closeEditContatoForm() {
    DOM.editForm.container().style.display = "none";
}

function redirectToContatos(clienteId) {
    window.location.href = `contato-details.html?clienteId=${clienteId}`;
}

async function searchContato() {
    const contatoId = DOM.searchInput().value.trim();
    if (!contatoId) return alert("Por favor, insira um ID de contato válido!");

    try {
        const contato = await fetchContato(contatoId);
        displayContatosSimplificada([contato]);
    } catch (error) {
        console.error("Erro na busca:", error);
        alert(error.message);
    }
}

// =============================================
// INICIALIZAÇÃO
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('clienteId');
    
    if (clienteId) {
        loadClienteContatos(clienteId);
        displayContatosSimplificada(contatos);
    } else {
        DOM.addButton().style.display = "block";
        getAllContatos();
    }
});

async function loadClienteContatos(clienteId) {
    try {
        const cliente = await fetchCliente(clienteId);
        DOM.pageTitle().textContent = `Contatos de ${cliente.nome}`;
        DOM.addButton().style.display = "block";
        getContatosByClienteId(clienteId);
    } catch (error) {
        console.error("Erro ao carregar cliente:", error);
    }
}