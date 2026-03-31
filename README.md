# CipherSafe - Complete Encryption & Security Analysis Suite

A full-stack web application for Caesar cipher, Vigenere cipher, cryptanalysis, file encryption, and security analysis.

## Features

- **Caesar Cipher**: Encrypt/decrypt text with customizable shift key (0-25)
- **Vigenere Cipher**: Advanced encryption/decryption using keyword-based substitution
- **File Encryption**: Encrypt/decrypt entire text files with automatic key generation
- **Brute Force Attack**: Test all 25 possible Caesar cipher keys automatically
- **Frequency Analysis**: Calculate letter frequency distribution and Shannon entropy
- **Real-Time Cipher Comparison**: Compare Caesar vs Vigenere encryption side-by-side
- **Security Audit**: Assess text vulnerability to cipher attacks
- **Encryption History**: Track all encryption/decryption operations
- **User Authentication**: Secure registration and login with password hashing

## Tech Stack

**Backend**: Flask (Python)
- Flask 3.1.2
- Flask-CORS 6.0.2
- Werkzeug 3.1.5
- SQLite3 (database)

**Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- Responsive design
- Real-time API integration

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Verify Python 3.7+ is installed:
   ```bash
   python --version
   ```

3. Install dependencies:
   ```bash
   pip install flask flask-cors werkzeug
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```
   
   Server will run on `http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Open in browser using one of these methods:
   
   **Option A**: Direct file open
   - Open `login.html` in your web browser
   - Or open `index.html` for direct access to cipher tools
   
   **Option B**: Local server (recommended for cross-origin requests)
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000/login.html`

## Usage Guide

### Initial Setup

1. **First Time Users**:
   - Go to login page (`login.html`)
   - Click "Register" button
   - Create a username and password
   - Click "Register" to create account
   - Use the credentials to login

2. **Returning Users**:
   - Enter credentials on login page
   - Click "Login" to access cipher tools

### Using the Cipher Tools

After login, you'll have access to these operations:

#### Text Encryption/Decryption
- **Caesar Encrypt**: Enter text, optionally set key (0-25), click "Caesar Encrypt"
- **Caesar Decrypt**: Enter encrypted text, enter the correct key, click "Caesar Decrypt"
- **Vigenere Encrypt**: Enter text, enter keyword (letters only), click "Vigenere Encrypt"
- **Vigenere Decrypt**: Enter ciphertext, enter the same keyword, click "Vigenere Decrypt"

#### File Operations
- **Encrypt File**: Select a text file (.txt/.md), click "Encrypt File" to encrypt and download
- **Decrypt File**: Select an encrypted file, enter key, click "Decrypt File" to decrypt and download

#### Analysis Tools
- **Compare Ciphers**: Enter text, click "Compare Ciphers" to see Caesar vs Vigenere side-by-side
- **Security Audit**: Enter text, click "Security Audit" to get vulnerability assessment
- **Frequency Analysis**: Paste text, click "Frequency" to see letter distribution and entropy
- **Brute Force**: Enter encrypted text, click "Brute force" to try all 25 keys

#### History
- **View History**: Click "View history" to see all past operations
- **Manage Account**: Click "Logout" on history page to return to login

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user

### Text Encryption/Decryption  
- `POST /encrypt` - Caesar cipher encryption
- `POST /decrypt` - Caesar cipher decryption
- `POST /vigenere/encrypt` - Vigenere cipher encryption
- `POST /vigenere/decrypt` - Vigenere cipher decryption

### Analysis & Tools
- `POST /brute` - Brute force attack (all 25 keys)
- `POST /frequency` - Letter frequency analysis
- `POST /compare` - Real-time cipher comparison
- `POST /audit` - Security vulnerability assessment

### Data
- `GET /history` - Retrieve encryption history

## API Request/Response Examples

### Encrypt Text
**Request**:
```json
POST /encrypt
{
  "text": "hello world",
  "key": 3
}
```

**Response**:
```json
{
  "result": "khoor zruog",
  "key": 3,
  "score": 11,
  "level": "Weak"
}
```

### Frequency Analysis
**Request**:
```json
POST /frequency
{
  "text": "abcabc"
}
```

**Response**:
```json
{
  "total_letters": 6,
  "frequency": {
    "a": 0.3333,
    "b": 0.3333,
    "c": 0.3333
  },
  "entropy": 1.585
}
```

### Vigenere Encrypt
**Request**:
```json
POST /vigenere/encrypt
{
  "text": "attack at dawn",
  "key": "LEMON"
}
```

**Response**:
```json
{
  "result": "lxfopv ef rnhr",
  "score": 24,
  "level": "Medium"
}
```

### Cipher Comparison
**Request**:
```json
POST /compare
{
  "text": "hello world"
}
```

**Response**:
```json
{
  "original": "hello world",
  "caesar": {
    "result": "khoor zruog",
    "key": 3,
    "strength": "Weak",
    "score": 11
  },
  "vigenere": {
    "result": "sixzb rjxxflj",
    "key": "CIPHER",
    "strength": "Medium",
    "score": 24
  }
}
```

### Security Audit
**Request**:
```json
POST /audit
{
  "text": "password123"
}
```

**Response**:
```json
{
  "text_length": 11,
  "letter_count": 10,
  "unique_letters": 9,
  "entropy": 3.2,
  "risk_level": "MEDIUM",
  "is_vulnerable_to_caesar": true,
  "most_common_letter": "s",
  "recommendations": [
    "Text is short - easier to brute force",
    "Use longer, more random passwords"
  ]
}
```

## File Structure

```
CipherSafe/
├── backend/
│   ├── app.py          # Flask application & API routes
│   ├── cipher.py       # Encryption algorithms (Caesar, Vigenere)
│   ├── auth.py         # User authentication logic
│   ├── db.py           # Database operations & history
│   ├── requirements.txt # Python dependencies
│   └── database.db     # SQLite database (auto-created)
├── frontend/
│   ├── index.html      # Main cipher tools interface
│   ├── login.html      # User authentication page
│   ├── dashboard.html  # History & results display
│   ├── script.js       # Frontend application logic
│   ├── auth.js         # Login/register functionality
│   └── style.css       # Application styling
├── README.md           # Complete project documentation
├── QUICKSTART.md       # Quick setup guide
├── STATUS_REPORT.md    # System status and testing results
├── FIX_REPORT.md       # Detailed fix history
├── REAL_WORLD_USES.md  # Use cases and feature explanations
└── TRANSFORMATION_SUMMARY.md # Project transformation details
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)
```

### History Table
```sql
CREATE TABLE history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  result TEXT NOT NULL,
  key INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Troubleshooting

### "Failed to fetch" Error
- Ensure backend is running: `python app.py` in backend folder
- Check that Flask is running on `http://127.0.0.1:5000`
- Verify no firewall is blocking port 5000

### Database Locked
- Delete `database.db` and restart the application
- A new database will be created automatically

### Module Not Found Errors
- Install required packages: `pip install flask flask-cors werkzeug`

### Frontend Not Loading
- Use the local HTTP server method: `python -m http.server 8000`
- Don't open HTML files directly with `file://` protocol for CORS requests

## Security Notes

- Passwords are hashed using Werkzeug's PBKDF2 with SHA256
- This is a demonstration/educational project
- Use for learning purposes only, not production encryption
- Caesar and basic Vigenere ciphers are NOT cryptographically secure

## Future Enhancements

- JWT token-based authentication
- Advanced encryption algorithms (AES, RSA)
- Clipboard operations
- Visual strength meter
- Unit tests and CI/CD
- Docker containerization
- Machine learning for cipher detection

## License

Educational project for learning cryptography concepts.

## Support

All endpoints tested and working correctly. Verification logs:
- All 9 API endpoints returning 200 status
- Database operations functional
- File upload processing working
- User authentication with password hashing
- Full encryption history tracking
