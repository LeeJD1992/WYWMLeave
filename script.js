document.addEventListener("DOMContentLoaded", function () {
    const countrySelector = document.getElementById("countrySelector");
    const yearSelector = document.getElementById("yearSelector");
    const updateButton = document.getElementById("updateButton");
    const bankHolidaysTable = document.getElementById("bankHolidaysTable");

    updateButton.addEventListener("click", function () {
        const selectedYear = yearSelector.value;
        const selectedCountry = countrySelector.value;

        if (selectedCountry === "uk") {
            fetchUkHolidays(selectedYear);
        } else if (selectedCountry === "australia") {
            fetchAustraliaHolidays(selectedYear);
        } else if (selectedCountry === "canada") {
            fetchCanadaHolidays(selectedYear);
        }
    });

    function fetchUkHolidays(year) {
        const currentDate = new Date();

        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }

        fetch("https://www.gov.uk/bank-holidays.json")
            .then(response => response.json())
            .then(data => {
                const ukBankHolidays = data["england-and-wales"].events;

                const holidaysToDisplay = ukBankHolidays.filter(event => {
                    const holidayDate = new Date(event.date);
                    if (year === "current") {
                        return holidayDate.getFullYear() === currentDate.getFullYear() && holidayDate >= currentDate;
                    } else {
                        return holidayDate.getFullYear() == year;
                    }
                });

                const rows = holidaysToDisplay.map(event => {
                    const formattedDate = formatDate(new Date(event.date));
                    return `<tr>
                                <td>${formattedDate}</td>
                                <td>${event.title}</td>
                            </tr>`;
                }).join("");

                bankHolidaysTable.querySelector("tbody").innerHTML = rows;
            })
            .catch(error => {
                console.error("Error fetching UK holidays:", error);
                bankHolidaysTable.querySelector("tbody").innerHTML = "<tr><td colspan='2'>Error fetching holidays.</td></tr>";
            });
    }

    function fetchAustraliaHolidays(year) {
        const data = {
            resource_id: '33673aca-0857-42e5-b8f0-9981b4755686', // the resource id
            limit: 1000, // Increase the limit to fetch more results
            q: year // query for the selected year
        };

        const apiUrl = `https://data.gov.au/data/api/3/action/datastore_search?resource_id=${data.resource_id}&limit=${data.limit}&q=${data.q}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const holidays = data.result.records;
                const rows = holidays.map(holiday => {
                    const formattedDate = holiday.date;
                    const holidayName = holiday.title;
                    return `<tr>
                                <td>${formattedDate}</td>
                                <td>${holidayName}</td>
                            </tr>`;
                }).join("");

                bankHolidaysTable.querySelector("tbody").innerHTML = rows;
            })
            .catch(error => {
                console.error("Error fetching Australia holidays:", error);
                bankHolidaysTable.querySelector("tbody").innerHTML = "<tr><td colspan='2'>Error fetching holidays.</td></tr>";
            });
    }

    function fetchCanadaHolidays(year) {
        const apiUrl = `https://date.nager.at/Api/v2/PublicHolidays/${year}/ca`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const holidays = data;
                const rows = holidays.map(holiday => {
                    const formattedDate = holiday.date;
                    const holidayName = holiday.name;
                    return `<tr>
                                <td>${formattedDate}</td>
                                <td>${holidayName}</td>
                            </tr>`;
                }).join("");

                bankHolidaysTable.querySelector("tbody").innerHTML = rows;
            })
            .catch(error => {
                console.error("Error fetching Canada holidays:", error);
                bankHolidaysTable.querySelector("tbody").innerHTML = "<tr><td colspan='2'>Error fetching holidays.</td></tr>";
            });
    }
});
