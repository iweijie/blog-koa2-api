const fs = require("fs")
const path = require("path")

module.exports = (root = path.resolve(__dirname,"../controllers")) => {
    fs.readdirSync(root).forEach(filename => {
        let file = path.parse(filename);
        // logger.info('load router:', filename);
        if (file.ext.toLowerCase() !== '.js') return;
        const router = new Router({
            prefix: `/${file.name}`
        });
        require(`${root}/${file.name}`)(router);
        app.use(router.routes());
    });
}