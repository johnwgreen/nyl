export default function decorate(block) {
  const h1 = block.querySelector('h1');
  if (h1) {
    const text = h1.textContent;
    const match = text.match(/^(Report to policy owners)\s+(.+)$/i);
    if (match) {
      const pretitle = document.createElement('span');
      pretitle.className = 'pretitle';
      pretitle.textContent = match[1];
      h1.textContent = match[2];
      h1.prepend(pretitle);
    }
  }
}
