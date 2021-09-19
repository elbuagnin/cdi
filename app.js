const http = require('http');

const requestListener = function (req, res) {
    res.writeHead(200);
    test();
    res.end('Hello, World!');
};

const server = http.createServer(requestListener);
server.listen(8080);

async function test() {
    const name = 'Dax';
    const text = 'Dax is a warrior.   Height: 5\'11"      Weight: 175 lbs.      Very lanky, built like me, only smaller.      Violet hair, in shoulder-length dreadlocks.      Face shaped something like home plate. Narrow, begins to taper at cheekbones, comes to point at chin.      Medium-length goatee, localized to chin. Sideburns down to jawline.      Large, wide, seafoam green eyes. Sarcastic, slightly calculating gaze; one eyebrow slightly raised at all times - ever vigilant, yet searching for humor in all circumstances.      Long, bony, but muscular hands. Extremely dexterous, but capable of unequaled grace and strength (except perhaps Largo\'s, whose hands far surpass Dax\'s in strength and size, but not quite in grace). Skinny fingers allow access into tiny places, such as pockets and traps.      Midnight blackish-blue robes, resembling that of ancient far-east martial artists, but with a more modern feel. Full of hidden pockets.      Utility belt around waist, contains many pockets, pouches, and loops for all the various tools and equipment he carries. Mostly hidden beneath cloak, however.      Grayish cloak, shifting slightly in color to blend in with surroundings. Tattered purposely, for purely aesthetic purposes. Flows perpetually about Dax, helping to conceal his true form, and any equipment he carries.';

    const cdi = require ('./index');
    await cdi(name, text);
}
