import streamlit as st
import joblib
import re
import pandas as pd
from urllib.parse import urlparse

# Load the trained model
try:
    model = joblib.load('phishing_model.pkl')
except:
    st.error("Model file 'phishing_model.pkl' not found. Please run the notebook cells to train and save the model first.")
    st.stop()

# Feature extraction function
def extract_features(url):
    url = url.lower().strip()
    features = []

    # 1. URL Length
    features.append(len(url))

    # 2. Count dots
    features.append(url.count('.'))

    # 3. Presence of @
    features.append(1 if '@' in url else 0)

    # 4. Contains IP
    ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    features.append(1 if re.search(ip_pattern, url) else 0)

    # 5. Suspicious words
    suspicious_words = ['login', 'secure', 'update', 'verify', 'bank', 'account', 'password', 'signin', 'paypal', 'ebay']
    features.append(1 if any(word in url for word in suspicious_words) else 0)

    # 6. Number of digits
    features.append(sum(c.isdigit() for c in url))

    # 7. Number of special characters
    special_chars = ['-', '_', '?', '=', '&', '%', '.', '/', ':']
    features.append(sum(url.count(char) for char in special_chars))

    # 8. Has HTTPS
    features.append(1 if url.startswith('https') else 0)

    # 9. Domain length (if parseable)
    try:
        parsed = urlparse(url)
        domain = parsed.netloc
        features.append(len(domain))
    except:
        features.append(0)

    # 10. Has suspicious TLD
    suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.xyz', '.club', '.online']
    features.append(1 if any(url.endswith(tld) for tld in suspicious_tlds) else 0)

    return features

# Prediction function
def predict_url(url):
    features = extract_features(url)
    prediction = model.predict([features])[0]
    probability = model.predict_proba([features])[0]

    if prediction == 0:
        result = "SAFE"
        confidence = probability[0]
    else:
        result = "PHISHING"
        confidence = probability[1]

    return result, confidence

# Streamlit UI
st.title("🔍 Phishing Detection Web App")
st.markdown("Enter a URL below to check if it's safe or potentially phishing.")

# Input
url_input = st.text_input("Enter URL:", placeholder="https://example.com")

if st.button("Check URL"):
    if url_input:
        try:
            result, confidence = predict_url(url_input)

            if result == "SAFE":
                st.success(f"✅ **{result}** - This URL appears to be safe.")
            else:
                st.error(f"⚠️ **{result}** - This URL may be malicious!")

            # Show features
            with st.expander("See extracted features"):
                features = extract_features(url_input)
                feature_names = ['URL Length', 'Dot Count', 'Has @', 'Has IP', 'Suspicious Words', 'Digit Count', 'Special Char Count', 'Has HTTPS', 'Domain Length', 'Suspicious TLD']
                feature_df = pd.DataFrame({'Feature': feature_names, 'Value': features})
                st.table(feature_df)

        except Exception as e:
            st.error(f"Error processing URL: {e}")
    else:
        st.warning("Please enter a URL.")

st.markdown("---")
st.markdown("Built with Streamlit and scikit-learn. Model trained on phishing dataset.")

