import { supabase } from "./supabase-client.js";

const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const logoutButton = document.querySelector("logout-button")

function showMessage(elementId, message, type = "error") {
    const element = document.getElementById(elementId);

    if (!element) return;


    element.textContent = message;
    element.className = `form-feedback ${type}`;
}

function friendlyError(error) {
    console.error("Authentication error", error);


    return "The operation could not be completed. Check the information and try again.";

}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = loginForm.querySelector('button[type="submit"]');
        const email = loginForm.elements.email.value.trim();
        const password = loginForm.elements.password.value;

        button.disabled = true;
        button.textContent = "Checking...";
        showMessage("login-feedback", "");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                showMessage(
                    "login-feedback",
                    "Unable to sign in. Please check your email and password."
                );
                return;
            }

            window.location.replace("dashboard.html");
        } catch (error) {
            showMessage("login-feedback", friendlyError(error));
        } finally {
            button.disabled = false;
            button.textContent = "Log in to my account ↗";
        }
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = registerForm.querySelector('button[type="submit"]');
        const name = registerForm.elements.name.value.trim();
        const email = registerForm.elements.email.value.trim();
        const password = registerForm.elements.password.value;
        const confirmPassword = registerForm.elements.confirm.value;

        showMessage("register-feedback", "");

        if (password !== confirmPassword) {
            showMessage(
                "register-feedback",
                "The passwords do not match."
            );
            return;
        }

        if (password.length < 8) {
            showMessage(
                "register-feedback", "The password must be at least 8 characters long."
            );
        }

        button.disabled = true;
        button.textContent = "Creating account...";


        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                Optionn: {
                    data: {
                        full_name: name
                    },
                    emailRedirectTo: `${window.location.origin}/login.html`
                }
            });

            if (error) {
                showMessage(
                    "register-feedback", "NUnable to complete the registration. Please check the information and try again."
                );
                return;
            }

            if (data.session) {
                window.location.replace("dashboard.html");
                return;
            }

            showMessage(
                "register-feedback",
                "Registration started! Check your email to confirm your account before logging in.",
                "success"
            );

            registerForm.reset();
        } catch (erro) {
            showMessage("register-feedback", friendlyError(error));
        } finally {
            button.disabled = false;
            button.textContent = "Create an account  ↗"
        }

    });
}

const userName = document.querySelector("#user-name");
const userEmail = document.querySelector("#user-email");

if (userName && userEmail) {
    async function loadDashboard() {
        try {
            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                window.Location.replace("login.html");
                return;
            }

            const user = data.user;
            const fullName = user.user_metadata?.full_name;


            userName.textContent = 
                typeof fullName === "string" && fullName.trim()
                ? fullName
                : "usuário";

                userEmail.textContent = user.email ?? "";
                } catch (error) {
                    console.error("Não foi possível carregar a área do usuário:", error);
            showMessage(
                "dashboard-feedback",
                "Não foi possível verificar sua sessão. Tente novamente."
            );

          }

        }
         loadDashboard();

    }


    if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        logoutButton.textContent = "Saindo...";

        try {
            const { error } = await supabase.auth.signOut({
                scope: "local"
            });

            if (error) {
                throw error;
            }

            window.location.replace("login.html");
        } catch (error) {
            console.error("Erro ao sair:", error);
            logoutButton.disabled = false;
            logoutButton.textContent = "Sair da conta ↗";

            showMessage(
                "dashboard-feedback",
                "Não foi possível encerrar a sessão. Tente novamente."
            );
        }
    });
}