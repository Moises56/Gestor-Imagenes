// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'apiGestorImagen-3005',
      script: 'dist/main.js',
      instances: 1, // Número de instancias (1 para modo simple)
      exec_mode: 'fork', // Modo de ejecución (fork es suficiente para NestJS básico)
      env: {
        NODE_ENV: 'production',
        PORT: 3005, // Si tu app usa un puerto específico, cámbialo aquí
      },
    },
  ],
};
