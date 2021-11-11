const fs = require('fs');
const levelup = require('levelup');
const memdown = require('memdown');
const logger = require('../helpers/logging');

class ImagePool {
  constructor(db) {
    this.db = db;
    this.logger = logger.baseLogger;
  }

  async init() {
    await this.reset();
  }

  async reset() {
    this.logger.info('Resetting the image pool cache...');
    const reg = new RegExp('^[0-9a-f]{40}\\.(png|jpg|gif)$');
    const frogsDirectory = await fs.promises.readdir('frogs');
    const frogs = frogsDirectory.filter(file => reg.test(file));
    this.logger.info(`Frogbot image pool refilled with ${frogs.length} frogs`);

    // pack the list of frogs to a JSON list, stick in levelDB
    await this.db.put('_frogcache', JSON.stringify(frogs));
  }

  async get() {
    // get the cache of available frogs
    const frogs = await this.db.get('_frogcache', { asBuffer: false });
    let frogCache = JSON.parse(frogs);

    // get a random frog
    const randomFrog = frogCache[Math.floor(Math.random() * frogCache.length)];

    // remove the frog from list, re-pack the cache
    frogCache = frogCache.filter(frog => frog !== randomFrog);
    await this.db.put('_frogcache', JSON.stringify(frogCache));

    this.logger.info(`frog pool is currently ${frogCache.length} after get()`);

    // reset the cache if low
    if (frogCache.length <= 2) {
      this.logger.warn('Frog cache is almost deleted... Resetting');
      this.reset();
    }

    // return a frog
    this.logger.info(`${randomFrog} selected for pool`);
    return randomFrog;
  }
}

// init the image pool based on an in-memory instance of LevelDB
const globalImagePool = new ImagePool(levelup(memdown()));
module.exports = globalImagePool;