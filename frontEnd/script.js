// --- LOGIN ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  // Função para hashear a senha em SHA-256 usando Web Crypto API
  async function hashPasswordSHA256(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const email = formData.get("email");
    const senha = formData.get("senha");

    // Hasheia a senha antes de enviar
    const senhaHash = await hashPasswordSHA256(senha);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: email, senha: senhaHash })
      });

      if (response.ok) {
        alert("Login bem-sucedido!");
        // Salva o email do usuário logado para validação futura de Pix
        localStorage.setItem('emailUsuario', email);
        window.location.href = "home.html";
      } else {
        const error = await response.text();
        alert("Erro: " + error);
      }
    } catch (error) {
      console.error(error);
      alert("Erro na conexão com o servidor.");
    }
  });
}

// --- Alternar exibição do saldo ---
const saldoValor = document.getElementById('saldo-valor');
const btnSaldo = document.getElementById('btn-saldo');
const imgEye = document.getElementById('img-eye');
let saldoVisivel = true;

function atualizarIconeOlho() {
  if (imgEye) {
    imgEye.src = saldoVisivel
      ? 'https://img.icons8.com/ios-filled/18/ffffff/visible--v1.png'
      : 'https://img.icons8.com/ios-filled/18/ffffff/invisible.png';
    imgEye.alt = saldoVisivel ? "Ocultar saldo" : "Exibir saldo";
  }
}

if (btnSaldo && saldoValor) {
  btnSaldo.addEventListener('click', () => {
    saldoVisivel = !saldoVisivel;
    if (saldoVisivel) {
      saldoValor.textContent = 'R$ 7.239,25';
      saldoValor.classList.remove('oculto');
    } else {
      saldoValor.textContent = '••••••••';
      saldoValor.classList.add('oculto');
    }
    atualizarIconeOlho();
  });
  atualizarIconeOlho();
}

// Acessar área do Pix (redireciona para pix.html)
const favPix = document.getElementById('fav-pix');
if (favPix) {
  favPix.addEventListener('click', () => {
    window.location.href = "pix.html";
  });
  favPix.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      favPix.click();
    }
  });
  favPix.setAttribute('tabindex', '0');
}

// IDs dos novos botões favoritos
const novosFavoritos = [
  'fav-transfer',
  'fav-pagamentos',
  'fav-cartoes',
  'fav-emprestimos',
  'fav-investimentos',
  'fav-recargas',
  'fav-personalizar'
];

novosFavoritos.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', () => {
      alert("Em breve terá novas funções!");
    });
    el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        el.click();
      }
    });
    el.setAttribute('tabindex', '0');
  }
});

// Rodapé: alerta nos itens exceto Home
const footerItems = document.querySelectorAll('.footer-item');
if (footerItems.length > 0) {
  footerItems.forEach((item, idx) => {
    if (idx > 0) {
      item.addEventListener('click', () => {
        alert("Em breve terá novas funções!");
      });
      item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          item.click();
        }
      });
      item.setAttribute('tabindex', '0');
    }
  });
}

// Menu superior: alerta em itens específicos
const menuLabels = ["Extrato", "Open Finance", "Meus bancos", "Trazer dados"];
const menuItems = document.querySelectorAll('.menu-item');
if (menuItems.length > 0) {
  menuItems.forEach(item => {
    const label = item.querySelector('span')?.textContent?.trim();
    if (menuLabels.includes(label)) {
      item.addEventListener('click', () => {
        alert("Em breve terá novas funções!");
      });
      item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          item.click();
        }
      });
      item.setAttribute('tabindex', '0');
    }
  });
}

// Sino de notificações
const bell = document.querySelector('.icon-bell');
if (bell) {
  bell.addEventListener('click', () => {
    alert("Em breve terá novas funções!");
  });
  bell.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      bell.click();
    }
  });
  bell.setAttribute('tabindex', '0');
}

// Botão Sair fecha o site ou redireciona
const logoutBtn = document.querySelector('.logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    window.close();
    setTimeout(() => {
      window.location.href = "https://www.bradesco.com.br";
    }, 200);
  });
}

// Pix: redirecionar ao clicar em Transferir
const pixTransferir = document.getElementById('pix-transferir');
if (pixTransferir) {
  pixTransferir.addEventListener('click', () => {
    window.location.href = "inserir.html";
  });
  pixTransferir.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      pixTransferir.click();
    }
  });
  pixTransferir.setAttribute('tabindex', '0');
}

// --- CONTINUAR PIX ---
document.getElementById('btn-continuar-pix').onclick = async function() {
  const chave = document.getElementById('chave-pix').value.trim();
  if (!chave) {
      alert("Digite uma chave Pix.");
      return;
  }
  // Chama o backend para verificar suspeita
  try {
      const resp = await fetch(`http://localhost:8080/pix/verificar-chave?chave=${encodeURIComponent(chave)}`);
      const suspeito = await resp.json();
      if (suspeito) {
          // Redireciona para msn.html e passa a chave via localStorage
          localStorage.setItem('chaveSuspeita', chave);
          window.location.href = "msn.html";
      } else {
          // Segue para valor.html
          localStorage.setItem('chavePix', chave);
          window.location.href = "valor.html";
      }
  } catch (e) {
      alert("Erro ao verificar chave Pix.");
  }
};
