const app = new Templater.default({
    el: '#app',
    data: {
        name: 'Henry',
        age: 25,
        bool: true,
    }
}).run();