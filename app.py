# app.py

# ----------------------------
# 1. Configuração e Dependências
# ----------------------------
import json
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import pipeline
import PyPDF2 
from io import BytesIO 

# Inicializa o Flask
app = Flask(__name__)
# Habilita o CORS para permitir a comunicação com o Front-end
CORS(app) 

# Variável global para o modelo de classificação do Hugging Face
classifier = None

# ----------------------------
# 2. Carregamento do Modelo de IA
# ----------------------------
try:
    print("Iniciando carregamento do modelo Hugging Face...")
    
    # Modelo pré-treinado para análise de sentimentos (RoBERTa).
    # Vamos adaptar a saída de 'Positivo'/'Negativo' para 'Improdutivo'/'Produtivo'.
    model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    classifier = pipeline("sentiment-analysis", model=model_name)
    
    print("Modelo de IA carregado com sucesso.")
except Exception as e:
    print(f"ERRO ao carregar o modelo Hugging Face: {e}")
    classifier = None

# ----------------------------
# 3. Lógica de Suporte e Geração de Resposta
# ----------------------------

def generate_response_by_category(category: str) -> str:
    """
    Gera uma resposta sugerida baseada apenas na categoria do e-mail.
    Esta lógica simples e gratuita substitui um modelo de geração de texto.
    """
    if category == "Produtivo":
        # Resposta para solicitações/problemas (tom de ação)
        return "Recebemos sua solicitação. Nosso time técnico já está analisando o seu caso e retornaremos com uma atualização de status em breve."
    
    elif category == "Improdutivo":
        # Resposta para agradecimentos/sociais (tom educado)
        return "Agradecemos muito pela sua mensagem e pelo contato. Desejamos um excelente dia e sucesso!"
    
    return "Não foi possível gerar uma resposta automática."

# app.py - Adicione esta função em algum lugar, por exemplo, após generate_response_by_category

def extract_text_from_pdf(file_stream) -> str:
    """
    Extrai texto do stream de um arquivo PDF.
    PyPDF2.PdfReader espera um objeto de arquivo aberto ou um stream (BytesIO).
    """
    try:
        pdf_reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in pdf_reader.pages:
            # O .extract_text() pode retornar None, então tratamos
            text += page.extract_text() or "" 
        return text.strip()
    except Exception as e:
        # Se a extração falhar (ex: PDF corrompido ou criptografado), lançamos
        raise ValueError(f"Falha ao extrair texto do PDF: {e}")


def process_email_with_ai(email_text: str) -> dict:
    """
    Classifica o email usando o modelo Hugging Face e gera a resposta.
    """
    if not classifier:
        return {"category": "Erro", "suggested_response": "Serviço de IA indisponível. Modelo de classificação não carregado."}, 503

    try:
        # 1. Classificação do Sentimento com Hugging Face
        results = classifier(email_text)
        label = results[0]['label']
        
        # 2. Definição de Palavras-Chave de Ação
        # Usamos minúsculas para simplificar a comparação
        email_text_lower = email_text.lower()
        
        action_keywords = [
            "bloqueado", "problema", "falha", "urgente", "defeito", 
            "preciso", "solicito", "reembolso", "cancelar", "erro"
        ]
        
        # Verifica se alguma palavra-chave está presente
        has_action_keyword = any(keyword in email_text_lower for keyword in action_keywords)
        
        # 3. Lógica Otimizada de Mapeamento (Regras de Desempate)
        
        if label == "LABEL_2": # Regra 1: Sentimento Positivo (Elogio, Agradecimento)
            category = "Improdutivo" 
            
        elif has_action_keyword: # Regra 2: Sentimento Neutro/Negativo E tem palavra-chave de Ação
            category = "Produtivo"
            
        else: # Regra 3: Sentimento Neutro/Negativo MAS SEM palavras-chave de Ação
              # Isso captura e-mails neutros que a IA não entende como Improdutivos
            category = "Improdutivo"

        # 4. Geração da Resposta
        suggested_response = generate_response_by_category(category)

        # Retorna o resultado no formato JSON esperado
        return {
            "category": category,
            "suggested_response": suggested_response
        }

    except Exception as e:
        print(f"Erro no processamento da IA: {e}")
        return {"category": "Erro", "suggested_response": "Erro ao processar o email."}, 500


# ----------------------------
# 4. Rota Principal da API (POST)
# ----------------------------

@app.route('/process', methods=['POST'])
def process_email():
    """
    Recebe o JSON do front-end com o 'email_content', processa e retorna o resultado.
    """
    try:
        data = request.get_json()
        email_text = data.get('email_content')
    except Exception:
        # Retorna 400 se o JSON estiver mal formatado
        return jsonify({"error": "Requisição inválida. Esperado um JSON com 'email_content'."}), 400

    if not email_text:
        return jsonify({"error": "Nenhum conteúdo de email fornecido."}), 400

    result = process_email_with_ai(email_text)

    # Lida com erros internos (como o 503)
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]

    # Sucesso (200 OK)
    return jsonify(result)


# ----------------------------
# 5. Rota Simples de Teste (GET)
# ----------------------------

@app.route('/', methods=['GET'])
def home():
    """
    Serve o arquivo HTML principal usando o render_template.
    """
    return render_template('index.html') 



@app.route('/process_file', methods=['POST'])
def process_file_route():
    """
    Recebe um arquivo (PDF ou TXT), extrai o texto e o processa.
    """
    if 'email_file' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado."}), 400

    file = request.files['email_file']
    
    try:
        file_extension = file.filename.lower().rsplit('.', 1)[-1]
        
        # Leitura e extração do conteúdo
        if file_extension == 'pdf':
            # PyPDF2 funciona melhor lendo o objeto de arquivo que o Flask fornece diretamente
            # Ou o seu conteúdo binário bruto:
            file_stream = BytesIO(file.read())
            email_content = extract_text_from_pdf(file_stream)
        
        elif file_extension == 'txt':
            # Decodificamos o conteúdo binário como texto
            email_content = file.read().decode('utf-8')
        
        else:
            return jsonify({"error": "Formato de arquivo não suportado. Use .txt ou .pdf"}), 400

        # Chama a função de processamento de IA (a lógica de negócio)
        if not email_content.strip():
            return jsonify({"error": "O arquivo estava vazio ou o texto não pôde ser extraído."}), 400

        result = process_email_with_ai(email_content)
        
        return jsonify(result), 200

    except ValueError as ve:
        # Erro específico de extração de PDF
        return jsonify({"error": str(ve)}), 400
        
    except Exception as e:
        app.logger.error(f"Erro geral ao processar arquivo: {e}")
        return jsonify({"error": f"Erro interno no servidor ao ler o arquivo: {str(e)}"}), 500
# ----------------------------
# 6. Execução do Servidor
# ----------------------------

if __name__ == '__main__':
    # Quando for para o deploy, lembre-se de desativar 'debug=True'
    app.run(debug=True)