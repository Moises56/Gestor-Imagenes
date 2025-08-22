import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acceso Restringido - AMDC-GIS</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #5ccedf 100%);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .container {
                 background: white;
                 border-radius: 15px;
                 box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                 padding: 25px;
                 max-width: 450px;
                 text-align: center;
                 margin: 20px;
             }
            .header {
                 color: #e74c3c;
                 font-size: 2em;
                 font-weight: bold;
                 margin-bottom: 8px;
                 text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
             }
             .subheader {
                 color: #c0392b;
                 font-size: 1.4em;
                 font-weight: 600;
                 margin-bottom: 20px;
             }
            .message {
                 color: #2c3e50;
                 font-size: 1em;
                 line-height: 1.5;
                 margin-bottom: 20px;
                 padding: 15px;
                 background: #f8f9fa;
                 border-radius: 8px;
                 border-left: 4px solid #3498db;
             }
            .note {
                 background: #e8f4fd;
                 border: 1px solid #bee5eb;
                 border-radius: 6px;
                 padding: 15px;
                 margin: 15px 0;
                 color: #0c5460;
             }
            .note-icon {
                font-size: 1.5em;
                margin-right: 10px;
            }
            .support {
                 background: #fff3cd;
                 border: 1px solid #ffeaa7;
                 border-radius: 6px;
                 padding: 15px;
                 margin: 15px 0;
                 color: #856404;
             }
            .support-icon {
                font-size: 1.5em;
                margin-right: 10px;
            }
            .brand {
                 color: #2c3e50;
                 font-size: 1.3em;
                 font-weight: bold;
                 margin: 20px 0 15px 0;
                 padding: 12px;
                 background: linear-gradient(45deg, #3498db, #2980b9);
                 color: white;
                 border-radius: 6px;
                 text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
             }
            .footer {
                color: #7f8c8d;
                font-size: 1.1em;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #ecf0f1;
            }
            .icon {
                 font-size: 3em;
                 color: #e74c3c;
                 margin-bottom: 15px;
             }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">🚫</div>
            <div class="header">Acceso Restringido</div>
            <span class="subheader">Esta ruta no está disponible para navegación directa</span>

            
            <div class="message">
                Para acceder a las aplicaciones, debe usar la URL específica proporcionada 
                o contactar al administrador del sistema.
            </div>
            
            <div class="note">
                <span class="note-icon">💡</span>
                <strong>Nota:</strong> Si tiene problemas de acceso, verifique que esté usando la URL correcta o contacte a la gerencia de TI.
            </div>
            
            <div class="brand">
                🔧 AMDC-GIS
            </div>
            
            <div class="support">
                <span class="support-icon">🔧</span>
                Para soporte técnico, contacta al administrador del sistema
            </div>
            
            <div class="footer">
               © 2025 AMDC<br>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}
