Amdc2025Gis - db

certificado
SQLServerCert.pfx con una contraseña (por ejemplo, CertPassword123!).




Adminamdcweb12345
192.168.200.70

CREATE USER 'gestorimg_user'@'localhost' IDENTIFIED BY 'secure_password';

GRANT ALL PRIVILEGES ON gestorimgdb.* TO 'gestorimg_user'@'localhost';

FLUSH PRIVILEGES;



solo cargo la imagen, en el backen ya lo tengo para que se guare a un carpeta y cree una url apuntrando a la imagen

fLOx-k05nS4i)L

GestorImgUser
186.2.148.92
