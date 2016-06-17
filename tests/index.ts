import http from '../src';

import 'jasmine-ajax';

describe('http', () => {
  beforeEach(() => {
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  it('basic', () => {
    function basic_get(url, options, expected_url) {
      function callback(error, result) {
        expect(error).toBeFalsy();
        if (!error) {
          expect(typeof result).toEqual("object");
          expect(result.statusCode).toEqual(200);

          const data = result.data;

          // allow dropping of final ? (which mobile browsers seem to do)
          const allowed = [expected_url];
          if (expected_url.slice(-1) === '?')
            allowed.push(expected_url.slice(0, -1));

          // assert.include(allowed, expected_url);
          expect(allowed).toContain(expected_url);
          expect(data.method).toEqual("GET");
        }
      };

      jasmine.Ajax.stubRequest(url).andReturn({
        'responseText': 'immediate response'
      });

      http("GET", url, options, (error, result) => {
        callback(error, result);
      });
    };

    basic_get("/foo", null, "/foo");
    basic_get("/foo?", null, "/foo?");
    basic_get("/foo?a=b", null, "/foo?a=b");
    basic_get("/foo", { params: { fruit: "apple" } },
      "/foo?fruit=apple");
    basic_get("/foo", { params: { fruit: "apple", dog: "Spot the dog" } },
      "/foo?fruit=apple&dog=Spot+the+dog");
    basic_get("/foo?", { params: { fruit: "apple", dog: "Spot the dog" } },
      "/foo?fruit=apple&dog=Spot+the+dog");
    basic_get("/foo?bar", { params: { fruit: "apple", dog: "Spot the dog" } },
      "/foo?bar&fruit=apple&dog=Spot+the+dog");
    basic_get("/foo?bar", {
      params: { fruit: "apple", dog: "Spot the dog" },
      query: "baz"
    },
      "/foo?baz&fruit=apple&dog=Spot+the+dog");
    basic_get("/foo", {
      params: { fruit: "apple", dog: "Spot the dog" },
      query: "baz"
    },
      "/foo?baz&fruit=apple&dog=Spot+the+dog");
    basic_get("/foo?", {
      params: { fruit: "apple", dog: "Spot the dog" },
      query: "baz"
    },
      "/foo?baz&fruit=apple&dog=Spot+the+dog");
    basic_get("/foo?bar", { query: "" }, "/foo?");
    basic_get("/foo?bar", {
      params: { fruit: "apple", dog: "Spot the dog" },
      query: ""
    },
      "/foo?fruit=apple&dog=Spot+the+dog");
  });
});
