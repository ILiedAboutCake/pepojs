const fs = require('fs');
const levelup = require('levelup');
const memdown = require('memdown');

class ImagePool {
  constructor() {
    this.db = levelup(memdown());
  }

  async init() {
    await this.reset();
  }

  async reset() {
    const reg = new RegExp('jpg|gif|png');
    const frogs = fs.readdirSync('frogs').filter(file => reg.test(file));
    console.log(`Frogbot Image Pool filled with ${frogs.length} frogs`);

    // pack the list of frogs to a JSON list, stick in levelDB
    await this.db.put('_frogcache', JSON.stringify(frogs));
  }

  async get() {
    // get the cache of available frogs
    const frogs = await this.db.get('_frogcache', { asBuffer: false });
    let frogCache = JSON.parse(frogs);

    console.log(`frog pool was ${frogCache.length} before get()`);

    // get a random frog
    const randomFrog = frogCache[Math.floor(Math.random() * frogCache.length)];

    // remove the frog from list, re-pack the cache
    frogCache = frogCache.filter(frog => frog !== randomFrog);
    await this.db.put('_frogcache', JSON.stringify(frogCache));

    console.log(`frog pool is now ${frogCache.length} after get()`);

    // reset the cache if low
    if (frogCache.length <= 2) {
      console.log('Frog cache is LOW! resetting....');
    }

    // return a frog
    console.log(`${randomFrog} selected for pool`);
    return randomFrog;
  }
}

module.exports = ImagePool;