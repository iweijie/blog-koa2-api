module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : 'blogApi',
      script    : './index.js',
      watch     :  true ,
      ignore_watch : ["node_modules"],
      max_memory_restart : "200M" ,
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'weijie',
      host : '47.104.199.117',
      ref  : 'origin/master',
      repo : 'git@github.com:weijie9520/blog-koa2-api.git',
      path : '/home/blog/blog-koa2-api',
      'post-deploy' : 'yarn install && pm2 reload ecosystem.config.js --env production'
    },
  }
};
