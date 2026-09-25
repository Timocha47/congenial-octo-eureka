const initCalculator = () => {
  const body = document.body || document.querySelector('body');
  if (!body) return;

  const styles = `
    :root {
      --bg: #070d18;
      --bg-2: #0d1728;
      --panel: rgba(15, 22, 35, 0.82);
      --panel-soft: rgba(19, 28, 43, 0.9);
      --primary: #7bd7ff;
      --secondary: #8b7dff;
      --accent: #77f0c8;
      --gold: #f4d78b;
      --rose: #ff8ebd;
      --text: #edf8ff;
      --muted: #a9bdd5;
      --danger: #ff6f88;
      --warning: #ffc772;
      --success: #5fe0a6;
      --shadow: 0 30px 80px rgba(3, 9, 22, 0.72);
      --radius: 26px;
      --glass: rgba(255,255,255,0.06);
      --brand-glow: rgba(123, 215, 255, 0.38);
      --line: rgba(183, 214, 255, 0.12);
    }

    body.light-mode {
      --bg: #edf4ff;
      --bg-2: #f8fbff;
      --panel: rgba(255, 255, 255, 0.78);
      --panel-soft: rgba(255, 255, 255, 0.92);
      --primary: #2169df;
      --secondary: #6a5cf6;
      --accent: #1bbf92;
      --gold: #d7901f;
      --rose: #ef5e9c;
      --text: #15263d;
      --muted: #59708f;
      --danger: #e7516d;
      --warning: #d98a24;
      --success: #1aa874;
      --shadow: 0 26px 60px rgba(32, 58, 98, 0.14);
      --glass: rgba(255,255,255,0.78);
      --brand-glow: rgba(33, 105, 223, 0.18);
      --line: rgba(109, 136, 182, 0.12);
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background:
        radial-gradient(circle at 15% 12%, rgba(123, 215, 255, 0.18), transparent 18%),
        radial-gradient(circle at 82% 16%, rgba(139, 125, 255, 0.18), transparent 26%),
        radial-gradient(circle at 52% 88%, rgba(255, 143, 189, 0.14), transparent 24%),
        linear-gradient(135deg, #040b14 0%, #0a1220 26%, #0d1828 58%, #0a1320 100%);
      color: var(--text);
      transition: background 0.25s ease, color 0.25s ease;
    }

    body.light-mode {
      background:
        radial-gradient(circle at 12% 12%, rgba(33, 105, 223, 0.10), transparent 18%),
        radial-gradient(circle at 80% 18%, rgba(106, 92, 246, 0.11), transparent 26%),
        radial-gradient(circle at 50% 80%, rgba(239, 94, 156, 0.08), transparent 22%),
        linear-gradient(135deg, #f4f8ff 0%, #edf4ff 34%, #eef2ff 100%);
    }

    body {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 8px;
    }

    .calc-app {
      width: 100%;
      max-width: 700px;
      background: linear-gradient(180deg, rgba(15, 22, 35, 0.82), rgba(9, 14, 24, 0.94));
      border: 1px solid rgba(123, 215, 255, 0.18);
      border-radius: 22px;
      box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,0.08);
      padding: 12px;
      backdrop-filter: blur(18px);
      position: relative;
      overflow: hidden;
    }

    body.light-mode .calc-app {
      background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,249,255,0.96));
      border-color: rgba(33, 105, 223, 0.08);
    }

    .calc-app::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(143, 227, 255, 0.07), transparent 25%, rgba(138, 125, 255, 0.08));
      pointer-events: none;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      gap: 8px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 46px;
      padding: 8px 14px 8px 10px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(123, 215, 255, 0.12), rgba(139, 125, 255, 0.12));
      border: 1px solid rgba(123, 215, 255, 0.18);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 0 26px var(--brand-glow);
    }

    .brand-mark {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold), var(--primary), var(--secondary));
      box-shadow: 0 0 28px rgba(123, 215, 255, 0.85);
      flex-shrink: 0;
    }

    .brand-copy {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .brand-name {
      font-weight: 800;
      letter-spacing: 0.08em;
      font-size: 0.78rem;
      text-transform: uppercase;
      color: var(--primary);
      text-shadow: 0 0 18px rgba(143, 227, 255, 0.45);
    }

    .brand-tag {
      font-size: 0.6rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
      opacity: 0.9;
    }

    body.light-mode .brand {
      background: linear-gradient(135deg, rgba(46, 125, 233, 0.08), rgba(109, 99, 244, 0.08));
      border-color: rgba(46, 125, 233, 0.12);
    }

    body.light-mode .brand-name {
      color: var(--primary);
      text-shadow: none;
    }

    .action-bar {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-shrink: 0;
    }

    .icon-btn {
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: var(--text);
      width: 36px;
      height: 36px;
      min-width: 36px;
      border-radius: 10px;
      font-size: 1.08rem;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
      transition: 0.2s ease;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon-btn:hover {
      transform: translateY(-1px);
      border-color: rgba(120,213,255,0.35);
    }

    #fxToggle {
      width: 52px;
      min-width: 52px;
      padding: 0 4px;
      font-size: 0.68rem;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }

    #themeToggle {
      width: 62px;
      min-width: 62px;
      padding: 0 6px;
      font-size: 0.9rem;
    }

    .display-panel {
      background: linear-gradient(180deg, rgba(11, 18, 31, 0.98), rgba(17, 25, 38, 0.94));
      border: 1px solid rgba(143, 227, 255, 0.1);
      border-radius: 16px;
      padding: 10px 12px 8px;
      margin-bottom: 10px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 30px rgba(0,0,0,0.18);
    }

    body.light-mode .display-panel {
      background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(239,244,255,0.96));
    }

    .history {
      min-height: 22px;
      color: var(--muted);
      font-size: 0.76rem;
      letter-spacing: 0.04em;
      text-align: right;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-bottom: 8px;
    }

    .expression {
      text-align: right;
      font-size: 0.78rem;
      color: var(--muted);
      min-height: 16px;
      margin-bottom: 3px;
      padding-right: 6px;
      word-break: break-all;
    }

    .expression.is-empty {
      display: none;
    }

    body.light-mode .expression,
    body.light-mode .history,
    body.light-mode .history-item small,
    body.light-mode .history-empty {
      color: #425776;
    }

    .result {
      text-align: right;
      font-size: clamp(1.9rem, 4vw, 3.2rem);
      line-height: 1;
      font-weight: 800;
      letter-spacing: -0.05em;
      word-break: break-all;
      min-height: 48px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
      background: linear-gradient(135deg, #edf7ff, #b9d8ff, #d9d2ff);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    body.light-mode .result {
      background: linear-gradient(135deg, #1d2d45, #2e4b76, #1b2f5c);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .workspace {
      display: block;
    }

    .calculator-panel {
      background: linear-gradient(180deg, rgba(17, 24, 38, 0.9), rgba(11, 17, 28, 0.94));
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 9px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
    }

    body.light-mode .calculator-panel {
      background: linear-gradient(180deg, rgba(255,255,255,0.82), rgba(246,249,255,0.96));
    }

    .side-panel {
      display: none !important;
    }

    .tab-row {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 8px;
    }

    .tab-btn {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      color: var(--muted);
      border-radius: 10px;
      padding: 7px 10px;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.98rem;
      letter-spacing: 0.02em;
      transition: 0.2s ease;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, rgba(123, 215, 255, 0.18), rgba(139, 125, 255, 0.24));
      color: var(--text);
      border-color: rgba(123, 215, 255, 0.38);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 24px rgba(123, 215, 255, 0.12);
    }

    .panel-wrap {
      display: none;
    }

    .panel-wrap.active {
      display: block;
    }

    .keypad {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 6px;
      width: 100%;
      max-width: 620px;
      margin: 0 auto;
    }

    .key {
      height: 62px;
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.18s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      color: var(--text);
      background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 18px rgba(0,0,0,0.18);
    }

    .key[data-action="digit"] {
      font-size: 1.42rem;
      font-weight: 800;
    }

    .key[data-action="operator"],
    .key[data-action="decimal"],
    .key[data-action="equals"],
    .key[data-action="toggle-sign"],
    .key[data-action="percent"] {
      font-size: 1.38rem;
      font-weight: 800;
    }

    .key:hover {
      transform: translateY(-2px);
      border-color: rgba(123, 215, 255, 0.38);
      box-shadow: 0 12px 22px rgba(0,0,0,0.24), 0 0 18px rgba(123, 215, 255, 0.10);
    }

    .key.operator {
      background: linear-gradient(135deg, rgba(139, 125, 255, 0.42), rgba(123, 215, 255, 0.14));
      color: #ffffff;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 20px rgba(139, 125, 255, 0.18);
    }

    body.light-mode .key {
      color: #17273d;
    }

    body.light-mode .key.operator {
      color: #1a2540;
    }

    body.light-mode .key.utility {
      color: #1b2330;
    }

    .key.operator[data-value="-"] {
      font-size: 1.75rem;
      font-weight: 900;
      letter-spacing: 0.02em;
      line-height: 1;
    }

    .key.operator[data-value="*"] {
      font-size: 1.65rem;
      font-weight: 900;
      line-height: 1;
    }

    .key.utility {
      background: linear-gradient(135deg, rgba(255, 197, 123, 0.22), rgba(255, 126, 182, 0.18));
      color: #fff9ef;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 18px rgba(255, 143, 189, 0.08);
    }

    .key.utility,
    .key.percent,
    .key.danger {
      font-size: 1.12rem;
    }

    .key[data-action="angle-mode"] {
      font-size: 0.82rem;
      letter-spacing: 0;
      padding: 0 2px;
      white-space: nowrap;
    }

    .angle-mode-label {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 0.95;
      gap: 2px;
      white-space: nowrap;
    }

    .key.danger {
      background: linear-gradient(135deg, rgba(255, 82, 106, 0.78), rgba(190, 35, 72, 0.82));
      border-color: rgba(255, 145, 158, 0.48);
      color: #ffffff;
    }

    .key.percent {
      background: linear-gradient(135deg, rgba(52, 211, 153, 0.78), rgba(16, 145, 104, 0.84));
      border-color: rgba(118, 255, 202, 0.48);
      color: #effff8;
    }

    .key.primary {
      background: linear-gradient(135deg, #9ef3ff, #b8b2ff 42%, #ffdca1);
      color: #091725;
      font-size: 1.3rem;
      box-shadow: 0 12px 24px rgba(143, 227, 255, 0.24);
    }

    .converter-btn,
    .special-btn,
    .mini-btn {
      font-size: 1.08rem;
    }

    .key.wide {
      grid-column: span 2;
    }

    .function-row {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 6px;
    }

    @media (min-width: 640px) {
      body {
        padding: 10px;
      }

      .calc-app {
        border-radius: 20px;
        padding: 11px;
      }
    }

    @media (min-width: 900px) {
      body {
        align-items: center;
        padding: 14px;
      }

      .calc-app {
        border-radius: 22px;
        padding: 12px;
      }
    }

    .history-panel {
      margin-top: 10px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 10px 12px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
    }

    .history-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      color: var(--muted);
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .history-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 260px;
      overflow: auto;
    }

    .history-item {
      background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 10px 12px;
      color: var(--text);
      font-size: 0.82rem;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
    }

    .history-item small {
      display: block;
      margin-bottom: 4px;
      color: var(--muted);
    }

    .history-empty {
      color: var(--muted);
      font-size: 0.8rem;
      padding: 8px 0;
    }

    .card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      padding: 14px;
      margin-bottom: 14px;
    }

    .card h3 {
      margin: 0 0 12px;
      font-size: 1rem;
      color: var(--primary);
    }

    .field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }

    .converter-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(180px, 0.9fr);
      gap: 12px;
      align-items: start;
    }

    .converter-layout .field-row {
      grid-template-columns: 1fr;
      margin-bottom: 0;
    }

    @media (max-width: 560px) {
      .converter-layout {
        grid-template-columns: 1fr;
      }
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.8rem;
      color: var(--muted);
    }

    .field input,
    .field select {
      width: 100%;
      background: rgba(10,17,29,0.85);
      border: 1px solid rgba(255,255,255,0.07);
      color: var(--text);
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 0.95rem;
    }

    body.light-mode .field input,
    body.light-mode .field select {
      background: rgba(255,255,255,0.96);
      border-color: rgba(33,105,223,0.2);
      color: #15263d;
      color-scheme: light;
    }

    body.light-mode .field select option {
      background: #ffffff;
      color: #15263d;
    }

    .mini-btn,
    .converter-btn,
    .special-btn {
      width: 100%;
      border: none;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: #05131f;
      border-radius: 12px;
      padding: 11px 12px;
      font-weight: 800;
      cursor: pointer;
      margin-top: 8px;
    }

    .result-box {
      margin-top: 10px;
      padding: 12px;
      border-radius: 12px;
      background: rgba(49, 208, 170, 0.08);
      border: 1px solid rgba(49, 208, 170, 0.18);
      color: var(--text);
      font-weight: 700;
    }

    body.light-mode .result-box {
      background: rgba(27, 191, 146, 0.1);
      border-color: rgba(27, 168, 116, 0.28);
      color: #15263d;
    }

    @media (max-width: 840px) {
      .workspace {
        grid-template-columns: 1fr;
      }

      .calc-app {
        padding: 9px;
      }

      .keypad {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }
    }
  `;

  body.innerHTML = `
    <style>${styles}</style>
    <div class="calc-app">
      <div class="topbar">
        <div class="brand">
          <span class="brand-mark"></span>
          <div class="brand-copy">
            <span class="brand-name">Timur Industries</span>
            <span class="brand-tag">Premium Suite</span>
          </div>
        </div>
        <div class="action-bar">
          <button class="icon-btn" id="themeToggle" title="Theme">Sun</button>
          <button class="icon-btn" id="fxToggle" title="Scientific mode">fx</button>
        </div>
      </div>

      <div class="display-panel">
        <div class="expression" id="expressionText">0</div>
        <div class="result" id="display">0</div>
      </div>

      <div class="workspace">
        <div class="calculator-panel">
          <div class="tab-row">
            <button class="tab-btn active" data-panel="standard">Standard</button>
            <button class="tab-btn" data-panel="scientific">Scientific</button>
            <button class="tab-btn" data-panel="converter">Converters</button>
            <button class="tab-btn" data-panel="special">Special</button>
            <button class="tab-btn" data-panel="history">History</button>
          </div>

          <div class="panel-wrap active" data-panel="standard">
            <div class="keypad">
              <button class="key percent" data-action="percent">%</button>
              <button class="key danger" data-action="clear">C</button>
              <button class="key danger" data-action="delete">DEL</button>
              <button class="key utility" data-action="parenthesis-toggle">( )</button>
              <button class="key operator" data-action="cube">x^3</button>

              <button class="key" data-action="digit" data-value="7">7</button>
              <button class="key" data-action="digit" data-value="8">8</button>
              <button class="key" data-action="digit" data-value="9">9</button>
              <button class="key operator" data-action="operator" data-value="/">/</button>
              <button class="key operator" data-action="operator" data-value="*">*</button>

              <button class="key" data-action="digit" data-value="4">4</button>
              <button class="key" data-action="digit" data-value="5">5</button>
              <button class="key" data-action="digit" data-value="6">6</button>
              <button class="key operator" data-action="operator" data-value="-">-</button>
              <button class="key operator" data-action="toggle-sign">+/-</button>

              <button class="key" data-action="digit" data-value="1">1</button>
              <button class="key" data-action="digit" data-value="2">2</button>
              <button class="key" data-action="digit" data-value="3">3</button>
              <button class="key operator" data-action="operator" data-value="+">+</button>
              <button class="key operator" data-action="square">x^2</button>

              <button class="key" data-action="digit" data-value="0">0</button>
              <button class="key" data-action="decimal">.</button>
              <button class="key operator" data-action="equals">=</button>
              <button class="key utility" data-action="factorial">n!</button>
              <button class="key utility" data-action="scientific" data-value="cos">cos</button>

              <div class="function-row">
                <button class="key utility" data-action="memory-sub">M-</button>
                <button class="key utility" data-action="memory-add">M+</button>
                <button class="key utility" data-action="memory-read">MR</button>
                <button class="key utility" data-action="scientific" data-value="tan">tan</button>
                <button class="key utility" data-action="scientific" data-value="sin">sin</button>
              </div>
            </div>
          </div>

          <div class="panel-wrap" data-panel="scientific">
            <div class="keypad">
              <button class="key utility" data-action="scientific" data-value="sin">sin</button>
              <button class="key utility" data-action="scientific" data-value="cos">cos</button>
              <button class="key utility" data-action="scientific" data-value="tan">tan</button>
              <button class="key utility" data-action="scientific" data-value="asin">asin</button>
              <button class="key utility" data-action="scientific" data-value="acos">acos</button>

              <button class="key utility" data-action="scientific" data-value="atan">atan</button>
              <button class="key utility" data-action="scientific" data-value="log">log</button>
              <button class="key utility" data-action="scientific" data-value="ln">ln</button>
              <button class="key utility" data-action="scientific" data-value="sqrt">sqrt</button>
              <button class="key utility" data-action="scientific" data-value="exp">e^x</button>

              <button class="key utility" data-action="scientific" data-value="percent">%</button>
              <button class="key utility" data-action="angle-mode"><span class="angle-mode-label"><span>RAD /</span><span>DEG</span></span></button>
              <button class="key utility" data-action="constant" data-value="pi">pi</button>
              <button class="key utility" data-action="constant" data-value="e">e</button>
              <button class="key utility" data-action="scientific" data-value="abs">|x|</button>
            </div>
          </div>

          <div class="panel-wrap" data-panel="converter">
            <div class="card">
              <h3>Unit converter</h3>
              <div class="converter-layout">
                <div class="converter-main">
                  <div class="field-row">
                    <div class="field">
                      <label>Category</label>
                      <select id="converterCategory">
                        <option value="length">Length</option>
                        <option value="mass">Mass</option>
                        <option value="temperature">Temperature</option>
                        <option value="volume">Volume</option>
                        <option value="speed">Speed</option>
                        <option value="time">Time</option>
                        <option value="data">Data</option>
                        <option value="area">Area</option>
                      </select>
                    </div>
                    <div class="field">
                      <label>Value</label>
                      <input id="converterValue" type="number" value="1" step="any" />
                    </div>
                  </div>
                </div>
                <div class="converter-options">
                  <div class="field-row">
                    <div class="field">
                      <label>From</label>
                      <select id="fromUnit"></select>
                    </div>
                    <div class="field">
                      <label>To</label>
                      <select id="toUnit"></select>
                    </div>
                  </div>
                </div>
              </div>
              <button class="converter-btn" id="convertBtn">Convert</button>
              <div class="result-box" id="converterResult">1 meter = 1 meter</div>
            </div>
          </div>

          <div class="panel-wrap" data-panel="special">
            <div class="card">
              <h3>Body mass index</h3>
              <div class="field-row">
                <div class="field">
                  <label>Height (cm)</label>
                  <input id="bmiHeight" type="number" value="170" />
                </div>
                <div class="field">
                  <label>Weight (kg)</label>
                  <input id="bmiWeight" type="number" value="70" />
                </div>
              </div>
              <button class="special-btn" id="bmiBtn">Calculate BMI</button>
              <div class="result-box" id="bmiResult">BMI: 24.2</div>
            </div>

            <div class="card">
              <h3>Date calculator</h3>
              <div class="field-row">
                <div class="field">
                  <label>Start date</label>
                  <input id="dateStart" type="date" value="2025-01-01" />
                </div>
                <div class="field">
                  <label>End date</label>
                  <input id="dateEnd" type="date" value="2025-12-31" />
                </div>
              </div>
              <button class="special-btn" id="dateBtn">Difference in days</button>
              <div class="result-box" id="dateResult">0 days</div>
            </div>

            <div class="card">
              <h3>Discount and tax</h3>
              <div class="field-row">
                <div class="field">
                  <label>Price</label>
                  <input id="discountPrice" type="number" value="100" />
                </div>
                <div class="field">
                  <label>Discount %</label>
                  <input id="discountPercent" type="number" value="20" />
                </div>
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Tax %</label>
                  <input id="taxPercent" type="number" value="10" />
                </div>
                <div class="field">
                  <label>Total</label>
                  <input id="discountFinal" type="number" value="0" readonly />
                </div>
              </div>
              <button class="special-btn" id="discountBtn">Calculate</button>
            </div>

            <div class="card">
              <h3>Split bill</h3>
              <div class="field-row">
                <div class="field">
                  <label>Bill</label>
                  <input id="tipBill" type="number" value="120" />
                </div>
                <div class="field">
                  <label>Tip %</label>
                  <input id="tipPercent" type="number" value="15" />
                </div>
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Number of people</label>
                  <input id="tipPeople" type="number" value="4" min="1" />
                </div>
                <div class="field">
                  <label>Per person</label>
                  <input id="tipEach" type="number" value="0" readonly />
                </div>
              </div>
              <button class="special-btn" id="tipBtn">Split bill</button>
            </div>
          </div>

          <div class="panel-wrap" data-panel="history">
            <div class="history-panel">
              <div class="history-panel-header">
                <span>Calculation history</span>
                <button class="icon-btn" id="clearHistoryBtn" title="Clear history">DEL</button>
              </div>
              <ul class="history-list" id="historyList"></ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  const display = document.getElementById('display');
  const expressionText = document.getElementById('expressionText');
  const themeToggle = document.getElementById('themeToggle');
  const fxToggle = document.getElementById('fxToggle');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const memoryStorageKey = 'timur-industries-calculator-memory';
  let savedMemory = 0;
  try {
    savedMemory = Number(localStorage.getItem(memoryStorageKey));
  } catch (error) {
    savedMemory = 0;
  }

  const state = {
    displayValue: '0',
    firstValue: null,
    operator: null,
    expression: null,
    waitingForSecondValue: false,
    memory: Number.isFinite(savedMemory) ? savedMemory : 0,
    memoryRecallPresses: 0,
    history: [],
    angleMode: 'DEG',
    currentTab: 'standard',
    scientificVisible: false,
    percentPending: false,
  };

  function formatNumber(value) {
    if (value === null || value === undefined || value === '') return '0';
    const num = Number(value);
    if (!Number.isFinite(num)) return 'Error';
    if (Math.abs(num) >= 1e12 || (Math.abs(num) > 0 && Math.abs(num) < 1e-10)) {
      return num.toExponential(8).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e');
    }
    return Number(num.toFixed(10)).toString();
  }

  function saveMemory() {
    localStorage.setItem(memoryStorageKey, String(state.memory));
  }

  function updateDisplay() {
    display.textContent = state.expression !== null ? state.expression || '0' : formatNumber(state.displayValue);
    const expressionLabel = state.expression !== null ? 'Expression' : state.operator && state.firstValue !== null
      ? `${formatNumber(state.firstValue)} ${state.operator}`
      : '';
    expressionText.textContent = expressionLabel;
    expressionText.classList.toggle('is-empty', expressionLabel === '');
  }

  function renderHistory() {
    if (!historyList) return;
    if (!state.history.length) {
      historyList.innerHTML = '<li class="history-empty">No calculations yet</li>';
      return;
    }

    historyList.innerHTML = state.history
      .map((entry) => `
        <li class="history-item">
          <small>${entry.label}</small>
          <span>${entry.value}</span>
        </li>
      `)
      .join('');
  }

  function updateHistory() {
    state.history = state.history.slice(0, 8);
    renderHistory();
  }

  function pushHistory(label, value) {
    state.history.unshift({ label, value: String(value) });
    state.history = state.history.slice(0, 8);
    updateHistory();
  }

  function clearAll() {
    const savedMemory = state.memory;
    state.displayValue = '0';
    state.firstValue = null;
    state.operator = null;
    state.expression = null;
    state.waitingForSecondValue = false;
    state.percentPending = false;
    state.memory = savedMemory;
    state.memoryRecallPresses = 0;
    updateDisplay();
  }

  function inputDigit(digit) {
    if (state.percentPending) {
      state.displayValue = digit;
      state.percentPending = false;
      state.waitingForSecondValue = false;
      updateDisplay();
      return;
    }
    if (state.expression !== null) {
      state.expression += digit;
      state.displayValue = state.expression;
      updateDisplay();
      return;
    }
    if (state.waitingForSecondValue) {
      state.displayValue = digit;
      state.waitingForSecondValue = false;
    } else {
      state.displayValue = state.displayValue === '0' ? digit : state.displayValue + digit;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (state.expression !== null) {
      state.expression += state.expression.endsWith('.') ? '' : '.';
      state.displayValue = state.expression;
      updateDisplay();
      return;
    }
    if (state.waitingForSecondValue) {
      state.displayValue = '0.';
      state.waitingForSecondValue = false;
      updateDisplay();
      return;
    }
    if (!state.displayValue.includes('.')) {
      state.displayValue += '.';
      updateDisplay();
    }
  }

  function toggleSign() {
    state.displayValue = String(Number(state.displayValue) * -1);
    updateDisplay();
  }

  function deleteLast() {
    if (state.expression !== null) {
      state.expression = state.expression.slice(0, -1);
      state.displayValue = state.expression || '0';
      updateDisplay();
      return;
    }
    if (state.waitingForSecondValue) return;
    state.displayValue = state.displayValue.length > 1 ? state.displayValue.slice(0, -1) : '0';
    updateDisplay();
  }

  function performCalculation(first, second, operator) {
    switch (operator) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return second === 0 ? 'Error' : first / second;
      default: return second;
    }
  }

  function evaluateExpression(expression) {
    const tokens = expression.match(/\d*\.?\d+|[()+\-*/]/g);
    if (!tokens || tokens.join('') !== expression.replace(/\s/g, '')) throw new Error('Invalid expression');
    let position = 0;

    function parsePrimary() {
      const token = tokens[position];
      if (token === '(') {
        position += 1;
        const value = parseAdditive();
        if (tokens[position] !== ')') throw new Error('Missing parenthesis');
        position += 1;
        return value;
      }
      if (token === '+' || token === '-') {
        position += 1;
        const value = parsePrimary();
        return token === '-' ? -value : value;
      }
      if (!token || !/^\d*\.?\d+$/.test(token)) throw new Error('Invalid number');
      position += 1;
      return Number(token);
    }

    function parseMultiplicative() {
      let value = parsePrimary();
      while (tokens[position] === '*' || tokens[position] === '/') {
        const operator = tokens[position++];
        const nextValue = parsePrimary();
        if (operator === '/' && nextValue === 0) throw new Error('Division by zero');
        value = operator === '*' ? value * nextValue : value / nextValue;
      }
      return value;
    }

    function parseAdditive() {
      let value = parseMultiplicative();
      while (tokens[position] === '+' || tokens[position] === '-') {
        const operator = tokens[position++];
        const nextValue = parseMultiplicative();
        value = operator === '+' ? value + nextValue : value - nextValue;
      }
      return value;
    }

    const result = parseAdditive();
    if (position !== tokens.length || !Number.isFinite(result)) throw new Error('Invalid expression');
    return result;
  }

  function inputParenthesis(parenthesis) {
    if (state.expression === null) {
      state.expression = state.displayValue === '0' ? '' : state.displayValue;
    }
    state.expression += parenthesis;
    state.displayValue = state.expression;
    updateDisplay();
  }

  function toggleParenthesis() {
    const expression = state.expression || '';
    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;
    const lastCharacter = expression.slice(-1);
    const shouldClose = openCount > closeCount
      && lastCharacter
      && !/[+\-*/.(]$/.test(lastCharacter);
    inputParenthesis(shouldClose ? ')' : '(');
  }

  function getMemoryInput() {
    if (state.expression !== null) {
      try {
        return evaluateExpression(state.expression);
      } catch (error) {
        return null;
      }
    }
    const value = Number(state.displayValue);
    return Number.isFinite(value) ? value : null;
  }

  function addCurrentResultToMemory() {
    if (state.expression !== null) {
      try {
        const result = evaluateExpression(state.expression);
        state.displayValue = String(result);
        state.expression = null;
        state.firstValue = null;
        state.operator = null;
        state.waitingForSecondValue = false;
      } catch (error) {
        return;
      }
    } else if (state.operator !== null && state.firstValue !== null) {
      computeResult();
    }

    const value = getMemoryInput();
    if (value !== null) {
      state.memory += value;
      state.memoryRecallPresses = 0;
      saveMemory();
    }
    updateDisplay();
  }

  function handleOperator(nextOperator) {
    if (state.expression !== null) {
      state.expression += nextOperator;
      state.displayValue = state.expression;
      updateDisplay();
      return;
    }
    const inputValue = Number(state.displayValue);

    if (state.firstValue === null) {
      state.firstValue = inputValue;
    } else if (state.operator) {
      if (!state.waitingForSecondValue) {
        state.expression = `${formatNumber(state.firstValue)}${state.operator}${formatNumber(inputValue)}${nextOperator}`;
        state.displayValue = state.expression;
        state.firstValue = null;
        state.operator = null;
        state.waitingForSecondValue = true;
        state.percentPending = false;
        updateDisplay();
        return;
      }
      const result = performCalculation(Number(state.firstValue), inputValue, state.operator);
      state.firstValue = result;
      state.displayValue = String(result);
    }

    state.operator = nextOperator;
    state.waitingForSecondValue = true;
    updateDisplay();
  }

  function applyPercent() {
    const value = Number(state.displayValue);
    if (!Number.isFinite(value)) {
      state.displayValue = 'Error';
      state.percentPending = false;
      updateDisplay();
      return;
    }

    if (state.operator !== null && state.firstValue !== null) {
      state.percentPending = true;
      state.displayValue = String(value);
      updateDisplay();
      return;
    }

    state.percentPending = false;
    state.displayValue = String(value / 100);
    updateDisplay();
  }

  function computeResult() {
    if (state.expression !== null) {
      try {
        const result = evaluateExpression(state.expression);
        pushHistory(state.expression, formatNumber(result));
        state.displayValue = String(result);
      } catch (error) {
        state.displayValue = 'Error';
      }
      state.expression = null;
      state.firstValue = null;
      state.operator = null;
      state.waitingForSecondValue = false;
      updateDisplay();
      return;
    }
    if (state.operator === null || state.firstValue === null) return;

    const first = Number(state.firstValue);
    const second = Number(state.displayValue);
    let adjustedSecond = second;

    if (state.percentPending && state.operator && (state.operator === '+' || state.operator === '-' || state.operator === '*' || state.operator === '/')) {
      const isPercentInput = Number.isFinite(second) && second >= 0 && second <= 100;
      const percentFactor = second / 100;

      if (isPercentInput && state.operator === '*') {
        adjustedSecond = percentFactor;
      }
      if (isPercentInput && state.operator === '/') {
        adjustedSecond = percentFactor;
      }
      if (isPercentInput && state.operator === '+') {
        adjustedSecond = first * percentFactor;
      }
      if (isPercentInput && state.operator === '-') {
        adjustedSecond = first * percentFactor;
      }
    }

    const result = performCalculation(first, adjustedSecond, state.operator);

    if (result === 'Error') {
      state.displayValue = 'Error';
      state.firstValue = null;
      state.operator = null;
      state.waitingForSecondValue = true;
      updateDisplay();
      return;
    }

    const formatted = formatNumber(result);
    const secondLabel = state.percentPending ? `${formatNumber(second)}%` : formatNumber(second);
    pushHistory(`${formatNumber(first)} ${state.operator} ${secondLabel}`, formatted);
    state.displayValue = String(result);
    state.firstValue = null;
    state.operator = null;
    state.waitingForSecondValue = false;
    state.percentPending = false;
    updateDisplay();
  }

  function applyUnary(op) {
    let value = Number(state.displayValue);
    let result = value;

    switch (op) {
      case 'sqrt': result = Math.sqrt(value); break;
      case 'square': result = value * value; break;
      case 'cube': result = value * value * value; break;
      case 'factorial': {
        if (value < 0 || !Number.isInteger(value)) { result = 'Error'; break; }
        let fact = 1;
        for (let i = 2; i <= value; i += 1) fact *= i;
        result = fact;
        break;
      }
      case 'sin': result = state.angleMode === 'DEG' ? Math.sin(value * Math.PI / 180) : Math.sin(value); break;
      case 'cos': result = state.angleMode === 'DEG' ? Math.cos(value * Math.PI / 180) : Math.cos(value); break;
      case 'tan': result = state.angleMode === 'DEG' ? Math.tan(value * Math.PI / 180) : Math.tan(value); break;
      case 'asin': result = state.angleMode === 'DEG' ? (Math.asin(value) * 180 / Math.PI) : Math.asin(value); break;
      case 'acos': result = state.angleMode === 'DEG' ? (Math.acos(value) * 180 / Math.PI) : Math.acos(value); break;
      case 'atan': result = state.angleMode === 'DEG' ? (Math.atan(value) * 180 / Math.PI) : Math.atan(value); break;
      case 'log': result = Math.log10(value); break;
      case 'ln': result = Math.log(value); break;
      case 'exp': result = Math.exp(value); break;
      case 'abs': result = Math.abs(value); break;
      case 'pi': result = Math.PI; break;
      case 'e': result = Math.E; break;
      default: break;
    }

    if (result === 'Error') {
      state.displayValue = 'Error';
    } else {
      state.displayValue = String(result);
      pushHistory(op, formatNumber(result));
    }
    state.firstValue = null;
    state.operator = null;
    state.waitingForSecondValue = false;
    updateDisplay();
  }

  function applyPower() {
    const exponent = Number(prompt('Enter exponent:', '2'));
    if (Number.isNaN(exponent)) return;
    state.displayValue = String(Math.pow(Number(state.displayValue), exponent));
    pushHistory(`x^y ${exponent}`, formatNumber(state.displayValue));
    updateDisplay();
  }

  function applyRoot() {
    const root = Number(prompt('Enter root degree:', '2'));
    if (Number.isNaN(root) || root === 0) return;
    state.displayValue = String(Math.pow(Number(state.displayValue), 1 / root));
    pushHistory(`${root} root`, formatNumber(state.displayValue));
    updateDisplay();
  }

  function applyFactorial() {
    const value = Number(state.displayValue);
    if (!Number.isInteger(value) || value < 0) {
      state.displayValue = 'Error';
      updateDisplay();
      return;
    }
    let fact = 1;
    for (let i = 2; i <= value; i += 1) fact *= i;
    state.displayValue = String(fact);
    pushHistory(`${formatNumber(value)}!`, formatNumber(fact));
    updateDisplay();
  }

  function toggleAngleMode() {
    state.angleMode = state.angleMode === 'DEG' ? 'RAD' : 'DEG';
    fxToggle.textContent = state.angleMode;
  }

  function updateTabs() {
    document.querySelectorAll('.tab-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.panel === state.currentTab);
    });
    document.querySelectorAll('.panel-wrap').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.panel === state.currentTab);
    });
  }

  document.querySelectorAll('.tab-btn').forEach((button) => {
    button.addEventListener('click', () => {
      state.currentTab = button.dataset.panel;
      updateTabs();
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const value = target.dataset.value;

    switch (action) {
      case 'digit': inputDigit(value); break;
      case 'decimal': inputDecimal(); break;
      case 'operator': handleOperator(value); break;
      case 'equals': computeResult(); break;
      case 'clear': clearAll(); break;
      case 'delete': deleteLast(); break;
      case 'toggle-sign': toggleSign(); break;
      case 'percent': applyPercent(); break;
      case 'parenthesis': inputParenthesis(value); break;
      case 'parenthesis-toggle': toggleParenthesis(); break;
      case 'square': applyUnary('square'); break;
      case 'cube': applyUnary('cube'); break;
      case 'factorial': applyFactorial(); break;
      case 'power': applyPower(); break;
      case 'toggle-root': applyRoot(); break;
      case 'scientific': applyUnary(value); break;
      case 'constant': applyUnary(value); break;
      case 'pi': applyUnary('pi'); break;
      case 'angle-mode': toggleAngleMode(); break;
      case 'memory-clear':
        state.memory = 0;
        state.memoryRecallPresses = 0;
        saveMemory();
        updateDisplay();
        break;
      case 'memory-read':
        state.displayValue = String(state.memory);
        state.memoryRecallPresses = 1;
        updateDisplay();
        break;
      case 'memory-add': {
        addCurrentResultToMemory();
        break;
      }
      case 'memory-sub': {
        const value = getMemoryInput();
        if (value !== null) {
          state.memory -= value;
          state.memoryRecallPresses = 0;
          saveMemory();
        }
        updateDisplay();
        break;
      }
      case 'memory-rc':
        if (state.memoryRecallPresses === 1) {
          state.memory = 0;
          state.memoryRecallPresses = 0;
          saveMemory();
        } else {
          state.displayValue = String(state.memory);
          state.memoryRecallPresses = 1;
        }
        updateDisplay();
        break;
      default: break;
    }
  });

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    themeToggle.textContent = isLight ? 'Moon' : 'Sun';
  });

  fxToggle.addEventListener('click', () => {
    state.scientificVisible = !state.scientificVisible;
    const scientificTab = document.querySelector('.tab-btn[data-panel="scientific"]');
    if (state.scientificVisible) {
      scientificTab.style.display = 'inline-flex';
      state.currentTab = 'scientific';
    } else {
      scientificTab.style.display = 'none';
      state.currentTab = 'standard';
    }
    updateTabs();
  });

  const converterConfigs = {
    length: { label: 'Length', units: { kilometer: { label: 'Kilometers', value: 1000 }, meter: { label: 'Meters', value: 1 }, mile: { label: 'Miles', value: 1609.344 }, inch: { label: 'Inches', value: 0.0254 } } },
    mass: { label: 'Mass', units: { kilogram: { label: 'Kilograms', value: 1000 }, pound: { label: 'Pounds', value: 453.59237 }, ounce: { label: 'Ounces', value: 28.349523125 }, gram: { label: 'Grams', value: 1 } } },
    temperature: { label: 'Temperature', units: { celsius: { label: 'Celsius', value: 'c' }, fahrenheit: { label: 'Fahrenheit', value: 'f' }, kelvin: { label: 'Kelvin', value: 'k' } } },
    volume: { label: 'Volume', units: { gallon: { label: 'Gallons', value: 3.785411784 }, liter: { label: 'Liters', value: 1 }, cup: { label: 'Cups', value: 0.2365882365 }, milliliter: { label: 'Milliliters', value: 0.001 } } },
    speed: { label: 'Speed', units: { ms: { label: 'm/s', value: 3.6 }, kmh: { label: 'km/h', value: 1 }, mph: { label: 'mph', value: 0.621371 } } },
    time: { label: 'Time', units: { day: { label: 'Days', value: 86400 }, hour: { label: 'Hours', value: 3600 }, minute: { label: 'Minutes', value: 60 }, second: { label: 'Seconds', value: 1 } } },
    data: { label: 'Data', units: { gigabyte: { label: 'GB', value: 1073741824 }, megabyte: { label: 'MB', value: 1048576 }, kilobyte: { label: 'KB', value: 1024 }, byte: { label: 'Bytes', value: 1 } } },
    area: { label: 'Area', units: { hectare: { label: 'Hectares', value: 10000 }, acre: { label: 'Acres', value: 4046.8564224 }, sqm: { label: 'm^2', value: 1 } } },
  };

  function populateConverterOptions() {
    const category = document.getElementById('converterCategory').value;
    const config = converterConfigs[category];
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');

    fromUnit.innerHTML = Object.entries(config.units).map(([key, unit]) => `<option value="${key}">${unit.label}</option>`).join('');
    toUnit.innerHTML = Object.entries(config.units).map(([key, unit]) => `<option value="${key}">${unit.label}</option>`).join('');
    fromUnit.value = Object.keys(config.units)[0];
    toUnit.value = Object.keys(config.units)[Math.min(1, Object.keys(config.units).length - 1)];
  }

  function convertValue() {
    const category = document.getElementById('converterCategory').value;
    const config = converterConfigs[category];
    const inputValue = Number(document.getElementById('converterValue').value || 0);
    const from = document.getElementById('fromUnit').value;
    const to = document.getElementById('toUnit').value;

    let result = inputValue;

    if (config.units[from].value === 'c' || config.units[from].value === 'f' || config.units[from].value === 'k') {
      const normalized = config.units[from].value === 'c' ? inputValue : config.units[from].value === 'f' ? (inputValue - 32) * 5 / 9 : inputValue - 273.15;
      const converted = config.units[to].value === 'c' ? normalized : config.units[to].value === 'f' ? (normalized * 9 / 5) + 32 : normalized + 273.15;
      result = converted;
    } else {
      const base = inputValue * config.units[from].value;
      result = base / config.units[to].value;
    }

    const fromLabel = config.units[from].label;
    const toLabel = config.units[to].label;
    const isTemperature = ['c', 'f', 'k'].includes(config.units[from].value);
    const showTargetFirst = !isTemperature && config.units[from].value < config.units[to].value;
    const firstValue = showTargetFirst
      ? result
      : inputValue;
    const firstLabel = showTargetFirst
      ? toLabel
      : fromLabel;
    const secondValue = firstValue === result ? inputValue : result;
    const secondLabel = firstValue === result ? fromLabel : toLabel;
    document.getElementById('converterResult').textContent = `${formatNumber(firstValue)} ${firstLabel} = ${formatNumber(secondValue)} ${secondLabel}`;
  }

  document.getElementById('converterCategory').addEventListener('change', populateConverterOptions);
  document.getElementById('fromUnit').addEventListener('change', convertValue);
  document.getElementById('toUnit').addEventListener('change', convertValue);
  document.getElementById('converterValue').addEventListener('input', convertValue);
  document.getElementById('convertBtn').addEventListener('click', convertValue);
  populateConverterOptions();
  convertValue();

  document.getElementById('bmiBtn').addEventListener('click', () => {
    const height = Number(document.getElementById('bmiHeight').value || 0) / 100;
    const weight = Number(document.getElementById('bmiWeight').value || 0);
    const bmi = weight / (height * height);
    document.getElementById('bmiResult').textContent = `BMI: ${formatNumber(bmi)} (${bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obesity'})`;
  });

  document.getElementById('dateBtn').addEventListener('click', () => {
    const start = new Date(document.getElementById('dateStart').value);
    const end = new Date(document.getElementById('dateEnd').value);
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
    document.getElementById('dateResult').textContent = `${diffDays} days`;
  });

  document.getElementById('discountBtn').addEventListener('click', () => {
    const price = Number(document.getElementById('discountPrice').value || 0);
    const discount = Number(document.getElementById('discountPercent').value || 0);
    const tax = Number(document.getElementById('taxPercent').value || 0);
    const discounted = price * (1 - discount / 100);
    const final = discounted * (1 + tax / 100);
    document.getElementById('discountFinal').value = formatNumber(final);
  });

  document.getElementById('tipBtn').addEventListener('click', () => {
    const bill = Number(document.getElementById('tipBill').value || 0);
    const percent = Number(document.getElementById('tipPercent').value || 0);
    const people = Number(document.getElementById('tipPeople').value || 1);
    const total = bill * (1 + percent / 100);
    const each = total / people;
    document.getElementById('tipEach').value = formatNumber(each);
  });

  clearHistoryBtn.addEventListener('click', () => {
    state.history = [];
    updateHistory();
  });

  document.addEventListener('keydown', (event) => {
    const isFormField = ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName || '');
    if (isFormField) return;

    const key = event.key.toLowerCase();
    const hasCtrl = event.ctrlKey || event.metaKey;

    if (hasCtrl && event.shiftKey && key === 'm') {
      event.preventDefault();
      state.memory -= getMemoryInput() || 0;
      state.memoryRecallPresses = 0;
      saveMemory();
      updateDisplay();
      return;
    }

    if (hasCtrl && key === 'm') {
      event.preventDefault();
      addCurrentResultToMemory();
      return;
    }

    if (hasCtrl && key === 'r') {
      event.preventDefault();
      state.displayValue = String(state.memory);
      state.memoryRecallPresses = 1;
      updateDisplay();
      return;
    }

    if (hasCtrl && key === 't') {
      event.preventDefault();
      themeToggle.click();
      return;
    }

    if (hasCtrl && key === 'f') {
      event.preventDefault();
      fxToggle.click();
      return;
    }

    if (event.altKey && /^[1-5]$/.test(key)) {
      event.preventDefault();
      const panels = ['standard', 'scientific', 'converter', 'special', 'history'];
      const panel = panels[Number(key) - 1];
      if (panel === 'scientific' && !state.scientificVisible) fxToggle.click();
      state.currentTab = panel;
      updateTabs();
      return;
    }

    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      inputDigit(event.key);
      return;
    }

    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
      inputDecimal();
      return;
    }

    if (['+', '-', '*', '/'].includes(event.key)) {
      event.preventDefault();
      handleOperator(event.key);
      return;
    }

    if (event.key === 'Enter' || event.key === '=') {
      event.preventDefault();
      computeResult();
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      deleteLast();
      return;
    }

    if (event.key === 'Escape' || key === 'c') {
      event.preventDefault();
      clearAll();
      return;
    }

    if (event.key === '%') {
      event.preventDefault();
      applyPercent();
      return;
    }

    if (event.key === '(' || event.key === ')') {
      event.preventDefault();
      inputParenthesis(event.key);
      return;
    }

    const keyboardActions = {
      u: () => toggleSign(),
      q: () => applyUnary('square'),
      b: () => applyUnary('cube'),
      '!': () => applyFactorial(),
      s: () => applyUnary('sin'),
      o: () => applyUnary('cos'),
      t: () => applyUnary('tan'),
      l: () => applyUnary('log'),
      n: () => applyUnary('ln'),
      r: () => applyUnary('sqrt'),
      x: () => applyUnary('exp'),
      a: () => applyUnary('abs'),
      p: () => applyUnary('pi'),
      e: () => applyUnary('e'),
      d: () => toggleAngleMode(),
    };

    if (keyboardActions[key] && !hasCtrl && !event.altKey) {
      event.preventDefault();
      keyboardActions[key]();
    }
  });

  updateDisplay();
  updateHistory();
  updateTabs();
  document.querySelector('.tab-btn[data-panel="scientific"]').style.display = 'none';
  fxToggle.textContent = state.angleMode;
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculator);
} else {
  initCalculator();
}
