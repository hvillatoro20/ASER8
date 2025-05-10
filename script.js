// Menu toggle para móviles
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Calculadora de contratación
document.getElementById('calcularBtn')?.addEventListener('click', function() {
    const horas = parseInt(document.getElementById('horas').value) || 0;
    const presupuesto = parseInt(document.getElementById('presupuesto').value) || 0;
    
    if (horas > 0 && presupuesto > 0) {
        const costeTotal = horas * presupuesto * 1.21; // IVA incluido
        document.getElementById('costeTotal').textContent = costeTotal.toFixed(2);
        const resultado = document.getElementById('resultadoCalculo');
        resultado.style.display = 'block';
        
        // Animación
        resultado.style.animation = 'none';
        setTimeout(() => {
            resultado.style.animation = 'fadeIn 0.5s ease-out';
        }, 10);
    } else {
        showAlert('Por favor, introduce valores válidos para horas y presupuesto.');
    }
});

// Validación de DNI/NIE español
document.getElementById('contratacionForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const dni = document.getElementById('dni').value.toUpperCase();
    const dniRegex = /^[XYZ]?\d{7,8}[A-Z]$/;
    
    if (!dniRegex.test(dni)) {
        showAlert('Por favor, introduce un DNI o NIE español válido.');
        return;
    }
    
    // Simular envío del formulario
    showAlert('Solicitud enviada correctamente. Nos pondremos en contacto contigo en breve.', 'success');
    this.reset();
    document.getElementById('resultadoCalculo').style.display = 'none';
});

// Mostrar alerta
function showAlert(message, type = 'error') {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alert);
        }, 300);
    }, 3000);
}

// Chatbot functionality
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const quickQuestions = document.querySelectorAll('.quick-question');

// Respuestas predefinidas del chatbot
const botResponses = {
    "legal": "Para constituir una empresa en España necesitas: 1) Certificado negativo de nombre, 2) Escritura de constitución ante notario, 3) Inscripción en el Registro Mercantil, 4) Alta en Hacienda y Seguridad Social. El coste oscila entre 600-1200€ dependiendo del tipo de sociedad.",
    "contratacion": "Nuestros profesionales se contratan por horas o días, sin costes adicionales. El precio mínimo es 15€/hora + IVA. Puedes calcular el coste total en nuestro formulario de contratación.",
    "costes": "Los costes aproximados son: Autónomo (60-150€), SL (600-1200€), SA (3000€+). Incluyen notaría, registro, gestoría y trámites administrativos.",
    "fiscalidad": "Las obligaciones fiscales básicas son: IVA trimestral, IRPF (trimestral o mensual), Impuesto de Sociedades (anual) y modelos informativos. Dependen de tu actividad y forma jurídica.",
    "default": "Entendido. Un asesor especializado se pondrá en contacto contigo en las próximas horas para resolver tu consulta personalmente."
};

// Mostrar/ocultar chatbot
chatbotBtn?.addEventListener('click', function() {
    chatbotWindow.classList.toggle('active');
    this.classList.toggle('active');
});

chatbotClose?.addEventListener('click', function() {
    chatbotWindow.classList.remove('active');
    chatbotBtn.classList.remove('active');
});

// Enviar mensaje al pulsar Enter
chatbotInput?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Enviar mensaje al hacer clic en el botón
chatbotSend?.addEventListener('click', sendMessage);

// Preguntas rápidas
quickQuestions.forEach(question => {
    question.addEventListener('click', function() {
        const questionType = this.getAttribute('data-question');
        addUserMessage(this.textContent);
        setTimeout(() => {
            addBotMessage(botResponses[questionType]);
        }, 500);
    });
});

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
        addUserMessage(message);
        chatbotInput.value = '';
        
        setTimeout(() => {
            // Buscar respuesta predefinida o usar default
            let response = botResponses.default;
            for (const [key, value] of Object.entries(botResponses)) {
                if (message.toLowerCase().includes(key)) {
                    response = value;
                    break;
                }
            }
            addBotMessage(response);
        }, 1000);
    }
}

function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Guardar historial del chat en localStorage
window.addEventListener('beforeunload', function() {
    if (chatbotMessages) {
        const messages = document.querySelectorAll('.chatbot-messages .message');
        const chatHistory = Array.from(messages).map(msg => ({
            text: msg.textContent,
            type: msg.classList.contains('user-message') ? 'user' : 'bot'
        }));
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
});

// Cargar historial del chat al iniciar
document.addEventListener('DOMContentLoaded', function() {
    // Año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Cargar historial del chat si existe
    if (chatbotMessages) {
        const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        if (chatHistory.length > 0) {
            chatHistory.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`;
                messageDiv.textContent = msg.text;
                chatbotMessages.appendChild(messageDiv);
            });
            scrollChatToBottom();
        }
    }
});

// Smooth scrolling para enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Efecto de carga progresiva para las cards
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});