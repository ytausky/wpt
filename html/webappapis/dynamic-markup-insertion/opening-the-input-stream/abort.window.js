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
