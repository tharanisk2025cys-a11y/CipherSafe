import sqlite3
from datetime import datetime

def connect():
    return sqlite3.connect("database.db")

def init_db():
    con = connect()
    cur = con.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # Drop and recreate history table to add user column
    cur.execute("DROP TABLE IF EXISTS history")
    cur.execute("""
        CREATE TABLE history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT NOT NULL,
            text TEXT NOT NULL,
            result TEXT NOT NULL,
            key INT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    con.commit()
    con.close()

def add_history(user, text, result, key):
    if not user:
        user = "anonymous"
    con = connect()
    cur = con.cursor()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cur.execute("INSERT INTO history (user, text, result, key, created_at) VALUES (?,?,?,?,?)", (user, text, result, key, timestamp))
    con.commit()
    con.close()

def get_history(user=None):
    con = connect()
    cur = con.cursor()
    if user:
        cur.execute("SELECT id, text, result, key, created_at FROM history WHERE user = ? ORDER BY created_at DESC", (user,))
    else:
        cur.execute("SELECT id, text, result, key, created_at FROM history ORDER BY created_at DESC")
    data = cur.fetchall()
    con.close()
    return data