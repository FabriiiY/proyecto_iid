from werkzeug.security import generate_password_hash

password = "Admin123"

hash_generado = generate_password_hash(password)

print(hash_generado)

#temporal