# Sistema de Gestão de Clientes e Contatos  

Sistema desenvolvido para a empresa Comércio S.A., substituindo uma agenda física por uma solução digital com:  
- Cadastro, edição e exclusão de clientes e contatos.  
- Validações de CPF, campos obrigatórios e relacionamentos.  
- API RESTful com Spring Boot e banco de dados relacional.  

## ✅ Funcionalidades Implementadas  
| Requisito | Status |  
|-----------|--------|  
| **RF01**: Cadastro de clientes | ✅ |  
| **RF02**: Edição de clientes | ✅ |  
| **RF03**: Exclusão de clientes | ✅ |  
| **RF04**: Listagem de clientes | ✅ |  
| **RF05**: Busca por Nome/CPF | ✅ |  
| **RF06**: Cadastro de contatos | ✅ |  
| **RF07**: Edição de contatos | ✅ |  
| **RF08**: Exclusão de contatos | ✅ |  
| **RF09**: Listagem de contatos por cliente | ✅ |  
| **RN01-RN08**: Regras de negócio (validações) | ✅ |  

## 🛠️ Tecnologias  
- **Backend**:  
  - Java 21 + Spring Boot  
  - Spring Data JPA + Hibernate  
  - Banco de Dados: PostgreSQL/MySQL (configurável)  
  - Validações com `@Valid` e anotações customizadas.  
- **Frontend**: *(HTML/CSS e JavaScript).*  

## 🚀 Como Executar  

### ⚡ Pré-requisitos  
- JDK 21+  
- Maven  
- Banco de Dados MySQL (ou PostgreSQL, configurável)  

### 📝 Configuração do Banco de Dados  
1. Crie o banco de dados utilizando o script SQL fornecido no repositório.  
   - O script inclui a estrutura do banco e dados de exemplo para testes.  

### 💾 Configuração do Projeto  
1. Clone o repositório:  
   ```bash  
   git clone https://github.com/leo-vasi/cliente-contato  
   ```  
2. Abra o projeto no IntelliJ IDEA (recomendado) ou outra IDE compatível.  
3. Configure o arquivo `application.properties` (localizado em `src/main/resources`).  
   - Atualize as credenciais do banco de dados conforme necessário:  
     ```properties  
     spring.datasource.url=jdbc:mysql://localhost:3306/db_comercio  
     spring.datasource.username=root  
     spring.datasource.password=  
     spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver  
     spring.jpa.hibernate.ddl-auto=update  
     spring.jpa.show-sql=true  
     spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect  
     ```  

### 🚀 Executando o Backend  
1. No IntelliJ, localize a classe `ComercioApplication`.  
2. Execute a aplicação clicando no botão *Run*.  

### 📱 Executando o Frontend  
1. No IntelliJ, abra a pasta `comercio-frontend` em uma nova janela.  
2. Abra o arquivo `index.html` em um navegador de sua preferência.  

Agora, a aplicação estará rodando e pronta para testes.

## 📡 Endpoints da API  

### Clientes (`/clientes`)

| Método HTTP | Endpoint | Descrição | Códigos de Resposta |
|-------------|----------|-------------|------------------|
| **GET** | `/clientes` | Lista todos os clientes | `200 OK` ou `204 No Content` |
| **GET** | `/clientes/{id}` | Busca cliente por ID | `200 OK` ou `404 Not Found` |
| **GET** | `/clientes/find/nome/{nome}` | Busca clientes por nome (parcial) | `200 OK` (array vazio se não achar) |
| **GET** | `/clientes/find/cpf/{cpf}` | Busca cliente por CPF exato | `200 OK` ou `404 Not Found` |
| **GET** | `/clientes/{id}/contatos` | Lista contatos de um cliente | `200 OK` ou `404 Not Found` |
| **POST** | `/clientes` | Cadastra novo cliente | `201 Created` ou `400 Bad Request` |
| **PUT** | `/clientes/alter/{id}` | Atualiza cliente por ID | `200 OK` ou `404 Not Found` |
| **DELETE** | `/clientes/delete/{id}` | Remove cliente e seus contatos | `204 No Content` ou `404 Not Found` |

### Contatos (`/contatos`)

| Método HTTP | Endpoint | Descrição | Códigos de Resposta |
|-------------|----------|-------------|------------------|
| **GET** | `/contatos` | Lista todos os contatos (não recomendado) | `200 OK` ou `204 No Content` |
| **GET** | `/contatos/{id}` | Busca contato por ID | `200 OK` ou `404 Not Found` |
| **POST** | `/contatos` | Cadastra novo contato para um cliente | `201 Created` ou `400 Bad Request` |
| **PUT** | `/contatos/alter/{id}` | Atualiza contato por ID | `200 OK` ou `404 Not Found` |
| **DELETE** | `/contatos/delete/{id}` | Remove contato | `204 No Content` ou `404 Not Found` |

# Cliente Controller

O arquivo `clienteController.js` gerencia os clientes cadastrados no sistema, incluindo suas operações CRUD e integração com a API REST. Também controla a renderização dos dados na interface.

## 📌 Funcionalidades

### 📝 Exibição de Clientes
- **`showClientes(clientes)`**: Renderiza a lista de clientes em uma tabela com ações (editar/excluir/ver contatos).
- **`renderClientTable(headers, rows)`**: Cria a estrutura da tabela dinamicamente.
- **`showEmptyMessage(message)`**: Exibe mensagem quando não há clientes cadastrados.

### 🔄 Operações CRUD
- **`getAllClientes()`**: Busca todos os clientes via API e os exibe.
- **`createCliente(clienteData)`**: Cadastra um novo cliente (valida dados antes do envio).
- **`editFormCliente(id)`**: Preenche o formulário de edição com os dados do cliente.
- **`updateCliente()`**: Envia alterações para a API via PUT.
- **`deleteCliente(id)`**: Remove um cliente e seus contatos (com confirmação).

### 🔍 Busca e Filtros
- **`searchCliente()`**: Busca clientes por ID, Nome ou CPF.
- **`performSearch(option, value)`**: Executa a busca na API conforme o critério selecionado.

## 🏗️ Estrutura do Código

### Constantes Organizadas:
- **`API_BASE_URL`**: Endpoint base da API.
- Funções utilitárias como `formatDate()` para formatação de dados.

### Separação de Responsabilidades:
- Funções de renderização (`showClientes`) separadas das operações de API (`createCliente`).

### Validações Robustas:
- Verifica CPF, campos obrigatórios e formatos antes de enviar à API.

## 📌 Requisitos
- Backend rodando em `http://localhost:8080`.

## 📋 Operações

| Ação              | Como Usar |
|-------------------|-----------|
| **Adicionar Cliente** | Preencher formulário e enviar (validações automáticas). |
| **Editar Cliente** | Clicar no ícone de edição (✏️), ajustar dados e salvar. |
| **Excluir Cliente** | Clicar no ícone de lixeira (🗑️) e confirmar (exclui também os contatos). |
| **Buscar Cliente** | Selecionar filtro (Nome/CPF) e digitar o valor. |




# Contato Controller

Este arquivo `contatoController.js` gerencia os contatos cadastrados no sistema. Ele interage com o backend via API REST e manipula a interface do usuário para listar, editar, adicionar e excluir contatos.

## 📌 Funcionalidades

### 📝 Exibição de Contatos
- `displayContatos(contatos)`: Renderiza contatos com opções de edição e exclusão.
- `displayContatosSimplificada(contatos)`: Exibe contatos de forma simplificada, sem ações.
- `showEmptyMessage(message)`: Exibe uma mensagem quando não há contatos cadastrados.

### 🔄 Operações CRUD
- `getAllContatos()`: Obtém e exibe todos os contatos cadastrados.
- `getContatosByClienteId(clienteId)`: Obtém contatos específicos de um cliente e exibe na interface.
- `editFormContato(id)`: Preenche o formulário de edição com os dados do contato selecionado.
- `updateContato()`: Atualiza um contato existente enviando uma requisição `PUT` para a API.
- `deleteContato(id)`: Remove um contato enviando uma requisição `DELETE` para a API.

## 🏗️ Estrutura do Código
- **Uso de Constantes:** Armazena seletores do DOM (`DOM`) e endpoints da API (`API_ENDPOINTS`).
- **Funções Assíncronas (`async/await`)** para chamadas à API.
- **Boas práticas de manipulação do DOM**, separando a lógica de exibição e atualização dos contatos.

### 📌 Requisitos
- Backend rodando em `localhost:8080`.


### 📋 Operações
- **Adicionar um Contato:** Preencher o formulário e clicar no botão correspondente.
- **Editar um Contato:** Clicar no ícone de edição, modificar os dados e salvar.
- **Remover um Contato:** Clicar no ícone de lixeira e confirmar a exclusão.



## 🎯 Conclusão

Este projeto atendeu todos os requisitos do desafio, implementando:

✅ **Backend robusto** com Spring Boot e validações customizadas.

✅ **Frontend intuitivo** em JavaScript puro, consumindo a API REST.

✅ **Documentação** para facilitar o uso e entendimento.




