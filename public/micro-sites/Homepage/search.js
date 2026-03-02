document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('projectSearch');
  const select = document.getElementById('categorySelect');
  const cards = Array.from(document.querySelectorAll('.grid .card'));

  if (!input || !select || cards.length === 0) return;

  const normalize = (s) => (s || '').toString().trim().toLowerCase();

  function matches(card, query, category) {
    const text = normalize(card.textContent);
    if (query && !text.includes(query)) return false;
    if (category && category !== 'All') {
      const cat = normalize(card.dataset.category || '');
      if (!cat || cat !== category.toLowerCase()) return false;
    }
    return true;
  }

  function update() {
    const q = normalize(input.value);
    const cat = select.value;
    cards.forEach((card) => {
      card.style.display = matches(card, q, cat) ? '' : 'none';
    });
  }

  input.addEventListener('input', update);
  select.addEventListener('change', update);

  const categories = new Set(['All']);
  cards.forEach((c) => {
    if (c.dataset && c.dataset.category) categories.add(c.dataset.category);
  });
  if (categories.size > 1) {
    select.innerHTML = Array.from(categories)
      .map((c) => `<option value="${c}">${c}</option>`)
      .join('');
  }
});
