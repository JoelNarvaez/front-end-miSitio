// --- Manejo del modal de login (funciona en cualquier página) ---
document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');

  if (loginBtn && loginModal && closeModal) {
    loginBtn.onclick = function() {
      loginModal.style.display = 'block';
    };
    closeModal.onclick = function() {
      loginModal.style.display = 'none';
    };
    window.onclick = function(event) {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    };
  }
});

// Capturamos el formulario
const form = document.getElementById("formLogin");

// Escuchamos el evento "submit"
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // evita que la página se recargue

  // Obtener los valores escritos por el usuario
  const login = document.getElementById("login").value;
  const contrasena = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cuenta: login, contrasena })
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok) {
      const cuenta = data.usuario?.cuenta;
      if (cuenta) {
        Swal.fire({
          icon: 'success',
          title: 'Acceso permitido',
          text: `Bienvenido ${cuenta}!`,
          confirmButtonText: 'Continuar',
          showConfirmButton: false
        });

        localStorage.setItem('usuario', JSON.stringify(data.usuario.cuenta));
        localStorage.setItem('contrasena', JSON.stringify(contrasena));

        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = cuenta;

        // cerrar modal automáticamente
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'none';
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Respuesta incompleta',
          text: 'No se pudo obtener la información del usuario.',
          confirmButtonText: 'Aceptar'
        });
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: data?.error ?? `Error ${res.status}: ${res.statusText}`,
        confirmButtonText: 'Reintentar'
      });

      document.getElementById("login").value = "";
      document.getElementById("password").value = "";
    }

  } catch (err) {
    console.error("Error al conectar con el servidor:", err);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor. Verifica tu red.',
      confirmButtonText: 'Aceptar'
    });
  }
});
