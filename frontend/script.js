const api = "http://127.0.0.1:5000";

function show(msg, error = false) {
  const out = document.getElementById("out");
  if (!out) {
    alert((error ? "ERROR: " : "") + msg);
    return;
  }
  // Format the message with proper line breaks and alignment
  const formattedMsg = msg.replace(/\n/g, '<br>');
  out.innerHTML = `<div style='color: ${error ? "#ff6b6b" : "#00ff00"}; font-family: monospace; line-height: 1.5; text-align: left; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;'>${error ? '❌ ' : '✅ '}${formattedMsg}</div>`;
}

function getText() {
  const text = document.getElementById("text").value.trim();
  if (!text) {
    // Check if file is selected
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length > 0) {
      return new Promise((resolve, reject) => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }
    throw new Error("Text is required or select a file.");
  }
  return text;
}

function getKey() {
  const keyValue = document.getElementById("key").value;
  if (!keyValue) return undefined;
  const key = parseInt(keyValue, 10);
  if (isNaN(key) || key < 0) throw new Error("Key must be a non-negative integer.");
  return key;
}

function getVigenereKey() {
  const keyValue = document.getElementById("vigenereKey").value.trim();
  if (!keyValue) throw new Error("Vigenere key is required.");
  if (!/^[a-zA-Z]+$/.test(keyValue)) throw new Error("Vigenere key must be letters only.");
  return keyValue;
}

async function encrypt() {
  try {
    const text = await getText();
    const key = getKey();

    const response = await fetch(api + "/encrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, key }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Encryption failed");

    show(`Encrypted: ${data.result}\nKey: ${data.key}\nStrength: ${data.level} (${data.score})`);
  } catch (err) {
    show(err.message, true);
  }
}

async function decrypt() {
  try {
    const text = await getText();
    const key = getKey();
    if (key === undefined) throw new Error("Key is required for decryption.");

    const response = await fetch(api + "/decrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, key }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Decryption failed");

    show(`Decrypted: ${data.result}`);
  } catch (err) {
    show(err.message, true);
  }
}

async function brute() {
  try {
    const text = await getText();
    const response = await fetch(api + "/brute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Brute-force failed");

    const lines = data.map(([k, attempt]) => `${k}: ${attempt}`).join("\n");
    show(`Brute-force results:\n${lines}`);
  } catch (err) {
    show(err.message, true);
  }
}

async function frequency() {
  try {
    const text = await getText();
    const response = await fetch(api + "/frequency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Frequency analysis failed");

    const freqLines = Object.entries(data.frequency)
      .map(([letter, pct]) => `${letter}: ${(pct * 100).toFixed(2)}%`)
      .join("\n");

    show(`FREQUENCY ANALYSIS:\n\nLetters analyzed: ${data.total_letters}\nUnique letters: ${Object.keys(data.frequency).length}\nEntropy: ${data.entropy}\n\n${freqLines}\n\nLower entropy = easier to crack with frequency analysis`);
  } catch (err) {
    show(err.message, true);
  }
}

async function vigenereEncrypt() {
  try {
    const text = await getText();
    const key = getVigenereKey();

    const response = await fetch(api + "/vigenere/encrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, key }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Vigenere encryption failed");

    show(`VIGENERE ENCRYPTED:\n\nOriginal: ${text}\nKey: ${key}\n\nResult: ${data.result}\nStrength: ${data.level} (${data.score})`);
  } catch (err) {
    show(err.message, true);
  }
}

async function vigenereDecrypt() {
  try {
    const text = await getText();
    const key = getVigenereKey();

    const response = await fetch(api + "/vigenere/decrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, key }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Vigenere decryption failed");

    show(`VIGENERE DECRYPTED:\n\n${data.result}`);
  } catch (err) {
    show(err.message, true);
  }
}

async function compare() {
  try {
    const text = await getText();
    const response = await fetch(api + "/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Comparison failed");

    const output = `REAL-TIME CIPHER COMPARISON\n\n` +
      `Original Text:\n"${data.original}"\n\n` +
      `─── CAESAR CIPHER ───\n` +
      `Result: ${data.caesar.result}\n` +
      `Key: ${data.caesar.key}\n` +
      `Strength: ${data.caesar.strength} (Score: ${data.caesar.score})\n\n` +
      `─── VIGENERE CIPHER ───\n` +
      `Result: ${data.vigenere.result}\n` +
      `Key: "${data.vigenere.key}"\n` +
      `Strength: ${data.vigenere.strength} (Score: ${data.vigenere.score})\n\n` +
      `💡 Note: Vigenere is stronger (uses keyword instead of single number)`;

    show(output);
  } catch (err) {
    show(err.message, true);
  }
}

async function audit() {
  try {
    const text = await getText();
    const response = await fetch(api + "/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Audit failed");

    const riskColor = data.risk_level === "HIGH" ? "🔴" : (data.risk_level === "MEDIUM" ? "🟡" : "🟢");
    
    const output = `SECURITY AUDIT REPORT\n\n` +
      `Text Length: ${data.text_length} characters\n` +
      `Letters: ${data.letter_count}\n` +
      `Unique Letters: ${data.unique_letters}\n` +
      `Entropy: ${data.entropy} (0-5 scale)\n\n` +
      `Risk Level: ${riskColor} ${data.risk_level}\n` +
      `Vulnerable to Caesar? ${data.is_vulnerable_to_caesar ? "YES ⚠️" : "NO ✓"}\n` +
      `Most Common Letter: '${data.most_common_letter}'\n\n` +
      `RECOMMENDATIONS:\n${data.recommendations.map(r => `• ${r}`).join("\n")}\n\n` +
      `This helps you understand how secure your text/password is against simple cipher attacks.`;

    show(output);
  } catch (err) {
    show(err.message, true);
  }
}

async function upload() {
  try {
    const fileInput = document.getElementById("file");
    if (!fileInput.files.length) throw new Error("Please select a file");

    const form = new FormData();
    form.append("file", fileInput.files[0]);

    const response = await fetch(api + "/upload", {
      method: "POST",
      body: form,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Upload failed");

    show(`File encrypted preview: ${data.result}\nKey: ${data.key}\nLength: ${data.length}`);
  } catch (err) {
    show(err.message, true);
  }
}


async function go() {
  window.location.href = "dashboard.html";
}

async function encryptFile() {
  try {
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length === 0) throw new Error("Please select a file to encrypt.");
    
    const file = fileInput.files[0];
    console.log("Encrypting file:", file.name);
    
    const text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("File read successfully");
        resolve(e.target.result);
      };
      reader.onerror = (e) => {
        console.error("File read error:", e);
        reject(new Error("Failed to read file"));
      };
      reader.readAsText(file);
    });
    
    console.log("File content length:", text.length);
    const key = getKey();
    console.log("Using key:", key);

    const response = await fetch(api + "/encrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, key }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Encryption failed");

    console.log("Encryption successful:", data);
    // Download encrypted file
    downloadFile(data.result, file.name.replace(/\.[^/.]+$/, "") + "_encrypted.txt", "File encrypted successfully!");
  } catch (err) {
    console.error("Encrypt file error:", err);
    show(err.message, true);
  }
}

async function decryptFile() {
  try {
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length === 0) throw new Error("Please select a file to decrypt.");
    
    const file = fileInput.files[0];
    console.log("Decrypting file:", file.name);
    
    const text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("File read successfully");
        resolve(e.target.result);
      };
      reader.onerror = (e) => {
        console.error("File read error:", e);
        reject(new Error("Failed to read file"));
      };
      reader.readAsText(file);
    });
    
    console.log("File content length:", text.length);
    const key = getKey();
    if (!key && key !== 0) throw new Error("Key is required for decryption.");
    console.log("Using key:", key);

    const response = await fetch(api + "/decrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, key }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Decryption failed");

    console.log("Decryption successful:", data);
    // Download decrypted file
    downloadFile(data.result, file.name.replace(/\.[^/.]+$/, "") + "_decrypted.txt", "File decrypted successfully!");
  } catch (err) {
    console.error("Decrypt file error:", err);
    show(err.message, true);
  }
}

function downloadFile(content, filename, message) {
  console.log("Downloading file:", filename, "Content length:", content.length);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log("Download initiated");
  show(message);
}
