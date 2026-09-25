document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('.container');

  if (!app) {
    console.warn('Container not found. New feature was not added.');
    return;
  }

  const existingBlock = document.querySelector('.new-feature-block');
  if (existingBlock) {
    return;
  }

  const style = document.createElement('style');
  style.textContent = `
    .new-feature-block {
      margin-top: 20px;
      padding: 18px 16px;
      border: 2px solid #7bdff2;
      border-radius: 12px;
      background: linear-gradient(180deg, #ffffff, #eaf7ff);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
    }

    .new-feature-block h3 {
      margin-bottom: 12px;
      color: #00008b;
      font-size: 1.25rem;
    }

    .new-feature-btn {
      background: #00008b;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .new-feature-btn:hover {
      transform: translateY(-1px);
    }

    .new-feature-output {
      margin-top: 12px;
      color: #00008b;
      font-weight: 600;
    }
  `;

  document.head.appendChild(style);

  const block = document.createElement('section');
  block.className = 'new-feature-block';
  block.innerHTML = `
    <h3>New feature draft</h3>
    <button class="new-feature-btn" type="button">Click me</button>
    <p class="new-feature-output">Waiting for click...</p>
  `;

  app.appendChild(block);

  const button = block.querySelector('.new-feature-btn');
  const output = block.querySelector('.new-feature-output');

  button.addEventListener('click', () => {
    output.textContent = 'New code works without affecting the old version.';
  });
});
