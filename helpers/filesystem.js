const { resolve } = require('path');
const { readdir } = require('fs').promises;

// @Author https://stackoverflow.com/a/45130990/16726930
const getFiles = async function* (dir, fileType) {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res, fileType);
        } else if (res.substr(-5, 5) === fileType) { // a better way?
            yield res;
        }
    }
};

module.exports = { getFiles };
