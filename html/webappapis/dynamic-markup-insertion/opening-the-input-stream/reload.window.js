async_test(t => {
  const frame = document.body.appendChild(document.createElement("iframe"));
  frame.src = "/common/blank.html";
  frame.addEventListener("load", t.step_func(() => {
    t.step_timeout(() => {
      assert_equals(frame.contentDocument.body.childNodes.length, 0, "precondition");
      frame.contentDocument.open();
      frame.contentDocument.write("<p>Content</p>");
      frame.contentDocument.close();
      frame.contentWindow.location.reload();
      frame.addEventListener("load", t.step_func_done(() => {
        assert_equals(frame.contentDocument.body.childNodes.length, 0, "actual test");
      }));
    }, 100);
  }), { once: true });
}, "Reloading a document.open()'d page should give original results");
