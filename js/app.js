function Store(initialStock) {
    this.stock = initialStock;
    this.cart = {};
    this.onUpdate = null;
}

Store.prototype.addItemToCart = function(name) {
    if(this.stock[name]["quantity"] > 0) {
        this.stock[name]["quantity"]--;
        this.cart[name] === undefined ? this.cart[name] = 1 : this.cart[name]++;
        this.onUpdate(name);
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
        this.onUpdate(name);
    }
}

let products = {
    "Box1": {
        "label": "Box1",
        "imageUrl": "images/Box1_$10.png",
        "price": 10,
        "quantity": 5
    },
    "Box2": {
        "label": "Box2",
        "imageUrl": "images/Box2_$5.png",
        "price": 5,
        "quantity": 5
    },
    "Clothes1": {
        "label": "Clothes1",
        "imageUrl": "images/Clothes1_$20.png",
        "price": 20,
        "quantity": 5
    },
    "Clothes2": {
        "label": "Clothes2",
        "imageUrl": "images/Clothes2_$30.png",
        "price": 30,
        "quantity": 5
    },
    "Jeans": {
        "label": "Jeans",
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
        "label": "Keyboard",
        "imageUrl": "images/Keyboard_$20.png",
        "price": 20,
        "quantity": 5
    },
    "Mice": {
        "label": "Mice",
        "imageUrl": "images/Mice_$20.png",
        "price": 20,
        "quantity": 5
    },
    "PC1": {
        "label": "PC1",
        "imageUrl": "images/PC1_$350.png",
        "price": 350,
        "quantity": 5
    },
    "PC2": {
        "label": "PC2",
        "imageUrl": "images/PC2_$400.png",
        "price": 400,
        "quantity": 5
    },
    "PC3": {
        "label": "PC3",
        "imageUrl": "images/PC3_$300.png",
        "price": 300,
        "quantity": 5
    },
    "Tent": {
        "label": "Tent",
        "imageUrl": "images/Tent_$100.png",
        "price": 100,
        "quantity": 5
    }
}

let store = new Store(products);
store.onUpdate = function(itemName) {
    let container = document.getElementById(`product-${itemName}`);
    renderProduct(container, store, itemName);
}

renderProductList(document.getElementById('productView'), store);

function showCart(cart) {
    let modal = document.getElementById("modal");
    modal.style.visibility = "visible";
    renderCart(document.getElementById("modal-content"), store);
}

function hideCart() {
    let modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
}

let btnShowCart = document.getElementById("btn-show-cart");
btnShowCart.onclick = function() {
    showCart(store.cart);
    resetTimer();
}


let timeoutInMiliseconds = 30000000;
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

function renderProduct(container, storeInstance, itemName) {
    let product = storeInstance['stock'][itemName];
    let newContainer = document.createElement('li');
    newContainer.setAttribute('class', 'product');

    let img = document.createElement('img');
    img.setAttribute('src', `${product['imageUrl']}`);
    newContainer.appendChild(img);

    let price = document.createElement('div');
    price.setAttribute('class', 'price');
    price.textContent = `$${product['price']}`;
    newContainer.appendChild(price);

    let name = document.createElement('div');
    name.setAttribute('class', 'productName');
    name.textContent = product['label'];
    newContainer.appendChild(name);

    //If the quantity of an item in stock is zero, "Add to Cart" button should not be generated.
    if(product['quantity'] > 0) {
        let add = document.createElement('button');
        add.setAttribute('type', 'button');
        add.setAttribute('class', 'btn-add');
        add.textContent = 'Add';
        // add.addEventListener("click", function() {
        //     console.log("clicklcdddd");
        //     resetTimer();
        //     store.addItemToCart(itemName);                           
        // });
        add.setAttribute('onclick', 'resetTimer(); store.addItemToCart(\"' + itemName + '\")')
        // add.onclick = function() {
        //     console.log("clickedddd");
        //     resetTimer();
        //     store.addItemToCart(itemName);                           
        // }
        newContainer.appendChild(add);
    }

    //If the quantity of an item in cart is zero, "Remove from Cart" button should not be generated.
    if(storeInstance['cart'][itemName] > 0) {
        let remove = document.createElement('button');
        remove.setAttribute('type', 'button');
        remove.setAttribute('class', 'btn-remove');
        remove.textContent = 'Remove';
        remove.setAttribute('onclick', 'resetTimer(); store.removeItemFromCart(\"' + itemName + '\")')
        newContainer.appendChild(remove);
    }

    container.innerHTML = newContainer.innerHTML;
}

function renderProductList(container, storeInstance) {
    //First clear the original content of the container
    container.innerHTML = '';

    for(let key in storeInstance['stock']) {
        let li = document.createElement('li');
        renderProduct(li, storeInstance, key);
        container.appendChild(li);
        li.setAttribute('id', `product-${key}`);
        li.setAttribute('class', 'product');
        container.appendChild(li);
    }
}