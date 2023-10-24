import { createServer, request } from 'http';
import sharp from 'sharp'
import parseURLInformation from './parseURLInformation.mjs';
import getStream from './getStream.mjs';
import getCrop from './getCrop.mjs'
import { Transform } from 'stream';
import { get } from 'https';

const handler = async (request, response) => {

    const start = new Date().getTime();

    console.log('Got request', request.url, request.headers.host);    

    let information;
    try {
        information = parseURLInformation(request.url, `https://${request.headers.host}`);
    } catch (err) {
        console.log('failed to get information: ', err);
        return;
    }

    
    response.setHeader('Content-Type', 'image/avif');
    
    console.log('Get image', information.originalURL);

    console.log('Information', information);

    // const stream = getStream(information.originalURL);

    const pipeline = sharp();
    
    let cropInfo;
    // const getCropInfo = pipeline.metadata((err, metadata) => {

    //     cropInfo = getCrop({
    //         inputWidth: metadata.width,
    //         inputHeight: metadata.height,
    //         outputWidth: information.width,
    //         outputHeight: information.height,
    //         focalPointX: information.focalPointX,
    //         focalPointY: information.focalPointY,
    //     });

    //     console.log('Crop info', cropInfo);
    // });

    // const extract = pipeline.extract({
    //     left: cropInfo.x1,
    //     top: cropInfo.y1,
    //     width: cropInfo.x2 - cropInfo.x1,
    //     height: cropInfo.y2 - cropInfo.y1,    
    // });

    // const resize = pipeline.resize({
    //     width: information.width,
    //     height: information.height,
    // });

    // const createAvif = pipeline.avif();

    // stream

        // .pipe(getCropInfo)
        // .pipe(extract)
        // .pipe(resize)
        // .pipe(t)
        // .pipe(createAvif)
        // .pipe(response);
    
    let chunks = [];

    get(information.originalURL, (res) => {
        res.on('data', (data) => {
            chunks.push(data);
        });

        res.on('end', async () => {
            console.log('Stream fully read');
            const image = sharp(Buffer.concat(chunks))
            
            const metadata = await image.metadata();
            const cropInfo = getCrop({
                inputWidth: metadata.width,
                inputHeight: metadata.height,
                outputWidth: information.width,
                outputHeight: information.height,
                focalPointX: information.focalPointX,
                focalPointY: information.focalPointY,
            });

            image.extract({
                    left: cropInfo.x1,
                    top: cropInfo.y1,
                    width: cropInfo.x2 - cropInfo.x1,
                    height: cropInfo.y2 - cropInfo.y1,    
                })
                .resize({
                    width: information.width,
                    height: information.height,
                })
                .avif();

                const buffer = await image.toBuffer();
                response.write(buffer);
                console.log('Done after', new Date().getTime() - start, 'ms');
    
        });
    });

}

const server = createServer(handler);

server.listen(3000, (err) => {
    if (err) {
        return console.log('Error', err);
    }
    console.log('Running');
});

