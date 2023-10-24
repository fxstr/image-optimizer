import { URL } from 'url';

const intifyIfSet = (value) => (
    (value !== null && value !== undefined) ? parseInt(value, 10) : undefined
);

/**
 * Extrats relevant information from the URL passed
 * @param {string} url      Relative URL we got from the incoming request
 * @param {string} baseURL  Base URL we got from the incoming request
 * 
 */
export default(url, baseURL) => {
    // Just use any prefix. Why's the URL relative, though?
    console.log('Parse URL %s on %s', url, baseURL);
    const urlObject = new URL(url, baseURL);
    const fileType = urlObject.searchParams.get('t');
    const focalPointX = intifyIfSet(urlObject.searchParams.get('fpx'));
    const focalPointY = intifyIfSet(urlObject.searchParams.get('fpy'));
    const height = intifyIfSet(urlObject.searchParams.get('h'));
    const width = intifyIfSet(urlObject.searchParams.get('w'));
    // Substr: Remove leading slash
    const originalURL = urlObject.pathname.substr(1);

    try {
        new URL(originalURL);
    } catch (err) {
        throw new Error(`Original URL ${originalURL} is not valid`);
    }

    return {
        fileType,
        originalURL,
        height,
        width,
        focalPointX,
        focalPointY,
    };
}
