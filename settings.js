document.addEventListener('DOMContentLoaded', () => {
  const mathmlRadio = document.getElementById('mathml');
  const latexRadio = document.getElementById('latex');
  const latexOptions = document.getElementById('latex-options');
  const delimiterRadios = document.getElementsByName('delimiter');

  // Update UI visibility
  const updateVisibility = () => {
    latexOptions.style.display = latexRadio.checked ? 'block' : 'none';
  };

  // Load saved setting
  chrome.storage.local.get(['outputFormat', 'latexDelimiter'], (result) => {
    // Set output format
    if (result.outputFormat === 'latex') {
      latexRadio.checked = true;
    } else {
      mathmlRadio.checked = true;
    }

    // Set delimiter
    if (result.latexDelimiter) {
      for (const radio of delimiterRadios) {
        if (radio.value === result.latexDelimiter) {
          radio.checked = true;
          break;
        }
      }
    }

    updateVisibility();
  });

  // Save setting on change
  const saveSetting = () => {
    const format = latexRadio.checked ? 'latex' : 'mathml';
    let delimiter = 'dollar';
    
    for (const radio of delimiterRadios) {
      if (radio.checked) {
        delimiter = radio.value;
        break;
      }
    }

    chrome.storage.local.set({ 
      outputFormat: format,
      latexDelimiter: delimiter
    }, () => {
      console.log('Settings saved:', { format, delimiter });
    });
    
    updateVisibility();
  };

  mathmlRadio.addEventListener('change', saveSetting);
  latexRadio.addEventListener('change', saveSetting);
  
  for (const radio of delimiterRadios) {
    radio.addEventListener('change', saveSetting);
  }
});
