from db import connect
from werkzeug.security import generate_password_hash, check_password_hash


def register(user, pwd):
    user = user.strip()
    if not user or not pwd:
        return False, "Username and password are required."

    con = connect()
    cur = con.cursor()
    cur.execute("SELECT username FROM users WHERE username=?", (user,))
    if cur.fetchone():
        con.close()
        return False, "User already exists."

    hashed = generate_password_hash(pwd)
    cur.execute("INSERT INTO users (username, password) VALUES (?,?)", (user, hashed))
    con.commit()
    con.close()
    return True, "Registered successfully."


def login(user, pwd):
    con = connect()
    cur = con.cursor()
    cur.execute("SELECT password FROM users WHERE username=?", (user.strip(),))
    row = cur.fetchone()
    con.close()
    if not row:
        return False

    return check_password_hash(row[0], pwd)