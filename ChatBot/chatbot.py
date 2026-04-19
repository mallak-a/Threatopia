import os
import sys
import math
import re
import joblib
import numpy as np
import pandas as pd
from urllib.parse import urlparse, parse_qs
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

DATA_DIR = 'data'
QA_PATH = os.path.join(DATA_DIR, 'cybersecurity-qa-v1.csv')
G6_PATH = os.path.join(DATA_DIR, '6G_Network_Slicing_Security_DatasetR.csv')
MODEL_DIR = 'models'
URL_MODEL_PATH = os.path.join(MODEL_DIR, 'rf_url_model.pkl')
TFIDF_VECT_PATH = os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl')
TFIDF_MATRIX_PATH = os.path.join(MODEL_DIR, 'tfidf_matrix.pkl')
ANSWERS_PATH = os.path.join(MODEL_DIR, 'answers.pkl')
T5_TOKENIZER_DIR = os.path.join(MODEL_DIR, 't5_qa_tokenizer')
T5_MODEL_DIR = os.path.join(MODEL_DIR, 't5_qa_model')

try:
    stopwords.words('english')
    word_tokenize('test')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')

lemmatizer = WordNetLemmatizer()

SIMPLE_QA = {
    "what is phishing": "Phishing is a scam where attackers trick you into giving sensitive information by pretending to be trustworthy. Always check URLs and don't click suspicious links.",
    "how to secure my account": "Use strong, unique passwords, enable two-factor authentication (2FA), and change passwords regularly. Avoid sharing credentials.",
    "what is malware": "Malware is malicious software that can harm your computer. Protect yourself with antivirus software and avoid downloading from unknown sources.",
    "how to protect against viruses": "Install antivirus software, keep your system updated, and be cautious with email attachments and downloads.",
    "what is a firewall": "A firewall monitors and controls incoming and outgoing network traffic based on security rules.",
    "how to create a strong password": "Use 12+ characters with uppercase, lowercase, numbers, and symbols. Example: Tr0pic@l$un2024! - Never use personal info or common words.",
    "strong password": "Use 12+ characters with uppercase, lowercase, numbers, and symbols. Example: Tr0pic@l$un2024! - Never use personal info or common words.",
    "give me a password": "Use 12+ characters with uppercase, lowercase, numbers, and symbols. Example: Tr0pic@l$un2024! - Never use personal info or common words.",
    "what is two-factor authentication": "2FA adds an extra layer of security by requiring a second form of verification such as a code or an authenticator app.",
    "how to spot a scam email": "Check suspicious senders, urgent language, unexpected attachments, and verify links before clicking.",
    "what is encryption": "Encryption converts data into a coded format to prevent unauthorized access.",
    "how to stay safe online": "Use strong passwords, enable 2FA, keep software updated, avoid public Wi-Fi for sensitive tasks, and be skeptical of unsolicited requests.",
    "what are url risks": "URL risks include phishing links, malicious redirects, fake domains, and malware downloads. Always use HTTPS, check for padlock icons, and avoid clicking suspicious links.",
    "what is network slicing": "Network slicing is a technology in 5G and 6G networks that divides the physical network into virtual slices, each optimized for specific services like IoT, autonomous vehicles, or emergency communications.",
    "who are you": "I am a cybersecurity awareness chatbot designed to provide information and tips on staying safe online.",
    "what do you know about me": "I don't have access to personal information about users. I'm here to help with cybersecurity questions and advice.",
    "what is ransomware": "Ransomware is malware that encrypts your files and demands payment for decryption. Backup your data regularly and never pay ransom.",
    "what is a vpn": "A VPN encrypts your internet connection and masks your IP address, protecting privacy on public Wi-Fi.",
    "what is multi-factor authentication": "Multi-factor authentication requires multiple forms of verification making accounts much harder to compromise.",
    "how to protect my password": "Never share passwords, use unique passwords for each account, enable password managers, and change them regularly.",
    "what is a data breach": "A data breach is unauthorized access to sensitive information. Monitor accounts and enable alerts if your data is exposed.",
    "what is social engineering": "Social engineering manipulates people into divulging information through deception rather than technical hacking.",
    "what is cybersecurity": "Cybersecurity is the practice of protecting systems, networks, and data from digital attacks and unauthorized access.",
    "hello": "Hello! I'm here to help with cybersecurity questions and tips.",
    "hi": "Hi! How can I assist you with cybersecurity today?",
    "hey": "Hey there! What cybersecurity question can I answer for you?",
    "how are you": "I'm doing well, thank you! Ready to help with cybersecurity awareness.",
    "good morning": "Good morning! Let's talk about staying safe online.",
    "good afternoon": "Good afternoon! How can I help with cybersecurity?",
    "good evening": "Good evening! Ready for some cybersecurity tips?"
}

OFF_TOPIC_LINKS = {
    'recipe': 'https://www.allrecipes.com',
    'cooking': 'https://www.allrecipes.com',
    'health': 'https://www.webmd.com',
    'medical': 'https://www.webmd.com',
    'programming': 'https://stackoverflow.com',
    'python': 'https://www.python.org',
    'football': 'https://www.fifa.com',
    'soccer': 'https://www.fifa.com',
    'movie': 'https://www.imdb.com',
    'weather': 'https://www.weather.com',
    'news': 'https://www.bbc.com',
    'sports': 'https://www.espn.com',
    'travel': 'https://www.lonelyplanet.com'
}

URL_TYPE_MAP = {
    0: 'benign',
    1: 'defacement',
    2: 'phishing',
    3: 'malware'
}

URL_SHORTENERS = {
    'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'shorturl.at', 'rebrand.ly'
}

SUSPICIOUS_TLDS = {
    'zip', 'review', 'country', 'click', 'link', 'online', 'top', 'win', 'work', 'loan', 'trade',
    'xyz', 'pw', 'info', 'biz', 'ru', 'cn', 'ml', 'ga', 'tk'
}

BRAND_KEYWORDS = {
    'paypal', 'google', 'facebook', 'amazon', 'apple', 'microsoft', 'bank', 'appleid', 'icloud', 'netflix',
    'microsoftonline', 'dropbox', 'office', 'outlook', 'instagram', 'twitter', 'secure', 'login'
}

SECURITY_KEYWORDS = {'secure', 'ssl', 'https', 'verify', 'account', 'password', 'update', 'validate', 'auth'}
URGENT_KEYWORDS = {'urgent', 'immediately', 'verify', 'update', 'action required', 'login', 'security'}

NETWORK_TERMS = {
    'anomaly', 'latency', 'jitter', 'packet loss', 'network slice', 'network slicing',
    'traffic', 'bandwidth', 'encryption', 'access control', 'device behavior', 'threat'
}

URL_FEATURE_ORDER = [
    'web_is_live', 'web_security_score', 'web_forms_count', 'web_password_fields', 'web_has_login',
    'web_ssl_valid', 'url_len', '@', '?', '-', '=', '.', '#', '%', '+', '$', '!', '*', ',', '//',
    'digits', 'letters', 'abnormal_url', 'https', 'Shortining_Service', 'having_ip_address',
    'defac_has_hacked_terms', 'defac_has_suspicious_ext', 'defac_path_depth', 'defac_is_deep_path',
    'defac_path_underscores', 'defac_is_gov_edu', 'defac_has_index_php', 'defac_has_option_param',
    'phish_has_brand', 'phish_brand_in_subdomain', 'phish_brand_in_path', 'phish_hyphen_count',
    'phish_digit_count', 'phish_long_domain', 'phish_many_subdomains', 'phish_suspicious_tld',
    'phish_keyword_count', 'phish_has_redirect', 'phish_param_count', 'phish_encoded_chars',
    'enh_urgency_count', 'enh_security_count', 'enh_brand_count', 'enh_brand_hijack',
    'enh_subdomain_count', 'enh_long_path', 'enh_many_params', 'enh_suspicious_tld',
    'adv_domain_ngram_entropy', 'adv_path_entropy', 'adv_consonant_ratio', 'adv_vowel_ratio',
    'adv_digit_ratio', 'adv_subdomain_count', 'adv_avg_subdomain_len', 'adv_token_count',
    'adv_avg_token_length'
]

vectorizer = None
tfidf_matrix = None
answers = None
gen_tokenizer = None
gen_model = None
url_model = None
g6_insight = None


def preprocess_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    tokens = [lemmatizer.lemmatize(word) for word in tokens]
    return ' '.join(tokens)


def load_tfidf_models():
    if os.path.exists(QA_PATH):
        df = pd.read_csv(QA_PATH)
        if 'question' in df.columns and 'answer' in df.columns:
            df = df.dropna(subset=['question', 'answer'])
            df['question_clean'] = df['question'].apply(preprocess_text)
            questions = df['question_clean'].astype(str).tolist()
            answers_list = df['answer'].astype(str).tolist()
            vectorizer_local = TfidfVectorizer(max_features=5000)
            tfidf_matrix_local = vectorizer_local.fit_transform(questions)
            return vectorizer_local, tfidf_matrix_local, answers_list

    vectorizer_local = joblib.load(TFIDF_VECT_PATH)
    tfidf_matrix_local = joblib.load(TFIDF_MATRIX_PATH)
    answers_list = joblib.load(ANSWERS_PATH)
    return vectorizer_local, tfidf_matrix_local, answers_list


def load_url_classifier():
    if os.path.exists(URL_MODEL_PATH):
        return joblib.load(URL_MODEL_PATH)
    return None


def load_6g_insight():
    if not os.path.exists(G6_PATH):
        return None
    try:
        df = pd.read_csv(G6_PATH)
        if 'anomaly_label' not in df.columns:
            return None
        numeric_columns = []
        for col in df.columns:
            if col != 'anomaly_label':
                try:
                    pd.to_numeric(df[col], errors='coerce')
                    numeric_columns.append(col)
                except:
                    pass
        if not numeric_columns:
            return None
        df = df.dropna(subset=['anomaly_label'])
        df[numeric_columns] = df[numeric_columns].fillna(0)
        X = df[numeric_columns].astype(float)
        y = df['anomaly_label'].astype(int)
        model = RandomForestClassifier(n_estimators=20, random_state=42)
        model.fit(X, y)
        importances = list(zip(numeric_columns, model.feature_importances_))
        importances.sort(key=lambda item: item[1], reverse=True)
        return {
            'anomaly_rate': float(y.mean()),
            'top_features': [feature for feature, _ in importances[:5]]
        }
    except Exception as e:
        print(f"Warning: Could not load 6G insights: {e}")
        return None


def extract_url_features(url):
    if not isinstance(url, str) or not url.strip():
        return None
    text = url.strip()
    if not text.startswith(('http://', 'https://')):
        text = 'http://' + text
    parsed = urlparse(text)
    domain = parsed.netloc.lower()
    if domain.startswith('www.'):
        domain = domain[4:]
    path = parsed.path or ''
    query = parsed.query or ''
    params = parse_qs(query)
    full_path = path + ('?' + query if query else '')
    domain_parts = [part for part in domain.split('.') if part]
    top_level = domain_parts[-1] if domain_parts else ''
    subdomains = domain_parts[:-2] if len(domain_parts) > 2 else []
    path_tokens = [t for t in re.split(r'[^a-zA-Z0-9]+', full_path) if t]

    def count_keywords(keywords):
        lower_text = text.lower()
        return sum(lower_text.count(keyword) for keyword in keywords)

    has_ip = bool(re.match(r'^(?:\d{1,3}\.){3}\d{1,3}$', domain))
    abnormal_url = int(bool(re.search(r'[^a-zA-Z0-9\-\._:/?&=%#]', text)))
    features = {
        'web_is_live': 1.0 if parsed.scheme in ('http', 'https') else 0.0,
        'web_security_score': 1.0 if parsed.scheme == 'https' else 0.0,
        'web_forms_count': 0.0,
        'web_password_fields': 0.0,
        'web_has_login': float(int(bool(re.search(r'login|signin|authenticate|auth', text, re.I)))),
        'web_ssl_valid': 1.0 if parsed.scheme == 'https' else 0.0,
        'url_len': float(len(text)),
        '@': float(text.count('@')),
        '?': float(text.count('?')),
        '-': float(text.count('-')),
        '=': float(text.count('=')),
        '.': float(text.count('.')),
        '#': float(text.count('#')),
        '%': float(text.count('%')),
        '+': float(text.count('+')),
        '$': float(text.count('$')),
        '!': float(text.count('!')),
        '*': float(text.count('*')),
        ',': float(text.count(',')),
        '//': float(text.count('//')),
        'digits': float(sum(ch.isdigit() for ch in text)),
        'letters': float(sum(ch.isalpha() for ch in text)),
        'abnormal_url': float(abnormal_url),
        'https': float(int(parsed.scheme == 'https')),
        'Shortining_Service': float(int(domain in URL_SHORTENERS)),
        'having_ip_address': float(int(has_ip)),
        'defac_has_hacked_terms': float(int(bool(re.search(r'hacked|deface|defacement', text, re.I)))),
        'defac_has_suspicious_ext': 0.0,
        'defac_path_depth': float(len(path_tokens)),
        'defac_is_deep_path': float(int(len(path_tokens) > 5)),
        'defac_path_underscores': float(int('_' in path)),
        'defac_is_gov_edu': float(int(top_level in {'gov', 'edu'})),
        'defac_has_index_php': float(int('index.php' in path.lower())),
        'defac_has_option_param': float(int('option=' in query.lower())),
        'phish_has_brand': float(int(any(brand in text.lower() for brand in BRAND_KEYWORDS))),
        'phish_brand_in_subdomain': float(int(any(brand in sub for brand in BRAND_KEYWORDS for sub in subdomains))),
        'phish_brand_in_path': float(int(any(brand in path.lower() for brand in BRAND_KEYWORDS))),
        'phish_hyphen_count': float(text.count('-')),
        'phish_digit_count': float(sum(ch.isdigit() for ch in text)),
        'phish_long_domain': float(int(len(domain) > 20)),
        'phish_many_subdomains': float(int(len(subdomains) > 2)),
        'phish_suspicious_tld': float(int(top_level in SUSPICIOUS_TLDS)),
        'phish_keyword_count': float(count_keywords({'login', 'secure', 'account', 'verify', 'update', 'bank', 'payment'})),
        'phish_has_redirect': float(int(bool(re.search(r'redirect|redir|url=|next=', query, re.I)))),
        'phish_param_count': float(len(params)),
        'phish_encoded_chars': float(text.count('%')),
        'enh_urgency_count': float(count_keywords(URGENT_KEYWORDS)),
        'enh_security_count': float(count_keywords(SECURITY_KEYWORDS)),
        'enh_brand_count': float(int(any(brand in text.lower() for brand in BRAND_KEYWORDS))),
        'enh_brand_hijack': float(int(any(brand in text.lower() for brand in BRAND_KEYWORDS) and '-' in domain)),
        'enh_subdomain_count': float(len(subdomains)),
        'enh_long_path': float(int(len(path) > 30)),
        'enh_many_params': float(int(len(params) > 3)),
        'enh_suspicious_tld': float(int(top_level in SUSPICIOUS_TLDS)),
        'adv_domain_ngram_entropy': float(sum((ch.isalpha() or ch.isdigit()) for ch in domain) / max(1, len(domain))),
        'adv_path_entropy': float(sum((ch.isalpha() or ch.isdigit()) for ch in path) / max(1, len(path))),
        'adv_consonant_ratio': float(sum(ch.lower() in 'bcdfghjklmnpqrstvwxyz' for ch in text) / max(1, len(text))),
        'adv_vowel_ratio': float(sum(ch.lower() in 'aeiou' for ch in text) / max(1, len(text))),
        'adv_digit_ratio': float(sum(ch.isdigit() for ch in text) / max(1, len(text))),
        'adv_subdomain_count': float(len(subdomains)),
        'adv_avg_subdomain_len': float(np.mean([len(sub) for sub in subdomains]) if subdomains else 0.0),
        'adv_token_count': float(len(path_tokens)),
        'adv_avg_token_length': float(np.mean([len(token) for token in path_tokens]) if path_tokens else 0.0)
    }
    return [features[name] for name in URL_FEATURE_ORDER]


def classify_url(url, url_model):
    if url_model is None:
        return None
    feature_vector = extract_url_features(url)
    if feature_vector is None:
        return None
    prediction = int(url_model.predict([feature_vector])[0])
    label = URL_TYPE_MAP.get(prediction, 'unknown')
    explanation = f"This URL appears most likely to be {label}."
    try:
        probabilities = url_model.predict_proba([feature_vector])[0]
        confidence = max(probabilities)
        explanation += f" Confidence {confidence:.2f}."
    except Exception:
        pass
    if label == 'phishing':
        explanation += ' It contains signs of phishing such as suspicious keywords, redirection, or an odd domain.'
    elif label == 'malware':
        explanation += ' It may be malicious and should be avoided or scanned carefully.'
    elif label == 'defacement':
        explanation += ' It may be part of a defaced or compromised page.'
    else:
        explanation += ' It looks more like a benign URL, but always verify before entering credentials.'
    return explanation


def is_url(text):
    if not isinstance(text, str):
        return False
    text = text.strip()
    if text.startswith(('http://', 'https://')):
        return True
    return bool(re.search(r'\b(www\.|https?://|[a-z0-9-]+\.(com|net|org|info|biz|ru|cn|xyz))\b', text, re.I))


def network_insight(question, g6_insight):
    if g6_insight is None:
        return None
    question_lower = question.lower()
    if any(term in question_lower for term in NETWORK_TERMS):
        top_features = ', '.join(g6_insight['top_features'])
        anomaly_pct = g6_insight['anomaly_rate'] * 100
        return (
            f"Based on the 6G network slicing security dataset, about {anomaly_pct:.1f}% of records are labeled as anomalies. "
            f"The strongest indicators are {top_features}. High latency, jitter, packet loss, low device behavior score, "
            f"and access control violations are common signs of an issue."
        )
    return None


def retrieve_answer(question, similarity_threshold=0.35):
    question_clean = preprocess_text(question)
    if not question_clean.strip():
        return None, 0.0
    question_vec = vectorizer.transform([question_clean])
    similarities = cosine_similarity(question_vec, tfidf_matrix)[0]
    best_idx = int(np.argmax(similarities))
    best_score = float(similarities[best_idx])
    best_answer = answers[best_idx]
    if best_score >= similarity_threshold:
        return best_answer, best_score
    return None, best_score


def get_simple_answer(question):
    question_lower = question.lower().strip()
    for key, answer in SIMPLE_QA.items():
        if key in question_lower:
            return answer
    return None


def get_off_topic_link(question_lower):
    for keyword, url in OFF_TOPIC_LINKS.items():
        if keyword in question_lower:
            return url
    return None


def generate_fallback_answer(question):
    question_lower = question.lower()
    cybersecurity_keywords = ['secure', 'password', 'hack', 'attack', 'malware', 'phishing', 'virus', 'threat', 'risk', 'protection', 'safe', 'encrypt', 'network', 'cyber', 'privacy', 'data', 'account', 'email', 'url', 'link', 'access', 'breach', 'fraud', 'scam', 'ssl', 'https']
    
    if not any(keyword in question_lower for keyword in cybersecurity_keywords):
        link = get_off_topic_link(question_lower)
        if link:
            return f"I'm specifically designed to answer cybersecurity questions. For that topic, try: {link}"
        return "I'm specifically designed to answer cybersecurity questions. Please ask me about online safety, passwords, phishing, malware, encryption, or other cybersecurity topics."
    
    prompt = (
        "As a cybersecurity expert, answer this question about online safety, data protection, or cybersecurity in a clear and helpful way: "
        f"{question}"
    )
    input_ids = gen_tokenizer.encode(prompt, return_tensors='pt')
    outputs = gen_model.generate(input_ids, max_length=150, num_beams=4, early_stopping=True)
    return gen_tokenizer.decode(outputs[0], skip_special_tokens=True)


def get_answer(question):
    simple_answer = get_simple_answer(question)
    if simple_answer:
        return simple_answer
    if is_url(question):
        url_answer = classify_url(question, url_model)
        if url_answer:
            return url_answer
    network_answer = network_insight(question, g6_insight)
    if network_answer:
        retrieval_answer, score = retrieve_answer(question, similarity_threshold=0.50)
        if retrieval_answer and score > 0.50:
            return f"{network_answer}\n\nAlso, here is a matched answer from the cybersecurity knowledge base:\n{retrieval_answer}"
        return network_answer
    if any(keyword in question.lower() for keyword in ['phishing', 'website', 'ssl', 'https', 'login', 'bank', 'check', 'safe', 'suspicious']):
        proxy_url_answer = classify_url(question, url_model)
        if proxy_url_answer:
            return proxy_url_answer
    off_topic_link = get_off_topic_link(question.lower())
    if off_topic_link:
        return f"I'm specifically designed to answer cybersecurity questions. For this topic, try: {off_topic_link}"
    retrieval_answer, score = retrieve_answer(question, similarity_threshold=0.50)
    if retrieval_answer and score > 0.50:
        return retrieval_answer
    return generate_fallback_answer(question)


def load_models():
    global vectorizer, tfidf_matrix, answers, gen_tokenizer, gen_model, url_model, g6_insight
    vectorizer, tfidf_matrix, answers = load_tfidf_models()
    if '' in sys.path:
        sys.path = [p for p in sys.path if p != '']
    current_dir = os.getcwd()
    sys.path = [p for p in sys.path if p != current_dir]
    from transformers import T5Tokenizer, T5ForConditionalGeneration
    gen_tokenizer = T5Tokenizer.from_pretrained(T5_TOKENIZER_DIR)
    gen_model = T5ForConditionalGeneration.from_pretrained(T5_MODEL_DIR)
    url_model = load_url_classifier()
    g6_insight = load_6g_insight()


def main():
    print("Starting Cybersecurity Awareness Chatbot...")
    print("Loading models, please wait...")
    load_models()
    print("Welcome to the Cybersecurity Awareness Chatbot!")
    print("Ask me anything about cybersecurity, and I'll provide an answer.")
    print("Type 'quit' to exit.")
    sample_question = "What is phishing?"
    print(f"\nSample question: {sample_question}")
    print(f"Answer: {get_answer(sample_question)}")
    while True:
        user_input = input("\nYour question: ")
        if user_input.strip().lower() == 'quit':
            print("Goodbye!")
            break
        answer = get_answer(user_input)
        print(f"Answer: {answer}")

if __name__ == '__main__':
    main()
