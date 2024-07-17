module.exports = {
  apps: [
    {
      name: "Moderation",
      namespace: "MODLOFF",
      script: 'Global.Moderation.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Moderation"
    },
    {
      name: "Executive",
      namespace: "MODLOFF",
      script: 'Global.Executive.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Server/Executive"
    }
  ]
};