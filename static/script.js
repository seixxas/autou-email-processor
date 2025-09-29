// script.js

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------
    // 1. Configuração e Elementos DOM
    // -------------------------------------
    // CORRIGIDO: Usamos rotas relativas. O navegador vai automaticamente
    // usar o domínio atual (ex: https://autou-email-processor-one.vercel.app/process)
    const API_URL = '/process';
    const FILE_UPLOAD_API_URL = '/process_file';

    const emailInput = document.getElementById('email-input');
    const processButton = document.getElementById('process-button');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultBox = document.getElementById('result-box');
    const categoryOutput = document.getElementById('category-output');
    const responseOutput = document.getElementById('response-output');
    const copyButton = document.getElementById('copy-button');
    const errorMessage = document.getElementById('error-message');
    const clearButton = document.getElementById('clear-button');
    const fileUpload = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name-display');


    // -------------------------------------
    // 2. Função Principal de Processamento
    // -------------------------------------
    async function processEmail() {
        if (!processButton || !fileUpload || !emailInput) return;

        toggleFeedback('loading');
        processButton.disabled = true;

        const file = fileUpload.files ? fileUpload.files[0] : null;
        const emailContent = emailInput.value.trim();

        try {
            let response;
            
            if (file) {
                const formData = new FormData();
                formData.append('email_file', file);
                
                response = await fetch(FILE_UPLOAD_API_URL, {
                    method: 'POST',
                    body: formData,
                });
            
            } else if (emailContent.length > 0) {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email_content: emailContent }),
                });
            
            } else {
                 throw new Error("Por favor, cole o conteúdo do e-mail ou selecione um ficheiro PDF.");
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `Ocorreu um erro no servidor (HTTP ${response.status})`);
            }
            
            updateCategoryDisplay(data.categoria);
            responseOutput.textContent = data.resposta_sugerida;
            toggleFeedback('result');

        } catch (error) {
            console.error("Erro ao comunicar com o Back-end:", error);
            if(errorMessage) errorMessage.textContent = error.message;
            toggleFeedback('error');
        } finally {
            if(processButton) processButton.disabled = false;
        }
    }

    // -------------------------------------
    // 3. Funções de Suporte (UI e Interação)
    // -------------------------------------

    function handleFileUpload() {
        if (!fileUpload || !fileNameDisplay || !emailInput) return;
        const file = fileUpload.files[0];

        if (file) {
            fileNameDisplay.textContent = file.name;
            emailInput.value = '';
            toggleFeedback('initial');
        } else {
            fileNameDisplay.textContent = "Nenhum ficheiro selecionado.";
        }
    }
    
    function handleTextInput() {
        if (!fileUpload || !fileNameDisplay) return;
        
        if (fileUpload.files.length > 0) {
            fileUpload.value = '';
            fileNameDisplay.textContent = "Nenhum ficheiro selecionado.";
        }
    }

    function clearAll() {
        if(emailInput) {
            emailInput.value = '';
            emailInput.focus();
        }
        if(fileUpload) fileUpload.value = '';
        if(fileNameDisplay) fileNameDisplay.textContent = "Nenhum ficheiro selecionado.";
        toggleFeedback('initial');
    }

    function toggleFeedback(state) {
        if(loadingSpinner) loadingSpinner.classList.add('hidden');
        if(resultBox) resultBox.classList.add('hidden');
        if(errorMessage) errorMessage.classList.add('hidden');
        if(copyButton) copyButton.classList.add('hidden');

        if (state === 'loading' && loadingSpinner) {
            loadingSpinner.classList.remove('hidden');
        } else if (state === 'error' && errorMessage) {
            errorMessage.classList.remove('hidden');
        } else if (state === 'result' && resultBox && copyButton) {
            resultBox.classList.remove('hidden');
            copyButton.classList.remove('hidden');
        }
    }

    function updateCategoryDisplay(category) {
        if (!categoryOutput) return;
        categoryOutput.textContent = category;
        categoryOutput.className = 'category-tag';

        if (category === 'Prioridade') {
            categoryOutput.classList.add('tag-prioridade');
        } else if (category === 'Pode Esperar') {
            categoryOutput.classList.add('tag-pode-esperar');
        } else {
            categoryOutput.classList.add('tag-erro');
        }
    }

    function copyResponse() {
        if (!responseOutput || !copyButton) return;
        navigator.clipboard.writeText(responseOutput.textContent).then(() => {
            copyButton.textContent = "Copiado!";
            setTimeout(() => { copyButton.textContent = "Copiar Resposta"; }, 2000);
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            alert('Não foi possível copiar o texto.');
        });
    }

    // -------------------------------------
    // 4. Event Listeners
    // -------------------------------------
    if (processButton) processButton.addEventListener('click', processEmail);
    if (copyButton) copyButton.addEventListener('click', copyResponse);
    if (clearButton) clearButton.addEventListener('click', clearAll);
    if (fileUpload) fileUpload.addEventListener('change', handleFileUpload);
    if (emailInput) emailInput.addEventListener('input', handleTextInput);

    toggleFeedback('initial');
});

