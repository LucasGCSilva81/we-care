


const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const menuAberto = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(menuAberto));
    menuToggle.setAttribute("aria-label", menuAberto ? "Close menu" : "Open menu");
    
    menuToggle.textContent = menuAberto ? "X" : "☰";
    });
    
    navLinks.querySelectorAll("a"). forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded" , false);
            menuToggle.setAttribute("aria-label" , "Open menu");
            menuToggle.textContent = "☰";
        });
    });
}

const elementosReveal = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const observador = new IntersectionObserver((entradas, observer) => {

        entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("visible");

                observer.unobserve(entrada.target);

            }

        });

    }, {
        threshold: 0.12
    });

    elementosReveal.forEach((elemento) => {
        observador.observe(elemento);
    });

} else {

    // Exibe os elementos em navegadores sem suporte à API.
    elementosReveal.forEach((elemento) => {
        elemento.classList.add("visible");
    });

}

document.querySelectorAll(".current-year").forEach((elemento) => {
    elemento.textContent = new Date().getFullYear();
});

const productSearch = document.querySelector("#product-search");
const categoryFilter = document.querySelector("#category-filter");
const productCards = document.querySelectorAll(".product-card");
const productCount = document.querySelector("#product-count");
const noProducts = document.querySelector("#no-products");

function filterProducts() {
    if (!productSearch || !categoryFilter) return;

    const pesquisa = productSearch.value.trim().toLowerCase();
    const categoria = categoryFilter.value;

    let quantidadeVisivel = 0;

    productCards.forEach((card) => {
        const texto = card.textContent.toLowerCase();
        const categoriaProduto = card.dataset.category;

        const correspondePesquisa = texto.includes(pesquisa);
        const correspondeCategoria =
            categoria === "all" || categoriaProduto === categoria;

        const mostrar = correspondePesquisa && correspondeCategoria;

        card.hidden = !mostrar;

        if (mostrar) {
            quantidadeVisivel++;
        }
    });

    if (productCount) {
        productCount.textContent =
            `${quantidadeVisivel} product(s) found(s).`;
    }

    if (noProducts) {
        noProducts.hidden = quantidadeVisivel !== 0;
    }
}

if (productSearch && categoryFilter) {
    productSearch.addEventListener("input", filterProducts);
    categoryFilter.addEventListener("change", filterProducts);
    filterProducts();
}

const productDialog = document.querySelector("#product-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const dialogPrice = document.querySelector("#dialog-price");
const closeDialog = document.querySelector("#close-dialog");

document.querySelectorAll(".product-details").forEach((button) => {
    button.addEventListener("click", () => {
        if (!productDialog) return;

        dialogTitle.textContent = button.dataset.title;
        dialogDescription.textContent = button.dataset.description;
        dialogPrice.textContent = button.dataset.price;

        productDialog.showModal();
    });
});

if (productDialog && closeDialog) {
    closeDialog.addEventListener("click", () => {
        productDialog.closest();
    });

     productDialog.addEventListener("click", (event) => {
        if (event.target === productDialog) {
            productDialog.closest();
        
        }
});

}

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        formFeedback.textContent =
            "Validation complete! This form does not yet send messages to the server.";
        formFeedback.className = "form-feedback success";


    });
}