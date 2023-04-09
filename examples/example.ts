import { Calendar } from "../src/calendar.js";

let cal: Calendar;

window.document.querySelector('#calendar').addEventListener('day_changed', (event:CustomEvent) => {
    console.log(event.detail);
});

window.document.querySelector('#calendar').addEventListener('month_changed', (event:CustomEvent) => {
    console.log(event.detail);
    cal.disable_days([7,])
});

cal = new Calendar({'selector': '#calendar'});
