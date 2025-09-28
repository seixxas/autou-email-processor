// script.js

// -------------------------------------
// 1. Definição de Elementos DOM
// -------------------------------------
const emailInput = document.getElementById('email-input');
const processButton = document.getElementById('process-button');
const loadingSpinner = document.getElementById('loading-spinner');
const resultBox = document.getElementById('result-box');
const categoryOutput = document.getElementById('category-output');
const responseOutput = document.getElementById('response-output');
const copyButton = document.getElementById('copy-button');
const errorMessage = document.getElementById('error-message');
const fileUpload = document.getElementById('file-upload');
const fileNameDisplay = document.getElementById('file-name-display');
const clearButton = document.getElementById('clear-button');


//URL para processar arquivos
const FILE_UPLOAD_API_URL = 'http://127.0.0.1:5000/process_file';

// A URL do seu Back-end. Como está local, é o IP:PORTA
const API_URL = 'http://127.0.0.1:5000/process';



// -------------------------------------
// FUNÇÃO 1: Lidar com a seleção de arquivo
// -------------------------------------
function handleFileUpload() {
    const file = fileUpload.files[0];
    
    // Se nenhum arquivo foi selecionado (ex: o usuário cancelou a janela de upload)
    if (!file) {
        fileNameDisplay.textContent = "Nenhum arquivo selecionado.";
        return;
    }

    // 1. Exibir o nome do arquivo
    fileNameDisplay.textContent = file.name;

    // 2. Limpa o estado anterior
    toggleFeedback('initial'); 
    
    // 3. Lógica para arquivos TXT (lidos no Front-end)
    if (file.name.toLowerCase().endsWith('.txt')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Preenche o textarea com o conteúdo do arquivo
            emailInput.value = e.target.result;
        };
        
        reader.onerror = function() {
            fileNameDisplay.textContent = "Erro ao ler o arquivo.";
            alert("Não foi possível ler o arquivo TXT.");
        };

        // Lê o arquivo como texto
        reader.readAsText(file);
        
    } else if (file.name.toLowerCase().endsWith('.pdf')) {
        // 4. Lógica para PDF (Não lê o conteúdo aqui!)
        // Apenas coloca uma mensagem informativa no campo.
        // O arquivo será enviado BINDÁRIO para o Flask na função processEmail.
        emailInput.value = `[Arquivo PDF selecionado: ${file.name}. Clique em "Analisar E-mail" para processar no servidor.]`;

    } else {
        // Formato não suportado
        emailInput.value = '';
        fileUpload.value = ''; // Limpa o input file
        fileNameDisplay.textContent = "Formato não suportado. Use .txt ou .pdf";
        alert("Apenas arquivos .txt e .pdf são suportados.");
    }
}

// -------------------------------------
// FUNÇÃO 2: Função Principal de Processamento
// -------------------------------------

async function processEmail() {
    toggleFeedback('loading');
    processButton.disabled = true;

    let response;
    let data;
    const file = fileUpload.files[0];

    try {
        if (file && file.name.toLowerCase().endsWith('.pdf')) {
            // -- CENÁRIO 1: UPLOAD DE ARQUIVO PDF --
            const formData = new FormData();
            formData.append('email_file', file);

            response = await fetch(FILE_UPLOAD_API_URL, {
                method: 'POST',
                body: formData, // Envia o arquivo como FormData
                // Não defina Content-Type, o navegador faz isso automaticamente para FormData
            });

        } else {
            // -- CENÁRIO 2: INSERÇÃO DE TEXTO OU ARQUIVO TXT --
            const emailContent = emailInput.value.trim();
            if (emailContent.length === 0 || (file && file.name.toLowerCase().endsWith('.pdf') && emailContent.startsWith('[Arquivo PDF')) ) {
                 throw new Error("Por favor, cole o conteúdo do e-mail ou selecione um arquivo válido.");
            }

            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_content: emailContent }), // Envia texto como JSON
            });
        }

        // --- Lógica de Resposta (igual à anterior) ---
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        data = await response.json();

        // Verifica se a resposta JSON da nossa API tem um campo de erro
        if (data.error || data.category === 'Erro') {
            responseOutput.textContent = data.error || data.suggested_response || "Erro interno na análise da IA.";
            updateCategoryDisplay('Erro');
            toggleFeedback('error');
            return;
        }

        // Sucesso: Atualiza o resultado
        updateCategoryDisplay(data.category);
        responseOutput.textContent = data.suggested_response;
        toggleFeedback('result');

    } catch (error) {
        console.error("Erro ao comunicar com o Back-end:", error);
        toggleFeedback('error');
        // Exibe a mensagem de erro da validação ou da conexão
        responseOutput.textContent = error.message.includes("válido") ? error.message : "Falha na conexão com a API de Processamento.";
    } finally {
        processButton.disabled = false;
    }
}


// -------------------------------------
// 2. Funções de Suporte
// -------------------------------------

/**
 * Exibe ou esconde os elementos de feedback (loading, erro, resultado).
 */
function toggleFeedback(state) {
    // Esconde tudo primeiro
    loadingSpinner.classList.add('hidden');
    resultBox.classList.add('hidden');
    errorMessage.classList.add('hidden');
    copyButton.classList.add('hidden');

    // Mostra o que for necessário
    if (state === 'loading') {
        loadingSpinner.classList.remove('hidden');
    } else if (state === 'error') {
        errorMessage.classList.remove('hidden');
    } else if (state === 'result') {
        resultBox.classList.remove('hidden');
        copyButton.classList.remove('hidden');
    }
}

/**
 * Atualiza o display da categoria e aplica a classe CSS correta.
 * @param {string} category - A categoria recebida ('Produtivo', 'Improdutivo', 'Erro').
 */
function updateCategoryDisplay(category) {
    categoryOutput.textContent = category;

    // Limpa todas as classes de cor
    categoryOutput.classList.remove('tag-produtivo', 'tag-improdutivo', 'tag-erro');

    // Aplica a classe de cor correspondente
    if (category === 'Produtivo') {
        categoryOutput.classList.add('tag-produtivo');
    } else if (category === 'Improdutivo') {
        categoryOutput.classList.add('tag-improdutivo');
    } else {
        // Para qualquer outro caso ou "Erro"
        categoryOutput.classList.add('tag-erro');
    }
}


// -------------------------------------
// 3. Função Principal de Processamento
// -------------------------------------

async function processEmail() {
    const emailContent = emailInput.value.trim();

    if (emailContent.length === 0) {
        alert("Por favor, cole o conteúdo do e-mail para análise.");
        return;
    }

    toggleFeedback('loading'); // Inicia o spinner
    processButton.disabled = true; // Desabilita o botão enquanto processa

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email_content: emailContent }),
        });

        // Verifica se o status HTTP é de erro (4xx ou 5xx)
        if (!response.ok) {
            // Lança um erro com a mensagem de status
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Verifica se a resposta JSON da nossa API tem um campo de erro
        if (data.category === 'Erro') {
            responseOutput.textContent = data.suggested_response || "Erro interno na análise da IA.";
            updateCategoryDisplay('Erro');
            toggleFeedback('error');
            return;
        }

        // Sucesso: Atualiza o resultado
        updateCategoryDisplay(data.category);
        responseOutput.textContent = data.suggested_response;
        toggleFeedback('result');

    } catch (error) {
        console.error("Erro ao comunicar com o Back-end:", error);
        toggleFeedback('error');
        responseOutput.textContent = "Falha na conexão com a API de Processamento.";
    } finally {
        processButton.disabled = false; // Habilita o botão novamente
    }
}

copyButton.addEventListener('click', copyResponse);

// NOVO LISTENER: Lidar com a seleção de arquivo
fileUpload.addEventListener('change', handleFileUpload); 


// -------------------------------------
// 4. Lógica de Cópia (Feature Extra)
// -------------------------------------

function copyResponse() {
    // Usa a API Clipboard para copiar o texto com segurança
    navigator.clipboard.writeText(responseOutput.textContent)
        .then(() => {
            copyButton.textContent = "Copiado!";
            // Volta ao texto original após 2 segundos
            setTimeout(() => {
                copyButton.textContent = "Copiar Resposta";
            }, 2000);
        })
        .catch(err => {
            console.error('Erro ao copiar o texto:', err);
            alert('Não foi possível copiar o texto. Tente selecionar manualmente.');
        });
}



// script.js - Nova Função de Suporte
function clearAll() {
    emailInput.value = ''; // Limpa o campo de texto
    fileUpload.value = ''; 
    fileNameDisplay.textContent = "Nenhum arquivo selecionado."; 
    toggleFeedback('initial'); // Esconde resultados e erros
    emailInput.focus(); // Coloca o cursor de volta no campo
}


// script.js - Seção 5 (Event Listeners)
// Adicione o novo Listener
clearButton.addEventListener('click', clearAll);


// -------------------------------------
// 5. Event Listeners (Conectores)
// -------------------------------------

processButton.addEventListener('click', processEmail);
copyButton.addEventListener('click', copyResponse);

// Inicializa o estado da interface
document.addEventListener('DOMContentLoaded', () => {
    toggleFeedback('initial');
});