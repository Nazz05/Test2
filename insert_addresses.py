import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="auth_db",
    user="postgres",
    password="postgres"
)

cur = conn.cursor()

addresses = [
    (1, 'Nguyen Van A', '0901234567', '123 Duong Le Loi', 'Phuong 1', 'Quan 1', 'TP Ho Chi Minh', '700000', True, 'Nha chinh'),
    (1, 'Nguyen Van A', '0912345678', '456 Duong Nguyen Hue', 'Phuong 2', 'Quan 3', 'TP Ho Chi Minh', '700001', False, 'Van phong'),
]

sql = """
INSERT INTO addresses (user_id, recipient_name, phone, address_line, ward, district, province, postal_code, is_default, notes)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
ON CONFLICT DO NOTHING
"""

for addr in addresses:
    cur.execute(sql, addr)

conn.commit()
cur.close()
conn.close()

print("Inserted sample addresses successfully")
