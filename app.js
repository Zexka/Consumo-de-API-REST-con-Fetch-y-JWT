// 1. Función para obtener posts 
async function fetchPosts() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error(`Error HTTP! estado: ${response.status}`);
        const posts = await response.json();
        displayPosts(posts.slice(0, 5));
    } catch (error) {
        const container = document.getElementById('posts');
        container.innerHTML = `<div class="error">Error al cargar los posts: ${error.message}</div>`;
    }
}
// 2. Función para mostrar posts en el DOM 
function displayPosts(posts) {
    const container = document.getElementById('posts');
    container.innerHTML = posts
        .map(post => `<div><h3>${post.title}</h3><p>${post.body}</p></div>`)
        .join('');
}
// 3. Ejecutar al cargar la página 
fetchPosts();

// 4. Función de login 
async function loginUser(email, password) {
    try {
        if (!email || !password) throw new Error('Email y password son requeridos');

        const response = await fetch('https://reqres.in/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.trim(),
                password: password.trim()
            }),
        });

        const data = await response.json(); // Siempre parsear la respuesta

        if (!response.ok) {
            // Usar mensaje del servidor si está disponible
            throw new Error(data.error || `Error ${response.status}`);
        }

        return data.token;
    } catch (error) {
        console.error('Login fallido:', error);
        showError(`Error: ${error.message}`);
        throw error; // Propagar el error para manejo adicional
    }
}

// Función auxiliar para mostrar errores
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 3000);
}

// Actualizar función handleLogin (app.js)
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Limpiar errores previos
        document.getElementById('error').textContent = '';

        const token = await loginUser(email, password);
        if (token) {
            console.log('Login exitoso! Token:', token);
            await fetchProtectedData(token);
        }
    } catch (error) {
        // El error ya se maneja en loginUser
    }
}

// 6. Función para obtener datos protegidos con JWT
async function fetchProtectedData(token) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1', {
            headers: { 'Authorization': `Bearer ${token}` }, // Simulación 
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const user = await response.json();
        console.log('Usuario protegido:', user);
    } catch (error) {
        console.error('Error al obtener datos protegidos:', error);
    }
}
// Modificar la función main para incluir esto: 
async function main() {
    const token = await loginUser('eve.holt@reqres.in', 'cityslicka');
    if (token) {
        await fetchProtectedData(token); // Usar el token 
    }
}