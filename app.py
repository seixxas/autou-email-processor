# app.py - CÓDIGO FINAL COM SUPORTE TXT E PDF

import os
import json
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from PyPDF2 import PdfReader # Mudado para PyPDF2 para evitar conflito de importação
from io import BytesIO
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do ficheiro .env
load_dotenv()

# --- 1. Configuração do Flask ---
app = Flask(__name__)
# CORRIGIDO: Configuração explícita do CORS para aceitar todas as origens
CORS(app, resources={r"/*": {"origins": "*"}})

# --- 2. Configuração da API do Gemini ---
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# --- 3. Função de Análise com IA ---
def analyze_email_with_gemini(email_text: str) -> dict:
    """
    Envia o texto do e-mail para a API do Gemini e retorna a resposta estruturada.
    """
    if not GEMINI_API_KEY:
        raise ValueError("A chave de API do Gemini não foi encontrada no ficheiro .env")

    # [O restante da sua função analyze_email_with_gemini permanece inalterado]
    headers = {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
    }
    
    prompt = f"""
        Analise o seguinte texto de um e-mail e classifique-o em uma de duas categorias: "Prioridade" ou "Pode Esperar".
        Depois, gere uma resposta curta e profissional apropriada para a categoria.

        Texto do E-mail:
        ---
        {email_text}
        ---

        Sua resposta DEVE ser um objeto JSON, e APENAS o objeto JSON, com a seguinte estrutura:
        {{
          "categoria": "...",
          "resposta_sugerida": "..."
        }}
    """

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json",
        }
    }

    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
        response.raise_for_status() # Lança um erro para status HTTP 4xx/5xx
        
        # A API do Gemini agora retorna o JSON diretamente
        api_response_text = response.json()['candidates'][0]['content']['parts'][0]['text']
        # Convertemos a string JSON em um dicionário Python
        return json.loads(api_response_text)
        
    except requests.exceptions.RequestException as e:
        print(f"Erro na comunicação com a API do Gemini: {e}")
        raise ConnectionError(f"Não foi possível conectar à API do Gemini. Detalhes: {e}")
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"Erro ao processar a resposta do Gemini: {e}")
        raise ValueError(f"A resposta da API do Gemini não veio no formato esperado. Detalhes: {e}")


# --- 4. Funções de Suporte (Extração de PDF/TXT) ---
def extract_text_from_pdf(file_stream) -> str:
    """
    Extrai texto de um stream de bytes de um ficheiro PDF.
    """
    try:
        # CORREÇÃO AQUI: Usando apenas PdfReader, que foi importado no topo
        pdf_reader = PdfReader(file_stream)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text.strip()
    except Exception as e:
        raise ValueError(f"Falha ao extrair texto do PDF: {e}")
    
    
def extract_text_from_txt(file_stream) -> str:
    """
    Extrai texto de um stream de bytes de um ficheiro TXT.
    """
    try:
        # Lemos o conteúdo do stream de bytes e o decodificamos
        return file_stream.read().decode('utf-8').strip()
    except UnicodeDecodeError:
        raise ValueError("Erro de codificação ao ler o arquivo TXT. Certifique-se de que é UTF-8.")
    except Exception as e:
        raise ValueError(f"Falha ao extrair texto do TXT: {e}")


# --- 5. Rotas da API ---

@app.route('/process', methods=['POST'])
def process_text_route():
    """ Rota para processar texto enviado como JSON (e-mail copiado e colado). """
    # [Mantido inalterado]
    try:
        data = request.get_json()
        email_text = data.get('email_content')
        if not email_text:
            return jsonify({"error": "Nenhum conteúdo de email fornecido."}), 400
        
        result = analyze_email_with_gemini(email_text)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

@app.route('/process_file', methods=['POST'])
def process_file_route():
    """ Rota para processar um ficheiro PDF ou TXT enviado. """
    if 'email_file' not in request.files:
        return jsonify({"error": "Nenhum ficheiro enviado."}), 400

    file = request.files['email_file']
    if file.filename == '':
        return jsonify({"error": "Nenhum ficheiro selecionado."}), 400

    filename = file.filename.lower()
    
    try:
        # Lemos o conteúdo do arquivo na memória uma única vez
        file_bytes = file.read()
        email_content = None

        if filename.endswith('.pdf'):
            # Criamos um stream de BytesIO para o PDFReader
            file_stream = BytesIO(file_bytes)
            email_content = extract_text_from_pdf(file_stream)

        elif filename.endswith('.txt'):
            # Criamos um stream de BytesIO para o extrator TXT
            file_stream = BytesIO(file_bytes)
            email_content = extract_text_from_txt(file_stream)
        
        else:
            return jsonify({"error": "Formato de arquivo não suportado. Use .txt ou .pdf."}), 400

        if not email_content:
            return jsonify({"error": "O ficheiro estava vazio ou o texto não pôde ser extraído."}), 400

        # Enviamos o texto extraído para a IA
        result = analyze_email_with_gemini(email_content)
        return jsonify(result), 200

    except ValueError as e:
        # Captura erros específicos de extração (como erro de codificação TXT ou PDF inválido)
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Captura outros erros, incluindo problemas com a API do Gemini
        return jsonify({"error": f"Erro interno ao processar ficheiro: {str(e)}"}), 500


@app.route('/', methods=['GET'])
def home():
    """ Rota para servir a página principal. """
    return render_template('index.html')

# --- 6. Execução do Servidor ---
if __name__ == '__main__':
    # Usando porta 5000 como padrão, mas permitindo variável de ambiente (bom para deploy)
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)