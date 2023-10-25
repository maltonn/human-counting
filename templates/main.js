

async function Refresh() {
    fetch('log/').then((response)=> {
        return response.json();
    }
    ).then((data)=> {
        console.log(data);
        return data;
    }
    );
}

const table = {};

setInterval(async () => {
    const data = await Refresh();

    data.forEach(({ timestamp, direction }) => {
        const date = new Date(timestamp * 1000);
        const day = date.toLocaleDateString();
        const hour = date.getHours();

        if (!table[direction]) {
            table[direction] = {};
        }

        if (!table[direction][day]) {
            table[direction][day] = {};
        }

        if (!table[direction][day][hour]) {
            table[direction][day][hour] = 0;
        }

        table[direction][day][hour]++;
    });

    
    console.table(table);
}, 1000);
const tableElement = document.createElement('table');
const theadElement = document.createElement('thead');
const tbodyElement = document.createElement('tbody');

// Create table header
const headerRow = document.createElement('tr');
const headerCell1 = document.createElement('th');
headerCell1.textContent = 'Direction';
const headerCell2 = document.createElement('th');
headerCell2.textContent = 'Day';
const headerCell3 = document.createElement('th');
headerCell3.textContent = 'Hour';
const headerCell4 = document.createElement('th');
headerCell4.textContent = 'Count';

headerRow.appendChild(headerCell1);
headerRow.appendChild(headerCell2);
headerRow.appendChild(headerCell3);
headerRow.appendChild(headerCell4);
theadElement.appendChild(headerRow);

// Create table body
for (const direction in table) {
    for (const day in table[direction]) {
        for (const hour in table[direction][day]) {
            const row = document.createElement('tr');
            const cell1 = document.createElement('td');
            cell1.textContent = direction;
            const cell2 = document.createElement('td');
            cell2.textContent = day;
            const cell3 = document.createElement('td');
            cell3.textContent = hour;
            const cell4 = document.createElement('td');
            cell4.textContent = table[direction][day][hour];

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            row.appendChild(cell4);
            tbodyElement.appendChild(row);
        }
    }
}

tableElement.appendChild(theadElement);
tableElement.appendChild(tbodyElement);
document.body.appendChild(tableElement);
