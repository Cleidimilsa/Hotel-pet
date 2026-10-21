// Script de Controle de Navegação da Etapa 1
document.addEventListener("DOMContentLoaded", () => {
    // Define a visão atual do Gerente
    localStorage.setItem("userRole", "gerente");
    const userRole = localStorage.getItem("userRole");

    // Destaca o link ativo na barra de navegação com base no caminho da página atual
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("header nav a");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref === currentPage) {
            link.classList.add("active");
        }
    });

    // Garante que o menu "Configurações" só esteja visível para a visão do Gerente
    const menuConfig = document.querySelector(".menu-configuracoes");
    if (menuConfig) {
        if (userRole === "gerente") {
            menuConfig.style.display = "inline-block";
        } else {
            menuConfig.style.display = "none";
        }
    }
});
