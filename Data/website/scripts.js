const rarities = ["common", "uncommon", "rare", "very rare", "legendary", "artifact", "unknown"];
const magicItems = {};
const rarityManager = document.getElementById('rarityManager');
const addRaritySelect = document.getElementById('addRaritySelect');
const addRarityBtn = document.getElementById('addRarityBtn');
const jsonOutput = document.getElementById('jsonOutput');

function updateJSONOutput() {
  jsonOutput.value = JSON.stringify(magicItems, null, 4);
}

function createItemField(container, rarity) {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('item-entry');

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Magic item name';

  // Add an empty entry for this new item in the array
  const index = magicItems[rarity].length;
  magicItems[rarity].push("");

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete Item';
  deleteBtn.addEventListener('click', () => {
    magicItems[rarity].splice(index, 1);
    itemDiv.remove();
    updateJSONOutput();
  });

  input.addEventListener('input', () => {
    magicItems[rarity][index] = input.value.trim();
    updateJSONOutput();
  });

  itemDiv.appendChild(input);
  itemDiv.appendChild(deleteBtn);
  container.appendChild(itemDiv);
}


function createRaritySection(rarity) {
  const raritySection = document.createElement('div');
  raritySection.classList.add('rarity-section');

  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add('rarity-header');

  const title = document.createElement('h3');
  title.textContent = rarity;

  const deleteRarityBtn = document.createElement('button');
  deleteRarityBtn.textContent = "Delete Rarity";
  deleteRarityBtn.classList.add('delete-rarity-btn');
  deleteRarityBtn.addEventListener('click', () => {
    delete magicItems[rarity];
    raritySection.remove();
    addRarityOption(rarity); // re-add to dropdown
    updateJSONOutput();
  });

  titleWrapper.appendChild(title);
  titleWrapper.appendChild(deleteRarityBtn);
  raritySection.appendChild(titleWrapper);

  const addItemBtn = document.createElement('button');
  addItemBtn.textContent = "Add Magic Item";
  addItemBtn.addEventListener('click', () => {
    createItemField(raritySection, rarity);
  });
  raritySection.appendChild(addItemBtn);

  rarityManager.appendChild(raritySection);
}

function addRarityOption(rarity) {
  const option = document.createElement('option');
  option.value = rarity;
  option.textContent = rarity;
  addRaritySelect.appendChild(option);
}

// Populate dropdown on load
rarities.forEach(rarity => addRarityOption(rarity));

addRarityBtn.addEventListener('click', () => {
  const rarity = addRaritySelect.value;
  if (!rarity) return;

  magicItems[rarity] = [];
  createRaritySection(rarity);

  // Remove from dropdown
  addRaritySelect.querySelector(`option[value="${rarity}"]`).remove();
  addRaritySelect.value = "";
  updateJSONOutput();
});

const copyBtn = document.getElementById('copyBtn');

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(jsonOutput.value)
    .then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => copyBtn.textContent = "Copy to Clipboard", 1500);
    })
    .catch(err => {
      console.error("Failed to copy: ", err);
      alert("Copy failed. Please copy manually.");
    });
});

const toggleThemeBtn = document.getElementById('toggleTheme');

// Load saved preference and apply
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  document.body.classList.remove('light-mode');
} else if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
  document.body.classList.remove('dark-mode');
}

// Toggle on click
toggleThemeBtn.addEventListener('click', () => {
  if (document.body.classList.contains('dark-mode')) {
    // Switch to light mode
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  } else {
    // Switch to dark mode
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  }
});

