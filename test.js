const bcrypt = require('bcryptjs');

(async () => {
    const hash = await bcrypt.hash('admin', 12);
    console.log(hash);

    const ok = await bcrypt.compare('admin', hash);
    console.log(ok); // Should print true
})();