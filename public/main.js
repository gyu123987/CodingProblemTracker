fetch('/api/problems')
  .then(res => res.json())
  .then(data => {
    document.getElementById('count').textContent = data.length;
    const tbody = document.querySelector('#problemTable tbody');

    function renderTable(filteredData) {
      tbody.innerHTML = '';
      filteredData.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${p.date || ''}</td>
          <td><a href="problem.html?id=${p.id}">${p.name}</a></td>
          <td>${p.tags.join(', ')}</td>
          <td>${p.language}</td>
        `;
        tbody.appendChild(row);
      });
    }

    renderTable(data);

    document.getElementById('search').addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      const filtered = data.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.language.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
      renderTable(filtered);
    });

    // let existingTags = new Array();
    let setExistingTags = new Set();
    data.forEach(p => p.tags.forEach(t => setExistingTags.add(t)));
    setExistingTags = Array.from(setExistingTags);
    // existingTags = [...setExistingTags]


    // let existingLanguage = new Array();
    let setExistingLanguage = new Set();
    data.forEach(p => setExistingLanguage.add(p.language));
    setExistingLanguage = Array.from(setExistingLanguage);
    // existingTags = [...setExistingTags]

    let setExistingSearch = new Set()
    data.forEach(p => setExistingSearch.add(p.language));
    data.forEach(p => p.tags.forEach(t => setExistingSearch.add(t)));
    data.forEach(p => setExistingSearch.add(p.name));
    setExistingSearch = Array.from(setExistingSearch);

    autocomplete(document.getElementById("formTagInput"), setExistingTags);
    autocomplete(document.getElementById("formLanguageInput"), setExistingLanguage);
    autocomplete(document.getElementById("search"), setExistingSearch);
  });


// const selectedFilters = new Set();
// const colorMap = {};
// function getColor(str) {
//   if (colorMap[str]) return colorMap[str];
//   // Deterministic pseudo-random color
//   const hue = (Array.from(str).reduce((acc, c) => acc + c.charCodeAt(0), 0) * 137) % 360;
//   const color = `hsl(${hue}, 60%, 50%)`;
//   colorMap[str] = color;
//   return color;
// }

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;

      var split = val.split(/,\s*|,/)
      val = split[split.length - 1]

      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              if (split.length > 1) {
                inp.value = split.slice(0, split.length-1).join(",") + "," + this.getElementsByTagName("input")[0].value;
              } else {
                inp.value = this.getElementsByTagName("input")[0].value;
              }
              
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      document.getElementById('search').dispatchEvent(new Event('input', { bubbles: true }));
      closeAllLists(e.target);
  });
}

const form = document.getElementById('addProblemForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form);
    const problem = {
      name: formData.get('name'),
      link: formData.get('link'),
      language: formData.get('language'),
      tags: formData.get('tags').split(',').map(t => t.trim()),
      code: formData.get('code'),
      notes: formData.get('notes'),
      date: formData.get('date')
    };
    

    const res = await fetch('/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problem)
    });

    if (res.ok) {
      alert('Problem added! Reloading...');
      location.reload();
    } else {
      const { error } = await res.json();
      alert('Failed to add problem: ' + error);
    }
  });
}

const modal = document.getElementById('problemModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.querySelector('.modal .close');

openModalBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
