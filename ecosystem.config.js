module.exports = {
  apps: [
    {
      name: "academic-interview-pro",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/academicinterviewpro",
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "1024M",
      autorestart: true,
      restart_delay: 4000,
      watch: false,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "/var/log/academicinterviewpro/error.log",
      out_file: "/var/log/academicinterviewpro/out.log",
      merge_logs: true,
    },
  ],
};
