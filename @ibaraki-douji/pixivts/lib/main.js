"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pixiv_1 = require("./Pixiv");
const pixiv = new Pixiv_1.Pixiv();
(async () => {
    pixiv.staticLogin("", "");
    console.log(await pixiv.getNewIllusts());
    /*
    let page = 1;
    let tag = "メリュジーヌ(Fate)";
    let out = "B:/Images/.Pixiv/Melusine/";
    let mode: any = "safe";
    let artworks = await pixiv.getIllustsByTag(tag, { page, mode: mode });
    while (artworks.length > 0) {
      console.log("PAGE " + page);
      try {
        mkdirSync(out, {recursive: true});
      } catch (e) {}
      for (let art of artworks) {
        console.log("|-" + art.id + " (" + (artworks.indexOf(art)+1) + " / " + artworks.length + ")");
        const illust = await pixiv.getIllustByArtwork(art);
        if (illust.pageCount > 1) {
          mkdirSync(out + illust.illustID, {recursive: true});
        }
        for (let i in illust.urls) {
          console.log("|---|- Illust " + (+i+1));
          writeFileSync(out + (illust.pageCount > 1 ? illust.illustID + "/" : "") + illust.illustID + "-" + i + ".jpg", await pixiv.download(new URL(illust.urls[i].original)));
        }
      }
      page++;
      artworks = (await pixiv.getIllustsByTag(tag, {mode: mode, page: page}));
    }/** */
})();
