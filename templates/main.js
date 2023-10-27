DIRECTION_MODE="total"

async function GetLogData() {
  return fetch('log/').then((response) => {
    return response.json();
  }
  ).then((data) => {
    return data;
  }
  );
}

function zeros(a, b) {
  let result = new Array(a);

  for (let i = 0; i < a; i++) {
    result[i] = new Array(b).fill(0);
  }

  return result;
}


const Refresh = async () => {
  const data = await GetLogData();
  const days = []
  const sections = []

  data.forEach(({ timestamp, direction }) => {
    const date = new Date(timestamp * 1000);
    const day = date.toLocaleDateString();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const section=hour+(minute<30?":00":":30")
    const dayIndex = days.indexOf(day);
    const sectionIndex = sections.indexOf(hour);
    
    if (!days.includes(day)) {
      days.push(day);
    }
    if (!sections.includes(section)) {
      sections.push(section);
    }
  });

  days.sort((a, b) => new Date(a) - new Date(b));
  sections.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));

  tablesDict = {
    "to_right": zeros(days.length, sections.length),
    "to_left": zeros(days.length, sections.length),
    "unknown": zeros(days.length, sections.length),
    "total": zeros(days.length, sections.length),
  }

  data.forEach(({ timestamp, direction }) => {
    const date = new Date(timestamp * 1000);
    const day = date.toLocaleDateString();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const section=hour+(minute<30?":00":":30")
    const dayIndex = days.indexOf(day);
    const sectionIndex = sections.indexOf(section);


    dic = {
      ">": "to_right",
      "<": "to_left",
      "?": "unknown",
    }

    tablesDict[dic[direction]][dayIndex][sectionIndex]++;
    tablesDict["total"][dayIndex][sectionIndex]++;
  });

  CreateTable(days, sections, tablesDict, DIRECTION_MODE)
  console.log("table created")
}


function CreateTable(days, sections, tablesDict, mode) {
  document.getElementById('table')?.remove();
  const table = tablesDict[mode];
  const tableElement = document.createElement('table');
  tableElement.id = 'table';
  const theadElement = document.createElement('thead');
  const tbodyElement = document.createElement('tbody');

  // Create table header row
  const headerRow = document.createElement('tr');
  headerRow.appendChild(document.createElement('th'));
  for (let i = 0; i < days.length; i++) { // Inverse days and sections
    const day = days[i];
    const dayCell = document.createElement('th');
    dayCell.textContent = day;
    headerRow.appendChild(dayCell);
  }
  theadElement.appendChild(headerRow);

  // Create table body rows
  for (let i = 0; i < sections.length; i++) { // Inverse days and sections
    const hour = sections[i];
    const hourRow = document.createElement('tr');
    const hourCell = document.createElement('th');
    hourCell.textContent = hour;
    hourRow.appendChild(hourCell);
    for (let j = 0; j < days.length; j++) { // Inverse days and sections
      const day = days[j];
      const count = table[j][i]; // Inverse days and sections
      const countCell = document.createElement('td');
      countCell.textContent = count;
      hourRow.appendChild(countCell);
    }
    tbodyElement.appendChild(hourRow);
  }

  tableElement.appendChild(theadElement);
  tableElement.appendChild(tbodyElement);
  document.body.appendChild(tableElement);
}


const radioButtons = document.querySelectorAll('input[name="direction_option"]');
radioButtons.forEach(radioButton => {
  radioButton.addEventListener('change', ()=>{
    const selectedFruitElement = document.querySelector('input[name="direction_option"]:checked');
    if (selectedFruitElement) {
      DIRECTION_MODE=selectedFruitElement.value
      Refresh()
    }
  });
});




window.onload =()=>{
  Refresh()
}

setInterval(Refresh, 1000 * 10)