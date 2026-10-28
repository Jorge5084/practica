const storageKey = 'mi-dia-tareas-v1';
const list = document.querySelector('#tasks');
const input = document.querySelector('#task-input');
const status = document.querySelector('#status');
let tasks = [];
let filter = 'all';
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (!Array.isArray(saved)) throw new Error('Formato inválido');
  tasks = saved.filter(t => t && typeof t.id === 'string' && typeof t.text === 'string' && typeof t.done === 'boolean');
} catch { status.textContent = 'No se pudieron recuperar las tareas guardadas. Puedes usar la lista durante esta sesión.'; }

function render() {
  list.replaceChildren();
  const visible = tasks.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done));
  for (const task of visible) {
    const row = document.createElement('li');
    row.className = task.done ? 'done' : '';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.id = `task-${task.id}`;
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = task.text;
    checkbox.addEventListener('change', () => { task.done = checkbox.checked; save(); });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete';
    remove.textContent = 'Eliminar';
    remove.setAttribute('aria-label', `Eliminar ${task.text}`);
    remove.addEventListener('click', () => { tasks = tasks.filter(t => t.id !== task.id); save(); });
    row.append(checkbox, label, remove);
    list.append(row);
  }
  const pending = tasks.filter(t => !t.done).length;
  document.querySelector('#counter').textContent = `${pending} ${pending === 1 ? 'pendiente' : 'pendientes'}`;
  document.querySelector('#empty').hidden = visible.length > 0;
  document.querySelector('#empty').textContent = tasks.length ? 'No hay tareas en este filtro.' : 'Tu lista está despejada. Agrega tu primera tarea.';
  document.querySelector('#clear').disabled = !tasks.some(t => t.done);
}
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(tasks)); status.textContent = ''; }
  catch { status.textContent = 'El navegador no permite guardar. Los cambios durarán solo esta sesión.'; }
  render();
}
document.querySelector('#task-form').addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  tasks.push({ id: crypto.randomUUID(), text, done: false });
  input.value = '';
  save();
  input.focus();
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  render();
}));
document.querySelector('#clear').addEventListener('click', () => { tasks = tasks.filter(t => !t.done); save(); });
render();
