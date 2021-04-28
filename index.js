const express = require("express");
const app = express();
// in the imports above
const fs = require("fs");
require("dotenv").config();

let folders = {};
for (let e of Object.keys(process.env)){
    if (e.startsWith('FOLDER_')){
        const k = e.replace('FOLDER_', '');
        folders[k] = process.env[e];
    }
}

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/video-page/:folder', function (req, res){
    res.sendFile(__dirname + "/video-page.html");
})

app.get("/videos", function (req, res, next){
    const out = {};
    for (let key of Object.keys(folders)){
        out[key] = fs.readdirSync(folders[key]);
    }
    res.json(out);
});

app.get("/video/:folder", function (req, res, next){
    const folder = folders[req.params.folder];
    const videoName = req.query.name;
    const range = req.headers.range;
    if (!range) {
        return res.status(400).send("Requires Range header");
    }

    // get video stats (about 61MB)
    const videoPath = folder + videoName;
    const videoSize = fs.statSync(videoPath).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 1 << 20; // 1MB
    let r = range.replace("bytes=", "");
    r = r.split('-');
    const start= parseInt(r[0]);
    let end = parseInt(r[1]);
    if (isNaN(end))
        end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Listening on port " + port);
});