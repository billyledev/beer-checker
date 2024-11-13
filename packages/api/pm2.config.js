module.exports = {
  apps: [
    {
      name: 'beercheckerapi',
      script: './dist/index.js',
      max_restarts: 3,
      min_uptime: '10s',
      max_memory_restart: '100M',
    },
  ],
};
