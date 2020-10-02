//Util para receber um link de player do youtube normal
//e quebrar para retornar ID de video para ser utilizado no YT Player embeded
//
module.exports = {
    extractIdYoutubeVideo(link) {
        let link_split = link.split('=');
        return link_split[1];
    }
}