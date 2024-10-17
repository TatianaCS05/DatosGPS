document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const usuario = formData.get('usuario');
    const contraseña = formData.get('contraseña');

    console.log('Intentando iniciar sesión con:', { usuario, contraseña });

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, contraseña })
        });

        const data = await response.json();

        console.log('Datos recibidos del servidor:', data);

        if (response.ok) {
            // Almacenar el token en localStorage
            localStorage.setItem('token', data.token);
            console.log('Login exitoso. Token guardado:', data.token);
            
            // Redirigir a la vista de activos
            console.log('Redirigiendo a activos.html...');
            window.location.href = '../activosView/activos.html';
        } else {
            console.log('Error en la respuesta del servidor:', data.message);
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error en la autenticación:', error);
        alert('Error al iniciar sesión');
    }
});

