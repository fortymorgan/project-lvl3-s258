import parseRssXml from './parser';

const corsProxy = 'https://cors-anywhere.herokuapp.com/';

export default feed => fetch(corsProxy + feed)
  .then(blob => blob.text())
  .then((data) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
    return parseRssXml(xml);
  });
