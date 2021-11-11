'use strict';

const app = new Templater({
  el: '#app',
  data: {
    name: "hello",
    age: 22
  }
});
app.firstRender();