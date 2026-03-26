import sqlite3

try:
    with sqlite3.connect("my.db") as conn:
        #interact with database
        cur = conn.cursor()
        cur.execute("INSERT INTO movie VALUES" \
        "           ('Monty Python', 1975, 8.2)," \
        "")
except sqlite3.OperationalError as e:
    print("Failed to open database:", e)
