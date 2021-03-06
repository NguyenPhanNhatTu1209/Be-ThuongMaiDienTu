module.exports = {
    apps: [
      {
        name: 'ec18b010',
        script: "dist/src/index.js",
        args: "src/index.js",
        wait_ready: true,
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_file: './logs/combined.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss:SSSS',
        min_uptime: 10000,
        max_restarts: 3,
        watch: true,
      },
    ],
  };