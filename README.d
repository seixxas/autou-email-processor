# AutoU Email Classifier (Processador de E-mail com IA)

![Badge de Tecnologia](https://img.shields.io/badge/Tecnologia-Python%20%7C%20Flask-blue)
![Badge de IA](https://img.shields.io/badge/IA%20Model-Google%20Gemini%20API-orange)
![Badge de Front-end](https://img.shields.io/badge/Front--end-HTML%20%7C%20CSS%20%7C%20JS-yellow)

---

## 💡 Ideia e Propósito do Projeto

O **AutoU Email Classifier** é uma ferramenta inteligente desenvolvida para aumentar a **produtividade** de profissionais que lidam com um alto volume de comunicações por e-mail.

O objetivo principal é **classificar automaticamente** o corpo de um e-mail em duas categorias chave:

1.  **Prioridade:** Requer ação, resposta ou atenção imediata.
2.  **Pode Esperar:** Informações que podem ser arquivadas, lidas posteriormente, ou são ruído (ex: newsletters, notificações automáticas, spam leve).

Além da classificação, a ferramenta utiliza uma IA Generativa para criar uma **sugestão de resposta** imediata, economizando tempo na redação e mantendo o fluxo de trabalho ágil.

---

## ✨ Funcionalidades Principais

* **Classificação Inteligente:** Determina se o e-mail é de **Prioridade** ou **Pode Esperar**.
* **Geração de Resposta:** Cria uma sugestão de resposta concisa baseada no conteúdo e na categoria do e-mail.
* **Múltiplas Entradas:** Aceita o e-mail via **colagem direta de texto** ou **Upload de Arquivos (.txt e .pdf)**.
* **Interface Moderna (Dark Mode):** Experiência do usuário agradável com um design escuro e responsivo.
* **Feedback Visual:** Indicadores de carregamento e botões de cópia com feedback de sucesso.

---

## 🧠 Tecnologia de Inteligência Artificial

A inteligência do projeto é impulsionada pela **Gemini API** do Google, utilizando o modelo **Gemini 2.0 Flash** para processamento rápido e eficiente.

O modelo é instruído via *prompt engineering* a analisar o corpo do e-mail e retornar uma resposta estruturada em JSON, garantindo que a classificação (**Prioridade** ou **Pode Esperar**) e a sugestão de resposta sejam fornecidas de forma coesa em uma única chamada de API.

---

## 🛠️ Arquitetura do Projeto

O projeto segue uma arquitetura **Backend-Driven** simples, utilizando **Python** e o framework **Flask**:

| Componente | Linguagens/Tecnologias | Função |
| :--- | :--- | :--- |
| **Backend (API)** | **Python, Flask, PyPDF2, Gemini API** | Roteamento, extração de texto de arquivos (.txt e .pdf), comunicação segura com a Gemini API e tratamento de erros. |
| **Frontend (Interface)** | **HTML5, CSS3, JavaScript** | Interface de usuário (UI) para colagem de texto e upload de arquivos. Lógica assíncrona para enviar dados à API e exibir os resultados dinamicamente. |
| **Rotas da API** | `/process` (POST), `/process_file` (POST) | Recebem o conteúdo do e-mail (texto ou arquivo) e retornam a categoria e a resposta gerada pela IA em formato JSON. |

---

## 🚀 Instalação e Execução Local

Para rodar este projeto em sua máquina local, siga os passos abaixo:

### Pré-requisitos

* Python 3.8+
* `pip` (Gerenciador de pacotes Python)

### 1. Clonar o Repositório

```bash
git clone [https://www.youtube.com/shorts/apr341idq8U](https://www.youtube.com/shorts/apr341idq8U)
cd autou-email-classifier


2. Configurar e Ativar o Ambiente Virtual
Bash

# Cria o ambiente virtual
python -m venv venv

# Ativação do ambiente virtual:
# No Windows (cmd/PowerShell):
.\venv\Scripts\activate

# No Linux/macOS (Bash/Git Bash):
source venv/bin/activate

Parceiro de Programacao
Entendido! Farei as alterações necessárias no seu README.md, substituindo todas as referências ao Hugging Face pela Gemini API e atualizando as categorias para as que estão sendo usadas no seu código Python (Prioridade e Pode Esperar).

Aqui está o novo README.md formatado:

Markdown

# AutoU Email Classifier (Processador de E-mail com IA)

![Badge de Tecnologia](https://img.shields.io/badge/Tecnologia-Python%20%7C%20Flask-blue)
![Badge de IA](https://img.shields.io/badge/IA%20Model-Google%20Gemini%20API-orange)
![Badge de Front-end](https://img.shields.io/badge/Front--end-HTML%20%7C%20CSS%20%7C%20JS-yellow)

---

## 💡 Ideia e Propósito do Projeto

O **AutoU Email Classifier** é uma ferramenta inteligente desenvolvida para aumentar a **produtividade** de profissionais que lidam com um alto volume de comunicações por e-mail.

O objetivo principal é **classificar automaticamente** o corpo de um e-mail em duas categorias chave:

1.  **Prioridade:** Requer ação, resposta ou atenção imediata.
2.  **Pode Esperar:** Informações que podem ser arquivadas, lidas posteriormente, ou são ruído (ex: newsletters, notificações automáticas, spam leve).

Além da classificação, a ferramenta utiliza uma IA Generativa para criar uma **sugestão de resposta** imediata, economizando tempo na redação e mantendo o fluxo de trabalho ágil.

---

## ✨ Funcionalidades Principais

* **Classificação Inteligente:** Determina se o e-mail é de **Prioridade** ou **Pode Esperar**.
* **Geração de Resposta:** Cria uma sugestão de resposta concisa baseada no conteúdo e na categoria do e-mail.
* **Múltiplas Entradas:** Aceita o e-mail via **colagem direta de texto** ou **Upload de Arquivos (.txt e .pdf)**.
* **Interface Moderna (Dark Mode):** Experiência do usuário agradável com um design escuro e responsivo.
* **Feedback Visual:** Indicadores de carregamento e botões de cópia com feedback de sucesso.

---

## 🧠 Tecnologia de Inteligência Artificial

A inteligência do projeto é impulsionada pela **Gemini API** do Google, utilizando o modelo **Gemini 2.0 Flash** para processamento rápido e eficiente.

O modelo é instruído via *prompt engineering* a analisar o corpo do e-mail e retornar uma resposta estruturada em JSON, garantindo que a classificação (**Prioridade** ou **Pode Esperar**) e a sugestão de resposta sejam fornecidas de forma coesa em uma única chamada de API.

---

## 🛠️ Arquitetura do Projeto

O projeto segue uma arquitetura **Backend-Driven** simples, utilizando **Python** e o framework **Flask**:

| Componente | Linguagens/Tecnologias | Função |
| :--- | :--- | :--- |
| **Backend (API)** | **Python, Flask, PyPDF2, Gemini API** | Roteamento, extração de texto de arquivos (.txt e .pdf), comunicação segura com a Gemini API e tratamento de erros. |
| **Frontend (Interface)** | **HTML5, CSS3, JavaScript** | Interface de usuário (UI) para colagem de texto e upload de arquivos. Lógica assíncrona para enviar dados à API e exibir os resultados dinamicamente. |
| **Rotas da API** | `/process` (POST), `/process_file` (POST) | Recebem o conteúdo do e-mail (texto ou arquivo) e retornam a categoria e a resposta gerada pela IA em formato JSON. |

---

## 🚀 Instalação e Execução Local

Para rodar este projeto em sua máquina local, siga os passos abaixo:

### Pré-requisitos

* Python 3.8+
* `pip` (Gerenciador de pacotes Python)

### 1. Clonar o Repositório

```
git clone [https://www.youtube.com/shorts/apr341idq8U](https://www.youtube.com/shorts/apr341idq8U)
cd autou-email-classifier
2. Configurar e Ativar o Ambiente Virtual


# Cria o ambiente virtual
python -m venv venv

# Ativação do ambiente virtual:
# No Windows (cmd/PowerShell):
.\venv\Scripts\activate

# No Linux/macOS (Bash/Git Bash):
source venv/bin/activate
3. Instalar Dependências e Chave de API
A. Instalar Pacotes


pip install -r requirements.txt
B. Configurar Chave da Gemini API (Essencial!)

Crie um arquivo chamado .env na raiz do projeto e adicione sua chave da Gemini API:

# .env
GEMINI_API_KEY="SUA_CHAVE_AQUI"
4. Iniciar o Servidor Flask

python app.py