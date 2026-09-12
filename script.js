const cart = [];

const cartDrawer = document.querySelector('.cart-drawer');
const cartBackdrop = document.querySelector('.cart-backdrop');
const cartItems = document.querySelector('.cart-items');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total strong');
const cartCounts = document.querySelectorAll('.cart-count');
const checkoutButton = document.querySelector('.checkout-button');
const clearButton = document.querySelector('.clear-cart');
const cartStatus = document.querySelector('#cart-status');
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('.primary-nav');

function formatMoney(value) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
}

function openCart() {
  cartBackdrop.hidden = false;
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cart-open');
  cartDrawer.querySelector('[data-close-cart]').focus();
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartBackdrop.hidden = true;
  document.body.classList.remove('cart-open');
}

function renderCart() {
  cartItems.replaceChildren();

  cart.forEach((item, index) => {
    const line = document.createElement('li');
    line.className = 'cart-line';

    const name = document.createElement('strong');
    name.textContent = item.name;
    const price = document.createElement('strong');
    price.textContent = formatMoney(item.price);
    const quantity = document.createElement('span');
    quantity.textContent = '1 item';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove-item';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      const [removed] = cart.splice(index, 1);
      cartStatus.textContent = `${removed.name} removed from your order.`;
      renderCart();
    });

    line.append(name, price, quantity, remove);
    cartItems.append(line);
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatMoney(total);
  cartCounts.forEach((count) => { count.textContent = cart.length; });
  cartEmpty.hidden = cart.length > 0;
  checkoutButton.disabled = cart.length === 0;
  clearButton.disabled = cart.length === 0;
}

document.querySelectorAll('.product-card').forEach((card) => {
  const button = card.querySelector('.add-button');
  button.addEventListener('click', () => {
    const item = { name: card.dataset.product, price: Number(card.dataset.price) };
    cart.push(item);
    button.classList.add('added');
    button.textContent = 'Added ✓';
    setTimeout(() => {
      button.classList.remove('added');
      button.textContent = 'Add to Order';
    }, 900);
    cartStatus.textContent = `${item.name} added to your order.`;
    renderCart();
  });
});

document.querySelectorAll('[data-open-cart]').forEach((button) => button.addEventListener('click', openCart));
document.querySelector('[data-close-cart]').addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && cartDrawer.classList.contains('open')) closeCart();
});

clearButton.addEventListener('click', () => {
  cart.splice(0, cart.length);
  cartStatus.textContent = 'Your order has been cleared.';
  renderCart();
});

checkoutButton.addEventListener('click', () => {
  alert('Prototype interaction: checkout is not connected to a payment system for this assessment website.');
});

navToggle.addEventListener('click', () => {
  const open = primaryNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  primaryNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

renderCart();
