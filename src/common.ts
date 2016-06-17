import {
  include,
} from 'underscore';

const MAX_LENGTH = 500; // if you change this, also change the appropriate test

export function makeErrorByStatus(statusCode, content) {
  let message = `failed [${statusCode}]`;

  if (content) {
    const stringContent = typeof content == "string" ?
      content : content.toString();

    message += ' ' + truncate(stringContent.replace(/\n/g, ' '), MAX_LENGTH);
  }

  return new Error(message);
};

// Fill in `response.data` if the content-type is JSON.
export function populateData(response) {
  // Read Content-Type header, up to a ';' if there is one.
  // A typical header might be "application/json; charset=utf-8"
  // or just "application/json".
  const contentType = (response.headers['content-type'] || ';').split(';')[0];

  // Only try to parse data as JSON if server sets correct content type.
  if (include(['application/json', 'text/javascript',
      'application/javascript', 'application/x-javascript'], contentType)) {
    try {
      response.data = JSON.parse(response.content);
    } catch (err) {
      response.data = null;
    }
  } else {
    response.data = null;
  }
}

function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}
