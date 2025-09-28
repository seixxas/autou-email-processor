# AutoU Email Classifier (Processador de E-mail com IA)

![Badge de Tecnologia](https://img.shields.io/badge/Tecnologia-Python%20%7C%20Flask-blue)
![Badge de IA](https://img.shields.io/badge/IA%20Model-HuggingFace-orange)
![Badge de Front-end](https://img.shields.io/badge/Front--end-HTML%20%7C%20CSS%20%7C%20JS-yellow)

---

## 💡 Ideia e Propósito do Projeto

O **AutoU Email Classifier** é uma ferramenta inteligente desenvolvida para aumentar a **produtividade** de profissionais que lidam com um alto volume de comunicações por e-mail.

O objetivo principal é **classificar automaticamente** o corpo de um e-mail em duas categorias chave:

1.  **Produtivo:** Requer ação, resposta ou atenção imediata.
2.  **Improdutivo:** Informações que podem ser arquivadas, lidas posteriormente, ou são ruído (ex: newsletters, notificações automáticas, spam leve).

Além da classificação, a ferramenta utiliza uma IA Generativa para criar uma **sugestão de resposta** imediata, economizando tempo na redação e mantendo o fluxo de trabalho ágil.

---

## ✨ Funcionalidades Principais

* **Classificação Inteligente:** Determina se o e-mail é **Produtivo** ou **Improdutivo**.
* **Geração de Resposta:** Cria uma sugestão de resposta concisa baseada no conteúdo e na categoria do e-mail.
* **Múltiplas Entradas:** Aceita o e-mail via **colagem direta de texto** ou **Upload de Arquivos (.txt e .pdf)**.
* **Interface Moderna (Dark Mode):** Experiência do usuário agradável com um design escuro e responsivo, seguindo a identidade visual da marca (toques em laranja).
* **Feedback Visual:** Indicadores de carregamento e botões de cópia com feedback de sucesso.

---

## 🧠 Tecnologia de Inteligência Artificial

A inteligência do projeto é impulsionada por modelos do **Hugging Face**, a plataforma líder em Machine Learning de código aberto.

| Função | Modelo Hugging Face | Pipeline |
| :--- | :--- | :--- |
| **Classificação** | `text-classification` | Determina Produtivo/Improdutivo. |
| **Geração de Resposta** | `text2text-generation` (Ex: Bart ou T5) | Cria o texto da resposta sugerida. |

Utilizamos o pipeline **Zero-Shot Classification** para a classificação, permitindo que o modelo decida a categoria sem ter sido treinado especificamente nesses labels, garantindo **flexibilidade** e **eficiência**.

---

## 🛠️ Arquitetura do Projeto

O projeto segue uma arquitetura **Backend-Driven** simples, utilizando Python e Flask:

| Componente | Linguagens/Tecnologias | Função |
| :--- | :--- | :--- |
| **Backend (API)** | **Python, Flask, Transformers** | Roteamento, carregamento e execução dos modelos de IA, tratamento de erros e extração de texto de arquivos (.pdf via `PyPDF2`). |
| **Frontend (Interface)** | **HTML5, CSS3, JavaScript** | Interface de usuário (UI) para colagem de texto e upload de arquivos. Lógica para enviar dados à API e exibir os resultados dinamicamente. |
| **Rotas da API** | `/process` (POST), `/process_file` (POST) | Recebem o conteúdo do e-mail (texto ou arquivo) e retornam a categoria e a resposta gerada pela IA em formato JSON. |

---

## 🚀 Instalação e Execução Local

Para rodar este projeto em sua máquina local, siga os passos abaixo:

### Pré-requisitos

* Python 3.8+
* `pip` (Gerenciador de pacotes Python)

### 1. Clonar o Repositório

```bash
git clone [https://www.youtube.com/watch?v=X49Wz3icO3E](https://www.youtube.com/watch?v=X49Wz3icO3E)
cd autou-email-processor


2. Configurar e Ativar o Ambiente Virtual 

# Cria o ambiente virtual
python -m venv venv

# Ativação do ambiente virtual:
# No Windows (cmd/PowerShell):
.\venv\Scripts\activate

# No Linux/macOS (Bash/Git Bash):
source venv/bin/activate


3. Instalar Dependências

pip install -r requirements.txt

4. Iniciar o Servidor Flask

python app.py