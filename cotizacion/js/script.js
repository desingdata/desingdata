// Patrones de validación
const validationPatterns = {
    nombre: /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefono: /^[\d\s\+\-\(\)]{7,}$/,
    empresa: /^[a-záéíóúñA-ZÁÉÍÓÚÑ\d\s\.\,\&\-]{2,}$/,
    numeroDocumento: /^\d{5,}$/,
    descripcion: /^.{10,}$/s
};

// Servicios
const services = [
    {
        id: 'diseño-web',
        category: 'Diseño Web',
        description: 'Plataformas digitales optimizadas y funcionales',
        basePrice: 10000000,
        priceRange: '$10-32 millones COP'
    },
    {
        id: 'diseño-grafico',
        category: 'Diseño Gráfico',
        description: 'Identidad visual y materiales de comunicación',
        basePrice: 6000000,
        priceRange: '$6-16 millones COP'
    },
    {
        id: 'analisis-datos',
        category: 'Análisis de Datos',
        description: 'Transformación de datos en información accionable',
        basePrice: 8000000,
        priceRange: '$8-24 millones COP'
    },
    {
        id: 'visualizacion-datos',
        category: 'Visualización de Datos',
        description: 'Dashboards y gráficos interactivos',
        basePrice: 8800000,
        priceRange: '$8.8-22 millones COP'
    },
    {
        id: 'edicion-video',
        category: 'Edición de Video',
        description: 'Reels, TikToks, Shorts y postproducción',
        basePrice: 7200000,
        priceRange: '$7.2-18 millones COP'
    },
    {
        id: 'cursos-tic',
        category: 'Cursos TIC',
        description: 'Formación técnica especializada',
        basePrice: 4800000,
        priceRange: '$4.8-14 millones COP'
    }
];

let currentStep = 1;
const totalSteps = 5;

function initForm() {
    renderServices();
    addValidationListeners();
    updateProgressBar();
}

function renderServices() {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = services.map(service => `
                <div class="service-card" id="card-${service.id}">
                    <input type="checkbox" name="services" value="${service.id}" class="service-checkbox">
                    <div class="checkmark">✓</div>
                    <div class="service-info">
                        <div class="service-name">${service.category}</div>
                        <div class="service-description">${service.description}</div>
                        <div class="service-price">Desde ${service.priceRange}</div>
                    </div>
                </div>
            `).join('');

    // Event listeners para servicios
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function (e) {
            if (e.target.type !== 'checkbox') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });

        const checkbox = card.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function () {
            card.classList.toggle('selected', this.checked);
            updateBudgetSummary();
        });
    });
}

function addValidationListeners() {
    const fieldsToValidate = [
        { id: 'nombre', required: true },
        { id: 'email', required: true },
        { id: 'telefono', required: true },
        { id: 'empresa', required: false },
        { id: 'numeroDocumento', required: true },
        { id: 'descripcion', required: false }
    ];

    fieldsToValidate.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.addEventListener('blur', () => validateField(field.id, field.required));
        }
    });

    document.getElementById('tipoDocumento').addEventListener('change', () => validateField('tipoDocumento', true));
}

function validateField(fieldName, isRequired = true) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`error-${fieldName}`);
    const value = field.value.trim();

    let isValid = true;

    if (isRequired && !value) {
        isValid = false;
    } else if (value && validationPatterns[fieldName]) {
        isValid = validationPatterns[fieldName].test(value);
    }

    if (!isValid && value) {
        errorElement.classList.add('show');
        field.classList.remove('validation-success');
        field.classList.add('error');
    } else if (isValid && value) {
        errorElement.classList.remove('show');
        field.classList.remove('error');
        field.classList.add('validation-success');
    } else if (!value && isRequired) {
        errorElement.classList.add('show');
        field.classList.remove('validation-success');
        field.classList.add('error');
    } else {
        errorElement.classList.remove('show');
        field.classList.remove('error', 'validation-success');
    }

    return isValid || (!isRequired && !value);
}

function validateStep(step) {
    let isValid = true;

    switch (step) {
        case 1:
            isValid = validateField('nombre', true) &&
                validateField('email', true) &&
                validateField('telefono', true);
            break;
        case 2:
            isValid = validateField('tipoDocumento', true) &&
                validateField('numeroDocumento', true);
            break;
        case 3:
            const selectedServices = document.querySelectorAll('input[name="services"]:checked').length;
            if (selectedServices === 0) {
                document.getElementById('error-services').classList.add('show');
                isValid = false;
            } else {
                document.getElementById('error-services').classList.remove('show');
            }
            break;
        case 4:
            validateField('descripcion', false);
            break;
        case 5:
            updateSummary();
            break;
    }

    return isValid;
}

function updateBudgetSummary() {
    const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
        .map(checkbox => services.find(s => s.id === checkbox.value));

    const budgetSummary = document.getElementById('budgetSummary');

    if (selectedServices.length === 0) {
        budgetSummary.innerHTML = '<div class="empty-services">Selecciona servicios para ver el presupuesto</div>';
        return;
    }

    const total = selectedServices.reduce((sum, service) => sum + service.basePrice, 0);
    const totalFormatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(total);

    budgetSummary.innerHTML = `
                ${selectedServices.map(service => `
                    <div class="summary-item">
                        <span>${service.category}</span>
                        <span>${new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(service.basePrice)}</span>
                    </div>
                `).join('')}
                <div class="summary-item total">
                    <span>Total Estimado</span>
                    <span>${totalFormatted}</span>
                </div>
            `;
}

function updateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
        .map(checkbox => services.find(s => s.id === checkbox.value));

    const summaryHTML = `
                <div class="summary-container">
                    <div class="summary-title">👤 Datos Personales</div>
                    <div class="summary-item">
                        <span><strong>Nombre:</strong></span>
                        <span>${document.getElementById('nombre').value}</span>
                    </div>
                    <div class="summary-item">
                        <span><strong>Email:</strong></span>
                        <span>${document.getElementById('email').value}</span>
                    </div>
                    <div class="summary-item">
                        <span><strong>Teléfono:</strong></span>
                        <span>${document.getElementById('telefono').value}</span>
                    </div>
                    <div class="summary-item">
                        <span><strong>Empresa:</strong></span>
                        <span>${document.getElementById('empresa').value || 'No especificada'}</span>
                    </div>
                    <div class="summary-item">
                        <span><strong>Documento:</strong></span>
                        <span>${document.getElementById('tipoDocumento').value} - ${document.getElementById('numeroDocumento').value}</span>
                    </div>
                </div>

                <div class="summary-container">
                    <div class="summary-title">🎯 Servicios Seleccionados</div>
                    ${selectedServices.length > 0 ? selectedServices.map(s => `
                        <div class="summary-item">
                            <span>${s.category}</span>
                        </div>
                    `).join('') : '<div class="empty-services">Sin servicios seleccionados</div>'}
                </div>
            `;

    summaryContent.innerHTML = summaryHTML;
    updateBudgetSummary();
}

function nextStep() {
    if (!validateStep(currentStep)) {
        return;
    }

    if (currentStep < totalSteps) {
        currentStep++;
        updateUI();
    } else {
        submitForm();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateUI();
    }
}

function updateUI() {
    // Actualizar steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');

    // Actualizar indicadores
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
        }
    });

    // Actualizar botones
    document.getElementById('btnPrev').disabled = currentStep === 1;
    const btnNext = document.getElementById('btnNext');
    if (currentStep === totalSteps) {
        btnNext.textContent = '✓ Enviar Solicitud';
    } else {
        btnNext.textContent = 'Siguiente →';
    }

    // Actualizar progress
    updateProgressBar();
    document.getElementById('currentStep').textContent = currentStep;

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressBar() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function submitForm() {
    const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
        .map(checkbox => services.find(s => s.id === checkbox.value));

    const total = selectedServices.reduce((sum, service) => sum + service.basePrice, 0);

    const data = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        empresa: document.getElementById('empresa').value,
        tipoDocumento: document.getElementById('tipoDocumento').value,
        numeroDocumento: document.getElementById('numeroDocumento').value,
        servicios: selectedServices.map(s => s.category),
        descripcion: document.getElementById('descripcion').value,
        presupuesto: document.getElementById('presupuesto').value,
        totalEstimado: total,
        fecha: new Date().toLocaleDateString('es-CO')
    };

    console.log('Datos de cotización:', data);

    // Mostrar éxito
    document.getElementById('successMessage').classList.add('show');
    document.querySelector('.form-container').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';

    setTimeout(() => {
        location.reload();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', initForm);