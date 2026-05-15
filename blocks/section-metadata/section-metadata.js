export default function decorate(block) {
  const section = block.closest('.section');
  if (!section) return;
  [...block.children].forEach((row) => {
    const key = row.children[0]?.textContent?.trim().toLowerCase();
    const val = row.children[1]?.textContent?.trim();
    if (key === 'style') {
      val.split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => section.classList.add(s));
    }
  });
  block.remove();
}
