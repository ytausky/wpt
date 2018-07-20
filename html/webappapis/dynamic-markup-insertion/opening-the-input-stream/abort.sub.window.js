async_test(t => {
  const frame = document.body.appendChild(document.createElement("iframe"));
  t.add_cleanup(() => frame.remove());
  frame.src = "/common/blank.html";
  frame.onload = t.step_func(() => {
    let happened = false;
    const client = new frame.contentWindow.XMLHttpRequest();
    client.open("GET", "/common/blank.html");
    client.onload = t.step_func_done(e => {
      assert_true(happened);
    });
    client.onerror = t.unreached_func("XMLHttpRequest should have succeeded");
    client.onabort = t.unreached_func("XMLHttpRequest should have succeeded");
    client.ontimeout = t.unreached_func("XMLHttpRequest should have succeeded");
    client.send();
    frame.contentDocument.open();
    happened = true;
  });
}, "document.open() and aborting documents (XMLHttpRequest)");

async_test(t => {
  const frame = document.body.appendChild(document.createElement("iframe"));
  t.add_cleanup(() => frame.remove());
  frame.src = "/common/blank.html";
  frame.onload = t.step_func(() => {
    let happened = false;
    frame.contentWindow.fetch("/common/blank.html").then(
      t.step_func_done(err => {
        assert_true(happened);
      }),
      t.unreached_func("Fetch should have succeeded")
    );
    frame.contentDocument.open();
    happened = true;
  });
}, "document.open() and aborting documents (fetch())");

async_test(t => {
  const __SERVER__NAME = "{{host}}";
  const __PORT = {{ports[ws][0]}};
  const frame = document.body.appendChild(document.createElement("iframe"));
  t.add_cleanup(() => frame.remove());
  frame.src = "/common/blank.html";
  frame.onload = t.step_func(() => {
    let happened = false;
    const ws = new frame.contentWindow.WebSocket(`ws://${__SERVER__NAME}:${__PORT}/echo`);
    ws.onopen = t.step_func_done(() => {
      assert_true(happened);
    });
    ws.onclose = t.unreached_func("WebSocket fetch should have succeeded");
    ws.onerror = t.unreached_func("WebSocket should have no error");
    frame.contentDocument.open();
    happened = true;
  });
}, "document.open() and aborting documents (establish a WebSocket connection)");

async_test(t => {
  const __SERVER__NAME = "{{host}}";
  const __PORT = {{ports[ws][0]}};
  const frame = document.body.appendChild(document.createElement("iframe"));
  t.add_cleanup(() => frame.remove());
  frame.src = "/common/blank.html";
  frame.onload = t.step_func(() => {
    let happened = false;
    const ws = new frame.contentWindow.WebSocket(`ws://${__SERVER__NAME}:${__PORT}/echo`);
    ws.onopen = t.step_func(() => {
      t.step_timeout(t.step_func_done(() => {
        assert_true(happened);
      }), 100);
      frame.contentDocument.open();
      happened = true;
    });
    ws.onclose = t.unreached_func("WebSocket should not be closed");
    ws.onerror = t.unreached_func("WebSocket should have no error");
  });
}, "document.open() and aborting documents (already established WebSocket connection)");
