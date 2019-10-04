function Store(initialStock) {
    this.stock = initialStock;
    this.cart = {};
}

Store.prototype.addItemToCart = function(name) {
    if(this.stock[name]["quantity"] > 0) {
        this.stock[name]["quantity"]--;
        this.cart[name] === undefined ? this.cart[name] = 1 : this.cart[name]++;
    } else {
        alert(`Add fail. No stock for ${name}`);
    }
}
Store.prototype.removeItemFromCart = function(name) {
    if(this.cart[name] === undefined) {
        alert(`Remove fail. No ${name} in cart`);
    } else {
        this.stock[name]["quantity"]++;
        this.cart[name]--;
        if(this.cart[name] === 0) {
            delete this.cart[name];
        }
    }
}

let products = {
    "Box1": {
        "label": "box1",
        "imageUrl": "images/Box1_$10.png",
        "price": 10,
        "quantity": 5
    },
    "Box2": {
        "label": "box2",
        "imageUrl": "images/Box2_$5.png",
        "price": 5,
        "quantity": 5
    },
    "Clothes1": {
        "label": "clothes1",
        "imageUrl": "images/Clothes1_$20.png",
        "price": 20,
        "quantity": 5
    },
    "Clothes2": {
        "label": "clothes2",
        "imageUrl": "images/Clothes2_$30.png",
        "price": 30,
        "quantity": 5
    },
    "Jeans": {
        "label": "jeans",
        "imageUrl": "images/Jeans_$50.png",
        "price": 50,
        "quantity": 5
    },
    "KeyboardCombo": {
        "label": "KeyboardCombo",
        "imageUrl": "images/KeyboardCombo_$40.png",
        "price": 40,
        "quantity": 5
    },
    "Keyboard": {
        "label": "keyboard",
        "imageUrl": "images/Keyboard_$20.png",
        "price": 20,
        "quantity": 5
    },
    "Mice": {
        "label": "mice",
        "imageUrl": "images/Mice_$20.png",
        "price": 20,
        "quantity": 5
    },
    "PC1": {
        "label": "pc1",
        "imageUrl": "images/PC1_$350.png",
        "price": 350,
        "quantity": 5
    },
    "PC2": {
        "label": "pc2",
        "imageUrl": "images/PC2_$300.png",
        "price": 400,
        "quantity": 5
    },
    "PC3": {
        "label": "pc3",
        "imageUrl": "images/PC3_$300.png",
        "price": 300,
        "quantity": 5
    },
    "Tent": {
        "label": "tent",
        "imageUrl": "images/Tent_$100.png",
        "price": 100,
        "quantity": 5
    }
}

let store = new Store(products);


let btns = document.querySelectorAll(".btn-add, .btn-remove");
for (let i = 0; i < btns.length; i++) {
    btns[i].onclick = function() {
        resetTimer();
        let siblings = btns[i].parentElement.children;
        let btnClass = btns[i].className;
        for (let j = 0; j < siblings.length; j++) {
            if(siblings[j].className == "productName") {
                let productName = siblings[j].textContent;
                if(btnClass == "btn-add") {
                    store.addItemToCart(productName);
                } else {
                    store.removeItemFromCart(productName);
                }              
            }           
        }        
    }
}

function showCart(cart) {
    let cartProducts = "";
    for (var product in cart) {
        console.log(cart[product]);
        cartProducts += product + " : " + cart[product] + "\n";
        console.log(cartProducts);
    }
    alert(cartProducts);
}

let btnShowCart = document.getElementById("btn-show-cart");
btnShowCart.onclick = function() {
    showCart(store.cart);
    resetTimer();
}


let timeoutInMiliseconds = 30000;
let timeoutId;

function startTimer() {
    timeoutId = setTimeout(function() {
        alert("Hey there! Are you still planning to buy something?");
        resetTimer();
    }, timeoutInMiliseconds);
}
function resetTimer() {
    clearTimeout(timeoutId);  //delete previous timer
    startTimer();
}

startTimer();