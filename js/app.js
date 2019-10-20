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
    renderCart(document.getElementById('modal-content'), store);
}

renderProductList(document.getElementById('productView'), store);

function showCart() {
    let modal = document.getElementById("modal");
    modal.style.visibility = "visible";
    renderCart(document.getElementById("modal-content"), store);
}

function hideCart() {
    let modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
}

// hide cart when ESC key is pressed
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) { //ESC key
        hideCart();
    }
};

function renderCart(container, storeInstance){
    // Clear the container first
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    let cart = storeInstance.cart;

    let table = document.createElement('table');
    let tr1 = document.createElement('tr');
    let th1 = document.createElement('th');
    th1.textContent = 'Product Name';
    let th2 = document.createElement('th');
    th2.textContent = 'Product Quantity';
    let th25 = document.createElement('th');
    th25.textContent = 'Product Price';
    let th3 = document.createElement('th');
    th3.textContent = 'Add';
    let th4 = document.createElement('th');
    th4.textContent = 'Sub';
    table.appendChild(tr1);
    tr1.appendChild(th1);
    tr1.appendChild(th2);
    tr1.appendChild(th25)
    tr1.appendChild(th3);
    tr1.appendChild(th4);

    var totalPrice = 0;
    for (var itemName in cart) { 
        let label = storeInstance['stock'][itemName]['label'];    
        let tr = document.createElement('tr');
        table.appendChild(tr);
        let item = document.createElement('td');
        item.textContent = itemName;
        tr.appendChild(item);

        let quantity = document.createElement('td');
        quantity.textContent = cart[itemName];
        tr.appendChild(quantity);

        var tdPrice = document.createElement("td");
        var totalItemPrice = storeInstance.stock[itemName].price * cart[itemName];
        tdPrice.setAttribute("class", "cart-table-data");
        tdPrice.textContent = "$" + totalItemPrice;
        tr.appendChild(tdPrice);
        totalPrice += totalItemPrice;

        let add = document.createElement('td');
        tr.appendChild(add);
        let sub = document.createElement('td');
        tr.appendChild(sub);

        let addBtn =  document.createElement('button');
        addBtn.setAttribute('type', 'button');
        addBtn.setAttribute('class', 'btn addbtn');
        addBtn.textContent = '+';
        addBtn.setAttribute('onclick', 'resetTimer(); store.addItemToCart(\"' + label + '\")')
        add.appendChild(addBtn);

        let subBtn =  document.createElement('button');
        subBtn.setAttribute('type', 'button');
        subBtn.setAttribute('class', 'btn subbtn');
        subBtn.textContent = '-';
        subBtn.setAttribute('onclick', 'resetTimer(); store.removeItemFromCart(\"' + label + '\")')
        sub.appendChild(subBtn);
        
    }

    let totalDue = document.createElement('div');
    totalDue.setAttribute('class', 'totalDue');
    totalDue.textContent = "Total Price: $" + totalPrice;

    container.appendChild(table);
    container.appendChild(totalDue);
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
    // Clear the container first
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    let product = storeInstance['stock'][itemName];
    // let newContainer = document.createElement('li');
    container.setAttribute('class', 'product');

    let img = document.createElement('img');
    img.setAttribute('src', `${product['imageUrl']}`);
    container.appendChild(img);

    let price = document.createElement('div');
    price.setAttribute('class', 'price');
    price.textContent = `$${product['price']}`;
    container.appendChild(price);

    let name = document.createElement('div');
    name.setAttribute('class', 'productName');
    name.textContent = product['label'];
    container.appendChild(name);

    //If the quantity of an item in stock is zero, "Add to Cart" button should not be generated.
    if(product['quantity'] > 0) {
        let add = document.createElement('button');
        add.setAttribute('type', 'button');
        add.setAttribute('class', 'btn-add');
        add.textContent = 'Add';
        add.onclick = function() {
            console.log("clickedddd");
            resetTimer();
            store.addItemToCart(itemName);                           
        }
        container.appendChild(add);
        //innerHTML is bad, why?(onclick doesn't work)
    }

    //If the quantity of an item in cart is zero, "Remove from Cart" button should not be generated.
    if(storeInstance['cart'][itemName] > 0) {
        let remove = document.createElement('button');
        remove.setAttribute('type', 'button');
        remove.setAttribute('class', 'btn-remove');
        remove.textContent = 'Remove';
        remove.setAttribute('onclick', 'resetTimer(); store.removeItemFromCart(\"' + itemName + '\")')
        container.appendChild(remove);
    }

}

function renderProductList(container, storeInstance) {
    // Clear the container first
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for(let key in storeInstance['stock']) {
        let li = document.createElement('li');
        let label = storeInstance['stock'][key]['label']
        renderProduct(li, storeInstance, key);
        container.appendChild(li);
        li.setAttribute('id', `product-${key}`);
        li.setAttribute('class', 'product');
        container.appendChild(li);
    }
}