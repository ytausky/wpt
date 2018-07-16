async_test(t => {
  const frame = document.body.appendChild(document.createElement("iframe"));
  frame.src = "/common/blank.html";
  frame.onload = t.step_func(() => {
    let happened = false;
    const client = new frame.contentWindow.XMLHttpRequest();
    client.open("GET", "/common/blank.html");
    client.onerror = t.step_func_done(e => {
      assert_true(happened);
      frame.contentDocument.close();
    });
    client.send();
    frame.contentDocument.open();
    happened = true;
  });
}, "document.open() and aborting documents (XMLHttpRequest)");

async_test(t => {
  const frame = document.body.appendChild(document.createElement("iframe"));
  frame.src = "/common/blank.html";
  frame.onload = t.step_func(() => {
    let happened = false;
    frame.contentWindow.fetch("/common/blank.html").then(
      t.unreached_func("Fetch should have been aborted"),
      t.step_func_done(err => {
        assert_true(happened);
        frame.contentDocument.close();
      }));
    frame.contentDocument.open();
    happened = true;
  });
}, "document.open() and aborting documents (fetch())");

// Since the "unload a document" algorithm is currently executed before "abort
// a document", the following two tests technically test the "unload" algorithm
// since that is where "make disappear a WebSocket object" is called, rather
// than aborting a fetch.
async_test(t => {
  const __SERVER__NAME = "{{host}}";
  const __PORT = {{ports[ws][0]}};
  const frame = document.body.appendChild(document.createElement("iframe"));
  frame.src = "/common/blank.html";
  frame.onload = t.step_func(() => {
    let happened = false;
    const ws = new frame.contentWindow.WebSocket(`ws://${__SERVER__NAME}:${__PORT}/echo`);
    ws.onopen = t.unreached_func("WebSocket fetch should have been aborted");
    // This should have been an error event rather than a close event, as the
    // WebSocket connection is not yet established (so "fail the WebSocket
    // connection" should be used), but no one implements that.
    ws.onclose = t.step_func_done(() => {
      assert_true(happened);
      frame.contentDocument.close();
    });
    ws.onerror = t.unreached_func("WebSocket should have no error");
    frame.contentDocument.open();
    happened = true;
  });
}, "document.open() and aborting documents (establish a WebSocket connection)");

async_test(t => {
  const __SERVER__NAME = "{{host}}";
  const __PORT = {{ports[ws][0]}};
  const frame = document.body.appendChild(document.createElement("iframe"));
  frame.src = "/common/blank.html";
  frame.onload = t.step_func(() => {
    let happened = false;
    const ws = new frame.contentWindow.WebSocket(`ws://${__SERVER__NAME}:${__PORT}/echo`);
    ws.onopen = t.step_func(() => {
      frame.contentDocument.open();
      happened = true;
    });
    ws.onclose = t.step_func_done(() => {
      assert_true(happened);
      frame.contentDocument.close();
    });
    ws.onerror = t.unreached_func("WebSocket should have no error");
  });
}, "document.open() and aborting documents (already established WebSocket connection)");
