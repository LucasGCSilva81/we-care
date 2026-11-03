const chatbotToggle = document.querySelector("#chatbot-toggle");
const chatbotWindow = document.querySelector("#chatbot-window");
const chatbotClose = document.querySelector("#chatbot-close");

const chatbotMessages = document.querySelector("#chatbot-messages");
const chatbotForm = document.querySelector("#chatbot-form");
const chatbotInput = document.querySelector("#chatbot-input");

const chatbotOptions = document.querySelectorAll(
    ".chatbot-options button"
);


const answers = {
    about: {
        text: "Nova Studio is a creative company focused on delivering innovative solutions. Visit our About page to learn more about us.",
        link: "about.html",
        label: "Learn about us"
    },

    products: {
        text: "Explore our available products and solutions on the Products page.",
        link: "products.html",
        label: "Explore products"
    },

    account: {
        text: "You can create an account or sign in to access your personal area.",
        link: "login.html",
        label: "Go to login"
    },

    register: {
        text: "Ready to join us? Visit the registration page to create your account.",
        link: "register.html",
        label: "Create an account"
    },

    contact: {
        text: "Would you like to contact our team? Visit the Contact page for more information.",
        link: "contact.html",
        label: "Contact us"
    },

    help: {
        text: "I can help you learn about our company, explore products, access your account, or contact our team."
    },

    unknown: {
        text: "I'm sorry, I didn't understand your question. Try asking about our company, products, account, or contact information."
    }
};


function setChatbotOpen(isOpen) {
    chatbotWindow.hidden = !isOpen;

    chatbotToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    chatbotToggle.setAttribute(
        "aria-label",
        isOpen ? "Close virtual assistant" : "Open virtual assistant"
    );

    if (isOpen) {
        chatbotInput.focus();
    }
}

chatbotToggle.addEventListener("click", () => {
    setChatbotOpen(chatbotWindow.hidden);
});

chatbotClose.addEventListener("click", () => {
    setChatbotOpen(false);
});


function addMessage(text, sender) {
    const message = document.createElement("div");

    message.classList.add(
        "chat-message",
        sender === "user" ? "user-message" : "bot-message"
    );

 
    message.textContent = text;

    chatbotMessages.appendChild(message);

    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}


function showAnswer(answer) {
    addMessage(answer.text, "bot");

    if (answer.link) {
        const link = document.createElement("a");

        link.href = answer.link;
        link.textContent = answer.label;

        link.classList.add("chat-message", "bot-message");

        link.style.textDecoration = "underline";
        link.style.fontWeight = "700";

        chatbotMessages.appendChild(link);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
}


function answerQuestion(question) {
    const normalizedQuestion = question
        .toLowerCase()
        .trim();

    let answer = answers.unknown;

    if (
        normalizedQuestion.includes("about") ||
        normalizedQuestion.includes("company")
    ) {
        answer = answers.about;

    } else if (
        normalizedQuestion.includes("product") ||
        normalizedQuestion.includes("service")
    ) {
        answer = answers.products;

    } else if (
        normalizedQuestion.includes("register") ||
        normalizedQuestion.includes("sign up") ||
        normalizedQuestion.includes("create account")
    ) {
        answer = answers.register;

    } else if (
        normalizedQuestion.includes("login") ||
        normalizedQuestion.includes("log in") ||
        normalizedQuestion.includes("account") ||
        normalizedQuestion.includes("password")
    ) {
        answer = answers.account;

    } else if (
        normalizedQuestion.includes("contact") ||
        normalizedQuestion.includes("email")
    ) {
        answer = answers.contact;

    } else if (
        normalizedQuestion.includes("help") ||
        normalizedQuestion.includes("hello") ||
        normalizedQuestion.includes("hi")
    ) {
        answer = answers.help;
    }

    showAnswer(answer);
}


chatbotForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const question = chatbotInput.value.trim();

    if (!question) {
        return;
    }

    addMessage(question, "user");

    chatbotInput.value = "";

    answerQuestion(question);
});


chatbotOptions.forEach((button) => {
    button.addEventListener("click", () => {
        const topic = button.dataset.question;

        addMessage(button.textContent.trim(), "user");

        showAnswer(answers[topic] || answers.unknown);
    });
});