const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../db.sqlite');

fs.readFile('../restaurants.json').then(data => {
    const all_restaurants = JSON.parse(String(data));
    let restaurantCount = 0;
    let menuCount = 0;
    try {
        db.serialize(() => {
            all_restaurants.forEach(restaurant => {
                restaurantCount++;
                db.run("INSERT INTO Restaurant(name, image) VALUES(?, ?)", [restaurant.name, restaurant.image]);
                restaurant.menus.forEach(menu => {
                    menuCount++;
                    db.run("INSERT INTO Menu(title, restaurant_id) VALUES(?, ?)", [menu.title, restaurantCount]);
                    menu.items.forEach(item => {
                        db.run("INSERT INTO MenuItem(name, price, menu_id) VALUES(?, ?, ?)", [item.name, item.price, menuCount]);
                    });
                });
            });
        });
    } finally {
        db.close();
    }
});