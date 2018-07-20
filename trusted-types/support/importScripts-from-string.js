try
{
  importScripts("worker.js");
}
catch(ex)
{
  if(ex instanceof TypeError) {
    result = "Type Error";
  }
  else {
    result = "Fail";
  }
  postMessage(result);
}
