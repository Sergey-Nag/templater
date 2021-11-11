const app = new Templater.default({
    el: '#app',
    data: {
        name: 'Henry',
        age: 25
    }
});
app.run();
app.data.name = 'Peter';