import random

# Caesar cipher core

def process(text: str, key: int) -> str:
    result = []
    for c in text:
        if c.isalpha():
            base = 65 if c.isupper() else 97
            result.append(chr((ord(c) - base + key) % 26 + base))
        else:
            result.append(c)
    return "".join(result)


def strength(text: str, key: int):
    if not text:
        return 0, "Empty"

    score = len(text)
    if any(c.isdigit() for c in text):
        score += 5
    if any(c.isupper() for c in text) and any(c.islower() for c in text):
        score += 5
    if any(not c.isalnum() for c in text):
        score += 5
    score += min(key, 25)

    if score < 15:
        level = "Weak"
    elif score < 25:
        level = "Medium"
    else:
        level = "Strong"

    return score, level


def encrypt(text: str, key: int = None):
    if key is None:
        key = random.randint(1, 25)
    key = int(key) % 26
    return process(text, key), key


def decrypt(text: str, key: int):
    key = int(key) % 26
    return process(text, -key)


def brute_force(text: str):
    return [(k, decrypt(text, k)) for k in range(1, 26)]


def vigenere_encrypt(plaintext: str, key: str):
    if not key:
        raise ValueError("Vigenere key cannot be empty")

    result = []
    key = key.strip()
    key_indices = [ord(c.lower()) - 97 for c in key if c.isalpha()]
    if not key_indices:
        raise ValueError("Vigenere key must contain letters")

    ki = 0
    for ch in plaintext:
        if ch.isalpha():
            base = 65 if ch.isupper() else 97
            shift = key_indices[ki % len(key_indices)]
            result.append(chr((ord(ch) - base + shift) % 26 + base))
            ki += 1
        else:
            result.append(ch)

    return "".join(result)


def vigenere_decrypt(ciphertext: str, key: str):
    if not key:
        raise ValueError("Vigenere key cannot be empty")

    result = []
    key = key.strip()
    key_indices = [ord(c.lower()) - 97 for c in key if c.isalpha()]
    if not key_indices:
        raise ValueError("Vigenere key must contain letters")

    ki = 0
    for ch in ciphertext:
        if ch.isalpha():
            base = 65 if ch.isupper() else 97
            shift = key_indices[ki % len(key_indices)]
            result.append(chr((ord(ch) - base - shift) % 26 + base))
            ki += 1
        else:
            result.append(ch)

    return "".join(result)


def frequency_analysis(text: str):
    counts = {}
    total = 0
    for ch in text.lower():
        if ch.isalpha():
            counts[ch] = counts.get(ch, 0) + 1
            total += 1

    if total == 0:
        return {"total_letters": 0, "frequency": {}, "entropy": 0.0}

    freq = {k: v / total for k, v in sorted(counts.items())}
    import math

    entropy = -sum(p * math.log2(p) for p in freq.values())

    return {"total_letters": total, "frequency": freq, "entropy": round(entropy, 3)}

