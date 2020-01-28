let availableAppointmentDates = [{
        date: "2020-01-28",
        time: ["13:00:00", "10:00:00", "9:00:00", "15:00:00", "16:00:00", "17:00:00", "19:00:00", "2:00:00", "13:00:00", "10:00:00", "9:00:00", "15:00:00", "16:00:00", "17:00:00", "19:00:00", "2:00:00"]
    },
    {
        date: "2020-02-26",
        time: ["13:00:00", "10:00:00", "9:00:00", "15:00:00"]
    },
    {
        date: "2020-02-27",
        time: ["13:00:00", "10:00:00", "9:00:00", "15:00:00"]
    },
    {
        date: "2020-02-28",
        time: ["13:00:00", "10:00:00", "9:00:00", "15:00:00"]
    }
];

class Calendar {
    constructor() {
        this.monthNames = [
            "Gennaio",
            "Febbraio",
            "Marzo",
            "Aprile",
            "Maggio",
            "Giugno",
            "Luglio",
            "Agosto",
            "Settembre",
            "Ottobre",
            "Novembre",
            "Dicembre"
        ];
        this.dayNames = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
        this.date = new Date();
        this.selectedMonth = this.date.getMonth();
        this.parentElement = undefined;
        this.calendarYear = undefined;
        this.showTimeAvailable = false;
        this.selectedAvailableDay = undefined;
        this.selectedAvailableTime = undefined;
        this.foundAppointmentsDays = [];
    }

    getDaysInMonth(month, year) {
        let date = new Date(year, month, 1);
        let selectedMonth = date.getMonth();
        let days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    getMonthsInYear(year) {
        let date = new Date(year, 0, 1);
        let months = [];
        let monthCount = 0;
        while (monthCount < 12) {
            months.push(new Date(date));
            date.setMonth(date.getMonth() + 1);
            monthCount++;
        }
        return months;
    }

    handleChangeMonth(arrow) {
        console.log("arrow");
        switch (arrow) {
            case "prev":
                this.selectedMonth--;
                break;
            case "next":
                this.selectedMonth++;
                break;
        }
        this.buildYearCalendar(this.parentElement, this.calendarYear);
    }

    handleShowTimeAvailable(el) {
        let _this = this;
        let timeAvailableElement = document.querySelector(".appointment");

        if (this.selectedAvailableDay != el) {
            this.selectedAvailableDay = el;
            this.showTimeAvailable = true;
        } else {
            this.showTimeAvailable = !this.showTimeAvailable;
            this.selectedAvailableDay = undefined;
            this.closeAppointment()
        }

        if (this.showTimeAvailable) {
            timeAvailableElement.classList.remove("hide");
            let availableTimesElement = document.querySelector(".available-times");

            let appointment = _this.foundAppointmentsDays.find(appointment => {
                console.log(
                    new Date(appointment.date).getDate() +
                    "==" +
                    new Date(el.getAttribute("data-date")).getDate()
                );
                if (
                    new Date(appointment.date).getDate() ==
                    new Date(el.getAttribute("data-date")).getDate()
                )
                    return el;
            });

            availableTimesElement.innerHTML = "";
            appointment.time.forEach(time => {
                let tmpTimeEl = document.createElement("div");
                tmpTimeEl.classList.add("time");
                tmpTimeEl.innerHTML = time;
                tmpTimeEl.addEventListener("click", () => _this.handleSelectTime(tmpTimeEl));
                availableTimesElement.appendChild(tmpTimeEl);
            });
        } else {
            timeAvailableElement.classList.add("hide");
        }
    }

    handleSelectTime(el) {
        let _this = this;
        if (this.selectedAvailableTime)
            this.selectedAvailableTime.classList.remove("active")

        if (this.selectedAvailableTime == el) {
            _this.closeAppointment()
        } else {
            this.selectedAvailableTime = el;
            el.classList.add("active")
            let formElement = document.querySelector("form")
            if (el) {
                formElement.classList.remove("hide")
                document.querySelector(".form-close").addEventListener("click", () => {
                    _this.closeAppointment()
                })
            }
        }


    }

    closeAppointment() {
        if (this.selectedAvailableTime) {
            this.selectedAvailableTime.classList.remove("active")
            this.selectedAvailableTime = undefined;
        }
        let formElement = document.querySelector("form")
        formElement.classList.add("hide")
    }

    setAppointment() {

    }

    buildYearCalendar(el, year) {
        this.parentElement = el;
        this.calendarYear = year;
        let _this = this;

        let opts = {
            showMonth: true,
            showDaysOfWeek: true,
            showYear: true,
            clickHandler: function (e) {
                let day = e.target.getAttribute("data-date");
                if (e.target.classList.contains("active")) {
                    _this.handleShowTimeAvailable(e.target);
                }
            }
        };

        let monthNode = _this.buildMonth(this.selectedMonth, year, opts);
        el.replaceWith(monthNode);

    }

    buildMonth(
        monthNum = this.selectedMonth,
        year = this.date.getFullYear(),
        opts
    ) {
        let _this = this;
        let dtm = new Date(year, monthNum, 1);
        let dtmMonth = dtm.getMonth();
        let prevM = new Date(dtm.setMonth(dtmMonth - 1));
        let nextM = new Date(dtm.setMonth(dtmMonth + 1));
        let daysInMonth = _this.getDaysInMonth(monthNum, year);
        let daysPrevMonth = _this.getDaysInMonth(
            prevM.getMonth(),
            prevM.getFullYear()
        );
        let daysNextMonth = _this.getDaysInMonth(
            nextM.getMonth(),
            nextM.getFullYear()
        );
        let monthNode = document.querySelector(".month-days");
        let titleNode = document.querySelector(".month-name h3");
        let skipLength = daysInMonth[0].getDay() - 1;
        let preLength = daysInMonth.length + skipLength;
        let postLength = function () {
            if (preLength % 7 === 0) {
                return 0;
            } else {
                if (preLength < 35) {
                    return 35 - preLength;
                } else {
                    return 42 - preLength;
                }
            }
        };

        this.foundAppointmentsDays = availableAppointmentDates.filter(
            (el, index) => {
                if (new Date(el.date).getMonth() == dtmMonth) return el;
            }
        );


        if (opts.showMonth) {
            titleNode.innerText =
                this.monthNames[monthNum] + (opts.showYear ? " " + year : "");
        }

        monthNode.innerHTML = "";

        if (opts.showDaysOfWeek) {
            let _this = this;
            let weekDays = document.createElement("div");
            weekDays.classList.add("month-days-weekdaysname");
            this.dayNames.forEach(function (a, b) {
                let dayNode = document.createElement("div");
                dayNode.classList.add("dow");
                dayNode.innerHTML = _this.dayNames[b];
                weekDays.appendChild(dayNode);
            });
            monthNode.appendChild(weekDays);
        }

        let alldays = document.createElement("div");
        alldays.classList.add("month-days-alldays");


        for (let i = 0; i < skipLength; i++) {
            let dayNode = document.createElement("div");
            dayNode.classList.add("dummy-day", "day");
            dayNode.innerText = daysPrevMonth.length - (skipLength - (i + 1));
            alldays.appendChild(dayNode);
        }


        daysInMonth.forEach(function (c, d) {
            let dayNode = document.createElement("div");
            let availableClass = _this.foundAppointmentsDays.find(el => {
                    return new Date(el.date).getDate() == d + 1;
                }) ?
                "active" :
                "day";
            dayNode.classList.add("day", availableClass);
            dayNode.setAttribute("data-date", c);
            dayNode.innerHTML = d + 1;
            let dow = new Date(c).getDay() - 1;
            if (dow === 0 || dow === 6) dayNode.classList.add("weekend");
            if (opts.clickHandler) {
                dayNode.addEventListener("click", opts.clickHandler);
            }
            alldays.appendChild(dayNode);
        });


        for (let j = 0; j < postLength(); j++) {
            let dayNode = document.createElement("div");
            dayNode.classList.add("dummy-day");
            dayNode.innerText = j + 1;
            alldays.appendChild(dayNode);
        }
        monthNode.appendChild(alldays);

        return monthNode;
    }
}

window.addEventListener("DOMContentLoaded", event => {
    let nextMonthButton = document.querySelector(".month-next a");
    let prevMonthButton = document.querySelector(".month-prev a");
    let calendar = document.querySelector(".month-days");
    let currentYear = new Date().getFullYear();
    let calendarize = new Calendar();
    calendarize.buildYearCalendar(calendar, currentYear);
    console.log(nextMonthButton);
    nextMonthButton.addEventListener("click", () =>
        calendarize.handleChangeMonth("next")
    );
    prevMonthButton.addEventListener("click", () =>
        calendarize.handleChangeMonth("prev")
    );


});

function handleSetAppointment() {
    e.preventDefault();
}