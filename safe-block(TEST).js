document.addEventListener('DOMContentLoaded', () => {
  const root = document.body;

  if (!root) return;

  const safeBlock = document.createElement('section');
  safeBlock.className = 'safe-block';
  safeBlock.innerHTML = `
    <style>
      .safe-block {
        margin: 24px auto;
        max-width: 900px;
        padding: 20px 18px;
        border-radius: 14px;
        background: linear-gradient(135deg, #fff9c4, #dff7ff);
        border: 2px solid #00008b;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
      }

      .safe-block h3 {
        margin: 0 0 12px;
        color: #00008b;
        font-size: 1.4rem;
      }

      .safe-block p {
        margin: 0;
        color: #1d1d1d;
        font-size: 1rem;
        line-height: 1.6;
      }

      .safe-block .safe-btn {
        margin-top: 14px;
        padding: 10px 20px;
        border: none;
        border-radius: 10px;
        background: #00008b;
        color: #fff;
        font-weight: 700;
        cursor: pointer;
      }

      .safe-block .safe-btn:hover {
        opacity: 0.95;
      }
    </style>

    <h3>Safe block</h3>
    <p>This block is isolated and does not overwrite the previous code.</p>
    <button class="safe-btn" type="button">Run safe block</button>
  `;

  root.appendChild(safeBlock);

  const button = safeBlock.querySelector('.safe-btn');
  button.addEventListener('click', () => {
    const message = document.createElement('p');
    message.textContent = 'Safe block works correctly and does not affect the old script.';
    safeBlock.appendChild(message);
  });
});
