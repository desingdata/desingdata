const patterns = { nombre: /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]{3,}$/, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, telefono: /^[\d\s\+\-\(\)]{7,}$/, empresa: /^[a-záéíóúñA-ZÁÉÍÓÚÑ\d\s\.\,\&\-]{2,}$/, mensaje: /^.{10,}$/s };
const subjects = [{ id: 'presupuesto', label: 'Solicitar Presupuesto', icon: '💰' }, { id: 'consulta', label: 'Consulta Servicios', icon: '❓' }, { id: 'colaboracion', label: 'Colaboración', icon: '🤝' }, { id: 'feedback', label: 'Feedback', icon: '💡' }, { id: 'soporte', label: 'Soporte Técnico', icon: '🔧' }, { id: 'otro', label: 'Otro', icon: '📝' }];
let currentStep = 1, selectedSubject = null;

function initForm() {
    const grid = document.getElementById('subjectsGrid');
    grid.innerHTML = subjects.map(s => `<label class="subject-option" id="subject-${s.id}"><input type="radio" name="subject" value="${s.id}" class="subject-radio"><span class="checkbox-label">${s.icon} ${s.label}</span></label>`).join('');
    document.querySelectorAll('.subject-radio').forEach(r => r.addEventListener('change', function () { document.querySelectorAll('.subject-option').forEach(o => o.classList.remove('selected')); document.getElementById(`subject-${this.value}`).classList.add('selected'); selectedSubject = this.value; document.getElementById('error-subject').classList.remove('show'); }));
    ['nombre', 'email', 'telefono', 'empresa', 'mensaje'].forEach(f => { const el = document.getElementById(f); if (el) el.addEventListener('blur', () => validateField(f, f !== 'empresa')); });
    updateProgressBar();
}

function validateField(f, req) {
    const el = document.getElementById(f); const err = document.getElementById(`error-${f}`); const val = el.value.trim(); let ok = true;
    if (req && !val) ok = false; else if (val && patterns[f]) ok = patterns[f].test(val);
    if (!ok && val) { err.classList.add('show'); el.classList.remove('validation-success'); el.classList.add('error'); }
    else if (ok && val) { err.classList.remove('show'); el.classList.remove('error'); el.classList.add('validation-success'); }
    else if (!val && req) { err.classList.add('show'); el.classList.remove('validation-success'); el.classList.add('error'); }
    else { err.classList.remove('show'); el.classList.remove('error', 'validation-success'); }
    return ok || (!req && !val);
}

function validateStep(s) {
    switch (s) {
        case 1: return validateField('nombre', true) && validateField('email', true) && validateField('telefono', true);
        case 2: if (!selectedSubject) { document.getElementById('error-subject').classList.add('show'); return false; } return true;
        case 3: return validateField('mensaje', true);
        case 4: updateSummary(); return true;
    }
    return true;
}

function updateSummary() {
    const subj = subjects.find(s => s.id === selectedSubject)?.label || 'No especificado';
    let html = `<div class="summary-container"><div class="summary-title">👤 Datos</div><div class="summary-item"><span class="summary-label">Nombre:</span><span>${document.getElementById('nombre').value}</span></div><div class="summary-item"><span class="summary-label">Email:</span><span>${document.getElementById('email').value}</span></div><div class="summary-item"><span class="summary-label">Teléfono:</span><span>${document.getElementById('telefono').value}</span></div>`;
    if (document.getElementById('empresa').value) html += `<div class="summary-item"><span class="summary-label">Empresa:</span><span>${document.getElementById('empresa').value}</span></div>`;
    html += `</div><div class="summary-container"><div class="summary-title">📌 Asunto</div><div class="summary-item"><span class="summary-label">Motivo:</span><span>${subj}</span></div></div><div class="summary-container"><div class="summary-title">✍️ Mensaje</div><div style="background: #f8f9fa; padding: 15px; border-radius: 6px; color: #333; line-height: 1.6; font-size: 0.9em;">${document.getElementById('mensaje').value}</div>`;
    if (document.getElementById('presupuesto').value) html += `<div class="summary-item" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(102,126,234,0.2);"><span class="summary-label">Presupuesto:</span><span>${document.getElementById('presupuesto').value}</span></div>`;
    html += `</div>`;
    document.getElementById('summaryContent').innerHTML = html;
}

function nextStep() { if (!validateStep(currentStep)) return; if (currentStep < 4) { currentStep++; updateUI(); } else submitForm(); }
function previousStep() { if (currentStep > 1) { currentStep--; updateUI(); } }
function updateUI() {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active')); document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
    document.querySelectorAll('.step').forEach(s => { const n = parseInt(s.dataset.step); s.classList.remove('active', 'completed'); if (n === currentStep) s.classList.add('active'); else if (n < currentStep) s.classList.add('completed'); });
    document.getElementById('btnPrev').disabled = currentStep === 1;
    document.getElementById('btnNext').textContent = currentStep === 4 ? '✓ Enviar' : 'Siguiente →';
    updateProgressBar();
    document.getElementById('currentStep').textContent = currentStep;
}
function updateProgressBar() { document.getElementById('progressFill').style.width = (currentStep / 4) * 100 + '%'; }
function submitForm() {
    console.log({ nombre: document.getElementById('nombre').value, email: document.getElementById('email').value, telefono: document.getElementById('telefono').value, empresa: document.getElementById('empresa').value || 'N/A', asunto: selectedSubject, mensaje: document.getElementById('mensaje').value, presupuesto: document.getElementById('presupuesto').value || 'N/A', fecha: new Date().toLocaleDateString('es-CO') });
    document.getElementById('successMessage').classList.add('show');
    document.querySelector('.form-container').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';
    setTimeout(() => location.reload(), 3000);
}
document.addEventListener('DOMContentLoaded', initForm);