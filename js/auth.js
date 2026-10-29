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
    console.error("Erro de autenticação", error);


    return "Não foi possível concluir a operação. Confira os dados e tente novamente.";

}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = loginForm.querySelector('button[type="submit"]');
        const email = loginForm.elements.email.value.trim();
        const password = loginForm.elements.password.value;

        button.disabled = true;
        button.textContent = "Verificando...";
        showMessage("login-feedback", "");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                showMessage(
                    "login-feedback",
                    "Não foi possível entrar. Confira seu e-mail e senha."
                );
                return;
            }

            window.location.replace("dashboard.html");
        } catch (error) {
            showMessage("login-feedback", friendlyError(error));
        } finally {
            button.disabled = false;
            button.textContent = "Entrar na minha conta ↗";
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
                "As senhas não são iguais."
            );
            return;
        }

        if (password.length < 8) {
            showMessage(
                "register-feedback", "A senha precisa ter pelo menos 8 caracteres."
            );
        }

        button.disabled = true;
        button.textContent = "Criando conta...";


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
                    "register-feedback", "Não foi possível concluir o cadastro. Confira os dados e tente novamente."
                );
                return;
            }

            if (data.session) {
                window.location.replace("dashboard.html");
                return;
            }

            showMessage(
                "register-feedback",
                "Cadastro iniciado! Confira seu e-mail para confirmar a conta antes de entrar.",
                "success"
            );

            registerForm.reset();
        } catch (erro) {
            showMessage("register-feedback", friendlyError(error));
        } finally {
            button.disabled = false;
            button.textContent = "Crfiar uma conta  ↗"
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