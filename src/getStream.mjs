import { get } from 'https';
import { Readable } from 'stream';


/**
 * Reads an URL as a readable stream and returns it
 * @param {string} url
 */
export default (url) => {
    const readable = new Readable({
        read() {}
    });
    get(url, (response) => {

        console.log('Response code for url', url, 'is', response.statusCode);

        response.on('data', (chunk) => {
            readable.push(chunk);
        });
        response.on('end', () => {
            console.log('END');
            readable.push(null);
        });
        response.on('error', (error) => {
            console.error('Failed:', error);
            readable.emit(error)
        });
    })
        .on('error', (error) => {
            console.error('Failed:', error);
            readable.emit(error)
        });
    return readable;
}
