# Quick Start Guide - CipherSafe

## 60-Second Setup

### Step 1: Start Backend (30 seconds)
```bash
cd backend
python app.py
```
✓ Wait for: `Running on http://127.0.0.1:5000`

### Step 2: Open Frontend (10 seconds)  
Option A - Direct:
```bash
cd frontend
start login.html
```

Option B - Local Server:
```bash
cd frontend
python -m http.server 8000
# Then open: http://localhost:8000/login.html
```

### Step 3: Create Account (10 seconds)
1. Click "Register" 
2. Username: `demo`
3. Password: `demo123`
4. Click "Register"

### Step 4: Login (5 seconds)
1. Enter credentials: `demo` / `demo123`
2. Click "Login"
3. You're in!

---

## Quick Features Test

### Try Text Encryption
1. **Text**: `hello world`
2. **Key**: `3`
3. Click **Caesar Encrypt** → Result: `khoor zruog`
4. Copy the result
5. **Text**: `khoor zruog`
6. **Key**: `3`
7. Click **Caesar Decrypt** → Result: `hello world`

### Try Vigenere Cipher
1. **Text**: `attack at dawn`
2. **Vigenere Key**: `LEMON` (letters only)
3. Click **Vigenere Encrypt** → Result: `lxfopv ef rnhr`

### Try File Encryption
1. Create a text file with content: `secret message`
2. **Choose File**: Select your text file
3. Click **Encrypt File** → Downloads encrypted file
4. **Choose File**: Select the encrypted file
5. **Key**: Enter the encryption key
6. Click **Decrypt File** → Downloads original file

### Try Analysis Tools
1. **Text**: `aaabbbcccddd`
2. Click **Frequency** → Shows letter distribution
3. Click **Compare Ciphers** → Shows Caesar vs Vigenere
4. Click **Security Audit** → Shows vulnerability assessment

### Try Brute Force
1. **Text**: `khoor` (Caesar encrypted text)
2. Click **Brute force** → Shows all 25 possible decryptions

### View History
1. Click **View history**
2. See all your past operations
3. Shows original text, encrypted result, and key used

---

## All Features Verified ✓

| Feature | Status | Test |
|---------|--------|------|
| Register | Working | OK ✓ |
| Login | Working | OK ✓ |
| Caesar Encrypt | Working | OK ✓ |
| Caesar Decrypt | Working | OK ✓ |
| Vigenere Encrypt | Working | OK ✓ |
| Vigenere Decrypt | Working | OK ✓ |
| File Encrypt | Working | OK ✓ |
| File Decrypt | Working | OK ✓ |
| Compare Ciphers | Working | OK ✓ |
| Security Audit | Working | OK ✓ |
| Frequency Analysis | Working | OK ✓ |
| Brute Force | Working | OK ✓ |
| History | Working | OK ✓ |

---

## Common Issues & Fixes

**Issue**: "Failed to fetch"  
**Fix**: Make sure backend is running with `python app.py`

**Issue**: "Connection refused"  
**Fix**: Backend not on port 5000. Kill other Flask apps and restart.

**Issue**: History not showing  
**Fix**: Make sure you're logged in (check localStorage)

**Issue**: Can't select file  
**Fix**: Click "Upload file" button, select a .txt file from your computer

---

## API Testing (Advanced)

Test any endpoint directly:
```bash
# Windows PowerShell
$body = @{text="hello"; key=3} | ConvertTo-Json
Invoke-WebRequest -Uri http://127.0.0.1:5000/encrypt -Method POST -Body $body -ContentType "application/json"
```

Or use the Python test script in the project root.

---

## Architecture

```
Browser (Frontend)
    |
    | HTTP/JSON
    v
Flask Server (Backend) :5000
    |
    ├── /encrypt, /decrypt, /brute, /frequency, /vigenere/*
    |
    v
SQLite Database
    └── users, history tables
```

---

## Next Steps

1. Explore all cipher types
2. Test frequency analysis on different texts
3. Try the brute force attack feature
4. Check the history to see all operations
5. Read README.md for detailed API documentation

Enjoy exploring cryptography! 🔐
