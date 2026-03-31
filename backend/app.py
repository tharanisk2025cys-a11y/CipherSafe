from flask import Flask, request, jsonify
from flask_cors import CORS
from cipher import encrypt, decrypt, strength, brute_force, vigenere_encrypt, vigenere_decrypt, frequency_analysis
from db import init_db, add_history, get_history
from auth import register, login

app = Flask(__name__)
CORS(app)

init_db()

@app.route("/")
def home():
    return jsonify({"status": "CipherSafe Ultra Running"})

# AUTH
@app.route("/register", methods=["POST"])
def reg():
    data = request.json or {}
    user = data.get("user")
    pwd = data.get("pwd")
    if not user or not pwd:
        return jsonify({"success": False, "error": "Username and password are required."}), 400

    success, message = register(user.strip(), pwd)
    return jsonify({"success": success, "message": message})

@app.route("/login", methods=["POST"])
def log():
    data = request.json or {}
    user = data.get("user")
    pwd = data.get("pwd")
    if not user or not pwd:
        return jsonify({"success": False, "error": "Username and password are required."}), 400

    ok = login(user.strip(), pwd)
    return jsonify({"success": ok})

# ENCRYPT
@app.route("/encrypt", methods=["POST"])
def enc():
    data = request.json or {}
    text = data.get("text")
    key = data.get("key")
    if text is None:
        return jsonify({"error": "Text is required."}), 400

    if key is not None:
        try:
            key = int(key)
        except ValueError:
            return jsonify({"error": "Key must be an integer."}), 400
    result, used_key = encrypt(text, key)
    score, level = strength(text, used_key)

    add_history(None, text, result, used_key)

    return jsonify({
        "result": result,
        "key": used_key,
        "score": score,
        "level": level
    })

# DECRYPT
@app.route("/decrypt", methods=["POST"])
def dec():
    data = request.json or {}
    text = data.get("text")
    key = data.get("key")
    if text is None or key is None:
        return jsonify({"error": "Text and key are required."}), 400

    try:
        key = int(key)
    except ValueError:
        return jsonify({"error": "Key must be an integer."}), 400

    result = decrypt(text, key)
    return jsonify({"result": result})

# BRUTE FORCE
@app.route("/brute", methods=["POST"])
def brute():
    data = request.json or {}
    text = data.get("text")
    if text is None:
        return jsonify({"error": "Text is required."}), 400

    return jsonify(brute_force(text))

# FREQUENCY ANALYSIS
@app.route("/frequency", methods=["POST"])
def frequency():
    data = request.json or {}
    text = data.get("text")
    if text is None:
        return jsonify({"error": "Text is required."}), 400
    return jsonify(frequency_analysis(text))

# VIGENERE ENCRYPT
@app.route("/vigenere/encrypt", methods=["POST"])
def vigenere_enc():
    data = request.json or {}
    text = data.get("text")
    key = data.get("key")
    if not text or not key:
        return jsonify({"error": "Text and key are required for Vigenere."}), 400
    try:
        result = vigenere_encrypt(text, key)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    score, level = strength(text, len(key))
    add_history(None, text, result, 0)
    return jsonify({"result": result, "score": score, "level": level})

# VIGENERE DECRYPT
@app.route("/vigenere/decrypt", methods=["POST"])
def vigenere_dec():
    data = request.json or {}
    text = data.get("text")
    key = data.get("key")
    if not text or not key:
        return jsonify({"error": "Text and key are required for Vigenere."}), 400
    try:
        result = vigenere_decrypt(text, key)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"result": result})

# HISTORY
@app.route("/history", methods=["GET"])
def history():
    return jsonify(get_history())

# REAL-TIME COMPARISON (Caesar vs Vigenere side-by-side)
@app.route("/compare", methods=["POST"])
def compare():
    data = request.json or {}
    text = data.get("text")
    if not text:
        return jsonify({"error": "Text is required."}), 400
    
    # Caesar with auto key
    caesar_result, caesar_key = encrypt(text)
    caesar_score, caesar_level = strength(text, caesar_key)
    
    # Vigenere with common keyword
    vigenere_key = "CIPHER"
    vigenere_result = vigenere_encrypt(text, vigenere_key)
    vigenere_score, vigenere_level = strength(text, len(vigenere_key))
    
    return jsonify({
        "original": text,
        "caesar": {
            "result": caesar_result,
            "key": caesar_key,
            "strength": caesar_level,
            "score": caesar_score
        },
        "vigenere": {
            "result": vigenere_result,
            "key": vigenere_key,
            "strength": vigenere_level,
            "score": vigenere_score
        }
    })

# SECURITY AUDIT (Check text vulnerability to Caesar cipher)
@app.route("/audit", methods=["POST"])
def audit():
    data = request.json or {}
    text = data.get("text")
    if not text:
        return jsonify({"error": "Text is required."}), 400
    
    freq = frequency_analysis(text)
    
    # Check for patterns
    total = freq.get("total_letters", 0)
    frequency = freq.get("frequency", {})
    entropy = freq.get("entropy", 0)
    
    # Security assessment
    is_vulnerable = entropy < 2.5  # Low entropy = vulnerable to frequency analysis
    risk_level = "HIGH" if entropy < 2.0 else ("MEDIUM" if entropy < 3.0 else "LOW")
    
    recommendations = []
    if entropy < 2.0:
        recommendations.append("Text has LOW entropy - vulnerable to frequency analysis attack")
        recommendations.append("Consider using longer, more random text")
    if total < 100:
        recommendations.append("Text is short - easier to brute force")
        recommendations.append("Use longer passwords/messages for better security")
    
    # Find most common letter
    most_common = max(frequency.items(), key=lambda x: x[1]) if frequency else None
    
    return jsonify({
        "text_length": len(text),
        "letter_count": total,
        "unique_letters": len(frequency),
        "entropy": round(entropy, 3),
        "risk_level": risk_level,
        "is_vulnerable_to_caesar": is_vulnerable,
        "most_common_letter": most_common[0] if most_common else None,
        "recommendations": recommendations
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)