const fs = require('fs');

class ImagePool {
  constructor() {
    this.frogcache = this.fill();
  }

  fill() {
    const reg = new RegExp('jpg|gif|png');
    const frogs = fs.readdirSync('frogs').filter(file => reg.test(file));
    console.log(`Frogbot Image Pool filled with ${frogs.length} frogs`);
    return frogs;
  }

  get() {
    // get a random frog
    const randomFrog = this.frogcache[Math.floor(Math.random() * this.frogcache.length)];

    // remove the frog from the cache
    this.frogcache = this.frogcache.filter(frog => frog !== randomFrog);

    // reset the cache if low
    if (this.frogcache.length <= 2) {
      console.log('Frog cache is resetting....');
      this.frogcache = this.fill();
    }

    return randomFrog;
  }
}

module.exports = ImagePool;